import express from "express";
import bcrypt from "bcryptjs";
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

const getNoticeAttachment = (file) =>
  file
    ? {
        filePath: `/uploads/${file.filename}`,
        originalName: file.originalname,
        fileMime: file.mimetype,
        fileSize: file.size,
      }
    : {
        filePath: null,
        originalName: null,
        fileMime: null,
        fileSize: null,
      };

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
      console.error("Failed to remove notice attachment:", err.message);
    }
  });
};

const getNoticePayload = (body) => ({
  title: String(body.title || "").trim(),
  content: String(body.content || "").trim(),
});

const noticeSelect = `
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
`;

router.use(verifyToken, requireRole("admin"));

// ── GET /api/admin/dashboard ────────────────────────────────
router.get("/dashboard", (_req, res) => {
  const students = db
    .prepare(
      `
    SELECT COUNT(*) as total,
      SUM(CASE WHEN status='pending'  THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status='approved' THEN 1 ELSE 0 END) as approved,
      SUM(CASE WHEN status='rejected' THEN 1 ELSE 0 END) as rejected
    FROM users WHERE role='student'
  `,
    )
    .get();

  const teachers = db
    .prepare(
      `
    SELECT COUNT(*) as total,
      SUM(CASE WHEN status='pending'  THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status='approved' THEN 1 ELSE 0 END) as approved,
      SUM(CASE WHEN status='rejected' THEN 1 ELSE 0 END) as rejected
    FROM users WHERE role='teacher'
  `,
    )
    .get();

  const recentPending = db
    .prepare(
      `
    SELECT u.id as userId,
           COALESCE(s.name, t.name) as name,
           u.email,
           u.role,
           COALESCE(s.student_id, t.teacher_id) as identifier,
           u.created_at as createdAt
    FROM users u
    LEFT JOIN students s ON s.user_id=u.id
    LEFT JOIN teachers t ON t.user_id=u.id
    WHERE u.status='pending' AND u.role IN ('student', 'teacher')
    ORDER BY u.created_at DESC LIMIT 5
  `,
    )
    .all();

  const trends = db
    .prepare(
      `
    SELECT
      CASE strftime('%m', created_at)
        WHEN '01' THEN 'Jan' WHEN '02' THEN 'Feb' WHEN '03' THEN 'Mar'
        WHEN '04' THEN 'Apr' WHEN '05' THEN 'May' WHEN '06' THEN 'Jun'
        WHEN '07' THEN 'Jul' WHEN '08' THEN 'Aug' WHEN '09' THEN 'Sep'
        WHEN '10' THEN 'Oct' WHEN '11' THEN 'Nov' WHEN '12' THEN 'Dec'
      END as month,
      SUM(CASE WHEN role='student' THEN 1 ELSE 0 END) as students,
      SUM(CASE WHEN role='teacher' THEN 1 ELSE 0 END) as teachers
    FROM users
    WHERE created_at >= date('now', '-5 months')
    GROUP BY strftime('%m', created_at)
    ORDER BY created_at ASC
  `,
    )
    .all();
  res.json({
    stats: {
      students,
      teachers,
    },
    recentPending,
    trends,
  });
});

// ── Students ────────────────────────────────────────────────
router.get("/students", (req, res) => {
  const { status = "all", search = "" } = req.query;
  let sql = `
    SELECT u.id as userId, s.name, u.email, s.student_id as studentId,
           s.batch, s.semester, s.phone, s.blood_group as bloodGroup,
           s.cgpa, u.status, u.created_at as createdAt
    FROM users u JOIN students s ON s.user_id=u.id
    WHERE u.role='student'
  `;
  const params = [];
  if (status !== "all") {
    sql += ` AND u.status=?`;
    params.push(status);
  }
  if (search) {
    sql += ` AND (s.name LIKE ? OR u.email LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }
  sql += ` ORDER BY u.created_at DESC`;
  res.json(db.prepare(sql).all(...params));
});

router.patch("/students/:userId/approve", (req, res) => {
  const { userId } = req.params;
  if (
    !db
      .prepare(`SELECT id FROM users WHERE id=? AND role='student'`)
      .get(userId)
  ) {
    return res.status(404).json({ error: "Student not found." });
  }
  db.prepare(
    `UPDATE users SET status='approved', updated_at=datetime('now') WHERE id=?`,
  ).run(userId);
  res.json({ success: true, message: "Student approved." });
});

router.patch("/students/:userId/reject", (req, res) => {
  const { userId } = req.params;
  if (
    !db
      .prepare(`SELECT id FROM users WHERE id=? AND role='student'`)
      .get(userId)
  ) {
    return res.status(404).json({ error: "Student not found." });
  }
  db.prepare(
    `UPDATE users SET status='rejected', updated_at=datetime('now') WHERE id=?`,
  ).run(userId);
  res.json({ success: true, message: "Student rejected." });
});

router.delete("/students/:userId", (req, res) => {
  db.prepare(`DELETE FROM users WHERE id=? AND role='student'`).run(
    req.params.userId,
  );
  res.json({ success: true, message: "Student deleted." });
});

// ── Teachers ────────────────────────────────────────────────
router.get("/teachers", (req, res) => {
  const { status = "all", search = "" } = req.query;
  let sql = `
    SELECT u.id as userId, t.name, u.email, t.teacher_id as teacherId,
           t.designation, t.specialization, t.phone, t.office_room as officeRoom,
           t.joining_date as joiningDate, u.status, u.created_at as createdAt
    FROM users u JOIN teachers t ON t.user_id=u.id
    WHERE u.role='teacher'
  `;
  const params = [];
  if (status !== "all") {
    sql += ` AND u.status=?`;
    params.push(status);
  }
  if (search) {
    sql += ` AND (t.name LIKE ? OR u.email LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }
  sql += ` ORDER BY t.name`;
  res.json(db.prepare(sql).all(...params));
});

router.patch("/teachers/:userId/approve", (req, res) => {
  const { userId } = req.params;
  if (
    !db
      .prepare(`SELECT id FROM users WHERE id=? AND role='teacher'`)
      .get(userId)
  ) {
    return res.status(404).json({ error: "Teacher not found." });
  }
  db.prepare(
    `UPDATE users SET status='approved', updated_at=datetime('now') WHERE id=?`,
  ).run(userId);
  res.json({ success: true, message: "Teacher approved." });
});

router.patch("/teachers/:userId/reject", (req, res) => {
  const { userId } = req.params;
  if (
    !db
      .prepare(`SELECT id FROM users WHERE id=? AND role='teacher'`)
      .get(userId)
  ) {
    return res.status(404).json({ error: "Teacher not found." });
  }
  db.prepare(
    `UPDATE users SET status='rejected', updated_at=datetime('now') WHERE id=?`,
  ).run(userId);
  res.json({ success: true, message: "Teacher rejected." });
});

router.post("/teachers", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      teacherId,
      designation,
      specialization,
      phone,
      officeRoom,
      joiningDate,
    } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ error: "Name, email and password are required." });
    if (db.prepare("SELECT id FROM users WHERE email=?").get(email))
      return res.status(409).json({ error: "Email already in use." });
    const hash = await bcrypt.hash(password, 10);
    const r = db
      .prepare(
        `INSERT INTO users (email,password,role,status) VALUES (?,?,'teacher','approved')`,
      )
      .run(email, hash);
    db.prepare(
      `INSERT INTO teachers (user_id,name,teacher_id,designation,specialization,phone,office_room,joining_date) VALUES (?,?,?,?,?,?,?,?)`,
    ).run(
      r.lastInsertRowid,
      name,
      teacherId || null,
      designation || null,
      specialization || null,
      phone || null,
      officeRoom || null,
      joiningDate || null,
    );
    res.status(201).json({ success: true, message: "Teacher created." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.put("/teachers/:userId", (req, res) => {
  const {
    name,
    teacherId,
    designation,
    specialization,
    phone,
    officeRoom,
    joiningDate,
  } = req.body;
  db.prepare(
    `UPDATE teachers SET name=?,teacher_id=?,designation=?,specialization=?,phone=?,office_room=?,joining_date=? WHERE user_id=?`,
  ).run(
    name,
    teacherId || null,
    designation || null,
    specialization || null,
    phone || null,
    officeRoom || null,
    joiningDate || null,
    req.params.userId,
  );
  res.json({ success: true, message: "Teacher updated." });
});

router.delete("/teachers/:userId", (req, res) => {
  db.prepare(`DELETE FROM users WHERE id=? AND role='teacher'`).run(
    req.params.userId,
  );
  res.json({ success: true, message: "Teacher deleted." });
});

// ── Courses ────────────────────────────────────────────────
router.get("/courses", (req, res) => {
  const courses = db
    .prepare(
      `
    SELECT c.id, c.course_code as courseCode, c.course_name as courseName,
           c.semester, t.user_id as teacherUserId, t.name as teacherName
    FROM courses c
    LEFT JOIN teachers t ON c.teacher_id = t.id
    ORDER BY c.semester ASC, c.course_code ASC
  `,
    )
    .all();
  res.json(courses);
});

router.post("/courses/assign-by-code", (req, res) => {
  const { courseCode, courseName, semester, teacherUserId } = req.body;
  if (!courseCode)
    return res.status(400).json({ error: "Course code is required." });

  let dbTeacherId = null;
  if (teacherUserId) {
    const teacher = db
      .prepare("SELECT id FROM teachers WHERE user_id=?")
      .get(teacherUserId);
    if (!teacher) return res.status(404).json({ error: "Teacher not found." });
    dbTeacherId = teacher.id;
  }

  const course = db
    .prepare("SELECT id FROM courses WHERE course_code=?")
    .get(courseCode);
  if (course) {
    db.prepare(
      "UPDATE courses SET teacher_id=?, course_name=?, semester=? WHERE id=?",
    ).run(dbTeacherId, courseName, semester, course.id);
  } else {
    db.prepare(
      `INSERT INTO courses (course_code, course_name, semester, teacher_id) VALUES (?, ?, ?, ?)`,
    ).run(courseCode, courseName, semester, dbTeacherId);
  }

  res.json({ success: true, message: "Course assigned successfully." });
});

// ── Notices ────────────────────────────────────────────────
router.get("/notices", (req, res) => {
  const notices = db
    .prepare(
      `
    ${noticeSelect}
    ORDER BY n.created_at DESC, n.id DESC
  `,
    )
    .all();
  res.json(notices);
});

router.post("/notices", upload.single("file"), (req, res) => {
  const { title, content } = getNoticePayload(req.body);
  if (!title) {
    removeUpload(req.file?.path);
    return res.status(400).json({ error: "Notice title is required." });
  }
  if (!content && !req.file) {
    removeUpload(req.file?.path);
    return res
      .status(400)
      .json({ error: "Write notice text or attach a file." });
  }

  const admin = db
    .prepare("SELECT id FROM admins WHERE user_id=?")
    .get(req.user.userId);
  const adminId = admin ? admin.id : null;
  const attachment = getNoticeAttachment(req.file);

  db.prepare(
    `
    INSERT INTO notices (
      title, content, file_path, original_name, file_mime, file_size, author_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    title,
    content,
    attachment.filePath,
    attachment.originalName,
    attachment.fileMime,
    attachment.fileSize,
    adminId,
  );
  res
    .status(201)
    .json({ success: true, message: "Notice published successfully." });
});

router.put("/notices/:id", upload.single("file"), (req, res) => {
  const existing = db
    .prepare("SELECT * FROM notices WHERE id=?")
    .get(req.params.id);
  if (!existing) {
    removeUpload(req.file?.path);
    return res.status(404).json({ error: "Notice not found." });
  }

  const { title, content } = getNoticePayload(req.body);
  if (!title) {
    removeUpload(req.file?.path);
    return res.status(400).json({ error: "Notice title is required." });
  }

  const shouldRemoveFile =
    req.body.removeFile === "true" || req.body.removeFile === "1";
  const uploadedAttachment = getNoticeAttachment(req.file);
  const nextAttachment = req.file
    ? uploadedAttachment
    : shouldRemoveFile
      ? getNoticeAttachment(null)
      : {
          filePath: existing.file_path,
          originalName: existing.original_name,
          fileMime: existing.file_mime,
          fileSize: existing.file_size,
        };

  if (!content && !nextAttachment.filePath) {
    removeUpload(req.file?.path);
    return res
      .status(400)
      .json({ error: "Write notice text or keep an attachment." });
  }

  db.prepare(
    `
    UPDATE notices
    SET title=?,
        content=?,
        file_path=?,
        original_name=?,
        file_mime=?,
        file_size=?,
        updated_at=datetime('now')
    WHERE id=?
  `,
  ).run(
    title,
    content,
    nextAttachment.filePath,
    nextAttachment.originalName,
    nextAttachment.fileMime,
    nextAttachment.fileSize,
    req.params.id,
  );

  if ((req.file || shouldRemoveFile) && existing.file_path) {
    removeUpload(existing.file_path);
  }

  res.json({ success: true, message: "Notice updated successfully." });
});

router.delete("/notices/:id", (req, res) => {
  const existing = db
    .prepare("SELECT file_path FROM notices WHERE id=?")
    .get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: "Notice not found." });
  }

  db.prepare("DELETE FROM notices WHERE id=?").run(req.params.id);
  removeUpload(existing.file_path);
  res.json({ success: true, message: "Notice deleted." });
});

export default router;
