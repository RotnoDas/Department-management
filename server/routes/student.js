import express from "express";
import db from "../database/db.js";
import { verifyToken, requireRole } from "../middleware/auth.js";

const router = express.Router();
router.use(verifyToken, requireRole("student"));

router.get("/profile", (req, res) => {
  const u = db
    .prepare("SELECT id, email, status FROM users WHERE id=?")
    .get(req.user.userId);
  const p = db
    .prepare("SELECT * FROM students WHERE user_id=?")
    .get(req.user.userId);
  if (!p) return res.status(404).json({ error: "Profile not found." });
  res.json({
    userId: u.id,
    email: u.email,
    status: u.status,
    name: p.name,
    studentId: p.student_id,
    phone: p.phone,
    batch: p.batch,
    semester: p.semester,
    session: p.session,
    cgpa: p.cgpa,
    address: p.address,
    bloodGroup: p.blood_group,
    createdAt: p.created_at,
  });
});

router.put("/profile", (req, res) => {
  const { name, phone, batch, semester, session, cgpa, address, bloodGroup } =
    req.body;
  if (!name) return res.status(400).json({ error: "Name is required." });
  db.prepare(
    `UPDATE students SET name=?,phone=?,batch=?,semester=?,session=?,cgpa=?,address=?,blood_group=? WHERE user_id=?`,
  ).run(
    name,
    phone || null,
    batch || null,
    parseInt(semester) || 1,
    session || null,
    parseFloat(cgpa) || 0,
    address || null,
    bloodGroup || null,
    req.user.userId,
  );
  res.json({ success: true, message: "Profile updated." });
});

// ── Notices ────────────────────────────────────────────────
router.get("/notices", (req, res) => {
  const notices = db
    .prepare(
      `
    SELECT n.id, n.title, n.content, n.created_at as createdAt, a.name as authorName
    FROM notices n
    LEFT JOIN admins a ON n.author_id = a.id
    ORDER BY n.created_at DESC
  `,
    )
    .all();
  res.json(notices);
});

// ── Courses ────────────────────────────────────────────────
router.get("/courses", (req, res) => {
  const p = db
    .prepare("SELECT semester FROM students WHERE user_id=?")
    .get(req.user.userId);
  if (!p) return res.status(404).json({ error: "Profile not found." });

  const courses = db
    .prepare(
      `
    SELECT c.course_code as courseCode, c.course_name as courseName, t.name as teacherName
    FROM courses c
    LEFT JOIN teachers t ON c.teacher_id = t.id
    WHERE c.semester = ?
  `,
    )
    .all(p.semester);

  res.json(courses);
});

// ── Course Materials ───────────────────────────────────────
router.get("/courses/:courseCode/materials", (req, res) => {
  const { courseCode } = req.params;
  const p = db
    .prepare("SELECT semester FROM students WHERE user_id=?")
    .get(req.user.userId);
  if (!p) return res.status(404).json({ error: "Profile not found." });

  // Verify course belongs to student's semester
  const course = db
    .prepare(
      "SELECT id, course_name FROM courses WHERE course_code=? AND semester=?",
    )
    .get(courseCode, p.semester);
  if (!course)
    return res
      .status(403)
      .json({ error: "Access denied or course not found." });

  const materials = db
    .prepare(
      "SELECT id, title, description, file_path as filePath, original_name as originalName, created_at as createdAt FROM course_materials WHERE course_code=? ORDER BY created_at DESC",
    )
    .all(courseCode);
  res.json({
    courseName: course.course_name,
    materials,
  });
});

export default router;
