import db from "./db.js";

console.log("\n🔄 Resetting Attendance Sessions...\n");

// Delete all old attendance records and sessions
db.prepare("DELETE FROM attendance_records").run();
db.prepare("DELETE FROM attendance_sessions").run();

console.log("✅ Deleted all old sessions and records\n");

// Create today's sessions
console.log("📅 Creating Today's Attendance Sessions...");
const today = new Date().toISOString().split("T")[0];

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
  { start: "08:00", end: "09:30", courseCode: "CSE601" },  // Software Engineering
  { start: "09:45", end: "11:15", courseCode: "CSE602" },  // Computer Networks
  { start: "11:30", end: "13:00", courseCode: "CSE603" },  // Operating Systems
  { start: "14:00", end: "15:30", courseCode: "CSE604" },  // Web Technologies
  { start: "15:45", end: "17:15", courseCode: "CSE605" },  // Machine Learning
];

for (const st of sessionTimes) {
  const course = db
    .prepare("SELECT id FROM courses WHERE course_code = ?")
    .get(st.courseCode);
  
  if (course) {
    db.prepare(
      `INSERT INTO attendance_sessions (course_id, session_date, start_time, end_time, status) 
       VALUES (?, ?, ?, ?, 'active')`,
    ).run(course.id, today, st.start, st.end);
    console.log(`  ✅  ${st.courseCode} → ${st.start}-${st.end} (${today})`);
  } else {
    console.log(`  ❌  Course ${st.courseCode} not found`);
  }
}

console.log("\n✅ Sessions created for today:", today);
console.log("\n🔍 Verifying sessions...");

const allSessions = db.prepare(`
  SELECT 
    c.course_code,
    c.course_name,
    c.semester,
    ats.session_date,
    ats.start_time,
    ats.end_time,
    ats.status
  FROM attendance_sessions ats
  JOIN courses c ON c.id = ats.course_id
  WHERE ats.session_date = ?
  ORDER BY c.semester, ats.start_time
`).all(today);

console.log(`\nTotal sessions for today: ${allSessions.length}\n`);

allSessions.forEach(s => {
  console.log(`  Semester ${s.semester}: ${s.course_code} (${s.start_time}-${s.end_time})`);
});

console.log("\n✅ Done!\n");
