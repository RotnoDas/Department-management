import { useState, useEffect, useCallback } from "react";
import { addToast } from "../../utils/toast";
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
  Mail,
  ShieldCheck,
  Sparkles,
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
      addToast({ title: `Successfully ${action}d`, color: "success" });
      load();
    } catch (e) {
      console.error(e);
      addToast({
        title: e.response?.data?.error || `Failed to ${action}`,
        color: "danger",
      });
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

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentMonthIdx = new Date().getMonth();

  const last5Months = [];
  for (let i = 4; i >= 0; i--) {
    let m = currentMonthIdx - i;
    if (m < 0) m += 12;
    last5Months.push(monthNames[m]);
  }

  const rawTrends = last5Months.map((monthName) => {
    const existing = trends.find((t) => t.month === monthName);
    return {
      month: monthName,
      students: existing ? existing.students : 0,
      teachers: existing ? existing.teachers : 0,
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
      const currIdx = trendData.findIndex((d) => d.month === label);
      const prevData = currIdx > 0 ? trendData[currIdx - 1] : null;

      return (
        <div className="rounded-2xl bg-white/95 p-4 shadow-2xl ring-1 ring-slate-100 backdrop-blur-md">
          <p className="mb-3 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
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
                      <span className="text-sm font-black text-slate-700">
                        {entry.name}
                      </span>
                    </div>
                    <span className="text-lg font-black tracking-tight">
                      {val}
                    </span>
                  </div>
                  {diff !== null && (
                    <div
                      className={`flex items-center gap-1 self-end text-[9px] font-black tracking-wider uppercase ${diff >= 0 ? "text-emerald-500" : "text-rose-500"}`}
                    >
                      {diff >= 0 ? "+" : ""}
                      {diff} New this month
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
        <div className="rounded-2xl bg-white/95 p-4 shadow-2xl ring-1 ring-slate-100 backdrop-blur-md">
          <div className="mb-1 flex items-center gap-3">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.payload.color }}
            ></div>
            <p className="text-sm font-black text-slate-800">{entry.name}</p>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter">
              {entry.value}
            </span>
            <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase">
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
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-sky-100 via-indigo-50 to-white p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-white/40 blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-indigo-100/50 blur-2xl"></div>

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-xl ring-1 ring-slate-100 transition-transform duration-500 hover:scale-105 hover:rotate-6">
              <Hand className="h-10 w-10 text-indigo-500" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-800">
                Welcome back, {user?.name}!
              </h1>
              <p className="mt-2 text-lg font-medium text-slate-500">
                Here's your CSE Department overview for today
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-4 lg:flex">
            <div className="rounded-[1.5rem] bg-white p-5 px-8 text-center shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md">
              <div className="text-3xl font-black tracking-tight text-indigo-600">
                {totalMembers}
              </div>
              <div className="text-[11px] font-black tracking-widest text-slate-400 uppercase">
                Total Members
              </div>
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
          icon={<BookUser className="h-8 w-8 text-indigo-600" />}
          gradient="from-indigo-50 to-white"
          iconBg="bg-indigo-100"
          trend={{
            value: `${Math.round(((s.approved || 0) / (s.total || 1)) * 100)}%`,
            label: "Approval Rate",
          }}
        />
        <StatCard
          title="Pending Approvals"
          value={s.pending || 0}
          subtitle="Needs attention"
          icon={<Clock className="h-8 w-8 text-amber-600" />}
          gradient="from-amber-50 to-white"
          iconBg="bg-amber-100"
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
          icon={<School className="h-8 w-8 text-purple-600" />}
          gradient="from-purple-50 to-white"
          iconBg="bg-purple-100"
          pulse={t.pending > 0}
          trend={{ value: `${t.pending || 0}`, label: "pending" }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Student Status Distribution */}
        <div className="group relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/50 transition-all duration-300 hover:shadow-xl hover:ring-indigo-100">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                Registration Status
              </h2>
              <p className="mt-1 text-lg font-black tracking-tight text-slate-800">
                Overall Flow
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-xs font-black text-indigo-600 shadow-inner ring-1 ring-indigo-100">
              {totalMembers}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: "11px", fontWeight: "bold" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Department Composition */}
        <div className="group relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/50 transition-all duration-300 hover:shadow-xl hover:ring-pink-100">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                Department Roles
              </h2>
              <p className="mt-1 text-lg font-black tracking-tight text-slate-800">
                Member Split
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-xs font-black text-pink-600 shadow-inner ring-1 ring-pink-100">
              {totalMembers}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={roleData}
                cx="50%"
                cy="50%"
                outerRadius={90}
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

        {/* Growth Trend - Line Comparison */}
        <div className="group relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/50 transition-all duration-300 hover:shadow-xl hover:ring-indigo-100">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                Registration Trend
              </h2>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[10px] font-black text-emerald-600 shadow-inner ring-1 ring-emerald-100">
              LIVE
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{
                  fontSize: 10,
                  fill: "#94a3b8",
                  fontWeight: "900",
                }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                tick={{
                  fontSize: 10,
                  fill: "#94a3b8",
                  fontWeight: "900",
                }}
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ fontSize: "10px", fontWeight: "black" }}
              />
              <Line
                type="monotone"
                connectNulls={true}
                dataKey="students"
                name="Students"
                stroke="#6366f1"
                strokeWidth={4}
                dot={{
                  r: 4,
                  fill: "#6366f1",
                  strokeWidth: 2,
                  stroke: "#fff",
                }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                connectNulls={true}
                dataKey="teachers"
                name="Teachers"
                stroke="#ec4899"
                strokeWidth={4}
                dot={{
                  r: 4,
                  fill: "#ec4899",
                  strokeWidth: 2,
                  stroke: "#fff",
                }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pending Registrations - Enhanced */}
      {recentPending.length > 0 && (
        <div className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-100 transition-all duration-300">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-inner ring-1 ring-amber-100">
                <Clock className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-800">
                  Pending Registrations
                </h2>
                <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  {recentPending.length} waiting for approval
                </p>
              </div>
            </div>
            <div className="rounded-full bg-amber-50 px-4 py-2 text-xs font-black tracking-widest text-amber-600 uppercase shadow-sm ring-1 ring-amber-100 transition-all hover:bg-white hover:ring-amber-500">
              {recentPending.length} Total
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-slate-50/50 shadow-inner ring-1 ring-slate-100">
            <table className="table w-full border-collapse">
              <thead>
                <tr className="bg-white/50 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  <th className="px-6 py-5">Member</th>
                  <th className="px-6 py-5 text-center">Role</th>
                  <th className="px-6 py-5 text-center">ID / Roll</th>
                  <th className="px-6 py-5 text-center">Registered</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
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
                      className="transition-colors hover:bg-white"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="avatar placeholder">
                            <div
                              className={`h-10 w-10 rounded-xl bg-gradient-to-br ${isTeacher ? "from-purple-50 to-white" : "from-indigo-50 to-white"} flex items-center justify-center border border-slate-100 text-slate-800 shadow-sm transition-transform group-hover:scale-110`}
                            >
                              <span className="text-xs font-black tracking-tighter">
                                {initials}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800">
                              {student.name}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span
                          className={`inline-block rounded-lg px-2.5 py-1 text-[10px] font-black tracking-widest uppercase ring-1 ${isTeacher ? "bg-purple-50 text-purple-600 ring-purple-100" : "bg-indigo-50 text-indigo-600 ring-indigo-100"}`}
                        >
                          {student.role || "student"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="rounded-md bg-white px-2 py-1 font-mono text-xs font-bold text-slate-700 shadow-sm ring-1 ring-slate-200/50">
                          {student.identifier || student.studentId || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-xs font-bold text-slate-500">
                          {new Date(student.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition-all hover:bg-emerald-600 hover:text-white hover:shadow-lg"
                            onClick={() =>
                              act(
                                student.userId,
                                student.role || "student",
                                "approve",
                              )
                            }
                            disabled={busy[student.userId + "approve"]}
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 transition-all hover:bg-rose-600 hover:text-white hover:shadow-lg"
                            onClick={() =>
                              act(
                                student.userId,
                                student.role || "student",
                                "reject",
                              )
                            }
                            disabled={busy[student.userId + "reject"]}
                          >
                            <X className="h-4 w-4" />
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
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <QuickActionCard
          icon={<BookUser className="h-7 w-7 text-indigo-600" />}
          title="Manage Students"
          description="View and manage student records"
          link="/admin/students"
          gradient="from-indigo-50 to-white"
          iconBg="bg-indigo-100"
        />
        <QuickActionCard
          icon={<School className="h-7 w-7 text-teal-600" />}
          title="Manage Teachers"
          description="View and manage faculty members"
          link="/admin/teachers"
          gradient="from-teal-50 to-white"
          iconBg="bg-teal-100"
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
      className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${gradient} text-slate-800 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] hover:ring-indigo-100 ${pulse ? "animate-pulse" : ""}`}
    >
      <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
      <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="mb-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
              {title}
            </p>
            <p className="mb-0.5 text-5xl font-black tracking-tighter text-slate-800">
              {value}
            </p>
            <p className="text-xs font-bold text-slate-500/80">{subtitle}</p>
            {trend && (
              <div className="mt-4 flex items-center gap-1.5 text-[10px] font-black tracking-wider uppercase">
                <span className="rounded-full bg-white px-2 py-1 text-indigo-600 shadow-sm ring-1 ring-slate-100">
                  {trend.value}
                </span>
                <span className="text-slate-400">{trend.label}</span>
              </div>
            )}
          </div>
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-[1.25rem] ${iconBg} shadow-sm ring-2 ring-white/10 backdrop-blur-md`}
          >
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({ icon, title, description, link, gradient, iconBg }) {
  return (
    <a
      href={link}
      className={`group relative flex cursor-pointer items-center overflow-hidden rounded-[2rem] bg-gradient-to-br ${gradient} p-6 text-slate-800 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] hover:ring-indigo-100`}
    >
      <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      <div className="relative z-10 flex w-full items-center gap-5">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-[1.25rem] ${iconBg} shadow-sm ring-2 ring-white backdrop-blur-md transition-transform duration-500 group-hover:scale-110`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-black tracking-tight text-slate-800">
            {title}
          </h3>
          <p className="mt-0.5 text-xs font-bold tracking-widest text-slate-400 uppercase">
            {description}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 shadow-sm transition-all duration-300 group-hover:translate-x-1 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg">
          <ChevronRight className="h-6 w-6" />
        </div>
      </div>
    </a>
  );
}
