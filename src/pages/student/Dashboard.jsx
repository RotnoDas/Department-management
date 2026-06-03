import { useState, useEffect } from "react";
import { Link } from "react-router";
import api from "../../api/axios";
import { SEMESTER_COURSES } from "../../data/courses";
import {
  User,
  BookOpen,
  IdCard,
  CalendarDays,
  Droplet,
  Phone,
  Target,
  Zap,
  BarChart3,
  FileText,
  Calendar,
  Library,
  Star,
  ExternalLink,
  GraduationCap,
  Upload,
  CalendarClock,
  CheckCircle,
  Mail,
  ShieldCheck,
  Sparkles,
  MapPin,
  ChevronRight,
} from "lucide-react";
import Loading from "../../components/Loading";

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [todayClasses, setTodayClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    Promise.all([
      api.get("/student/profile"),
      api.get("/student/courses"),
      api.get(`/student/today-classes?day=${today}`),
    ])
      .then(([profileRes, coursesRes, todayRes]) => {
        setProfile(profileRes.data);
        setAssignedCourses(coursesRes.data);
        setTodayClasses(todayRes.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading fullScreen text="Loading Dashboard..." />;

  const semesterCourses = SEMESTER_COURSES[profile?.semester] || [];

  return (
    <div className="page-transition space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="relative flex-1 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-sky-100 via-indigo-50 to-white p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-100">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-800">
                My Dashboard
              </h1>
              <p className="mt-2 text-lg font-bold text-slate-400">
                CSE Department{" "}
                <span className="mx-1 text-indigo-600/50">•</span> Student
                Portal
              </p>
            </div>
            <Link
              to="/student/profile"
              className="group hidden h-12 items-center gap-2 rounded-2xl bg-white px-6 text-sm font-black text-indigo-600 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-indigo-600 hover:text-white hover:shadow-xl hover:shadow-indigo-100 sm:flex"
            >
              <User className="h-4 w-4" /> Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-sky-100 via-indigo-50 to-white p-8 text-slate-800 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-100">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-white/40 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-indigo-100/50 blur-2xl"></div>
        <div className="relative z-10 flex flex-col items-center gap-8 sm:flex-row">
          <div className="group relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-[1.5rem] bg-white text-indigo-600 shadow-xl ring-1 ring-slate-100 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
              <GraduationCap className="h-12 w-12" />
            </div>
            <div className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-lg ring-2 ring-white">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="text-center sm:text-left">
            <div className="mb-2 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <h2 className="text-3xl font-black tracking-tight text-slate-800">
                Welcome, {profile?.name}!
              </h2>
              <span className="rounded-full bg-white/60 px-3 py-1 text-[10px] font-black tracking-widest text-indigo-600 uppercase shadow-sm ring-1 ring-slate-200/50 backdrop-blur-sm">
                Verified
              </span>
            </div>
            <p className="mb-5 flex items-center justify-center gap-2 text-sm font-bold text-slate-400 sm:justify-start">
              <Mail className="h-4 w-4 opacity-50" />
              {profile?.email}
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
              <div className="rounded-xl bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md">
                <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                  Batch
                </p>
                <p className="text-xs font-black text-indigo-600">
                  {profile?.batch || "N/A"}
                </p>
              </div>
              <div className="rounded-xl bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md">
                <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                  Level
                </p>
                <p className="text-xs font-black text-cyan-600">
                  Semester {profile?.semester || "N/A"}
                </p>
              </div>
              {profile?.studentId && (
                <div className="rounded-xl bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md">
                  <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                    Student ID
                  </p>
                  <p className="font-mono text-xs font-black text-slate-700">
                    {profile.studentId}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* Info grid */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                  Profile Overview
                </h2>
                <p className="mt-1 text-2xl font-black tracking-tight text-slate-800">
                  Academic Info
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                [
                  IdCard,
                  "Roll",
                  profile?.studentId || "Not set",
                  "bg-blue-50 text-blue-600 ring-blue-100",
                ],
                [
                  CalendarDays,
                  "Session",
                  profile?.batch || "Not set",
                  "bg-purple-50 text-purple-600 ring-purple-100",
                ],
                [
                  Droplet,
                  "Blood Group",
                  profile?.bloodGroup || "Not set",
                  "bg-rose-50 text-rose-600 ring-rose-100",
                ],
                [
                  Phone,
                  "Phone",
                  profile?.phone || "Not set",
                  "bg-emerald-50 text-emerald-600 ring-emerald-100",
                ],
              ].map(([Icon, label, val, colorClass], idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-indigo-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <div className="relative z-10 flex items-center gap-5">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.25rem] shadow-sm ring-1 transition-all duration-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-200 ${colorClass}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                        {label}
                      </p>
                      <p className="mt-0.5 text-base font-black text-slate-700 transition-colors group-hover:text-indigo-700">
                        {val}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coursework Section */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                  Academic Load
                </h2>
                <p className="mt-1 text-2xl font-black tracking-tight text-slate-800">
                  Current Coursework
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-2 text-[10px] font-black tracking-widest text-slate-400 uppercase shadow-sm ring-1 ring-slate-100">
                Semester {profile?.semester}
              </div>
            </div>

            {semesterCourses.length === 0 ? (
              <div className="relative overflow-hidden rounded-[3rem] bg-white/50 p-20 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-sky-50/50 opacity-60"></div>
                <div className="relative z-10 flex min-h-[250px] flex-col items-center justify-center">
                  <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-sky-100 p-6 shadow-inner ring-4 ring-white transition-transform duration-500 hover:scale-110">
                    <Library className="h-12 w-12 text-indigo-500" />
                  </div>
                  <h3 className="mb-3 text-3xl font-black tracking-tight text-slate-800">
                    No Coursework Found
                  </h3>
                  <p className="mx-auto max-w-sm text-lg leading-relaxed font-bold text-slate-400">
                    It looks like your courses for this semester haven't been
                    assigned yet.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {semesterCourses.map((course) => {
                  const assignedData = assignedCourses.find(
                    (c) => c.courseCode === course.code,
                  );
                  const teacherName =
                    assignedData?.teacherName || "Pending Assignment";

                  return (
                    <div
                      key={course.code}
                      className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:ring-indigo-100"
                    >
                      <div className="relative z-10 flex flex-1 flex-col">
                        <div className="mb-5 flex items-start justify-between">
                          <div className="inline-flex items-center rounded-xl bg-indigo-50 px-3 py-1.5 ring-1 ring-indigo-100/50 transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-200">
                            <span className="font-mono text-xs font-black tracking-widest uppercase">
                              {course.code}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 ring-1 ring-slate-100">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-[10px] font-black text-slate-600">
                              {course.credits} Cr
                            </span>
                          </div>
                        </div>

                        <h3 className="mb-8 text-xl leading-tight font-black text-slate-800 transition-colors group-hover:text-indigo-700">
                          {course.title}
                        </h3>

                        <div className="mb-6 flex flex-col gap-2 px-1">
                          <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                            Faculty
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 ring-1 ring-slate-100 transition-all group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-sm">
                              <User className="h-4 w-4" />
                            </div>
                            <span
                              className={`truncate text-sm font-black transition-colors ${!assignedData?.teacherName ? "font-medium text-slate-300 italic" : "text-slate-600 group-hover:text-indigo-700"}`}
                            >
                              {teacherName}
                            </span>
                          </div>
                        </div>

                        <div className="mt-auto flex gap-3 border-t border-slate-50 pt-6">
                          <Link
                            to={`/student/courses/${course.code}/materials`}
                            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-50 text-[10px] font-black tracking-widest text-slate-600 uppercase transition-all hover:bg-white hover:text-indigo-600 hover:shadow-md hover:ring-1 hover:ring-indigo-100"
                          >
                            <ExternalLink className="h-4 w-4" /> Resources
                          </Link>
                          <Link
                            to={`/student/courses/${course.code}/assignments`}
                            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-slate-200 transition-all hover:bg-indigo-600 hover:shadow-indigo-100"
                          >
                            <Upload className="h-4 w-4" /> Tasks
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Today's Classes Widget */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-100">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 shadow-inner ring-1 ring-sky-100">
                <CalendarClock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-slate-800">
                  Today's Classes
                </h3>
                <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                  Daily Schedule
                </p>
              </div>
            </div>

            {todayClasses.length > 0 ? (
              <div className="space-y-3">
                {todayClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="group relative flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-white hover:shadow-md hover:ring-1 hover:ring-sky-100"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-slate-800">
                        {cls.courseCode}
                      </span>
                      <span className="rounded-lg bg-white px-3 py-1.5 text-xs font-black text-sky-600 shadow-sm ring-1 ring-sky-100 transition-all group-hover:bg-sky-600 group-hover:text-white">
                        {cls.timeSlot.split(" - ")[0]}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold tracking-wide text-slate-400 uppercase">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> Room{" "}
                          {cls.room || "TBA"}
                        </span>
                      </div>
                      <span className="text-[9px] font-medium lowercase italic opacity-70">
                        Faculty Assigned
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-slate-100 py-8 text-center">
                <p className="text-[11px] font-black tracking-widest text-slate-300 uppercase">
                  No classes today
                </p>
              </div>
            )}
          </div>

          {/* Performance Widget */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-100">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner ring-1 ring-indigo-100">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-slate-800">
                  Performance
                </h3>
                <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                  Academic Progress
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative flex h-40 w-40 items-center justify-center">
                <svg className="h-full w-full -rotate-90 transform">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-slate-50"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={440}
                    strokeDashoffset={440 - 440 * ((profile?.cgpa || 0) / 4)}
                    strokeLinecap="round"
                    className="text-indigo-600 transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-4xl font-black tracking-tighter text-slate-800">
                    {profile?.cgpa > 0 ? profile.cgpa.toFixed(2) : "N/A"}
                  </span>
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    CGPA
                  </span>
                </div>
              </div>

              {profile?.cgpa > 0 && (
                <div className="mt-8 w-full space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Current Standing
                    </span>
                    <span className="text-xs font-black text-indigo-600">
                      {((profile.cgpa / 4) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-50 shadow-inner ring-1 ring-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-1000"
                      style={{ width: `${(profile.cgpa / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-100">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 shadow-inner ring-1 ring-teal-100">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-slate-800">
                  Quick Links
                </h3>
                <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                  Student Tools
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {[
                {
                  label: "View Attendance",
                  icon: BarChart3,
                  color: "text-indigo-500",
                  bg: "bg-indigo-50",
                  to: "/student/attendance",
                },
                {
                  label: "Request Transcript",
                  icon: FileText,
                  color: "text-sky-500",
                  bg: "bg-sky-50",
                },
                {
                  label: "Academic Calendar",
                  icon: Calendar,
                  color: "text-teal-500",
                  bg: "bg-teal-50",
                },
              ].map((link, i) => (
                <Link
                  key={i}
                  to={link.to || "#"}
                  className="group flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all hover:bg-slate-50 hover:shadow-sm"
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${link.bg} ${link.color} shadow-sm ring-1 ring-white transition-transform group-hover:scale-110`}
                  >
                    <link.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-black tracking-wide text-slate-600 uppercase transition-colors group-hover:text-slate-900">
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
