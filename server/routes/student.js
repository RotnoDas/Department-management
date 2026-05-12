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

export default router;
