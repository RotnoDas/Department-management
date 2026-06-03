import { useState, useEffect } from "react";
import { Link } from "react-router";
import api from "../../api/axios";
import {
  User,
  Briefcase,
  Microscope,
  CalendarClock,
  Phone,
  DoorOpen,
  BookCopy,
  Zap,
  MessageSquare,
  Calendar,
  Files,
  CheckSquare,
  Users,
  Mail,
  Presentation,
  FileText,
  CheckCircle,
  MapPin,
  Sparkles,
} from "lucide-react";
import Loading from "../../components/Loading";

export default function TeacherDashboard() {
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [todayClasses, setTodayClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    Promise.all([
      api.get("/teacher/profile"),
      api.get("/teacher/courses"),
      api.get(`/teacher/today-classes?day=${today}`),
    ])
      .then(([profileRes, coursesRes, todayClassesRes]) => {
        setProfile(profileRes.data);
        setCourses(coursesRes.data);
        setTodayClasses(todayClassesRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading fullScreen text="Loading Dashboard..." />;

  // Group courses by semester
  const coursesBySemester = courses.reduce((acc, course) => {
    if (!acc[course.semester]) acc[course.semester] = [];
    acc[course.semester].push(course);
    return acc;
  }, {});

  return (
    <div className="page-transition space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="relative flex-1 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-sky-100 via-indigo-50 to-white p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-100">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-800">
                Faculty Dashboard
              </h1>
              <p className="mt-2 text-lg font-bold text-slate-400">
                CSE Department{" "}
                <span className="mx-1 text-indigo-600/50">•</span> Faculty
                Portal
              </p>
            </div>
            <Link
              to="/teacher/profile"
              className="group hidden h-12 items-center gap-2 rounded-2xl bg-white px-6 text-sm font-black text-indigo-600 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-indigo-600 hover:text-white hover:shadow-xl hover:shadow-indigo-100 sm:flex"
            >
              <User className="h-4 w-4" /> Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Banner - Introductory Card */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-sky-100 via-indigo-50 to-white p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-100">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/40 blur-3xl"></div>
        <div className="absolute bottom-0 left-10 -mb-10 h-40 w-40 rounded-full bg-indigo-100/50 blur-2xl"></div>

        <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row">
          <div className="group relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-[1.5rem] bg-white text-sky-600 shadow-xl ring-1 ring-slate-100 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
              <Presentation className="h-12 w-12" />
            </div>
            <div className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-lg ring-2 ring-white">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="mb-2 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <h2 className="text-3xl font-black tracking-tight text-slate-800">
                {profile?.name}
              </h2>
              {profile?.designation && (
                <span className="rounded-full bg-white/60 px-3 py-1 text-[10px] font-black tracking-widest text-sky-700 uppercase shadow-sm ring-1 ring-slate-200/50 backdrop-blur-sm">
                  {profile.designation}
                </span>
              )}
            </div>
            <p className="mb-5 flex items-center justify-center gap-2 text-sm font-bold text-slate-400 md:justify-start">
              <Mail className="h-4 w-4 opacity-50" />
              {profile?.email}
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
              <div className="rounded-xl bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md">
                <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                  Department ID
                </p>
                <p className="font-mono text-xs font-black text-slate-700">
                  {profile?.teacherId || "N/A"}
                </p>
              </div>
              <div className="rounded-xl bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md">
                <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                  Specialization
                </p>
                <p className="text-xs font-black text-indigo-600">
                  {profile?.specialization?.split(",")[0] || "General"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* Professional Details Grid */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                  Profile Information
                </h2>
                <p className="mt-1 text-2xl font-black tracking-tight text-slate-800">
                  Professional Details
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                [
                  Microscope,
                  "Specialization",
                  profile?.specialization || "Not set",
                  "bg-indigo-50 text-indigo-600 ring-indigo-100",
                ],
                [
                  CalendarClock,
                  "Joining Date",
                  profile?.joiningDate || "Not set",
                  "bg-sky-50 text-sky-600 ring-sky-100",
                ],
                [
                  Phone,
                  "Phone",
                  profile?.phone || "Not set",
                  "bg-emerald-50 text-emerald-600 ring-emerald-100",
                ],
                [
                  DoorOpen,
                  "Office Room",
                  profile?.officeRoom || "Not set",
                  "bg-purple-50 text-purple-600 ring-purple-100",
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

          {/* Assigned Courses dynamically loaded */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                  Academic Load
                </h2>
                <p className="mt-1 text-2xl font-black tracking-tight text-slate-800">
                  Assigned Courses
                </p>
              </div>
            </div>

            {courses.length === 0 ? (
              <div className="relative overflow-hidden rounded-[2.5rem] bg-white/50 p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-sky-50/50 opacity-60"></div>
                <div className="relative z-10 flex min-h-[250px] flex-col items-center justify-center">
                  <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-sky-100 p-6 shadow-inner ring-4 ring-white transition-transform duration-500 hover:scale-110">
                    <BookCopy className="h-12 w-12 text-indigo-500" />
                  </div>
                  <h3 className="mb-3 text-3xl font-black tracking-tight text-slate-800">
                    No Courses Assigned
                  </h3>
                  <p className="mx-auto max-w-sm text-base leading-relaxed font-medium text-slate-500">
                    You currently have no teaching assignments. Check back later
                    or contact the administrator.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                {Object.keys(coursesBySemester)
                  .sort((a, b) => a - b)
                  .map((semester) => (
                    <div
                      key={semester}
                      className="group relative overflow-hidden rounded-[2.5rem] bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-100 transition-all duration-300 hover:ring-indigo-100"
                    >
                      <div className="flex items-center justify-between border-b border-slate-50 bg-gradient-to-r from-slate-50/50 to-white px-8 py-6">
                        <h3 className="flex items-center gap-4 text-2xl font-black text-slate-800">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-inner ring-1 ring-indigo-100">
                            {semester}
                          </span>
                          Semester {semester}
                        </h3>
                        <div className="rounded-xl bg-slate-50 px-4 py-2 text-[10px] font-black tracking-widest text-slate-400 uppercase shadow-sm ring-1 ring-slate-100">
                          {coursesBySemester[semester].length} Courses
                        </div>
                      </div>
                      <div className="p-8">
                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                          {coursesBySemester[semester].map((course, i) => (
                            <div
                              key={i}
                              className="group/card relative flex flex-col overflow-hidden rounded-[2rem] bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5"
                            >
                              <div className="mb-5 flex items-start justify-between">
                                <span className="rounded-xl bg-indigo-50 px-3.5 py-2 font-mono text-xs font-black tracking-widest text-indigo-700 ring-1 ring-indigo-100/50 transition-all group-hover/card:bg-indigo-600 group-hover/card:text-white group-hover/card:shadow-lg group-hover/card:shadow-indigo-200">
                                  {course.courseCode}
                                </span>
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-inner ring-1 ring-emerald-100/50">
                                  <CheckCircle className="h-4 w-4" />
                                </div>
                              </div>
                              <h3 className="mb-8 text-xl leading-tight font-black text-slate-800 transition-colors group-hover/card:text-indigo-700">
                                {course.courseName}
                              </h3>
                              <div className="mt-auto flex flex-wrap gap-2 pt-2">
                                <button className="flex h-10 flex-1 items-center justify-center rounded-xl bg-emerald-50 text-[10px] font-black tracking-widest text-emerald-600 uppercase transition-all hover:bg-emerald-600 hover:text-white hover:shadow-lg">
                                  Attendance
                                </button>
                                <Link
                                  to={`/teacher/courses/${course.courseCode}/materials`}
                                  className="flex h-10 flex-1 items-center justify-center rounded-xl bg-sky-50 text-[10px] font-black tracking-widest text-sky-600 uppercase transition-all hover:bg-sky-600 hover:text-white hover:shadow-lg"
                                >
                                  Materials
                                </Link>
                                <Link
                                  to={`/teacher/assignments?course=${encodeURIComponent(course.courseCode)}`}
                                  className="flex h-10 flex-1 items-center justify-center rounded-xl bg-slate-900 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-indigo-600 hover:shadow-lg"
                                >
                                  Tasks
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Today's Classes */}
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
                      <span>Sem {cls.semester}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> Room {cls.room}
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

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="group relative overflow-hidden rounded-[2rem] bg-indigo-50 p-6 text-center shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-indigo-100 transition-all hover:-translate-y-1 hover:shadow-lg">
              <Presentation className="mx-auto mb-3 h-8 w-8 text-indigo-600 transition-transform group-hover:scale-110" />
              <div className="text-3xl font-black tracking-tight text-indigo-700">
                {courses.length}
              </div>
              <div className="text-[9px] font-black tracking-widest text-indigo-600/60 uppercase">
                Total Courses
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-[2rem] bg-emerald-50 p-6 text-center shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-emerald-100 transition-all hover:-translate-y-1 hover:shadow-lg">
              <Users className="mx-auto mb-3 h-8 w-8 text-emerald-600 transition-transform group-hover:scale-110" />
              <div className="text-3xl font-black tracking-tight text-emerald-700">
                —
              </div>
              <div className="text-[9px] font-black tracking-widest text-emerald-600/60 uppercase">
                Advisees
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-100">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 shadow-inner ring-1 ring-teal-100">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-slate-800">
                  Quick Actions
                </h3>
                <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                  Faculty Tools
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {[
                [
                  MessageSquare,
                  "Post Announcement",
                  "text-sky-500",
                  "bg-sky-50",
                ],
                [Calendar, "View Schedule", "text-indigo-500", "bg-indigo-50"],
                [Files, "Manage Resources", "text-teal-500", "bg-teal-50"],
                [CheckSquare, "Leave Requests", "text-rose-500", "bg-rose-50"],
              ].map(([Icon, label, color, bg], i) => (
                <button
                  key={i}
                  className="group flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all hover:bg-slate-50 hover:shadow-sm"
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg} ${color} shadow-sm ring-1 ring-white transition-transform group-hover:scale-110`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-black tracking-wide text-slate-600 uppercase transition-colors group-hover:text-slate-900">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
