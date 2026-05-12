import "dotenv/config";
import bcrypt from "bcryptjs";
import db from "./db.js";

const SALT = 10;

async function seed() {
  console.log("\n🌱  Seeding CSE Department Management System...\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // ── Admin ──────────────────────────────────────────────────
  console.log("📋 Creating Admin Account...");
  if (
    !db.prepare("SELECT id FROM users WHERE email = ?").get("admin@cse.edu")
  ) {
    const hash = await bcrypt.hash("Admin@123", SALT);
    const r = db
      .prepare(
        `INSERT INTO users (email,password,role,status) VALUES (?,?,'admin','approved')`,
      )
      .run("admin@cse.edu", hash);
    db.prepare(`INSERT INTO admins (user_id,name) VALUES (?,?)`).run(
      r.lastInsertRowid,
      "CSE Admin",
    );
    console.log("  ✅  Admin created → admin@cse.edu / Admin@123\n");
  } else {
    console.log("  ⏭️  Admin already exists\n");
  }

  // ── Teachers ───────────────────────────────────────────────
  console.log("👨‍🏫 Teacher Accounts:");
  console.log(
    "   No teachers seeded. Teachers will be added when they sign up.\n",
  );

  // ── Students ───────────────────────────────────────────────
  console.log("👨‍🎓 Student Accounts:");
  console.log(
    "   No students seeded. Students will be added when they sign up.\n",
  );

  // ── Courses ────────────────────────────────────────────────
  console.log("📚 Creating Sample Courses...");
  const courses = [
    {
      code: "CSE101",
      name: "Introduction to Programming",
      sem: 1,
      location: "Room 301",
      lat: 23.8103,
      lon: 90.4125,
    },
    {
      code: "CSE201",
      name: "Data Structures",
      sem: 3,
      location: "Room 302",
      lat: 23.8103,
      lon: 90.4125,
    },
    {
      code: "CSE301",
      name: "Database Management Systems",
      sem: 5,
      location: "Room 303",
      lat: 23.8103,
      lon: 90.4125,
    },
    {
      code: "CSE401",
      name: "Artificial Intelligence",
      sem: 7,
      location: "Room 304",
      lat: 23.8103,
      lon: 90.4125,
    },
    // Semester 6 Courses
    {
      code: "CSE601",
      name: "Software Engineering",
      sem: 6,
      location: "Room 401",
      lat: 23.8103,
      lon: 90.4125,
    },
    {
      code: "CSE602",
      name: "Computer Networks",
      sem: 6,
      location: "Room 402",
      lat: 23.8103,
      lon: 90.4125,
    },
    {
      code: "CSE603",
      name: "Operating Systems",
      sem: 6,
      location: "Room 403",
      lat: 23.8103,
      lon: 90.4125,
    },
    {
      code: "CSE604",
      name: "Web Technologies",
      sem: 6,
      location: "Lab 201",
      lat: 23.8103,
      lon: 90.4125,
    },
    {
      code: "CSE605",
      name: "Machine Learning",
      sem: 6,
      location: "Room 404",
      lat: 23.8103,
      lon: 90.4125,
    },
  ];

  for (const c of courses) {
    const existing = db
      .prepare("SELECT id FROM courses WHERE course_code = ?")
      .get(c.code);
    if (!existing) {
      db.prepare(
        `INSERT INTO courses (course_code, course_name, semester, location, latitude, longitude, radius)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ).run(c.code, c.name, c.sem, c.location, c.lat, c.lon, 100);
      console.log(`  ✅  ${c.code.padEnd(10)} → ${c.name}`);
    }
  }
  console.log("");

  // ── Attendance Sessions ────────────────────────────────────
  console.log("📅 Creating Today's Attendance Sessions...");
  const today = new Date().toISOString().split("T")[0];
  const now = new Date();
  const currentHour = now.getHours();

  // Create sessions for today - Multiple semesters
  const sessionTimes = [
    // Semester 1
    { start: "09:00", end: "10:30", courseCode: "CSE101" },
    // Semester 3
    { start: "11:00", end: "12:30", courseCode: "CSE201" },
    // Semester 5
    { start: "14:00", end: "15:30", courseCode: "CSE301" },
    // Semester 7
    { start: "16:00", end: "17:30", courseCode: "CSE401" },

    // Semester 6 - Full Schedule
    { start: "08:00", end: "09:30", courseCode: "CSE601" }, // Software Engineering
    { start: "09:45", end: "11:15", courseCode: "CSE602" }, // Computer Networks
    { start: "11:30", end: "13:00", courseCode: "CSE603" }, // Operating Systems
    { start: "14:00", end: "15:30", courseCode: "CSE604" }, // Web Technologies
    { start: "15:45", end: "17:15", courseCode: "CSE605" }, // Machine Learning
  ];

  for (const st of sessionTimes) {
    const course = db
      .prepare("SELECT id FROM courses WHERE course_code = ?")
      .get(st.courseCode);
    if (course) {
      const existing = db
        .prepare(
          "SELECT id FROM attendance_sessions WHERE course_id = ? AND session_date = ? AND start_time = ?",
        )
        .get(course.id, today, st.start);

      if (!existing) {
        const startHour = parseInt(st.start.split(":")[0]);
        const status =
          currentHour >= startHour && currentHour < startHour + 2
            ? "active"
            : "active";

        db.prepare(
          `INSERT INTO attendance_sessions (course_id, session_date, start_time, end_time, status)
           VALUES (?, ?, ?, ?, ?)`,
        ).run(course.id, today, st.start, st.end, status);
        console.log(
          `  ✅  ${st.courseCode} → ${st.start}-${st.end} (${status})`,
        );
      }
    }
  }
  console.log("");

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅  Database seeded successfully!\n");
  console.log("🔐 Login Credentials:\n");
  console.log(
    "┌─────────────┬────────────────────────────────────┬─────────────┐",
  );
  console.log(
    "│ Role        │ Email                              │ Password    │",
  );
  console.log(
    "├─────────────┼────────────────────────────────────┼─────────────┤",
  );
  console.log(
    "│ Admin       │ admin@cse.edu                      │ Admin@123   │",
  );
  console.log(
    "│ Teacher     │ (Register first)                   │ (Your PW)   │",
  );
  console.log(
    "└─────────────┴────────────────────────────────────┴─────────────┘\n",
  );
  console.log("📝 User Approval Workflow (Students & Teachers):");
  console.log("   1. Users sign up → Status: PENDING");
  console.log("   2. Admin sees user in dashboard pending section");
  console.log("   3. Admin approves → Status: APPROVED → User can login");
  console.log("   4. Admin rejects → Status: REJECTED → User cannot login\n");
  console.log("✅ Attendance System:");
  console.log("   • Semester 6 students can mark attendance");
  console.log("   • 5 courses with scheduled sessions today");
  console.log("   • Location-based validation (within 100m)");
  console.log("   • Time-based validation (during class hours)\n");
  console.log("🚀 Start the application:");
  console.log("   npm run dev\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

seed().catch(console.error);
