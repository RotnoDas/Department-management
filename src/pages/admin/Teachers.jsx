import { useState, useEffect, useCallback } from "react";
import api from "../../api/axios";
import {
  Pencil,
  Trash2,
  School,
  Check,
  X,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  UserCheck2,
  UserSquare2,
  Mail,
  MapPin,
  Briefcase,
  BookOpenCheck,
  ShieldCheck,
  Sparkles,
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
      load();
    } catch (e) {
      console.error(e);
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
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Operation failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/teachers/${delTarget.userId}`);
      setDelTarget(null);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const counts = teachers.reduce((a, t) => {
    a[t.status] = (a[t.status] || 0) + 1;
    return a;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header with Branded Faculty Logo */}
      <div className="card relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="card-body relative z-10 flex-row items-center justify-between p-8">
          <div className="flex items-center gap-8">
            <div className="group relative">
              <div className="flex h-20 w-20 transform items-center justify-center rounded-3xl border border-white/30 bg-white/20 shadow-2xl backdrop-blur-xl transition-transform duration-500 group-hover:rotate-6">
                <BookOpenCheck className="h-10 w-10 text-white drop-shadow-lg" />
              </div>
              <div className="absolute -right-2 -bottom-2 flex h-8 w-8 transform items-center justify-center rounded-xl border-2 border-white bg-yellow-400 text-indigo-900 shadow-lg transition-transform group-hover:scale-110">
                <ShieldCheck className="h-5 w-5 font-bold" />
              </div>
              <Sparkles className="absolute -top-3 -left-3 h-6 w-6 animate-pulse text-yellow-300" />
            </div>

            <div>
              <h1 className="flex items-center gap-3 text-4xl font-black tracking-tight">
                Faculty Hub
                <div className="badge badge-warning badge-sm px-3 py-3 font-bold uppercase shadow-lg">
                  Verified
                </div>
              </h1>
              <p className="mt-2 text-lg font-medium text-white/80">
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
          icon={<Users className="h-8 w-8 text-white" />}
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Pending"
          value={counts.pending || 0}
          icon={<Clock className="h-8 w-8 text-white" />}
          gradient="from-amber-500 to-orange-600"
        />
        <StatCard
          title="Approved"
          value={counts.approved || 0}
          icon={<CheckCircle className="h-8 w-8 text-white" />}
          gradient="from-emerald-500 to-green-600"
        />
        <StatCard
          title="Rejected"
          value={counts.rejected || 0}
          icon={<XCircle className="h-8 w-8 text-white" />}
          gradient="from-red-500 to-rose-600"
        />
      </div>

      {/* Search and Filters - Modernized */}
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
                placeholder="Search by name, email, or department ID..."
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

            <div className="flex flex-wrap items-center gap-4">
              {/* Status Filters */}
              <div className="bg-base-200 flex gap-1 rounded-xl p-1.5">
                {["all", "pending", "approved", "rejected"].map((s) => (
                  <button
                    key={s}
                    className={`rounded-lg px-4 py-2 text-sm font-bold capitalize transition-all ${
                      statusFilter === s
                        ? "text-primary bg-white shadow-sm"
                        : "text-base-content/60 hover:bg-base-300"
                    }`}
                    onClick={() => setStatusFilter(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* View Toggles */}
              <div className="bg-base-200 flex gap-1 rounded-xl p-1.5">
                <button
                  className={`rounded-lg p-2 transition-all ${viewMode === "table" ? "text-primary bg-white shadow-sm" : "text-base-content/60 hover:bg-base-300"}`}
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
                </button>
                <button
                  className={`rounded-lg p-2 transition-all ${viewMode === "grid" ? "text-primary bg-white shadow-sm" : "text-base-content/60 hover:bg-base-300"}`}
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
                </button>
              </div>
            </div>
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
            <h3 className="text-3xl font-black tracking-tight">No Teachers Found</h3>
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
      className={`card bg-gradient-to-br ${gradient} text-white shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl`}
    >
      <div className="card-body p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold tracking-wide text-white/80 uppercase">
              {title}
            </p>
            <p className="mt-1 text-4xl font-extrabold">{value}</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeacherTable({ teachers, act, busy, openEdit, setDelTarget }) {
  return (
    <div className="card bg-base-100 overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="table">
          <thead className="from-base-200 to-base-300 bg-gradient-to-r">
            <tr>
              <th className="font-bold">#</th>
              <th className="font-bold">Teacher</th>
              <th className="font-bold">ID</th>
              <th className="font-bold">Designation</th>
              <th className="font-bold">Specialization</th>
              <th className="font-bold">Status</th>
              <th className="text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
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
                  className="hover:bg-base-200/50 transition-colors"
                >
                  <td className="text-base-content/50 text-sm font-semibold">
                    {i + 1}
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
                          <span className="text-sm font-bold">{initials}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm leading-tight font-bold">
                          {t.name}
                        </p>
                        <div className="text-base-content/50 mt-0.5 flex items-center gap-1.5">
                          <Mail className="h-3 w-3" />
                          <span className="text-xs">{t.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-outline badge-sm font-mono font-semibold">
                      {t.teacherId || "—"}
                    </span>
                  </td>
                  <td className="text-sm font-medium">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 opacity-40" />
                      {t.designation || "—"}
                    </div>
                  </td>
                  <td className="text-sm opacity-70">
                    {t.specialization || "—"}
                  </td>
                  <td>
                    <span
                      className={`badge badge-sm font-bold ${STATUS_COLOR[t.status] || "badge-neutral"}`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-end gap-1">
                      {t.status === "pending" && (
                        <>
                          <button
                            className="btn btn-success btn-xs text-white"
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
                            className="btn btn-error btn-outline btn-xs"
                            onClick={() => act(t.userId, "reject")}
                            disabled={busy[t.userId + "reject"]}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {t.status === "approved" && (
                        <button
                          className="btn btn-warning btn-outline btn-xs"
                          onClick={() => act(t.userId, "reject")}
                          disabled={busy[t.userId + "reject"]}
                        >
                          Revoke
                        </button>
                      )}
                      {t.status === "rejected" && (
                        <button
                          className="btn btn-success btn-outline btn-xs"
                          onClick={() => act(t.userId, "approve")}
                          disabled={busy[t.userId + "approve"]}
                        >
                          Restore
                        </button>
                      )}
                      <button
                        className="btn btn-ghost btn-square btn-xs"
                        onClick={() => openEdit(t)}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        className="btn btn-ghost btn-square btn-xs text-error hover:bg-error/10"
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
      <div className="border-base-200 text-base-content/50 border-t px-4 py-3 text-xs font-semibold">
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
            className="group card bg-base-100 border-base-200 border shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
          >
            {/* Card Header with Status and ID */}
            <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
              <span
                className={`badge badge-sm font-bold shadow-sm ${STATUS_COLOR[t.status] || "badge-neutral"}`}
              >
                {t.status}
              </span>
              <span className="badge badge-ghost badge-xs px-2 font-mono opacity-50">
                #{t.teacherId || "N/A"}
              </span>
            </div>

            <div className="card-body overflow-hidden p-0">
              {/* Profile Background & Avatar Section */}
              <div className="relative h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-10 transition-opacity group-hover:opacity-20"></div>

              <div className="-mt-12 flex flex-col items-start gap-3 px-6">
                <div className="avatar placeholder ring-base-100 rounded-3xl shadow-xl ring-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/30 bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 text-white shadow-inner">
                    <span className="text-3xl font-black tracking-tighter drop-shadow-md">
                      {initials}
                    </span>
                  </div>
                </div>

                <div className="mt-1">
                  <h3 className="group-hover:text-primary text-xl font-extrabold tracking-tight transition-colors">
                    {t.name}
                  </h3>
                  <div className="text-primary mt-0.5 flex items-center gap-2 text-sm font-bold tracking-wider uppercase">
                    <Briefcase className="h-3.5 w-3.5" />
                    {t.designation || "Faculty Member"}
                  </div>
                </div>
              </div>

              {/* Contact & Info */}
              <div className="space-y-4 px-6 py-4">
                <div className="grid grid-cols-1 gap-2">
                  <div className="text-base-content/70 bg-base-200/50 border-base-200/50 flex items-center gap-3 rounded-xl border p-2.5 text-sm">
                    <div className="rounded-lg bg-white p-1.5 shadow-sm">
                      <Mail className="h-4 w-4 text-indigo-500" />
                    </div>
                    <span className="truncate font-medium">{t.email}</span>
                  </div>
                  {t.officeRoom && (
                    <div className="text-base-content/70 bg-base-200/50 border-base-200/50 flex items-center gap-3 rounded-xl border p-2.5 text-sm">
                      <div className="rounded-lg bg-white p-1.5 shadow-sm">
                        <MapPin className="h-4 w-4 text-pink-500" />
                      </div>
                      <span className="font-medium">{t.officeRoom}</span>
                    </div>
                  )}
                </div>

                {/* Specialization Tags */}
                <div>
                  <p className="text-base-content/40 mb-2 px-1 text-[10px] font-bold tracking-widest uppercase">
                    Specialization
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {specs.length > 0 ? (
                      specs.map((s, idx) => (
                        <span
                          key={idx}
                          className="badge badge-outline badge-sm hover:bg-primary/10 hover:border-primary/30 px-3 py-2.5 font-medium transition-colors"
                        >
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-base-content/30 px-1 text-xs italic">
                        No specialization listed
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="bg-base-200/30 border-base-200 mt-auto flex items-center justify-between gap-2 border-t p-4">
                <div className="flex flex-1 gap-2">
                  {t.status === "pending" && (
                    <>
                      <button
                        className="btn btn-success btn-sm flex-1 border-none text-white shadow-md"
                        onClick={() => act(t.userId, "approve")}
                        disabled={busy[t.userId + "approve"]}
                      >
                        {busy[t.userId + "approve"] ? (
                          <span className="loading loading-spinner loading-xs" />
                        ) : (
                          "Approve"
                        )}
                      </button>
                      <button
                        className="btn btn-error btn-outline btn-sm flex-1 border-2"
                        onClick={() => act(t.userId, "reject")}
                        disabled={busy[t.userId + "reject"]}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {t.status === "approved" && (
                    <button
                      className="btn btn-warning btn-outline btn-sm flex-1 border-2 font-bold"
                      onClick={() => act(t.userId, "reject")}
                      disabled={busy[t.userId + "reject"]}
                    >
                      Revoke Access
                    </button>
                  )}
                  {t.status === "rejected" && (
                    <button
                      className="btn btn-success btn-outline btn-sm flex-1 border-2 font-bold"
                      onClick={() => act(t.userId, "approve")}
                      disabled={busy[t.userId + "approve"]}
                    >
                      Restore Access
                    </button>
                  )}
                </div>

                <div className="flex gap-1">
                  <button
                    className="btn btn-ghost btn-square btn-sm shadow-sm transition-all hover:bg-white hover:shadow"
                    onClick={() => openEdit(t)}
                    title="Edit Profile"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    className="btn btn-ghost btn-square btn-sm text-error hover:bg-error/10"
                    onClick={() => setDelTarget(t)}
                    title="Delete Teacher"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
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
