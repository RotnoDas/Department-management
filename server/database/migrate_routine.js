import db from "./db.js";

try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS routines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day TEXT NOT NULL,
      semester INTEGER NOT NULL,
      time_slot TEXT NOT NULL,
      course_code TEXT,
      teacher_id INTEGER REFERENCES teachers(id) ON DELETE SET NULL,
      room TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_routines_unique ON routines(day, semester, time_slot);
  `);
  console.log("Routine table created successfully.");
} catch (error) {
  console.error("Migration failed:", error);
}
