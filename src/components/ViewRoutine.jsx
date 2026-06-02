import { useState, useEffect, Fragment } from "react";
import api from "../api/axios";
import { Loader2 } from "lucide-react";
import { addToast } from "@heroui/toast";

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

export default function ViewRoutine({ role }) {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/${role}/routine`)
      .then((res) => setRoutines(res.data))
      .catch((err) => addToast({ title: "Failed to load routine", color: "danger" }))
      .finally(() => setLoading(false));
  }, [role]);

  const getCellData = (day, semester, timeSlot) => {
    return routines.find(
      (r) =>
        r.day === day && r.semester === semester && r.timeSlot === timeSlot,
    );
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
            Department class schedule
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
                          return null;
                        }

                        const cell = getCellData(day, sem.id, slot);

                        return (
                          <td
                            key={slot}
                            className="border-r border-slate-200 p-2 transition-colors hover:bg-slate-50"
                          >
                            <div className="flex min-h-[60px] flex-col items-center justify-center rounded p-1 text-center">
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
                                <span className="text-base-content/20 text-xs">
                                  -
                                </span>
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
  );
}
