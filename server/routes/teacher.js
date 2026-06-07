import express from "express";
import multer from "multer";
import path from "path";
import db from "../database/db.js";
import { verifyToken, requireRole } from "../middleware/auth.js";
import { syncMissingSessions } from "./attendance.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "./server/uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.use(verifyToken, requireRole("teacher"));

router.get("/profile", (req, res) => {
  const u = db
    .prepare("SELECT id, email FROM users WHERE id=?")
    .get(req.user.userId);
  const p = db
    .prepare("SELECT * FROM teachers WHERE user_id=?")
    .get(req.user.userId);
  if (!p) return res.status(404).json({ error: "Profile not found." });
  res.json({
    userId: u.id,
    email: u.email,
    name: p.name,
    teacherId: p.teacher_id,
    phone: p.phone,
    designation: p.designation,
    specialization: p.specialization,
    officeRoom: p.office_room,
    joiningDate: p.joining_date,
  });
});

router.put("/profile", (req, res) => {
  const { name, phone, designation, specialization, officeRoom } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required." });
  db.prepare(
    `UPDATE teachers SET name=?,phone=?,designation=?,specialization=?,office_room=? WHERE user_id=?`,
  ).run(
    name,
    phone || null,
    designation || null,
    specialization || null,
    officeRoom || null,
    req.user.userId,
  );
  res.json({ success: true, message: "Profile updated." });
});

router.get("/courses", (req, res) => {
  const teacher = db
    .prepare("SELECT id FROM teachers WHERE user_id=?")
    .get(req.user.userId);
  if (!teacher) return res.status(404).json({ error: "Teacher not found." });

  const courses = db
    .prepare(
      `
    SELECT id, course_code as courseCode, course_name as courseName, semester
    FROM courses
    WHERE teacher_id=?
    ORDER BY semester ASC, course_code ASC
  `,
    )
    .all(teacher.id);

  res.json(courses);
});

router.get("/assignments", (req, res) => {
  const teacher = db
    .prepare("SELECT id FROM teachers WHERE user_id=?")
    .get(req.user.userId);
  if (!teacher) return res.status(404).json({ error: "Teacher not found." });

  const courses = db
    .prepare(
      `
    SELECT course_code as courseCode, course_name as courseName, semester
    FROM courses
    WHERE teacher_id=?
    ORDER BY semester ASC, course_code ASC
  `,
    )
    .all(teacher.id);

  const params = [teacher.id];
  let submissionsSql = `
    SELECT a.id,
           a.course_code as courseCode,
           c.course_name as courseName,
           a.semester,
           a.title,
           a.note,
           a.file_path as filePath,
           a.original_name as originalName,
           a.file_mime as fileMime,
           a.file_size as fileSize,
           a.created_at as createdAt,
           s.name as studentName,
           s.student_id as studentRoll
    FROM assignment_submissions a
    JOIN students s ON s.id = a.student_id
    JOIN courses c ON c.course_code = a.course_code
    WHERE c.teacher_id=?
  `;

  if (req.query.courseCode) {
    submissionsSql += " AND a.course_code=?";
    params.push(req.query.courseCode);
  }

  submissionsSql += `
    ORDER BY a.semester ASC,
             a.course_code ASC,
             LOWER(s.name) ASC,
             s.student_id ASC,
             a.created_at DESC,
             a.id DESC
  `;

  const submissions = db.prepare(submissionsSql).all(...params);
  res.json({ courses, submissions });
});
// ── Course Attendance ───────────────────────────────────────
router.get("/courses/:courseCode/attendance", (req, res) => {
  const { courseCode } = req.params;
  const { semester } = req.query;

  const teacher = db
    .prepare("SELECT id FROM teachers WHERE user_id=?")
    .get(req.user.userId);
  if (!teacher) return res.status(404).json({ error: "Teacher not found." });

  // Verify course belongs to teacher
  const course = db
    .prepare(
      "SELECT id, course_name, semester, target_sessions FROM courses WHERE course_code=? AND teacher_id=?",
    )
    .get(courseCode, teacher.id);

  if (!course)
    return res
      .status(403)
      .json({ error: "Access denied or course not found." });

  const sem = semester || course.semester;

  // Sync missing sessions for this semester so missed classes show up
  syncMissingSessions(sem);

  // Get all sessions for this course
  const sessions = db
    .prepare(
      "SELECT id, session_date as sessionDate, start_time as startTime, end_time as endTime FROM attendance_sessions WHERE course_id=? ORDER BY session_date DESC, start_time DESC",
    )
    .all(course.id);

  // Get all students in the given semester
  const students = db
    .prepare(
      "SELECT id, name, student_id as roll FROM students WHERE semester=? ORDER BY student_id ASC",
    )
    .all(sem);

  // Get all attendance records for these sessions
  const records = [];
  if (sessions.length > 0) {
    const sessionIds = sessions.map((s) => s.id).join(",");
    const query = `
      SELECT session_id, student_id, status
      FROM attendance_records
      WHERE session_id IN (${sessionIds})
    `;
    const fetchedRecords = db.prepare(query).all();
    records.push(...fetchedRecords);
  }

  // Map records for easier frontend consumption
  const attendanceMap = {};
  records.forEach((r) => {
    if (!attendanceMap[r.student_id]) attendanceMap[r.student_id] = {};
    attendanceMap[r.student_id][r.session_id] = r.status;
  });

  const target =
    course.target_sessions !== null ? course.target_sessions : sessions.length;

  const attendanceData = students.map((student) => {
    const studentRecords = attendanceMap[student.id] || {};
    let presentCount = 0;

    sessions.forEach((session) => {
      if (studentRecords[session.id] === "present") presentCount++;
    });

    return {
      studentId: student.id,
      name: student.name,
      roll: student.roll,
      records: studentRecords,
      presentCount,
      percentage: target > 0 ? Math.round((presentCount / target) * 100) : 0,
    };
  });

  res.json({
    courseCode,
    courseName: course.course_name,
    semester: sem,
    targetSessions: course.target_sessions,
    sessions,
    attendanceData,
  });
});

router.put("/courses/:courseCode/target-sessions", (req, res) => {
  const { courseCode } = req.params;
  const { targetSessions } = req.body;
  const teacher = db
    .prepare("SELECT id FROM teachers WHERE user_id=?")
    .get(req.user.userId);
  if (!teacher) return res.status(404).json({ error: "Teacher not found." });

  const course = db
    .prepare("SELECT id FROM courses WHERE course_code=? AND teacher_id=?")
    .get(courseCode, teacher.id);
  if (!course) return res.status(403).json({ error: "Access denied." });

  db.prepare("UPDATE courses SET target_sessions=? WHERE id=?").run(
    targetSessions || null,
    course.id,
  );

  res.json({ success: true, message: "Target sessions updated successfully." });
});

// ── Course Materials ───────────────────────────────────────
router.get("/courses/:courseCode/materials", (req, res) => {
  const { courseCode } = req.params;
  const teacher = db
    .prepare("SELECT id FROM teachers WHERE user_id=?")
    .get(req.user.userId);
  if (!teacher) return res.status(404).json({ error: "Teacher not found." });

  // Verify course belongs to teacher
  const course = db
    .prepare(
      "SELECT id, course_name FROM courses WHERE course_code=? AND teacher_id=?",
    )
    .get(courseCode, teacher.id);
  if (!course)
    return res
      .status(403)
      .json({ error: "Access denied or course not found." });

  const materials = db
    .prepare(
      "SELECT * FROM course_materials WHERE course_code=? AND teacher_id=? ORDER BY created_at DESC",
    )
    .all(courseCode, teacher.id);
  res.json({
    courseName: course.course_name,
    materials,
  });
});
router.post(
  "/courses/:courseCode/materials",
  upload.single("file"),
  (req, res) => {
    const { courseCode } = req.params;
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required." });

    // File is now optional if they provided a description
    if (!req.file && !description) {
      return res
        .status(400)
        .json({ error: "You must provide either a file or a description." });
    }

    const teacher = db
      .prepare("SELECT id FROM teachers WHERE user_id=?")
      .get(req.user.userId);
    if (!teacher) return res.status(404).json({ error: "Teacher not found." });

    // Verify course belongs to teacher
    const course = db
      .prepare(
        "SELECT id, semester FROM courses WHERE course_code=? AND teacher_id=?",
      )
      .get(courseCode, teacher.id);
    if (!course)
      return res
        .status(403)
        .json({ error: "Access denied or course not found." });

    const filePath = req.file ? `/uploads/${req.file.filename}` : null;
    const originalName = req.file ? req.file.originalname : null;
    db.prepare(
      `
    INSERT INTO course_materials (course_code, semester, title, description, file_path, original_name, teacher_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
    ).run(
      courseCode,
      course.semester,
      title,
      description || null,
      filePath,
      originalName,
      teacher.id,
    );

    res
      .status(201)
      .json({ success: true, message: "Material uploaded successfully." });
  },
);

router.delete("/materials/:id", (req, res) => {
  const teacher = db
    .prepare("SELECT id FROM teachers WHERE user_id=?")
    .get(req.user.userId);
  if (!teacher) return res.status(404).json({ error: "Teacher not found." });

  const result = db
    .prepare("DELETE FROM course_materials WHERE id=? AND teacher_id=?")
    .run(req.params.id, teacher.id);
  if (result.changes === 0)
    return res
      .status(403)
      .json({ error: "Access denied or material not found." });

  res.json({ success: true, message: "Material deleted." });
});

router.get("/today-classes", (req, res) => {
  const teacher = db
    .prepare("SELECT id FROM teachers WHERE user_id=?")
    .get(req.user.userId);
  if (!teacher) return res.status(404).json({ error: "Teacher not found." });

  const day = req.query.day;
  if (!day) return res.status(400).json({ error: "Day is required." });

  const classes = db
    .prepare(
      `
    SELECT r.id, r.semester, r.time_slot as timeSlot, r.course_code as courseCode, r.room
    FROM routines r
    WHERE r.teacher_id = ? AND r.day = ?
    ORDER BY r.time_slot ASC, r.semester ASC
  `,
    )
    .all(teacher.id, day);

  res.json(classes);
});

router.get("/routine", (req, res) => {
  const routines = db
    .prepare(
      `
    SELECT r.id, r.day, r.semester, r.time_slot as timeSlot, r.course_code as courseCode,
           r.room, t.name as teacherName
    FROM routines r
    LEFT JOIN teachers t ON r.teacher_id = t.id
  `,
    )
    .all();
  res.json(routines);
});

export default router;
