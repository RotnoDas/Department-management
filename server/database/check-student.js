import db from "./db.js";

console.log("\n🔍 Checking Student Data...\n");

// Get all students
const students = db.prepare(`
  SELECT 
    s.id,
    s.name,
    s.student_id,
    s.semester,
    s.batch,
    u.email,
    u.status
  FROM students s
  JOIN users u ON u.id = s.user_id
`).all();

console.log(`Total students: ${students.length}\n`);

if (students.length === 0) {
  console.log("❌ No students found in database!");
  console.log("Please sign up as a student first.\n");
} else {
  students.forEach(s => {
    console.log(`Student: ${s.name}`);
    console.log(`  Email: ${s.email}`);
    console.log(`  Roll: ${s.student_id}`);
    console.log(`  Semester: ${s.semester}`);
    console.log(`  Session: ${s.batch}`);
    console.log(`  Status: ${s.status}`);
    console.log("");
  });

  // Update all students to Semester 6
  console.log("🔄 Updating all students to Semester 6...\n");
  db.prepare("UPDATE students SET semester = 6").run();
  console.log("✅ All students updated to Semester 6\n");

  // Verify
  const updated = db.prepare("SELECT name, semester FROM students").all();
  updated.forEach(s => {
    console.log(`  ✅ ${s.name} → Semester ${s.semester}`);
  });
}

console.log("\n✅ Done!\n");
