import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router";
import api from "../../api/axios";
import {
  ArrowLeft,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Pencil,
} from "lucide-react";
import Loading from "../../components/Loading";
import { toast } from "../../utils/toast";

export default function TeacherAttendance() {
  const { courseCode } = useParams();
  const [searchParams] = useSearchParams();
  const semester = searchParams.get("semester");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const [editingTarget, setEditingTarget] = useState(false);
  const [targetSessions, setTargetSessions] = useState("");
  const [savingTarget, setSavingTarget] = useState(false);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `/teacher/courses/${courseCode}/attendance?semester=${semester}`,
        );
        setData(res.data);
        setTargetSessions(res.data.targetSessions || "");
      } catch (err) {
        console.error("Failed to fetch attendance:", err);
        toast.error(err.response?.data?.error || "Failed to fetch attendance");
      } finally {
        setLoading(false);
      }
    };

    if (courseCode) {
      fetchAttendance();
    }
  }, [courseCode, semester]);

  const handleSaveTarget = async () => {
    try {
      setSavingTarget(true);
      await api.put(`/teacher/courses/${courseCode}/target-sessions`, {
        targetSessions: targetSessions ? parseInt(targetSessions, 10) : null,
      });
      toast.success("Total sessions updated successfully!");
      setEditingTarget(false);
      // fetch again to update
      const res = await api.get(
        `/teacher/courses/${courseCode}/attendance?semester=${semester}`,
      );
      setData(res.data);
      setTargetSessions(res.data.targetSessions || "");
    } catch (e) {
      toast.error(
        e.response?.data?.error || "Failed to update total sessions.",
      );
    } finally {
      setSavingTarget(false);
    }
  };

  if (loading && !data)
    return <Loading fullScreen text="Loading Attendance..." />;
  if (!data)
    return (
      <div className="p-8 text-center text-red-500">Failed to load data.</div>
    );

  return (
    <div className="page-transition space-y-8 pb-10">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] ring-1 ring-slate-100">
        <div className="relative z-10 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              to="/teacher/dashboard"
              className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition-colors hover:text-indigo-600"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-black tracking-tight text-slate-800">
              {data.courseName}
            </h1>
            <div className="mt-2 flex flex-wrap gap-3">
              <span className="inline-flex items-center rounded-xl bg-indigo-100 px-3 py-1 text-[10px] font-black tracking-widest text-indigo-700 uppercase">
                {courseCode}
              </span>
              <span className="inline-flex items-center rounded-xl bg-sky-100 px-3 py-1 text-[10px] font-black tracking-widest text-sky-700 uppercase">
                Semester {data.semester}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex min-w-[120px] flex-col items-center justify-center rounded-2xl bg-white px-6 py-4 shadow-sm ring-1 ring-slate-100">
              <Target className="mb-1 h-6 w-6 text-rose-500" />
              {editingTarget ? (
                <div className="mt-2 flex flex-col gap-2">
                  <input
                    type="number"
                    className="input input-sm input-bordered w-full bg-slate-50 text-center text-sm font-black"
                    value={targetSessions}
                    onChange={(e) => setTargetSessions(e.target.value)}
                    placeholder="Auto"
                  />
                  <div className="flex gap-1">
                    <button
                      className="btn btn-xs flex-1 border-0 bg-emerald-500 text-white hover:bg-emerald-600"
                      onClick={handleSaveTarget}
                      disabled={savingTarget}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-xs flex-1 border-0 bg-slate-200 text-slate-700 hover:bg-slate-300"
                      onClick={() => {
                        setEditingTarget(false);
                        setTargetSessions(data.targetSessions || "");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className="group flex cursor-pointer items-center gap-2"
                    onClick={() => setEditingTarget(true)}
                  >
                    <span
                      className="text-2xl font-black text-slate-800"
                      title="Click to edit planned total sessions"
                    >
                      {data.targetSessions || data.sessions.length}
                    </span>
                    <Pencil className="h-3 w-3 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                    Planned Sessions
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-4 shadow-sm ring-1 ring-slate-100">
              <Users className="mb-1 h-6 w-6 text-indigo-500" />
              <span className="text-2xl font-black text-slate-800">
                {data.attendanceData.length}
              </span>
              <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                Students
              </span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-4 shadow-sm ring-1 ring-slate-100">
              <Calendar className="mb-1 h-6 w-6 text-emerald-500" />
              <span className="text-2xl font-black text-slate-800">
                {data.sessions.length}
              </span>
              <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                Conducted
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="rounded-[2.5rem] bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] ring-1 ring-slate-100 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-800">
            Attendance Report
          </h2>
        </div>

        {data.sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Calendar className="mb-4 h-12 w-12 text-slate-300" />
            <h3 className="text-lg font-bold text-slate-600">
              No Sessions Found
            </h3>
            <p className="text-sm text-slate-400">
              There are no attendance sessions recorded for this course yet.
            </p>
          </div>
        ) : data.attendanceData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="mb-4 h-12 w-12 text-slate-300" />
            <h3 className="text-lg font-bold text-slate-600">
              No Students Found
            </h3>
            <p className="text-sm text-slate-400">
              There are no students enrolled in Semester {data.semester}.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl ring-1 ring-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                <tr>
                  <th className="sticky left-0 z-10 bg-slate-50 px-6 py-4 font-black">
                    Roll No
                  </th>
                  <th className="sticky left-[100px] z-10 min-w-[150px] bg-slate-50 px-6 py-4 font-black">
                    Student Name
                  </th>
                  <th className="px-6 py-4 text-center font-black">
                    Present %
                  </th>
                  {data.sessions.map((session) => (
                    <th
                      key={session.id}
                      className="min-w-[120px] px-6 py-4 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-slate-700">
                          {session.sessionDate}
                        </span>
                        <span className="text-[9px] text-slate-400">
                          {session.startTime}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.attendanceData.map((student) => (
                  <tr
                    key={student.studentId}
                    className="transition-colors hover:bg-slate-50/50"
                  >
                    <td className="sticky left-0 z-10 bg-white px-6 py-4 font-mono font-bold text-slate-700 group-hover:bg-slate-50">
                      {student.roll}
                    </td>
                    <td className="sticky left-[100px] z-10 bg-white px-6 py-4 font-bold text-slate-800 group-hover:bg-slate-50">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 text-center font-black">
                      <span
                        className={`rounded-xl px-2 py-1 ${student.percentage >= 75 ? "bg-emerald-100 text-emerald-700" : student.percentage >= 50 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}
                      >
                        {student.percentage}%
                      </span>
                    </td>
                    {data.sessions.map((session) => {
                      const status = student.records[session.id];
                      return (
                        <td key={session.id} className="px-6 py-4 text-center">
                          <div className="flex justify-center">
                            {status === "present" ? (
                              <CheckCircle className="h-5 w-5 text-emerald-500" />
                            ) : status === "late" ? (
                              <Clock className="h-5 w-5 text-amber-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-rose-300" />
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
