import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRouter from "./routes/auth.js";
import adminRouter from "./routes/admin.js";
import studentRouter from "./routes/student.js";
import teacherRouter from "./routes/teacher.js";
import attendanceRouter from "./routes/attendance.js";

const app = express();
const PORT = process.env.PORT || 3001;

// ── Core middleware ─────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
  }),
);

// Serve uploads folder for materials
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Routes ──────────────────────────────────────────────────
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/student", studentRouter);
app.use("/api/teacher", teacherRouter);
app.use("/api/attendance", attendanceRouter);

app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", time: new Date().toISOString() }),
);
app.use("/api/*", (_req, res) =>
  res.status(404).json({ error: "Endpoint not found." }),
);

// ── Global error handler ────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Internal server error." });
});

// ── Start ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🎓  CSE Department Management System`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🚀  Server running at:  http://localhost:${PORT}`);
  console.log(
    `📊  Database:           SQLite (server/database/cse_department.db)`,
  );
  console.log(`\n💡  Quick Start:`);
  console.log(`    1. Run "npm run seed" to populate demo data`);
  console.log(`    2. Open http://localhost:5173 in your browser`);
  console.log(`    3. Login as admin@cse.edu / Admin@123`);
  console.log(`\n📝  Student Workflow:`);
  console.log(`    → Student signs up (pending status)`);
  console.log(`    → Admin reviews in admin panel`);
  console.log(`    → Admin approves/rejects`);
  console.log(`    → Approved students can login`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
});
