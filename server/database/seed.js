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
  console.log("📚 Sample Courses exist in database (or use UI to add more)...");
  console.log("");

  // ── Attendance Sessions ────────────────────────────────────
  console.log("📅 Creating Today's Attendance Sessions...");
  const today = new Date().toISOString().split("T")[0];
  const now = new Date();
  const currentHour = now.getHours();

  // No placeholder sessions are automatically seeded to avoid duplicates.
  // The system dynamically syncs real sessions from the routines.

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
