import express from "express";
import db from "../database/db.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
router.use(verifyToken);

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Get active attendance sessions for student
router.get("/student/active-sessions", (req, res) => {
  try {
    const student = db
      .prepare("SELECT id, semester FROM students WHERE user_id = ?")
      .get(req.user.id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];

    // Show all sessions for today regardless of time (for testing)
    const sessions = db
      .prepare(
        `
      SELECT 
        ats.id as sessionId,
        ats.session_date as date,
        ats.start_time as startTime,
        ats.end_time as endTime,
        c.id as courseId,
        c.course_code as courseCode,
        c.course_name as courseName,
        c.location,
        c.latitude,
        c.longitude,
        c.radius,
        ar.id as attendanceId,
        ar.status as attendanceStatus
      FROM attendance_sessions ats
      JOIN courses c ON c.id = ats.course_id
      LEFT JOIN attendance_records ar ON ar.session_id = ats.id 
        AND ar.student_id = ?
      WHERE c.semester = ?
        AND ats.status = 'active'
        AND ats.session_date = ?
      ORDER BY ats.start_time
    `,
      )
      .all(student.id, student.semester, currentDate);

    res.json({ sessions });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

// Mark attendance
router.post("/student/mark", (req, res) => {
  try {
    const { sessionId, latitude, longitude } = req.body;

    if (!sessionId || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const student = db
      .prepare("SELECT id FROM students WHERE user_id = ?")
      .get(req.user.id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Get session details
    const session = db
      .prepare(
        `
      SELECT 
        ats.*,
        c.latitude as courseLat,
        c.longitude as courseLon,
        c.radius
      FROM attendance_sessions ats
      JOIN courses c ON c.id = ats.course_id
      WHERE ats.id = ? AND ats.status = 'active'
    `,
      )
      .get(sessionId);

    if (!session) {
      return res.status(404).json({ error: "Session not found or closed" });
    }

    // Check if already marked
    const existing = db
      .prepare(
        "SELECT id FROM attendance_records WHERE session_id = ? AND student_id = ?",
      )
      .get(sessionId, student.id);

    if (existing) {
      return res.status(400).json({ error: "Attendance already marked" });
    }

    // Validate time - Allow marking anytime during the day
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];

    if (session.session_date !== currentDate) {
      return res
        .status(400)
        .json({ error: "Attendance can only be marked on the session date" });
    }

    // Validate location
    if (session.courseLat && session.courseLon) {
      const distance = calculateDistance(
        latitude,
        longitude,
        session.courseLat,
        session.courseLon,
      );

      if (distance > session.radius) {
        return res.status(400).json({
          error: `You must be within ${session.radius}m of the class location`,
          distance: Math.round(distance),
        });
      }
    }

    // Determine status - always present since time validation is removed
    const status = "present";

    // Mark attendance
    db.prepare(
      `INSERT INTO attendance_records (session_id, student_id, latitude, longitude, status) 
       VALUES (?, ?, ?, ?, ?)`,
    ).run(sessionId, student.id, latitude, longitude, status);

    res.json({
      success: true,
      message: "Attendance marked successfully",
      status,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to mark attendance" });
  }
});

// Get student's attendance history
router.get("/student/history", (req, res) => {
  try {
    const student = db
      .prepare("SELECT id FROM students WHERE user_id = ?")
      .get(req.user.id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const history = db
      .prepare(
        `
      SELECT 
        ar.id,
        ar.marked_at as markedAt,
        ar.status,
        ats.session_date as date,
        ats.start_time as startTime,
        ats.end_time as endTime,
        c.course_code as courseCode,
        c.course_name as courseName
      FROM attendance_records ar
      JOIN attendance_sessions ats ON ats.id = ar.session_id
      JOIN courses c ON c.id = ats.course_id
      WHERE ar.student_id = ?
      ORDER BY ats.session_date DESC, ats.start_time DESC
      LIMIT 50
    `,
      )
      .all(student.id);

    res.json({ history });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// Get attendance statistics
router.get("/student/stats", (req, res) => {
  try {
    const student = db
      .prepare("SELECT id, semester FROM students WHERE user_id = ?")
      .get(req.user.id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const stats = db
      .prepare(
        `
      SELECT 
        c.course_code as courseCode,
        c.course_name as courseName,
        COUNT(DISTINCT ats.id) as totalSessions,
        COUNT(DISTINCT ar.id) as attendedSessions,
        SUM(CASE WHEN ar.status = 'present' THEN 1 ELSE 0 END) as presentCount,
        SUM(CASE WHEN ar.status = 'late' THEN 1 ELSE 0 END) as lateCount
      FROM courses c
      LEFT JOIN attendance_sessions ats ON ats.course_id = c.id
      LEFT JOIN attendance_records ar ON ar.session_id = ats.id AND ar.student_id = ?
      WHERE c.semester = ?
      GROUP BY c.id
    `,
      )
      .all(student.id, student.semester);

    const formattedStats = stats.map((s) => ({
      ...s,
      percentage:
        s.totalSessions > 0
          ? Math.round((s.attendedSessions / s.totalSessions) * 100)
          : 0,
    }));

    res.json({ stats: formattedStats });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
