import express from "express";
import db from "../database/db.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
router.use(verifyToken);

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Helper to parse a time slot string like "9:00 - 10:00" or "01:00 - 02:00"
function parseTimeSlot(slotStr) {
  const [startStr, endStr] = slotStr.split(" - ").map((s) => s.trim());
  const parse = (tStr) => {
    let [h, m] = tStr.split(":");
    let hours = parseInt(h, 10);
    // Slots "01:00"–"05:00" are PM (afternoon), "9:00"–"12:00" are AM
    if (hours >= 1 && hours <= 5) hours += 12;
    return { hours, minutes: parseInt(m, 10) };
  };
  return { start: parse(startStr), end: parse(endStr), startStr, endStr };
}

function slotToDate(base, { hours, minutes }) {
  const d = new Date(base);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

export function syncMissingSessions(semester) {
  try {
    const minCourse = db
      .prepare("SELECT MIN(created_at) as start FROM courses WHERE semester=?")
      .get(semester);
    if (!minCourse || !minCourse.start) return;

    let startDate = new Date(minCourse.start);
    const now = new Date();

    const diffDays = Math.ceil(
      Math.abs(now - startDate) / (1000 * 60 * 60 * 24),
    );
    if (diffDays > 120) {
      startDate = new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000);
    }

    const routines = db
      .prepare(
        `SELECT r.course_code, r.day, r.time_slot, c.id as course_id
         FROM routines r
         JOIN courses c ON c.course_code = r.course_code
         WHERE r.semester = ?`,
      )
      .all(semester);

    const routinesByDay = {};
    for (const r of routines) {
      if (!routinesByDay[r.day]) routinesByDay[r.day] = [];
      routinesByDay[r.day].push(r);
    }

    const checkSession = db.prepare(
      `SELECT 1 FROM attendance_sessions
       WHERE course_id = ? AND session_date = ? AND start_time = ? AND end_time = ?`,
    );

    const insertSession = db.prepare(
      `INSERT INTO attendance_sessions (course_id, session_date, start_time, end_time, status)
       VALUES (?, ?, ?, ?, 'closed')`,
    );

    let curr = new Date(startDate);
    curr.setHours(0, 0, 0, 0);

    db.exec("BEGIN TRANSACTION");
    while (curr <= now) {
      const dateStr = curr.toISOString().split("T")[0];
      const dayName = curr.toLocaleDateString("en-US", { weekday: "long" });
      const dayRoutines = routinesByDay[dayName] || [];

      for (const r of dayRoutines) {
        const parsed = parseTimeSlot(r.time_slot);
        const classStartTime = new Date(curr);
        classStartTime.setHours(parsed.start.hours, parsed.start.minutes, 0, 0);

        if (classStartTime <= now) {
          const existing = checkSession.get(
            r.course_id,
            dateStr,
            parsed.startStr,
            parsed.endStr,
          );
          if (!existing) {
            insertSession.run(
              r.course_id,
              dateStr,
              parsed.startStr,
              parsed.endStr,
            );
          }
        }
      }
      curr.setDate(curr.getDate() + 1);
    }
    db.exec("COMMIT");
  } catch (e) {
    if (db.inTransaction) db.exec("ROLLBACK");
    console.error("Failed to sync missing sessions:", e);
  }
}

// ── GET /attendance/student/active-sessions ────────────────
router.get("/student/active-sessions", (req, res) => {
  try {
    // FIX: use req.user.userId (from JWT payload)
    const student = db
      .prepare("SELECT id, semester FROM students WHERE user_id = ?")
      .get(req.user.userId);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const now = new Date();
    const currentDayName = now.toLocaleDateString("en-US", { weekday: "long" });
    const currentDate = now.toISOString().split("T")[0];

    // LEFT JOIN so routine entries without a matching course row still appear
    const routines = db
      .prepare(
        `
        SELECT r.id        AS routineId,
               r.time_slot AS timeSlot,
               r.course_code AS courseCode,
               r.room      AS location,
               c.id        AS courseId,
               c.course_name AS courseName,
               c.latitude,
               c.longitude
        FROM   routines r
        LEFT JOIN courses c ON c.course_code = r.course_code
        WHERE  r.day = ? AND r.semester = ?
        ORDER  BY r.time_slot
      `,
      )
      .all(currentDayName, student.semester);

    const activeSessions = [];

    for (const routine of routines) {
      const parsed = parseTimeSlot(routine.timeSlot);
      const startTime = slotToDate(now, parsed.start);
      const endTime = slotToDate(now, parsed.end);

      const diffMinutesStart = (now - startTime) / 1000 / 60;
      const isActive = now >= startTime && now <= endTime;
      const isPast = now > endTime;
      const isMarkable = isActive && diffMinutesStart <= 15;

      // Auto-create attendance_session only when class is active & course exists in DB
      let session = null;
      if (routine.courseId) {
        session = db
          .prepare(
            `SELECT id FROM attendance_sessions
             WHERE course_id = ? AND session_date = ? AND start_time = ? AND end_time = ?`,
          )
          .get(routine.courseId, currentDate, parsed.startStr, parsed.endStr);

        if (!session && isActive) {
          const ins = db
            .prepare(
              `INSERT INTO attendance_sessions (course_id, session_date, start_time, end_time, status)
               VALUES (?, ?, ?, ?, 'active')`,
            )
            .run(routine.courseId, currentDate, parsed.startStr, parsed.endStr);
          session = { id: ins.lastInsertRowid };
        }
      }

      let record = null;
      if (session) {
        record = db
          .prepare(
            `SELECT id FROM attendance_records WHERE session_id = ? AND student_id = ?`,
          )
          .get(session.id, student.id);
      }

      activeSessions.push({
        sessionId: session ? session.id : null,
        date: currentDate,
        startTime: parsed.startStr,
        endTime: parsed.endStr,
        courseId: routine.courseId,
        courseCode: routine.courseCode,
        courseName: routine.courseName || routine.courseCode,
        location: routine.location,
        latitude: routine.latitude,
        longitude: routine.longitude,
        radius: 5,
        attendanceId: record ? record.id : null,
        attendanceStatus: record ? "present" : null,
        isMarkable,
        isActive,
        isPast,
      });
    }

    res.json({ sessions: activeSessions });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

// ── POST /attendance/student/mark ─────────────────────────
router.post("/student/mark", (req, res) => {
  try {
    const { sessionId, latitude, longitude } = req.body;

    if (!sessionId || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // FIX: use req.user.userId
    const student = db
      .prepare("SELECT id FROM students WHERE user_id = ?")
      .get(req.user.userId);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const session = db
      .prepare(
        `SELECT ats.*, c.latitude as courseLat, c.longitude as courseLon
         FROM attendance_sessions ats
         JOIN courses c ON c.id = ats.course_id
         WHERE ats.id = ? AND ats.status = 'active'`,
      )
      .get(sessionId);

    if (!session) {
      return res.status(404).json({ error: "Session not found or closed" });
    }

    const existing = db
      .prepare(
        "SELECT id FROM attendance_records WHERE session_id = ? AND student_id = ?",
      )
      .get(sessionId, student.id);

    if (existing) {
      return res.status(400).json({ error: "Attendance already marked" });
    }

    // Validate date
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    if (session.session_date !== currentDate) {
      return res
        .status(400)
        .json({ error: "Attendance can only be marked on the session date" });
    }

    // Validate 15-minute window
    const parsed = parseTimeSlot(`${session.start_time} - ${session.end_time}`);
    const sessionStart = slotToDate(now, parsed.start);
    const diffMinutes = (now - sessionStart) / 1000 / 60;
    if (diffMinutes < 0 || diffMinutes > 15) {
      return res.status(400).json({
        error:
          "Attendance can only be marked within 15 minutes of class start time.",
      });
    }

    // Validate location – 5 m radius
    if (session.courseLat && session.courseLon) {
      const distance = calculateDistance(
        latitude,
        longitude,
        session.courseLat,
        session.courseLon,
      );
      if (distance > 5) {
        return res.status(400).json({
          error: `You must be within 5m of the classroom. You are ${Math.round(distance)}m away.`,
          distance: Math.round(distance),
        });
      }
    }

    db.prepare(
      `INSERT INTO attendance_records (session_id, student_id, latitude, longitude, status)
       VALUES (?, ?, ?, ?, 'present')`,
    ).run(sessionId, student.id, latitude, longitude);

    res.json({
      success: true,
      message: "Attendance marked successfully",
      status: "present",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to mark attendance" });
  }
});

// ── GET /attendance/student/history ───────────────────────
router.get("/student/history", (req, res) => {
  try {
    const student = db
      .prepare("SELECT id FROM students WHERE user_id = ?")
      .get(req.user.userId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    const history = db
      .prepare(
        `SELECT ar.id, ar.marked_at as markedAt, ar.status,
                ats.session_date as date, ats.start_time as startTime, ats.end_time as endTime,
                c.course_code as courseCode, c.course_name as courseName
         FROM attendance_records ar
         JOIN attendance_sessions ats ON ats.id = ar.session_id
         JOIN courses c ON c.id = ats.course_id
         WHERE ar.student_id = ?
         ORDER BY ats.session_date DESC, ats.start_time DESC
         LIMIT 50`,
      )
      .all(student.id);

    res.json({ history });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// ── GET /attendance/student/stats ─────────────────────────
router.get("/student/stats", (req, res) => {
  try {
    const student = db
      .prepare("SELECT id, semester FROM students WHERE user_id = ?")
      .get(req.user.userId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    // Sync any past sessions that were missed by everyone
    syncMissingSessions(student.semester);

    const stats = db
      .prepare(
        `SELECT c.course_code as courseCode, c.course_name as courseName, c.target_sessions as targetSessions,
                COUNT(DISTINCT ats.id) as conductedSessions,
                COUNT(DISTINCT ar.id)  as attendedSessions,
                SUM(CASE WHEN ar.status='present' THEN 1 ELSE 0 END) as presentCount,
                SUM(CASE WHEN ar.status='late'    THEN 1 ELSE 0 END) as lateCount
         FROM courses c
         LEFT JOIN attendance_sessions ats ON ats.course_id = c.id
         LEFT JOIN attendance_records  ar  ON ar.session_id = ats.id AND ar.student_id = ?
         WHERE c.semester = ?
         GROUP BY c.id`,
      )
      .all(student.id, student.semester);

    const formattedStats = stats.map((s) => {
      const total =
        s.targetSessions !== null ? s.targetSessions : s.conductedSessions;
      return {
        ...s,
        totalSessions: total,
        percentage:
          total > 0 ? Math.round((s.attendedSessions / total) * 100) : 0,
      };
    });

    res.json({ stats: formattedStats });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
