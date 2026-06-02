import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import db from "../database/db.js";
import { verifyToken, requireRole } from "../middleware/auth.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, "../uploads");

fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    cb(null, safeName);
  },
});
const upload = multer({ storage });

const removeUpload = (filePath) => {
  if (!filePath) return;

  const resolvedPath = path.resolve(
    __dirname,
    "..",
    filePath.replace(/^\/+/, ""),
  );
  if (
    resolvedPath !== uploadsDir &&
    !resolvedPath.startsWith(`${uploadsDir}${path.sep}`)
  ) {
    return;
  }

  fs.unlink(resolvedPath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.error("Failed to remove assignment upload:", err.message);
    }
  });
};

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
    SELECT n.id, n.title, n.content,
           n.file_path as filePath,
           n.original_name as originalName,
           n.file_mime as fileMime,
           n.file_size as fileSize,
           n.created_at as createdAt,
           n.updated_at as updatedAt,
           a.name as authorName
    FROM notices n
    LEFT JOIN admins a ON n.author_id = a.id
    ORDER BY n.created_at DESC, n.id DESC
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

// â”€â”€ Assignment Submissions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.get("/courses/:courseCode/assignments", (req, res) => {
  const { courseCode } = req.params;
  const student = db
    .prepare("SELECT id, semester FROM students WHERE user_id=?")
    .get(req.user.userId);
  if (!student) return res.status(404).json({ error: "Profile not found." });

  const course = db
    .prepare(
      `
      SELECT c.id, c.course_name, c.teacher_id, t.name as teacherName
      FROM courses c
      LEFT JOIN teachers t ON c.teacher_id = t.id
      WHERE c.course_code=? AND c.semester=?
    `,
    )
    .get(courseCode, student.semester);
  if (!course) {
    return res
      .status(403)
      .json({ error: "Access denied or course not found." });
  }

  const submissions = db
    .prepare(
      `
      SELECT id, title, note,
             file_path as filePath,
             original_name as originalName,
             file_mime as fileMime,
             file_size as fileSize,
             created_at as createdAt
      FROM assignment_submissions
      WHERE course_code=? AND student_id=?
      ORDER BY created_at DESC, id DESC
    `,
    )
    .all(courseCode, student.id);

  res.json({
    courseName: course.course_name,
    teacherName: course.teacherName,
    canSubmit: Boolean(course.teacher_id),
    submissions,
  });
});

router.post(
  "/courses/:courseCode/assignments",
  upload.single("file"),
  (req, res) => {
    const { courseCode } = req.params;
    const title = String(req.body.title || "").trim();
    const note = String(req.body.note || "").trim();

    if (!title) {
      removeUpload(req.file?.path);
      return res.status(400).json({ error: "Assignment title is required." });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Assignment file is required." });
    }

    const student = db
      .prepare("SELECT id, semester FROM students WHERE user_id=?")
      .get(req.user.userId);
    if (!student) {
      removeUpload(req.file.path);
      return res.status(404).json({ error: "Profile not found." });
    }

    const course = db
      .prepare(
        "SELECT id, semester, teacher_id FROM courses WHERE course_code=? AND semester=?",
      )
      .get(courseCode, student.semester);
    if (!course) {
      removeUpload(req.file.path);
      return res
        .status(403)
        .json({ error: "Access denied or course not found." });
    }
    if (!course.teacher_id) {
      removeUpload(req.file.path);
      return res
        .status(400)
        .json({ error: "No faculty is assigned to this course yet." });
    }

    db.prepare(
      `
      INSERT INTO assignment_submissions (
        course_code, semester, title, note, file_path, original_name,
        file_mime, file_size, student_id, teacher_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    ).run(
      courseCode,
      course.semester,
      title,
      note || null,
      `/uploads/${req.file.filename}`,
      req.file.originalname,
      req.file.mimetype || null,
      req.file.size || null,
      student.id,
      course.teacher_id,
    );

    res
      .status(201)
      .json({ success: true, message: "Assignment submitted successfully." });
  },
);

router.get("/today-classes", (req, res) => {
  const p = db
    .prepare("SELECT semester FROM students WHERE user_id=?")
    .get(req.user.userId);
  if (!p) return res.status(404).json({ error: "Profile not found." });

  const day = req.query.day;
  if (!day) return res.status(400).json({ error: "Day is required." });

  const classes = db
    .prepare(
      `
    SELECT r.id, r.time_slot as timeSlot, r.course_code as courseCode, r.room,
           t.name as teacherName
    FROM routines r
    LEFT JOIN teachers t ON r.teacher_id = t.id
    WHERE r.semester = ? AND r.day = ?
    ORDER BY r.time_slot ASC
  `,
    )
    .all(p.semester, day);

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
