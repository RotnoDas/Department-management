import { useState, useEffect, useCallback } from "react";
import api from "../../api/axios";
import {
  Calendar,
  BookUser,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Trash2,
  Check,
  X,
  GraduationCap,
  Mail,
  Hash,
  Layers,
  Droplet,
  ShieldCheck,
  Sparkles,
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
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState({});
  const [delTarget, setDelTarget] = useState(null);
  const [selectedSession, setSelectedSession] = useState("all");
  const [sessions, setSessions] = useState([]);
  const [viewMode, setViewMode] = useState("table");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.get(`/admin/students`);
      const allStudents = r.data || [];
      setStudents(allStudents);

      const uniqueSessions = [
        ...new Set(allStudents.map((s) => s.batch).filter(Boolean)),
      ].sort();
      setSessions(uniqueSessions);
    } catch (e) {
      console.error(e);
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
      load();
    } catch (e) {
      console.error(e);
    } finally {
      setBusy((b) => ({ ...b, [userId + action]: false }));
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/admin/students/${delTarget.userId}`);
      setDelTarget(null);
      load();
    } catch (e) {
      console.error(e);
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

  return (
    <div className="flex gap-6">
      {/* Session Sidebar */}
      <div className="w-72 flex-shrink-0">
        <div className="card bg-base-100 sticky top-6 shadow-xl">
          <div className="card-body p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="card-title text-lg">Sessions</h2>
                <p className="text-base-content/60 text-xs">
                  Filter by session
                </p>
              </div>
            </div>

            <ul className="menu menu-sm gap-1 p-0">
              <li>
                <button
                  className={`${selectedSession === "all" ? "active bg-gradient-to-r from-blue-500 to-indigo-600 text-white" : ""} hover:bg-base-200`}
                  onClick={() => setSelectedSession("all")}
                >
                  <span className="flex-1 font-semibold">All Sessions</span>
                  <span className="badge badge-sm badge-primary">
                    {students.length}
                  </span>
                </button>
              </li>

              {sessions.length > 0 && (
                <div className="divider my-2 text-xs font-bold">By Session</div>
              )}

              {sessions.map((session) => {
                const count = students.filter(
                  (s) => s.batch === session,
                ).length;
                return (
                  <li key={session}>
                    <button
                      className={`${selectedSession === session ? "active bg-gradient-to-r from-blue-500 to-indigo-600 text-white" : ""} hover:bg-base-200`}
                      onClick={() => setSelectedSession(session)}
                    >
                      <span className="flex-1 font-semibold">{session}</span>
                      <span
                        className={`badge badge-sm ${selectedSession === session ? "badge-ghost" : "badge-primary"}`}
                      >
                        {count}
                      </span>
                    </button>
                  </li>
                );
              })}

              {sessions.length === 0 && (
                <li className="text-base-content/40 px-4 py-3 text-center text-xs">
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
        <div className="card relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
          <div className="card-body relative z-10 p-8">
            <div className="flex items-center gap-8">
              <div className="group relative">
                <div className="flex h-20 w-20 transform items-center justify-center rounded-3xl border border-white/30 bg-white/20 shadow-2xl backdrop-blur-xl transition-transform duration-500 group-hover:-rotate-6">
                  <GraduationCap className="h-10 w-10 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -bottom-2 -left-2 flex h-8 w-8 transform items-center justify-center rounded-xl border-2 border-white bg-blue-400 text-white shadow-lg transition-transform group-hover:scale-110">
                  <ShieldCheck className="h-5 w-5 font-bold" />
                </div>
                <Sparkles className="absolute -top-3 -right-3 h-6 w-6 animate-pulse text-yellow-300" />
              </div>

              <div>
                <h1 className="flex items-center gap-3 text-4xl font-black tracking-tight">
                  {selectedSession === "all"
                    ? "Student Central"
                    : `Batch ${selectedSession}`}
                  <div className="badge badge-info badge-sm px-3 py-3 font-bold text-white uppercase shadow-lg">
                    Academic
                  </div>
                </h1>
                <p className="mt-2 text-lg font-medium text-white/80">
                  Department of Computer Science & Engineering
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
            <div className="card-body p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold tracking-wide text-white/80 uppercase">
                    Total
                  </p>
                  <p className="mt-1 text-4xl font-extrabold">
                    {filteredStudents.length}
                  </p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
            <div className="card-body p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold tracking-wide text-white/80 uppercase">
                    Pending
                  </p>
                  <p className="mt-1 text-4xl font-extrabold">
                    {counts.pending || 0}
                  </p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20">
                  <Clock className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
            <div className="card-body p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold tracking-wide text-white/80 uppercase">
                    Approved
                  </p>
                  <p className="mt-1 text-4xl font-extrabold">
                    {counts.approved || 0}
                  </p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
            <div className="card-body p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold tracking-wide text-white/80 uppercase">
                    Rejected
                  </p>
                  <p className="mt-1 text-4xl font-extrabold">
                    {counts.rejected || 0}
                  </p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20">
                  <XCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and View Toggle - Modernized */}
        <div className="card bg-base-100 overflow-visible shadow-xl">
          <div className="card-body p-6">
            <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:items-center">
              {/* Search Box */}
              <div className="group relative flex-1">
                <div className="group-focus-within:text-primary pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 transition-colors">
                  <Search className="h-5 w-5 opacity-50" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email, or student roll..."
                  className="input input-bordered bg-base-200/50 focus:bg-base-100 focus:ring-primary/20 h-14 w-full border-none pl-12 text-lg transition-all focus:ring-2"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-base-content/30 hover:text-base-content/60 absolute inset-y-0 right-4 flex items-center transition-colors"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* View Toggles */}
              <div className="bg-base-200 flex gap-1 self-end rounded-xl p-1.5 lg:self-center">
                <button
                  className={`flex items-center gap-2 rounded-lg p-2 px-4 font-bold transition-all ${viewMode === "table" ? "text-primary bg-white shadow-sm" : "text-base-content/60 hover:bg-base-300"}`}
                  onClick={() => setViewMode("table")}
                  title="Table View"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                  <span className="text-sm">Table</span>
                </button>
                <button
                  className={`flex items-center gap-2 rounded-lg p-2 px-4 font-bold transition-all ${viewMode === "grid" ? "text-primary bg-white shadow-sm" : "text-base-content/60 hover:bg-base-300"}`}
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                  <span className="text-sm">Grid</span>
                </button>
              </div>
            </div>
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
              <h3 className="text-3xl font-black tracking-tight">No Students Found</h3>
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
    <div className="card bg-base-100 overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="table">
          <thead className="from-base-200 to-base-300 bg-gradient-to-r">
            <tr>
              <th className="font-bold">#</th>
              <th className="font-bold">Student</th>
              <th className="font-bold">Roll</th>
              <th className="font-bold">Session</th>
              <th className="font-bold">Semester</th>
              <th className="font-bold">Blood</th>
              <th className="font-bold">Status</th>
              <th className="text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
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
                  className="hover:bg-base-200/50 transition-colors"
                >
                  <td className="text-base-content/50 text-sm font-semibold">
                    {i + 1}
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
                          <span className="text-sm font-bold">{initials}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm leading-tight font-bold">
                          {s.name}
                        </p>
                        <div className="text-base-content/50 mt-0.5 flex items-center gap-1.5">
                          <Mail className="h-3 w-3" />
                          <span className="text-xs">{s.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-outline badge-sm font-mono font-semibold">
                      {s.studentId || "—"}
                    </span>
                  </td>
                  <td className="text-sm font-semibold">{s.batch || "—"}</td>
                  <td className="text-sm">Semester {s.semester}</td>
                  <td className="text-sm">
                    <div className="text-error/80 flex items-center gap-1">
                      <Droplet className="h-3 w-3" />
                      {s.bloodGroup || "—"}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge badge-sm font-semibold ${STATUS_COLOR[s.status] || "badge-neutral"}`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-end gap-1">
                      {s.status === "pending" && (
                        <>
                          <button
                            className="btn btn-xs btn-success text-white"
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
                            className="btn btn-xs btn-outline btn-error"
                            onClick={() => act(s.userId, "reject")}
                            disabled={busy[s.userId + "reject"]}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {s.status === "approved" && (
                        <button
                          className="btn btn-xs btn-outline btn-warning"
                          onClick={() => act(s.userId, "reject")}
                          disabled={busy[s.userId + "reject"]}
                        >
                          Revoke
                        </button>
                      )}
                      {s.status === "rejected" && (
                        <button
                          className="btn btn-xs btn-success btn-outline"
                          onClick={() => act(s.userId, "approve")}
                          disabled={busy[s.userId + "approve"]}
                        >
                          Restore
                        </button>
                      )}
                      <button
                        className="btn btn-xs btn-ghost btn-square text-error hover:bg-error/10"
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
      <div className="border-base-200 text-base-content/50 border-t px-4 py-3 text-xs font-semibold">
        Showing {students.length} student{students.length !== 1 ? "s" : ""}
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
            className="card bg-base-100 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="card-body p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="avatar placeholder">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                    <span className="text-xl font-bold">{initials}</span>
                  </div>
                </div>
                <span
                  className={`badge ${STATUS_COLOR[s.status] || "badge-neutral"} font-semibold`}
                >
                  {s.status}
                </span>
              </div>

              <div className="mb-1 flex items-center gap-2">
                <GraduationCap className="text-primary h-5 w-5" />
                <h3 className="card-title text-lg">{s.name}</h3>
              </div>

              <div className="text-base-content/60 mb-4 flex items-center gap-2 text-sm">
                <Mail className="h-3.5 w-3.5" />
                {s.email}
              </div>

              <div className="divider my-3 opacity-50"></div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base-content/60 flex items-center gap-1.5">
                    Roll
                  </span>
                  <span className="badge badge-ghost badge-sm py-2 font-mono font-semibold">
                    {s.studentId || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base-content/60 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> Session
                  </span>
                  <span className="text-primary font-semibold">
                    {s.batch || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base-content/60 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5" /> Level
                  </span>
                  <span className="font-semibold">Semester {s.semester}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base-content/60 flex items-center gap-1.5">
                    <Droplet className="h-3.5 w-3.5" /> Blood
                  </span>
                  <span className="text-error font-semibold">
                    {s.bloodGroup || "—"}
                  </span>
                </div>
              </div>

              <div className="card-actions mt-6 justify-end gap-2">
                {s.status === "pending" && (
                  <>
                    <button
                      className="btn btn-sm btn-success flex-1 text-white shadow-md"
                      onClick={() => act(s.userId, "approve")}
                      disabled={busy[s.userId + "approve"]}
                    >
                      {busy[s.userId + "approve"] ? (
                        <span className="loading loading-spinner loading-xs" />
                      ) : (
                        <>
                          <Check className="mr-1 h-4 w-4" /> Approve
                        </>
                      )}
                    </button>
                    <button
                      className="btn btn-sm btn-outline btn-error flex-1"
                      onClick={() => act(s.userId, "reject")}
                      disabled={busy[s.userId + "reject"]}
                    >
                      <X className="mr-1 h-4 w-4" /> Reject
                    </button>
                  </>
                )}
                {s.status === "approved" && (
                  <button
                    className="btn btn-sm btn-outline btn-warning flex-1"
                    onClick={() => act(s.userId, "reject")}
                    disabled={busy[s.userId + "reject"]}
                  >
                    Revoke
                  </button>
                )}
                {s.status === "rejected" && (
                  <button
                    className="btn btn-sm btn-success btn-outline flex-1"
                    onClick={() => act(s.userId, "approve")}
                    disabled={busy[s.userId + "approve"]}
                  >
                    Restore
                  </button>
                )}
                <button
                  className="btn btn-sm btn-ghost btn-square text-error hover:bg-error/10"
                  onClick={() => setDelTarget(s)}
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
