import { useState, useEffect, useCallback } from "react";
import { addToast } from "../../utils/toast";
import api from "../../api/axios";
import {
  Pencil,
  Trash2,
  Check,
  X,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Mail,
  GraduationCap,
  Layers,
  Droplet,
  User,
  ShieldCheck,
  Sparkles,
  Calendar,
} from "lucide-react";
import Loading from "../../components/Loading";

const STATUS_COLOR = {
  pending: "badge-warning",
  approved: "badge-success",
  rejected: "badge-error",
};

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [delTarget, setDelTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedSession, setSelectedSession] = useState("all");
  const [busy, setBusy] = useState({});
  const [viewMode, setViewMode] = useState("table");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/students");
      setStudents(res.data);
    } catch (e) {
      console.error(e);
      addToast({ title: "Failed to load students", color: "danger" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (userId, action) => {
    setBusy((b) => ({ ...b, [userId + action]: true }));
    try {
      await api.patch(`/admin/students/${userId}/${action}`);
      addToast({ title: `Successfully ${action}d student`, color: "success" });
      load();
    } catch (e) {
      console.error(e);
      addToast({
        title: e.response?.data?.error || `Failed to ${action} student`,
        color: "danger",
      });
    } finally {
      setBusy((b) => ({ ...b, [userId + action]: false }));
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/admin/students/${delTarget.userId}`);
      setDelTarget(null);
      addToast({ title: "Student deleted successfully", color: "success" });
      load();
    } catch (e) {
      console.error(e);
      addToast({
        title: e.response?.data?.error || "Failed to delete student",
        color: "danger",
      });
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSession =
      selectedSession === "all" || s.batch === selectedSession;
    const matchesSearch =
      search === "" ||
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId?.toLowerCase().includes(search.toLowerCase());
    return matchesSession && matchesSearch;
  });

  const counts = filteredStudents.reduce((a, s) => {
    a[s.status] = (a[s.status] || 0) + 1;
    return a;
  }, {});

  const sessions = [...new Set(students.map((s) => s.batch))].filter(Boolean);

  return (
    <div className="flex gap-6">
      {/* Session Sidebar */}
      <div className="w-72 flex-shrink-0">
        <div className="sticky top-6 overflow-hidden rounded-[2rem] bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-100">
          <div className="bg-gradient-to-br from-indigo-50/50 to-white p-6">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-indigo-200">
                <Calendar className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-800">
                  Sessions
                </h2>
                <p className="text-[10px] font-black tracking-[0.15em] text-slate-400 uppercase">
                  Filter List
                </p>
              </div>
            </div>

            <ul className="flex flex-col gap-1.5">
              <li>
                <button
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 font-bold transition-all duration-300 ${selectedSession === "all" ? "bg-indigo-600 text-white shadow-md" : "bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"}`}
                  onClick={() => setSelectedSession("all")}
                >
                  <span className="tracking-tight">All Sessions</span>
                  <span
                    className={`rounded-lg px-2 py-0.5 text-[10px] font-black ${selectedSession === "all" ? "bg-white/20 text-white" : "bg-white text-slate-500 shadow-sm ring-1 ring-slate-200/50"}`}
                  >
                    {students.length}
                  </span>
                </button>
              </li>

              {sessions.length > 0 && (
                <div className="my-3 flex items-center gap-3 px-2">
                  <div className="h-px flex-1 bg-slate-100"></div>
                  <span className="text-[9px] font-black tracking-[0.2em] text-slate-300 uppercase">
                    By Batch
                  </span>
                  <div className="h-px flex-1 bg-slate-100"></div>
                </div>
              )}

              {sessions.map((session) => {
                const count = students.filter(
                  (s) => s.batch === session,
                ).length;
                return (
                  <li key={session}>
                    <button
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 font-bold transition-all duration-300 ${selectedSession === session ? "bg-indigo-600 text-white shadow-md" : "bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"}`}
                      onClick={() => setSelectedSession(session)}
                    >
                      <span className="tracking-tight">{session}</span>
                      <span
                        className={`rounded-lg px-2 py-0.5 text-[10px] font-black ${selectedSession === session ? "bg-white/20 text-white" : "bg-white text-slate-500 shadow-sm ring-1 ring-slate-200/50"}`}
                      >
                        {count}
                      </span>
                    </button>
                  </li>
                );
              })}

              {sessions.length === 0 && (
                <li className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-xs font-semibold text-slate-400">
                  No sessions yet
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header with Branded Student Logo */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-sky-100 via-indigo-50 to-white p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-100">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
          <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-white/40 blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-indigo-100/50 blur-2xl"></div>

          <div className="relative z-10 flex items-center gap-8">
            <div className="group relative">
              <div className="flex h-20 w-20 transform items-center justify-center rounded-3xl bg-white shadow-xl ring-1 ring-slate-100 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                <GraduationCap className="h-10 w-10 text-indigo-500" />
              </div>
              <div className="absolute -bottom-2 -left-2 flex h-8 w-8 transform items-center justify-center rounded-xl border-2 border-white bg-blue-400 text-white shadow-lg transition-transform group-hover:scale-110">
                <ShieldCheck className="h-5 w-5 font-bold" />
              </div>
              <Sparkles className="absolute -top-3 -right-3 h-6 w-6 animate-pulse text-yellow-500" />
            </div>

            <div>
              <h1 className="flex items-center gap-3 text-4xl font-black tracking-tight text-slate-800">
                {selectedSession === "all"
                  ? "Student Central"
                  : `Batch ${selectedSession}`}
                <div className="rounded-full bg-white/60 px-3 py-1 text-[10px] font-black tracking-widest text-indigo-600 uppercase shadow-sm ring-1 ring-slate-200/50 backdrop-blur-sm">
                  Academic
                </div>
              </h1>
              <p className="mt-2 text-lg font-medium text-slate-500">
                Department of Computer Science & Engineering
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-50 to-white p-6 text-slate-800 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] hover:ring-indigo-100">
            <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                  Total
                </p>
                <p className="mt-1 text-4xl font-black tracking-tighter text-slate-800">
                  {filteredStudents.length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-indigo-50 shadow-sm ring-1 ring-indigo-100 transition-transform duration-300 group-hover:scale-110">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-amber-50 to-white p-6 text-slate-800 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] hover:ring-amber-200">
            <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                  Pending
                </p>
                <p className="mt-1 text-4xl font-black tracking-tighter text-slate-800">
                  {counts.pending || 0}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-amber-50 shadow-sm ring-1 ring-amber-100 transition-transform duration-300 group-hover:scale-110">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-50 to-white p-6 text-slate-800 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] hover:ring-emerald-200">
            <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                  Approved
                </p>
                <p className="mt-1 text-4xl font-black tracking-tighter text-slate-800">
                  {counts.approved || 0}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-emerald-50 shadow-sm ring-1 ring-emerald-100 transition-transform duration-300 group-hover:scale-110">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-rose-50 to-white p-6 text-slate-800 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] hover:ring-rose-200">
            <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                  Rejected
                </p>
                <p className="mt-1 text-4xl font-black tracking-tighter text-slate-800">
                  {counts.rejected || 0}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-rose-50 shadow-sm ring-1 ring-rose-100 transition-transform duration-300 group-hover:scale-110">
                <XCircle className="h-6 w-6 text-rose-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and View Toggle - Thinner and Minimalist */}
        <div className="flex flex-col items-center justify-between gap-6 rounded-full bg-white/80 p-2 shadow-sm ring-1 ring-slate-200/60 backdrop-blur-md lg:flex-row lg:pr-6">
          <div className="group relative w-full flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center transition-colors group-focus-within:text-indigo-600">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search students..."
              className="w-full rounded-full border-none bg-transparent py-3 pr-10 pl-12 text-sm font-semibold text-slate-600 transition-all outline-none placeholder:text-slate-400 focus:ring-0"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-4 flex items-center text-slate-300 transition-colors hover:text-slate-500"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex h-10 items-center gap-1 rounded-full bg-slate-100/50 p-1 ring-1 ring-slate-200/30">
            <button
              className={`flex h-8 items-center gap-2 rounded-full px-5 text-xs font-bold transition-all duration-300 ${viewMode === "table" ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/50" : "text-slate-500 hover:text-indigo-600"}`}
              onClick={() => setViewMode("table")}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <span className="text-xs">Table</span>
            </button>
            <button
              className={`flex h-8 items-center gap-2 rounded-full px-5 text-xs font-bold transition-all duration-300 ${viewMode === "grid" ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/50" : "text-slate-500 hover:text-indigo-600"}`}
              onClick={() => setViewMode("grid")}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              <span className="text-xs">Grid</span>
            </button>
          </div>
        </div>

        {/* Students Display */}
        {loading ? (
          <div className="card bg-base-100 shadow-lg">
            <Loading text="Loading students..." />
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="card bg-base-100 border-base-200 border-2 shadow-2xl">
            <div className="card-body items-center justify-center py-24 text-center">
              <div className="bg-primary/5 text-primary mb-6 flex h-32 w-32 items-center justify-center rounded-full shadow-inner ring-4 ring-white">
                <Search className="h-16 w-16" />
              </div>
              <h3 className="text-3xl font-black tracking-tight">
                No Students Found
              </h3>
              <p className="text-base-content/60 mt-3 max-w-md text-lg">
                {search
                  ? "We couldn't find any students matching your search criteria. Try adjusting your keywords."
                  : "It looks like there are no students enrolled in this session yet."}
              </p>
              {search && (
                <button
                  className="btn btn-primary btn-wide mt-6 shadow-lg"
                  onClick={() => setSearch("")}
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        ) : viewMode === "table" ? (
          <StudentTable
            students={filteredStudents}
            act={act}
            busy={busy}
            setDelTarget={setDelTarget}
          />
        ) : (
          <StudentGrid
            students={filteredStudents}
            act={act}
            busy={busy}
            setDelTarget={setDelTarget}
          />
        )}
      </div>

      {/* Delete Modal */}
      {delTarget && (
        <div className="modal modal-open">
          <div className="modal-box max-w-sm text-center">
            <div className="bg-error/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Trash2 className="text-error h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Delete Student?</h3>
            <p className="text-base-content/60 mt-3 text-sm">
              Remove <strong>{delTarget.name}</strong> permanently? This action
              cannot be undone.
            </p>
            <div className="modal-action mt-6 justify-center gap-3">
              <button
                className="btn btn-ghost"
                onClick={() => setDelTarget(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-error text-white"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop bg-black/30"
            onClick={() => setDelTarget(null)}
          />
        </div>
      )}
    </div>
  );
}

function StudentTable({ students, act, busy, setDelTarget }) {
  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-100">
      <div className="overflow-x-auto">
        <table className="table w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              <th className="px-6 py-5">#</th>
              <th className="px-6 py-5">Student</th>
              <th className="px-6 py-5">Roll</th>
              <th className="px-6 py-5 text-center">Session</th>
              <th className="px-6 py-5">Semester</th>
              <th className="px-6 py-5">Blood</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/50">
            {students.map((s, i) => {
              const initials = s.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
              return (
                <tr
                  key={s.userId}
                  className="transition-colors hover:bg-slate-50/50"
                >
                  <td className="px-6 py-5 text-[11px] font-bold text-slate-400">
                    {String(i + 1).padStart(2, "0")}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="group/avatar relative">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-indigo-600 ring-1 ring-slate-200 transition-all duration-300 group-hover/avatar:bg-indigo-600 group-hover/avatar:text-white group-hover/avatar:shadow-md">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-100">
                          <div
                            className={`h-2 w-2 rounded-full ${s.status === "approved" ? "bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" : s.status === "pending" ? "bg-amber-500" : "bg-rose-500"}`}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-black tracking-tight text-slate-800 transition-colors group-hover:text-indigo-600">
                          {s.name}
                        </p>
                        <div className="mt-0.5 flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                          <Mail className="h-3 w-3 text-indigo-400 opacity-50" />
                          <span className="tracking-wide">{s.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 font-mono text-xs font-bold text-slate-600 ring-1 ring-slate-200/50">
                      {s.studentId || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-xs font-bold text-indigo-600">
                      {s.batch || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <Layers className="h-3.5 w-3.5 text-slate-300" />
                      <span className="text-xs font-bold text-slate-600">
                        Sem {s.semester}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5">
                      <Droplet className="h-3.5 w-3.5 text-rose-400" />
                      <span className="text-xs font-bold text-rose-500">
                        {s.bloodGroup || "—"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`badge rounded-lg px-2.5 py-2.5 text-[10px] font-bold tracking-wider uppercase shadow-sm ${STATUS_COLOR[s.status] || "badge-neutral"}`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-1.5">
                      {s.status === "pending" && (
                        <>
                          <button
                            className="btn btn-xs h-8 border-0 bg-emerald-500 text-white shadow-sm hover:bg-emerald-600"
                            onClick={() => act(s.userId, "approve")}
                            disabled={busy[s.userId + "approve"]}
                          >
                            {busy[s.userId + "approve"] ? (
                              <span className="loading loading-spinner loading-xs" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            className="btn btn-xs h-8 border-rose-100 bg-rose-50 text-rose-600 shadow-sm hover:bg-rose-100"
                            onClick={() => act(s.userId, "reject")}
                            disabled={busy[s.userId + "reject"]}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {s.status === "approved" && (
                        <button
                          className="btn btn-xs h-8 rounded-lg border-amber-100 bg-amber-50 px-3 text-amber-600 shadow-sm hover:bg-amber-100"
                          onClick={() => act(s.userId, "reject")}
                          disabled={busy[s.userId + "reject"]}
                        >
                          Revoke
                        </button>
                      )}
                      {s.status === "rejected" && (
                        <button
                          className="btn btn-xs h-8 rounded-lg border-emerald-100 bg-emerald-50 px-3 text-emerald-600 shadow-sm hover:bg-emerald-100"
                          onClick={() => act(s.userId, "approve")}
                          disabled={busy[s.userId + "approve"]}
                        >
                          Restore
                        </button>
                      )}
                      <button
                        className="btn btn-xs h-8 w-8 rounded-lg border-0 bg-slate-50 text-slate-400 shadow-sm transition-all hover:bg-rose-50 hover:text-rose-600"
                        onClick={() => setDelTarget(s)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-50/50 px-8 py-4 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
        Total {students.length} student{students.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}

function StudentGrid({ students, act, busy, setDelTarget }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {students.map((s) => {
        const initials = s.name
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
        return (
          <div
            key={s.userId}
            className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] hover:ring-indigo-100"
          >
            <div className="flex items-start justify-between">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-indigo-600 ring-1 ring-slate-100 transition-all duration-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-200">
                  <span className="text-xl font-black">{initials}</span>
                </div>
                <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-100">
                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-black tracking-[0.1em] uppercase ring-1 ring-inset ${
                  s.status === "approved"
                    ? "bg-emerald-50 text-emerald-600 ring-emerald-100"
                    : s.status === "pending"
                      ? "bg-amber-50 text-amber-600 ring-amber-100"
                      : "bg-rose-50 text-rose-600 ring-rose-100"
                }`}
              >
                {s.status}
              </span>
            </div>

            <div className="mt-5">
              <h3 className="text-lg font-black tracking-tight text-slate-800 transition-colors group-hover:text-indigo-700">
                {s.name}
              </h3>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <Mail className="h-3.5 w-3.5 opacity-50" />
                <span className="tracking-wide">{s.email}</span>
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-slate-50/50 p-3 ring-1 ring-slate-100/50 transition-colors group-hover:bg-white">
                <p className="text-[9px] font-black tracking-[0.15em] text-slate-400 uppercase">
                  Roll
                </p>
                <p className="mt-0.5 font-mono text-xs font-bold text-slate-700">
                  {s.studentId || "—"}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50/50 p-3 ring-1 ring-slate-100/50 transition-colors group-hover:bg-white">
                <p className="text-[9px] font-black tracking-[0.15em] text-slate-400 uppercase">
                  Session
                </p>
                <p className="mt-0.5 text-xs font-bold text-indigo-600">
                  {s.batch || "—"}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
              <div className="flex gap-1.5">
                <div className="flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 ring-1 ring-slate-100">
                  <Layers className="h-3 w-3 text-slate-400" />
                  <span className="text-[10px] font-black text-slate-600">
                    S-{s.semester}
                  </span>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 ring-1 ring-slate-100">
                  <Droplet className="h-3 w-3 text-rose-400" />
                  <span className="text-[10px] font-black text-rose-600">
                    {s.bloodGroup || "—"}
                  </span>
                </div>
              </div>

              <div className="flex gap-1">
                {s.status === "pending" && (
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition-all hover:bg-emerald-600 hover:text-white"
                    onClick={() => act(s.userId, "approve")}
                    title="Approve"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600"
                  onClick={() => setDelTarget(s)}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
