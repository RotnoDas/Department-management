import { useState, useEffect, Fragment } from "react";
import api from "../../api/axios";
import { Calendar, Save, Edit3, X, Loader2 } from "lucide-react";
import { addToast } from "@heroui/toast";
import { SEMESTER_COURSES } from "../../data/courses";

const DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"];
const SEMESTERS = [
  { id: 1, label: "1" },
  { id: 2, label: "2" },
  { id: 3, label: "3" },
  { id: 4, label: "4" },
  { id: 5, label: "5" },
  { id: 6, label: "6" },
  { id: 7, label: "7" },
  { id: 8, label: "8" },
];
const TIME_SLOTS = [
  "9:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 01:00",
  "01:00 - 02:00",
  "02:00 - 03:00",
  "03:00 - 04:00",
  "04:00 - 05:00",
];

export default function AdminRoutine() {
  const [routines, setRoutines] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCell, setEditingCell] = useState(null); // { day, semester, timeSlot }
  const [formData, setFormData] = useState({
    courseCode: "",
    teacherId: "",
    room: "",
  });

  const fetchRoutines = async () => {
    try {
      const res = await api.get("/admin/routine");
      setRoutines(res.data);
    } catch (err) {
      addToast({ title: "Failed to load routines", color: "danger" });
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await api.get("/admin/courses");
      setCourses(res.data);
    } catch (err) {
      addToast({ title: "Failed to load courses", color: "danger" });
    }
  };

  useEffect(() => {
    Promise.all([fetchRoutines(), fetchCourses()]).finally(() =>
      setLoading(false),
    );
  }, []);

  const getCellData = (day, semester, timeSlot) => {
    return routines.find(
      (r) =>
        r.day === day && r.semester === semester && r.timeSlot === timeSlot,
    );
  };

  const handleEditClick = (day, semester, timeSlot) => {
    const cell = getCellData(day, semester, timeSlot);
    setEditingCell({ day, semester, timeSlot });
    if (cell) {
      setFormData({
        courseCode: cell.courseCode || "",
        teacherId: cell.teacherId || "",
        room: cell.room || "",
      });
    } else {
      setFormData({ courseCode: "", teacherId: "", room: "" });
    }
  };

  const handleSave = async () => {
    if (!editingCell) return;
    try {
      await api.post("/admin/routine", {
        day: editingCell.day,
        semester: editingCell.semester,
        timeSlot: editingCell.timeSlot,
        courseCode: formData.courseCode,
        teacherId: formData.teacherId || null,
        room: formData.room,
      });
      addToast({ title: "Routine updated", color: "success" });
      setEditingCell(null);
      fetchRoutines();
    } catch (err) {
      addToast({ title: err.response?.data?.error || "Failed to update routine", color: "danger" });
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="page-transition space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Class Routine</h1>
          <p className="text-base-content/60 text-sm">
            Manage department class schedule
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-300 bg-white shadow-lg">
        <table className="table w-full border-collapse">
          <thead>
            <tr className="bg-slate-800 text-white">
              <th className="w-16 border-r border-slate-700 text-center font-bold tracking-wide uppercase">
                Day
              </th>
              <th className="w-20 border-r border-slate-700 text-center font-bold tracking-wide uppercase">
                Sem
              </th>
              {TIME_SLOTS.map((slot) => (
                <th
                  key={slot}
                  className="min-w-[150px] border-r border-slate-700 text-center font-bold whitespace-nowrap last:border-0"
                >
                  {slot}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day, dayIdx) => (
              <Fragment key={day}>
                {SEMESTERS.map((sem, idx) => {
                  const isFirstSemOfDay = idx === 0;
                  return (
                    <tr
                      key={`${day}-${sem.id}`}
                      className={
                        isFirstSemOfDay
                          ? "border-t-4 border-slate-300"
                          : "border-t border-slate-100"
                      }
                    >
                      {isFirstSemOfDay && (
                        <td
                          rowSpan={SEMESTERS.length}
                          className="rotate-180 border-r-4 border-slate-300 bg-slate-100 text-center align-middle font-black tracking-[0.3em] text-slate-700 uppercase"
                          style={{ writingMode: "vertical-rl" }}
                        >
                          {day}
                        </td>
                      )}
                      <td className="border-r border-slate-200 bg-slate-50 text-center text-lg font-extrabold text-slate-700">
                        {sem.label}
                      </td>
                      {TIME_SLOTS.map((slot) => {
                        const isBreak = slot === "01:00 - 02:00";
                        if (isBreak) {
                          if (isFirstSemOfDay) {
                            return (
                              <td
                                key={slot}
                                rowSpan={SEMESTERS.length}
                                className="border-r border-slate-200 bg-slate-100/50 text-center align-middle font-black tracking-widest text-slate-400 uppercase"
                              >
                                Break
                              </td>
                            );
                          }
                          return null; // Skip for other rows in break column
                        }

                        const cell = getCellData(day, sem.id, slot);
                        const isEditing =
                          editingCell?.day === day &&
                          editingCell?.semester === sem.id &&
                          editingCell?.timeSlot === slot;

                        return (
                          <td
                            key={slot}
                            className={`border-r border-slate-200 p-2 transition-colors ${
                              isEditing ? "bg-primary/5" : "hover:bg-slate-50"
                            }`}
                          >
                            {isEditing ? (
                              <div className="flex min-w-[140px] flex-col gap-2">
                                <select
                                  className="select select-bordered select-sm"
                                  value={formData.courseCode}
                                  onChange={(e) => {
                                    const code = e.target.value;
                                    const selectedCourse = courses.find(
                                      (c) => c.courseCode === code,
                                    );
                                    setFormData({
                                      ...formData,
                                      courseCode: code,
                                      teacherId: selectedCourse
                                        ? selectedCourse.teacherId
                                        : "",
                                    });
                                  }}
                                >
                                  <option value="">Select Course</option>
                                  {(SEMESTER_COURSES[sem.id] || []).map((c) => {
                                    const assignedCourse = courses.find(
                                      (ac) => ac.courseCode === c.code,
                                    );
                                    return (
                                      <option key={c.code} value={c.code}>
                                        {c.code} - {c.title}{" "}
                                        {assignedCourse?.teacherName
                                          ? `(${assignedCourse.teacherName})`
                                          : "(No Faculty)"}
                                      </option>
                                    );
                                  })}
                                </select>
                                <input
                                  type="text"
                                  className="input input-bordered input-sm"
                                  placeholder="Room"
                                  value={formData.room}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      room: e.target.value,
                                    })
                                  }
                                />
                                <div className="mt-1 flex justify-end gap-1">
                                  <button
                                    className="btn btn-xs btn-ghost text-error"
                                    onClick={() => setEditingCell(null)}
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                  <button
                                    className="btn btn-xs btn-primary"
                                    onClick={handleSave}
                                  >
                                    <Save className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div
                                className="hover:bg-base-200 flex min-h-[60px] cursor-pointer flex-col items-center justify-center rounded p-1 text-center"
                                onClick={() =>
                                  handleEditClick(day, sem.id, slot)
                                }
                              >
                                {cell &&
                                (cell.courseCode ||
                                  cell.teacherName ||
                                  cell.room) ? (
                                  <>
                                    <span className="text-primary text-xs font-bold">
                                      {cell.courseCode}
                                    </span>
                                    <span
                                      className="text-base-content/80 max-w-full truncate text-xs"
                                      title={cell.teacherName}
                                    >
                                      {cell.teacherName}
                                    </span>
                                    <span className="text-base-content/60 bg-base-200 mt-1 rounded px-1 text-[10px]">
                                      {cell.room}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-base-content/20 opacity-0 transition-opacity hover:opacity-100">
                                    <Edit3 className="mx-auto h-4 w-4" />
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
