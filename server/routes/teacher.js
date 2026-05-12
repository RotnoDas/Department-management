import express from "express";
import db from "../database/db.js";
import { verifyToken, requireRole } from "../middleware/auth.js";

const router = express.Router();
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

export default router;
