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
  MapPin,
  Briefcase,
  BookOpenCheck,
  ShieldCheck,
  Sparkles,
  Calendar,
  UserCheck2,
} from "lucide-react";
import Loading from "../../components/Loading";

const EMPTY = {
  name: "",
  email: "",
  password: "",
  teacherId: "",
  designation: "",
  specialization: "",
  phone: "",
  officeRoom: "",
  joiningDate: "",
};

const STATUS_COLOR = {
  pending: "badge-warning",
  approved: "badge-success",
  rejected: "badge-error",
};

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [delTarget, setDelTarget] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.get("/admin/teachers", {
        params: { status: statusFilter, search },
      });
      setTeachers(r.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (userId, action) => {
    setBusy((b) => ({ ...b, [userId + action]: true }));
    try {
      await api.patch(`/admin/teachers/${userId}/${action}`);
      addToast({ title: `Successfully ${action}d teacher`, color: "success" });
      load();
    } catch (e) {
      console.error(e);
      addToast({
        title: e.response?.data?.error || `Failed to ${action} teacher`,
        color: "danger",
      });
    } finally {
      setBusy((b) => ({ ...b, [userId + action]: false }));
    }
  };

  const openEdit = (t) => {
    setEditItem(t);
    setForm({ ...EMPTY, ...t, password: "" });
    setError("");
    setModal(true);
  };

  const f = (key) => ({
    value: form[key],
    onChange: (e) => setForm({ ...form, [key]: e.target.value }),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.put(`/admin/teachers/${editItem.userId}`, form);
      setModal(false);
      addToast({ title: "Teacher profile updated", color: "success" });
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Operation failed.");
      addToast({
        title: err.response?.data?.error || "Update failed",
        color: "danger",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/teachers/${delTarget.userId}`);
      setDelTarget(null);
      addToast({ title: "Teacher deleted successfully", color: "success" });
      load();
    } catch (e) {
      console.error(e);
      addToast({
        title: e.response?.data?.error || "Failed to delete teacher",
        color: "danger",
      });
    }
  };

  const counts = teachers.reduce((a, t) => {
    a[t.status] = (a[t.status] || 0) + 1;
    return a;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header with Branded Faculty Logo */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-sky-100 via-indigo-50 to-white p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-100">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-white/40 blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-indigo-100/50 blur-2xl"></div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="group relative">
              <div className="flex h-20 w-20 transform items-center justify-center rounded-3xl bg-white shadow-xl ring-1 ring-slate-100 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                <BookOpenCheck className="h-10 w-10 text-indigo-600" />
              </div>
              <div className="absolute -right-2 -bottom-2 flex h-8 w-8 transform items-center justify-center rounded-xl border-2 border-white bg-yellow-400 text-indigo-900 shadow-lg transition-transform group-hover:scale-110">
                <ShieldCheck className="h-5 w-5 font-bold" />
              </div>
              <Sparkles className="absolute -top-3 -left-3 h-6 w-6 animate-pulse text-yellow-500" />
            </div>

            <div>
              <h1 className="flex items-center gap-3 text-4xl font-black tracking-tight text-slate-800">
                Faculty Hub
                <div className="rounded-full bg-white/60 px-3 py-1 text-[10px] font-black tracking-widest text-indigo-600 uppercase shadow-sm ring-1 ring-slate-200/50 backdrop-blur-sm">
                  Verified
                </div>
              </h1>
              <p className="mt-2 text-lg font-medium text-slate-500">
                Pabna University of Science & Technology
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total"
          value={teachers.length}
          icon={<Users className="h-8 w-8 text-indigo-600" />}
          gradient="from-indigo-50 to-white"
        />
        <StatCard
          title="Pending"
          value={counts.pending || 0}
          icon={<Clock className="h-8 w-8 text-amber-600" />}
          gradient="from-amber-50 to-white"
        />
        <StatCard
          title="Approved"
          value={counts.approved || 0}
          icon={<CheckCircle className="h-8 w-8 text-emerald-600" />}
          gradient="from-emerald-50 to-white"
        />
        <StatCard
          title="Rejected"
          value={counts.rejected || 0}
          icon={<XCircle className="h-8 w-8 text-rose-600" />}
          gradient="from-rose-50 to-white"
        />
      </div>

      {/* Search and Filters - Thinner and Minimalist */}
      <div className="flex flex-col items-center justify-between gap-6 rounded-full bg-white/80 p-2 shadow-sm ring-1 ring-slate-200/60 backdrop-blur-md lg:flex-row lg:pr-6">
        <div className="group relative w-full flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center transition-colors group-focus-within:text-indigo-600">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search teachers..."
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

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-10 items-center gap-1 rounded-full bg-slate-100/50 p-1 ring-1 ring-slate-200/30">
            {["all", "pending", "approved", "rejected"].map((s) => (
              <button
                key={s}
                className={`h-8 rounded-full px-4 text-xs font-bold capitalize transition-all duration-300 ${statusFilter === s ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/50" : "text-slate-500 hover:text-indigo-600"}`}
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex h-10 items-center gap-1 rounded-full bg-slate-100/50 p-1 ring-1 ring-slate-200/30">
            <button
              className={`flex h-8 w-10 items-center justify-center rounded-full transition-all duration-300 ${viewMode === "table" ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/50" : "text-slate-500 hover:text-indigo-600"}`}
              onClick={() => setViewMode("table")}
              title="Table View"
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
            </button>
            <button
              className={`flex h-8 w-10 items-center justify-center rounded-full transition-all duration-300 ${viewMode === "grid" ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/50" : "text-slate-500 hover:text-indigo-600"}`}
              onClick={() => setViewMode("grid")}
              title="Grid View"
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
            </button>
          </div>
        </div>
      </div>

      {/* Teachers Display */}
      {loading ? (
        <div className="card bg-base-100 shadow-lg">
          <Loading text="Loading teachers..." />
        </div>
      ) : teachers.length === 0 ? (
        <div className="card bg-base-100 border-base-200 border-2 shadow-2xl">
          <div className="card-body items-center justify-center py-24 text-center">
            <div className="bg-primary/5 text-primary mb-6 flex h-32 w-32 items-center justify-center rounded-full shadow-inner ring-4 ring-white">
              <Search className="h-16 w-16" />
            </div>
            <h3 className="text-3xl font-black tracking-tight">
              No Teachers Found
            </h3>
            <p className="text-base-content/60 mt-3 max-w-md text-lg">
              {search
                ? "We couldn't find any teachers matching your search. Try different keywords or filters."
                : "No teachers match the current filters."}
            </p>
            {(search || statusFilter !== "all") && (
              <button
                className="btn btn-primary btn-wide mt-6 shadow-lg"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                }}
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      ) : viewMode === "table" ? (
        <TeacherTable
          teachers={teachers}
          act={act}
          busy={busy}
          openEdit={openEdit}
          setDelTarget={setDelTarget}
        />
      ) : (
        <TeacherGrid
          teachers={teachers}
          act={act}
          busy={busy}
          openEdit={openEdit}
          setDelTarget={setDelTarget}
        />
      )}

      {/* Add/Edit Modal */}
      {modal && (
        <div className="modal modal-open">
          <div className="modal-box w-full max-w-lg">
            <button
              className="btn btn-circle btn-ghost btn-sm absolute top-4 right-4"
              onClick={() => setModal(false)}
            >
              ✕
            </button>
            <h3 className="mb-5 text-lg font-bold">Edit Teacher Profile</h3>
            {error && (
              <div className="alert alert-error mb-4 py-2 text-sm">{error}</div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <F label="Full Name" required>
                  <input
                    className="input input-bordered w-full"
                    required
                    {...f("name")}
                  />
                </F>
                <F label="Teacher ID">
                  <input
                    className="input input-bordered w-full"
                    placeholder="T-001"
                    {...f("teacherId")}
                  />
                </F>
                <F label="Designation">
                  <input
                    className="input input-bordered w-full"
                    placeholder="Professor"
                    {...f("designation")}
                  />
                </F>
                <F label="Specialization">
                  <input
                    className="input input-bordered w-full"
                    placeholder="AI / Networks"
                    {...f("specialization")}
                  />
                </F>
                <F label="Phone">
                  <input
                    className="input input-bordered w-full"
                    {...f("phone")}
                  />
                </F>
                <F label="Office Room">
                  <input
                    className="input input-bordered w-full"
                    placeholder="CSE-301"
                    {...f("officeRoom")}
                  />
                </F>
                <F label="Joining Date">
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    {...f("joiningDate")}
                  />
                </F>
              </div>
              <div className="modal-action mt-4">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving && (
                    <span className="loading loading-spinner loading-sm" />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
          <div
            className="modal-backdrop bg-black/30"
            onClick={() => setModal(false)}
          />
        </div>
      )}

      {/* Delete Modal */}
      {delTarget && (
        <div className="modal modal-open">
          <div className="modal-box max-w-sm text-center">
            <div className="bg-error/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Trash2 className="text-error h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Delete Teacher?</h3>
            <p className="text-base-content/60 mt-3 text-sm">
              Remove <strong>{delTarget.name}</strong> permanently? This cannot
              be undone.
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
                onClick={handleDelete}
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

function StatCard({ title, value, icon, gradient }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${gradient} p-6 text-slate-800 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)]`}
    >
      <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
            {title}
          </p>
          <p className="mt-1 text-4xl font-black tracking-tighter text-slate-800">
            {value}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-white shadow-sm ring-1 ring-slate-100 transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
      </div>
    </div>
  );
}

function TeacherTable({ teachers, act, busy, openEdit, setDelTarget }) {
  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-100">
      <div className="overflow-x-auto">
        <table className="table w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              <th className="px-6 py-5">#</th>
              <th className="px-6 py-5">Teacher</th>
              <th className="px-6 py-5">ID</th>
              <th className="px-6 py-5">Designation</th>
              <th className="px-6 py-5">Specialization</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/50">
            {teachers.map((t, i) => {
              const initials = t.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
              return (
                <tr
                  key={t.userId}
                  className="transition-colors hover:bg-slate-50/50"
                >
                  <td className="px-6 py-5 text-[11px] font-bold text-slate-400">
                    {String(i + 1).padStart(2, "0")}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="group/avatar relative">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-indigo-600 ring-1 ring-slate-200 transition-all duration-300 group-hover/avatar:bg-indigo-600 group-hover/avatar:text-white group-hover/avatar:shadow-md">
                          <UserCheck2 className="h-5 w-5" />
                        </div>
                        <div className="absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-100">
                          <div
                            className={`h-2 w-2 rounded-full ${t.status === "approved" ? "bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" : t.status === "pending" ? "bg-amber-500" : "bg-rose-500"}`}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-black tracking-tight text-slate-800 transition-colors group-hover:text-indigo-600">
                          {t.name}
                        </p>
                        <div className="mt-0.5 flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                          <Mail className="h-3 w-3 text-indigo-400 opacity-50" />
                          <span className="tracking-wide">{t.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 font-mono text-xs font-bold text-slate-600 ring-1 ring-slate-200/50">
                      {t.teacherId || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-slate-300" />
                      <span className="text-xs font-bold text-slate-600">
                        {t.designation || "—"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-slate-400">
                      {t.specialization || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`badge rounded-lg px-2.5 py-2.5 text-[10px] font-bold tracking-wider uppercase shadow-sm ${STATUS_COLOR[t.status] || "badge-neutral"}`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-1.5">
                      {t.status === "pending" && (
                        <>
                          <button
                            className="btn btn-xs h-8 border-0 bg-emerald-500 text-white shadow-sm hover:bg-emerald-600"
                            onClick={() => act(t.userId, "approve")}
                            disabled={busy[t.userId + "approve"]}
                          >
                            {busy[t.userId + "approve"] ? (
                              <span className="loading loading-spinner loading-xs" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            className="btn btn-xs h-8 border-rose-100 bg-rose-50 text-rose-600 shadow-sm hover:bg-rose-100"
                            onClick={() => act(t.userId, "reject")}
                            disabled={busy[t.userId + "reject"]}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {t.status === "approved" && (
                        <button
                          className="btn btn-xs h-8 rounded-lg border-amber-100 bg-amber-50 px-3 text-amber-600 shadow-sm hover:bg-amber-100"
                          onClick={() => act(t.userId, "reject")}
                          disabled={busy[t.userId + "reject"]}
                        >
                          Revoke
                        </button>
                      )}
                      {t.status === "rejected" && (
                        <button
                          className="btn btn-xs h-8 rounded-lg border-emerald-100 bg-emerald-50 px-3 text-emerald-600 shadow-sm hover:bg-emerald-100"
                          onClick={() => act(t.userId, "approve")}
                          disabled={busy[t.userId + "approve"]}
                        >
                          Restore
                        </button>
                      )}
                      <button
                        className="btn btn-xs h-8 w-8 rounded-lg border-0 bg-slate-50 text-slate-400 shadow-sm transition-all hover:bg-indigo-50 hover:text-indigo-600"
                        onClick={() => openEdit(t)}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        className="btn btn-xs h-8 w-8 rounded-lg border-0 bg-slate-50 text-slate-400 shadow-sm transition-all hover:bg-rose-50 hover:text-rose-600"
                        onClick={() => setDelTarget(t)}
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
        Showing {teachers.length} teacher{teachers.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}

function TeacherGrid({ teachers, act, busy, openEdit, setDelTarget }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {teachers.map((t) => {
        const initials = t.name
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
        const specs = t.specialization
          ? t.specialization.split(",").map((s) => s.trim())
          : [];

        return (
          <div
            key={t.userId}
            className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] hover:ring-indigo-100"
          >
            <div className="flex items-start justify-between">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-indigo-600 ring-1 ring-slate-100 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-200">
                  <span className="text-xl font-black">{initials}</span>
                </div>
                <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-100">
                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-black tracking-[0.1em] uppercase ring-1 ring-inset ${
                  t.status === "approved"
                    ? "bg-emerald-50 text-emerald-600 ring-emerald-100"
                    : t.status === "pending"
                      ? "bg-amber-50 text-amber-600 ring-amber-100"
                      : "bg-rose-50 text-rose-600 ring-rose-100"
                }`}
              >
                {t.status}
              </span>
            </div>

            <div className="mt-5">
              <h3 className="text-lg font-black tracking-tight text-slate-800 transition-colors group-hover:text-indigo-700">
                {t.name}
              </h3>
              <div className="mt-1 flex items-center gap-1.5 text-xs font-bold tracking-wide text-indigo-600 uppercase">
                <Briefcase className="h-3.5 w-3.5" />
                {t.designation || "Faculty"}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-400">
              <Mail className="h-4 w-4 opacity-50" />
              <span className="truncate tracking-wide">{t.email}</span>
            </div>

            <div className="mt-6 space-y-3 rounded-2xl bg-slate-50/50 p-4 ring-1 ring-slate-100/50 transition-colors group-hover:bg-white">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[9px] font-black tracking-[0.15em] text-slate-400 uppercase">
                  ID
                </span>
                <span className="font-mono text-xs font-bold text-slate-700">
                  {t.teacherId || "—"}
                </span>
              </div>
              {t.officeRoom && (
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-[9px] font-black tracking-[0.15em] text-slate-400 uppercase">
                    <MapPin className="h-3 w-3" /> Office
                  </span>
                  <span className="text-xs font-bold text-indigo-600">
                    {t.officeRoom}
                  </span>
                </div>
              )}
              <div className="flex flex-wrap gap-1 pt-1">
                {specs.slice(0, 3).map((s, idx) => (
                  <span
                    key={idx}
                    className="rounded-md bg-white px-2 py-0.5 text-[9px] font-bold text-slate-500 ring-1 ring-slate-100"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
              <div className="flex gap-2">
                {t.status === "pending" && (
                  <button
                    className="flex items-center gap-1 rounded-xl bg-emerald-500 px-3 py-1.5 text-[10px] font-bold text-white shadow-sm transition-all hover:bg-emerald-600"
                    onClick={() => act(t.userId, "approve")}
                  >
                    Approve
                  </button>
                )}
                {t.status === "approved" && (
                  <button
                    className="rounded-xl border border-rose-100 bg-white px-3 py-1.5 text-[10px] font-bold text-rose-600 shadow-sm transition-all hover:bg-rose-50"
                    onClick={() => act(t.userId, "reject")}
                  >
                    Revoke
                  </button>
                )}
              </div>

              <div className="flex gap-1">
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition-all hover:bg-indigo-50 hover:text-indigo-600"
                  onClick={() => openEdit(t)}
                  title="Edit"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600"
                  onClick={() => setDelTarget(t)}
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function F({ label, required, children }) {
  return (
    <div className="form-control">
      <label className="label py-1">
        <span className="label-text text-sm font-medium">
          {label}
          {required && <span className="text-error ml-0.5">*</span>}
        </span>
      </label>
      {children}
    </div>
  );
}
