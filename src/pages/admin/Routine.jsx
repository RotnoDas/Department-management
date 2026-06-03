import { useState, useEffect, Fragment } from "react";
import api from "../../api/axios";
import {
  Calendar,
  Save,
  Edit3,
  X,
  Loader2,
  Clock,
  Coffee,
  BookOpen,
  User,
  MapPin,
} from "lucide-react";
import { addToast } from "../../utils/toast";
import { SEMESTER_COURSES } from "../../data/courses";

const DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"];
const SEMESTERS = [
  { id: 1, label: "1-1" },
  { id: 2, label: "1-2" },
  { id: 3, label: "2-1" },
  { id: 4, label: "2-2" },
  { id: 5, label: "3-1" },
  { id: 6, label: "3-2" },
  { id: 7, label: "4-1" },
  { id: 8, label: "4-2" },
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
      addToast({
        title: err.response?.data?.error || "Failed to update routine",
        color: "danger",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 shadow-inner">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition space-y-8 pb-12">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-sky-100 via-indigo-50 to-white p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-100">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="relative z-10 flex items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-xl ring-1 ring-slate-100">
            <BookOpen className="h-8 w-8 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-800">
              Routine Management
            </h1>
            <p className="mt-1 text-lg font-bold text-slate-400">
              Admin master schedule control
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/60">
        <div className="custom-scrollbar overflow-x-auto">
          <table className="table w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200/60 bg-slate-50/80 backdrop-blur-md">
                <th className="w-14 border-r border-slate-200/50 py-8 text-center text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">
                  Day
                </th>
                <th className="w-14 border-r border-slate-200/50 py-8 text-center text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">
                  Sem
                </th>
                {TIME_SLOTS.map((slot) => {
                  const isBreak = slot === "01:00 - 02:00";
                  return (
                    <th
                      key={slot}
                      className={`${isBreak ? "w-10 px-0" : "min-w-[160px]"} border-r border-slate-200/50 py-8 text-center font-black whitespace-nowrap last:border-0`}
                    >
                      <div className="flex flex-col items-center gap-1.5">
                        <Clock
                          className={`h-4 w-4 ${isBreak ? "opacity-20" : "text-indigo-500"}`}
                        />
                        <span
                          className={`text-sm font-black tracking-wider uppercase ${isBreak ? "text-slate-300" : "text-slate-900"}`}
                        >
                          {isBreak ? "Brk" : slot}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {DAYS.map((day, dIdx) => (
                <Fragment key={day}>
                  {SEMESTERS.map((sem, idx) => {
                    const isFirstSemOfDay = idx === 0;
                    return (
                      <tr
                        key={`${day}-${sem.id}`}
                        className={`group transition-colors hover:bg-slate-50/30 ${isFirstSemOfDay && dIdx !== 0 ? "border-t-[10px] border-slate-200" : ""}`}
                      >
                        {isFirstSemOfDay && (
                          <td
                            rowSpan={SEMESTERS.length}
                            className="w-14 border-r border-slate-300 bg-white p-0"
                          >
                            <div className="relative flex h-full w-full items-center justify-center bg-slate-50/50">
                              <span
                                className="rotate-180 text-center align-middle text-sm font-black tracking-[0.4em] text-slate-950 uppercase"
                                style={{ writingMode: "vertical-rl" }}
                              >
                                {day}
                              </span>
                            </div>
                          </td>
                        )}
                        <td className="w-14 border-r border-slate-200 bg-white p-0 text-center align-middle">
                          <span className="text-xs font-black text-slate-500 transition-colors group-hover:text-indigo-600">
                            {sem.label}
                          </span>
                        </td>
                        {TIME_SLOTS.map((slot) => {
                          const isBreak = slot === "01:00 - 02:00";
                          if (isBreak) {
                            if (isFirstSemOfDay) {
                              return (
                                <td
                                  key={slot}
                                  rowSpan={SEMESTERS.length}
                                  className="w-10 border-r border-slate-200 bg-slate-50/20 p-0 text-center align-middle"
                                >
                                  <div className="flex h-full flex-col items-center justify-center opacity-10 transition-opacity group-hover:opacity-20">
                                    <span
                                      className="text-[9px] font-black tracking-[0.5em] text-slate-600 uppercase"
                                      style={{ writingMode: "vertical-rl" }}
                                    >
                                      BREAK
                                    </span>
                                  </div>
                                </td>
                              );
                            }
                            return null;
                          }

                          const cell = getCellData(day, sem.id, slot);
                          const isEditing =
                            editingCell?.day === day &&
                            editingCell?.semester === sem.id &&
                            editingCell?.timeSlot === slot;

                          return (
                            <td
                              key={slot}
                              className={`relative cursor-pointer border-r border-slate-200 p-2 transition-all duration-300 ${isEditing ? "bg-indigo-50" : ""}`}
                              onClick={() => handleEditClick(day, sem.id, slot)}
                            >
                              <div className="flex min-h-[110px] w-full flex-col items-center justify-center">
                                {cell &&
                                (cell.courseCode ||
                                  cell.teacherName ||
                                  cell.room) ? (
                                  <div className="group/card relative flex h-full w-full flex-col items-center justify-center rounded-[1.5rem] border border-slate-100 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)]">
                                    <span className="mb-1.5 text-xs font-black tracking-widest text-indigo-600 uppercase">
                                      {cell.courseCode}
                                    </span>
                                    <span className="mb-2 line-clamp-1 text-center text-[11px] font-bold text-slate-800">
                                      {cell.teacherName}
                                    </span>
                                    <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 ring-1 ring-slate-100 group-hover/card:bg-indigo-50 group-hover/card:ring-indigo-100">
                                      <MapPin className="h-3.5 w-3.5 text-slate-400 group-hover/card:text-indigo-500" />
                                      <span className="text-xs font-black tracking-wider text-slate-500 uppercase group-hover/card:text-indigo-600">
                                        R-{cell.room}
                                      </span>
                                    </div>
                                    <Edit3 className="absolute top-2 right-2 h-3 w-3 text-indigo-400 opacity-0 shadow-sm transition-opacity group-hover/card:opacity-100" />
                                  </div>
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center rounded-2xl transition-all duration-300 group-hover:bg-slate-50/50">
                                    <Edit3 className="h-4 w-4 scale-75 text-indigo-100 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100" />
                                    <span className="text-xl font-light text-slate-100 transition-opacity group-hover:hidden">
                                      -
                                    </span>
                                  </div>
                                )}
                              </div>
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

      {/* Edit Modal */}
      {editingCell && (
        <div className="modal modal-open bg-slate-900/40 backdrop-blur-md">
          <div className="modal-box max-w-sm rounded-[2rem] bg-white p-8 shadow-2xl ring-1 ring-white/20">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner">
                <Edit3 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-slate-800">
                  Edit Class
                </h3>
                <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  {editingCell.day} • {editingCell.timeSlot}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-[10px] font-black tracking-widest text-slate-500 uppercase">
                    Course
                  </span>
                </label>
                <select
                  className="select select-bordered w-full rounded-xl font-bold transition-all focus:ring-2 focus:ring-indigo-100"
                  value={formData.courseCode}
                  onChange={(e) => {
                    const code = e.target.value;
                    const selectedCourse = courses.find(
                      (c) => c.courseCode === code,
                    );
                    setFormData({
                      ...formData,
                      courseCode: code,
                      teacherId: selectedCourse ? selectedCourse.teacherId : "",
                    });
                  }}
                >
                  <option value="">Select Course</option>
                  {(SEMESTER_COURSES[editingCell.semester] || []).map((c) => {
                    const assignedCourse = courses.find(
                      (ac) => ac.courseCode === c.code,
                    );
                    return (
                      <option key={c.code} value={c.code}>
                        {c.code} - {c.title}{" "}
                        {assignedCourse?.teacherName
                          ? `(${assignedCourse.teacherName})`
                          : ""}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-[10px] font-black tracking-widest text-slate-500 uppercase">
                    Room
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full rounded-xl font-bold transition-all focus:ring-2 focus:ring-indigo-100"
                  placeholder="e.g. 101"
                  value={formData.room}
                  onChange={(e) =>
                    setFormData({ ...formData, room: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="modal-action mt-8 flex gap-3">
              <button
                className="btn flex-1 rounded-xl border-0 bg-slate-100 text-slate-600 hover:bg-slate-200"
                onClick={() => setEditingCell(null)}
              >
                Cancel
              </button>
              <button
                className="btn flex-1 rounded-xl border-0 bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
                onClick={handleSave}
              >
                <Save className="mr-2 h-4 w-4" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
