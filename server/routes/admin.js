import express from "express";
import bcrypt from "bcryptjs";
import db from "../database/db.js";
import { verifyToken, requireRole } from "../middleware/auth.js";

const router = express.Router();
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

export default router;
