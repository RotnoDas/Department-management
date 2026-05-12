import { useState, useEffect, useCallback } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import {
  Hand,
  BookUser,
  Clock,
  School,
  CheckCircle,
  ChevronRight,
  Check,
  X,
  UserCheck2,
  GraduationCap,
} from "lucide-react";
import Loading from "../../components/Loading";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState({});

  const load = useCallback(async () => {
    try {
      const r = await api.get("/admin/dashboard");
      setData(r.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (userId, role, action) => {
    const endpoint = role === "student" ? "students" : "teachers";
    setBusy((b) => ({ ...b, [userId + action]: true }));
    try {
      await api.patch(`/admin/${endpoint}/${userId}/${action}`);
      load();
    } catch (e) {
      console.error(e);
    } finally {
      setBusy((b) => ({ ...b, [userId + action]: false }));
    }
  };

  if (loading) return <Loading fullScreen text="Loading Dashboard..." />;

  const { stats = {}, recentPending = [], trends = [] } = data || {};
  const s = stats.students || {};
  const t = stats.teachers || {};

  const totalMembers = (s.total || 0) + (t.total || 0);

  const statusData = [
    {
      name: "Approved",
      value: (s.approved || 0) + (t.approved || 0),
      color: "#10b981",
    },
    {
      name: "Pending",
      value: (s.pending || 0) + (t.pending || 0),
      color: "#f59e0b",
    },
    {
      name: "Rejected",
      value: (s.rejected || 0) + (t.rejected || 0),
      color: "#ef4444",
    },
  ];

  const roleData = [
    { name: "Students", value: s.total || 0, color: "#6366f1" },
    { name: "Teachers", value: t.total || 0, color: "#ec4899" },
  ];

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonthIdx = new Date().getMonth();
  
  const last5Months = [];
  for (let i = 4; i >= 0; i--) {
    let m = currentMonthIdx - i;
    if (m < 0) m += 12;
    last5Months.push(monthNames[m]);
  }

  const rawTrends = last5Months.map(monthName => {
    const existing = trends.find(t => t.month === monthName);
    return {
      month: monthName,
      students: existing ? existing.students : 0,
      teachers: existing ? existing.teachers : 0
    };
  });

  let cumulativeStudents = 0;
  let cumulativeTeachers = 0;
  const trendData = rawTrends.map((d) => {
    cumulativeStudents += d.students || 0;
    cumulativeTeachers += d.teachers || 0;
    return {
      ...d,
      students: cumulativeStudents,
      teachers: cumulativeTeachers,
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Find current index to compare with previous
      const currIdx = trendData.findIndex((d) => d.month === label);
      const prevData = currIdx > 0 ? trendData[currIdx - 1] : null;

      return (
        <div className="bg-base-100 border-base-content/10 rounded-xl border p-4 shadow-2xl backdrop-blur-md">
          <p className="text-base-content/60 mb-3 text-sm font-bold tracking-widest uppercase">
            {label} Overview
          </p>
          <div className="space-y-4">
            {payload.map((entry, index) => {
              const val = entry.value;
              const prevVal = prevData ? prevData[entry.dataKey] : null;
              const diff = prevVal !== null ? val - prevVal : null;

              return (
                <div key={index} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-8">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: entry.color || entry.stroke }}
                      ></div>
                      <span className="text-base-content/70 font-medium">
                        {entry.name}
                      </span>
                    </div>
                    <span className="text-lg font-black">{val}</span>
                  </div>
                  {diff !== null && (
                    <div
                      className={`flex items-center gap-1 self-end text-[10px] font-bold uppercase ${diff >= 0 ? "text-success" : "text-error"}`}
                    >
                      {diff >= 0 ? "+" : ""}
                      {diff} new this month
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      const percent =
        totalMembers > 0 ? ((entry.value / totalMembers) * 100).toFixed(1) : 0;
      return (
        <div className="bg-base-100 border-base-content/10 rounded-xl border p-4 shadow-2xl backdrop-blur-md">
          <div className="mb-1 flex items-center gap-3">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.payload.color }}
            ></div>
            <p className="text-lg font-bold">{entry.name}</p>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black">{entry.value}</span>
            <span className="text-success text-sm font-bold">
              {percent}% of total
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 pb-8">
      {/* Hero Header with Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAx.NzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHpWLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 text-white shadow-2xl backdrop-blur-xl">
              <Hand className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
                Welcome back, {user?.name}!
              </h1>
              <p className="mt-2 text-lg text-white/90">
                Here's your CSE Department overview for today
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-4 lg:flex">
            <div className="rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-center backdrop-blur-xl">
              <div className="text-3xl font-bold text-white">
                {totalMembers}
              </div>
              <div className="text-sm text-white/80">Total Members</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid with Animated Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total Students"
          value={s.total || 0}
          subtitle={`${s.approved || 0} approved`}
          icon={<BookUser className="h-8 w-8" />}
          gradient="from-blue-500 via-blue-600 to-indigo-600"
          iconBg="bg-blue-500/20"
          trend={{
            value: `${Math.round(((s.approved || 0) / (s.total || 1)) * 100)}%`,
            label: "Approval Rate",
          }}
        />
        <StatCard
          title="Pending Approvals"
          value={s.pending || 0}
          subtitle="Needs attention"
          icon={<Clock className="h-8 w-8" />}
          gradient="from-amber-500 via-orange-500 to-red-500"
          iconBg="bg-amber-500/20"
          pulse={s.pending > 0}
          trend={{
            value: `${(s.pending || 0) + (t.pending || 0)}`,
            label: "total waiting",
          }}
        />
        <StatCard
          title="Faculty Members"
          value={t.total || 0}
          subtitle={`${t.approved || 0} approved`}
          icon={<School className="h-8 w-8" />}
          gradient="from-blue-500 via-indigo-600 to-purple-600"
          iconBg="bg-blue-500/20"
          pulse={t.pending > 0}
          trend={{ value: `${t.pending || 0}`, label: "pending" }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Student Status Distribution */}
        <div className="card bg-base-100 border-base-300 border shadow-xl transition-all duration-300 hover:shadow-2xl">
          <div className="card-body">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="card-title text-xl font-bold">
                  Registration Status
                </h2>
                <p className="text-base-content/60 mt-1 text-sm">
                  Overall approval flow
                </p>
              </div>
              <div className="badge badge-primary badge-lg py-4 font-bold">
                {totalMembers}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Composition */}
        <div className="card bg-base-100 border-base-300 border shadow-xl transition-all duration-300 hover:shadow-2xl">
          <div className="card-body">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="card-title text-xl font-bold">
                  Department Roles
                </h2>
                <p className="text-base-content/60 mt-1 text-sm">
                  Students vs Faculty
                </p>
              </div>
              <div className="badge badge-secondary badge-lg py-4 font-bold">
                {totalMembers}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Growth Trend - Line Comparison */}
        <div className="card border-base-300 bg-base-100 border shadow-xl transition-all duration-300 hover:shadow-2xl">
          <div className="card-body">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="card-title text-xl font-bold">
                  Registration Trend
                </h2>
                <p className="text-base-content/60 mt-1 text-sm">
                  Students vs Teachers (5M)
                </p>
              </div>
              <div className="badge badge-success badge-lg font-bold">LIVE</div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trendData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(var(--bc) / 0.1)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: 12,
                    fill: "oklch(var(--bc) / 0.6)",
                    fontWeight: "bold",
                  }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  tick={{
                    fontSize: 12,
                    fill: "oklch(var(--bc) / 0.6)",
                    fontWeight: "bold",
                  }}
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" align="right" iconType="circle" />
                <Line
                  type="monotone"
                  connectNulls={true}
                  dataKey="students"
                  name="Students"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{
                    r: 5,
                    fill: "#6366f1",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  connectNulls={true}
                  dataKey="teachers"
                  name="Teachers"
                  stroke="#ec4899"
                  strokeWidth={3}
                  dot={{
                    r: 5,
                    fill: "#ec4899",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Pending Registrations - Enhanced */}
      {recentPending.length > 0 && (
        <div className="card border-warning animate-in fade-in slide-in-from-bottom border-2 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 shadow-2xl duration-500">
          <div className="card-body">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-warning/20 text-warning flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg">
                  <Clock className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="card-title text-2xl">Pending Registrations</h2>
                  <p className="text-base-content/70 mt-1">
                    {recentPending.length} registration
                    {recentPending.length !== 1 ? "s" : ""} waiting for approval
                  </p>
                </div>
              </div>
              <div className="badge badge-warning badge-lg gap-2 px-4 py-4 text-lg font-bold shadow-lg">
                <span className="animate-pulse">●</span>
                {recentPending.length} Pending
              </div>
            </div>

            <div className="bg-base-100 overflow-hidden rounded-2xl shadow-xl">
              <table className="table">
                <thead className="from-base-200 to-base-300 bg-gradient-to-r">
                  <tr>
                    <th className="text-base font-bold">Member</th>
                    <th className="text-base font-bold">Role</th>
                    <th className="text-base font-bold">ID/Identifier</th>
                    <th className="text-base font-bold">Registered</th>
                    <th className="text-right text-base font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPending.map((student, idx) => {
                    const initials = student.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();
                    const isTeacher = student.role === "teacher";

                    return (
                      <tr
                        key={student.userId}
                        className="hover:bg-base-200/50 transition-all duration-200"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <td>
                          <div className="flex items-center gap-4">
                            <div className="avatar placeholder">
                              <div
                                className={`h-12 w-12 rounded-xl bg-gradient-to-br ${isTeacher ? "from-purple-600 to-pink-600" : "from-blue-600 to-indigo-700"} flex items-center justify-center border border-white/20 text-white shadow-lg`}
                              >
                                <span className="text-sm font-black tracking-tighter">
                                  {initials}
                                </span>
                              </div>
                            </div>
                            <div>
                              <p className="text-base font-bold">
                                {student.name}
                              </p>
                              <p className="text-base-content/60 text-xs">
                                {student.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            {isTeacher ? (
                              <UserCheck2 className="text-secondary h-4 w-4" />
                            ) : (
                              <GraduationCap className="text-info h-4 w-4" />
                            )}
                            <span
                              className={`badge badge-sm font-bold uppercase ${student.role === "student" ? "badge-info" : "badge-secondary"}`}
                            >
                              {student.role || "student"}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-outline badge-lg font-mono font-semibold">
                            {student.identifier || student.studentId || "—"}
                          </span>
                        </td>
                        <td className="text-base-content/60">
                          {new Date(student.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </td>
                        <td>
                          <div className="flex justify-end gap-3">
                            <button
                              className="btn btn-success gap-2 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                              onClick={() =>
                                act(
                                  student.userId,
                                  student.role || "student",
                                  "approve",
                                )
                              }
                              disabled={busy[student.userId + "approve"]}
                            >
                              {busy[student.userId + "approve"] ? (
                                <span className="loading loading-spinner loading-sm" />
                              ) : (
                                <>
                                  <Check className="h-5 w-5" />
                                  Approve
                                </>
                              )}
                            </button>
                            <button
                              className="btn btn-outline btn-error gap-2 transition-all hover:scale-105 hover:shadow-lg"
                              onClick={() =>
                                act(
                                  student.userId,
                                  student.role || "student",
                                  "reject",
                                )
                              }
                              disabled={busy[student.userId + "reject"]}
                            >
                              <X className="h-5 w-5" />
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* No Pending - Success State */}
      {recentPending.length === 0 && (
        <div className="card border-success/30 border-2 bg-gradient-to-br from-emerald-50 to-green-50 shadow-xl">
          <div className="card-body items-center py-12 text-center">
            <div className="bg-success/10 text-success mb-4 flex h-24 w-24 items-center justify-center rounded-full">
              <CheckCircle className="h-16 w-16" />
            </div>
            <h3 className="text-success text-2xl font-bold">All Caught Up!</h3>
            <p className="text-base-content/60 mt-2 text-lg">
              No pending registrations at the moment
            </p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <QuickActionCard
          icon={<BookUser className="h-8 w-8" />}
          title="Manage Students"
          description="View and manage all student records"
          link="/admin/students"
          gradient="from-indigo-600 via-purple-600 to-pink-600"
        />
        <QuickActionCard
          icon={<School className="h-8 w-8" />}
          title="Manage Teachers"
          description="View and manage faculty members"
          link="/admin/teachers"
          gradient="from-emerald-500 via-teal-600 to-cyan-700"
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  gradient,
  iconBg,
  pulse,
  trend,
}) {
  return (
    <div
      className={`card bg-gradient-to-br ${gradient} text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${pulse ? "animate-pulse" : ""}`}
    >
      <div className="card-body p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="mb-2 text-sm font-semibold tracking-wide text-white/80 uppercase">
              {title}
            </p>
            <p className="mb-1 text-5xl font-extrabold drop-shadow-lg">
              {value}
            </p>
            <p className="text-sm text-white/80">{subtitle}</p>
            {trend && (
              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-white/90">
                <span className="badge badge-sm border-white/30 bg-white/20">
                  {trend.value}
                </span>
                <span>{trend.label}</span>
              </div>
            )}
          </div>
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl ${iconBg} text-white shadow-xl backdrop-blur-sm`}
          >
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({ icon, title, description, link, gradient }) {
  return (
    <a
      href={link}
      className={`card bg-gradient-to-br ${gradient} group cursor-pointer text-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl`}
    >
      <div className="card-body p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-white shadow-lg backdrop-blur-sm transition-transform group-hover:scale-110">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="mt-1 text-sm text-white/80">{description}</p>
          </div>
          <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </a>
  );
}
