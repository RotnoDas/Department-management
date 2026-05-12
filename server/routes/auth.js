import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../database/db.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

const signToken = (user) =>
  jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );

const getProfileName = (userId, role) => {
  if (role === "student")
    return db.prepare("SELECT name FROM students  WHERE user_id=?").get(userId)
      ?.name;
  if (role === "teacher")
    return db.prepare("SELECT name FROM teachers  WHERE user_id=?").get(userId)
      ?.name;
  if (role === "employee")
    return db.prepare("SELECT name FROM employees WHERE user_id=?").get(userId)
      ?.name;
  if (role === "admin")
    return db.prepare("SELECT name FROM admins    WHERE user_id=?").get(userId)
      ?.name;
  return null;
};

// ── POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      role,
      studentId,
      teacherId,
      employeeId,
      phone,
      batch,
      semester,
      bloodGroup,
      address,
      designation,
      specialization,
      officeRoom,
      section,
    } = req.body;

    if (!email || !password || !name || !role) {
      return res
        .status(400)
        .json({ error: "Name, email, password and role are required." });
    }

    if (!["admin", "teacher", "employee", "student"].includes(role)) {
      return res.status(400).json({ error: "Invalid role provided." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters." });
    }

    if (db.prepare("SELECT id FROM users WHERE email=?").get(email)) {
      return res
        .status(409)
        .json({ error: "An account with this email already exists." });
    }

    const hash = await bcrypt.hash(password, 10);
    const r = db
      .prepare(
        `INSERT INTO users (email,password,role,status) VALUES (?,?,?,'pending')`,
      )
      .run(email, hash, role);

    const userId = r.lastInsertRowid;

    if (role === "student") {
      db.prepare(
        `INSERT INTO students (user_id,name,student_id,phone,batch,semester,blood_group,address) VALUES (?,?,?,?,?,?,?,?)`,
      ).run(
        userId,
        name,
        studentId || null,
        phone || null,
        batch || null,
        parseInt(semester) || 1,
        bloodGroup || null,
        address || null,
      );
    } else if (role === "teacher") {
      db.prepare(
        `INSERT INTO teachers (user_id,name,teacher_id,phone,designation,specialization,office_room) VALUES (?,?,?,?,?,?,?)`,
      ).run(
        userId,
        name,
        teacherId || null,
        phone || null,
        designation || null,
        specialization || null,
        officeRoom || null,
      );
    } else if (role === "employee") {
      db.prepare(
        `INSERT INTO employees (user_id,name,employee_id,phone,designation,section) VALUES (?,?,?,?,?,?)`,
      ).run(
        userId,
        name,
        employeeId || null,
        phone || null,
        designation || null,
        section || null,
      );
    } else if (role === "admin") {
      db.prepare(`INSERT INTO admins (user_id,name) VALUES (?,?)`).run(
        userId,
        name,
      );
    }

    res.status(201).json({
      success: true,
      message:
        "Registration successful! Your account is pending admin approval.",
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// ── POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role)
      return res
        .status(400)
        .json({ error: "Email, password and role are required." });

    const user = db.prepare("SELECT * FROM users WHERE email=?").get(email);
    if (!user || !user.password)
      return res.status(401).json({ error: "Invalid email or password." });

    if (user.role !== role) {
      return res
        .status(401)
        .json({ error: `User is not registered as a ${role}.` });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ error: "Invalid email or password." });

    if (user.status === "pending") {
      return res.status(403).json({
        error: "Your account is pending admin approval.",
        status: "pending",
      });
    }
    if (user.status === "rejected") {
      return res.status(403).json({
        error: "Your account application has been rejected.",
        status: "rejected",
      });
    }

    const name = getProfileName(user.id, user.role) || user.email;
    const token = signToken({ ...user, name });
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        name,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// ── GET /api/auth/me
router.get("/me", verifyToken, (req, res) => {
  const { userId, email, role, status } = req.user;
  const user = db.prepare("SELECT id FROM users WHERE id=?").get(userId);
  if (!user) return res.status(404).json({ error: "User not found." });
  const name = getProfileName(userId, role) || email;
  res.json({ id: userId, email, role, status, name });
});

// ── POST /api/auth/logout
router.post("/logout", (_req, res) => {
  res.json({ success: true });
});

export default router;
