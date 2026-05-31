import db from './server/database/db.js';

try {
  // Add description column
  try {
    db.exec("ALTER TABLE course_materials ADD COLUMN description TEXT");
  } catch (e) {
    console.log("Column might exist:", e.message);
  }

  // Recreate table to allow file_path to be NULL
  db.exec(`
    CREATE TABLE cm_new (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      course_code   TEXT NOT NULL,
      semester      INTEGER NOT NULL,
      title         TEXT NOT NULL,
      description   TEXT,
      file_path     TEXT,
      original_name TEXT,
      teacher_id    INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
      created_at    TEXT DEFAULT (datetime('now'))
    );
    INSERT INTO cm_new SELECT id, course_code, semester, title, description, file_path, original_name, teacher_id, created_at FROM course_materials;
    DROP TABLE course_materials;
    ALTER TABLE cm_new RENAME TO course_materials;
  `);

  console.log("Migration complete");
} catch (e) {
  console.error("Migration failed:", e.message);
}
