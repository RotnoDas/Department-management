// Using Node.js built-in sqlite (v22+) — no native compilation needed
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new DatabaseSync(join(__dirname, "cse_department.db"));

// Pragmas via exec
db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    email      TEXT UNIQUE NOT NULL,
    password   TEXT,
    role       TEXT NOT NULL CHECK(role IN ('student','teacher','admin')),
    status     TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS students (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    student_id  TEXT,
    phone       TEXT,
    batch       TEXT,
    semester    INTEGER DEFAULT 1,
    session     TEXT,
    cgpa        REAL DEFAULT 0.0,
    address     TEXT,
    blood_group TEXT,
    created_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS teachers (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id        INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    name           TEXT NOT NULL,
    teacher_id     TEXT,
    phone          TEXT,
    designation    TEXT,
    specialization TEXT,
    office_room    TEXT,
    joining_date   TEXT,
    created_at     TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS admins (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    name       TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS courses (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    course_code  TEXT UNIQUE NOT NULL,
    course_name  TEXT NOT NULL,
    semester     INTEGER NOT NULL,
    teacher_id   INTEGER REFERENCES teachers(id) ON DELETE SET NULL,
    schedule     TEXT,
    location     TEXT,
    latitude     REAL,
    longitude    REAL,
    radius       INTEGER DEFAULT 50,
    created_at   TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS attendance_sessions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id   INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    session_date TEXT NOT NULL,
    start_time  TEXT NOT NULL,
    end_time    TEXT NOT NULL,
    status      TEXT DEFAULT 'active' CHECK(status IN ('active','closed')),
    created_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS attendance_records (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id  INTEGER NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    student_id  INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    marked_at   TEXT DEFAULT (datetime('now')),
    latitude    REAL,
    longitude   REAL,
    status      TEXT DEFAULT 'present' CHECK(status IN ('present','absent','late')),
    UNIQUE(session_id, student_id)
  );

  CREATE TABLE IF NOT EXISTS notices (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    title         TEXT NOT NULL,
    content       TEXT,
    file_path     TEXT,
    original_name TEXT,
    file_mime     TEXT,
    file_size     INTEGER,
    author_id     INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    created_at    TEXT DEFAULT (datetime('now')),
    updated_at    TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS course_materials (
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

  CREATE TABLE IF NOT EXISTS assignment_submissions (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    course_code   TEXT NOT NULL,
    semester      INTEGER NOT NULL,
    title         TEXT NOT NULL,
    note          TEXT,
    file_path     TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_mime     TEXT,
    file_size     INTEGER,
    student_id    INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    teacher_id    INTEGER REFERENCES teachers(id) ON DELETE SET NULL,
    created_at    TEXT DEFAULT (datetime('now'))
  );
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_assignment_submissions_student_course
    ON assignment_submissions(student_id, course_code);
  CREATE INDEX IF NOT EXISTS idx_assignment_submissions_course_semester
    ON assignment_submissions(course_code, semester);
`);

const ensureColumn = (table, column, definition) => {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all();
  if (!columns.some((item) => item.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${definition}`);
  }
};

ensureColumn(
  "courses",
  "target_sessions",
  "target_sessions INTEGER DEFAULT NULL",
);
ensureColumn("notices", "file_path", "file_path TEXT");
ensureColumn("notices", "original_name", "original_name TEXT");
ensureColumn("notices", "file_mime", "file_mime TEXT");
ensureColumn("notices", "file_size", "file_size INTEGER");
ensureColumn("notices", "updated_at", "updated_at TEXT");

export default db;
