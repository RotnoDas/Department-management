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
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Faculty Dashboard
          </h1>
          <p className="text-base-content/60 mt-1">
            CSE Department — Faculty Portal
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/teacher/profile"
            className="btn btn-info text-info-content shadow-lg transition-all hover:shadow-xl"
          >
            <User className="mr-2 inline h-4 w-4" /> Edit Profile
          </Link>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="card relative overflow-hidden border border-cyan-200/50 bg-gradient-to-br from-cyan-100 via-sky-50 to-blue-100 text-slate-900 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-48 w-48 rounded-full bg-white opacity-60 blur-3xl"></div>
        <div className="absolute bottom-0 left-10 -mb-10 h-40 w-40 rounded-full bg-sky-200 opacity-40 blur-2xl"></div>

        <div className="card-body relative z-10 flex-col items-center gap-8 p-8 md:flex-row">
          <div className="avatar placeholder rounded-full bg-white p-2 shadow-xl ring-4 ring-white transition-transform hover:scale-105">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-sky-600 text-white">
              <Presentation className="h-12 w-12" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="mb-2 flex flex-col gap-3 md:flex-row md:items-center">
              <h2 className="text-3xl font-bold">{profile?.name}</h2>
              {profile?.designation && (
                <span className="badge rounded-lg border-sky-200 bg-white px-4 py-3 font-bold text-sky-700 shadow-sm">
                  {profile.designation}
                </span>
              )}
            </div>
            <p className="mb-4 flex items-center justify-center gap-2 font-semibold text-slate-600 md:justify-start">
              <Mail className="h-5 w-5 text-sky-600" />
              {profile?.email}
            </p>

            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 shadow-sm">
                <span className="text-sm font-semibold text-slate-500">
                  ID:
                </span>
                <span className="font-mono font-bold tracking-wider text-slate-800">
                  {profile?.teacherId || "N/A"}
                </span>
              </div>
              {profile?.officeRoom && (
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 shadow-sm">
                  <span className="text-sm font-semibold text-slate-500">
                    Room:
                  </span>
                  <span className="font-bold text-slate-800">
                    {profile.officeRoom}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* Professional Details Grid */}
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <Briefcase className="text-info h-6 w-6" /> Professional Details
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                [
                  Microscope,
                  "Specialization",
                  profile?.specialization || "Not set",
                  "bg-purple-100 text-purple-600",
                ],
                [
                  CalendarClock,
                  "Joining Date",
                  profile?.joiningDate || "Not set",
                  "bg-emerald-100 text-emerald-600",
                ],
                [
                  Phone,
                  "Phone",
                  profile?.phone || "Not set",
                  "bg-amber-100 text-amber-600",
                ],
                [
                  DoorOpen,
                  "Office Room",
                  profile?.officeRoom || "Not set",
                  "bg-cyan-100 text-cyan-600",
                ],
              ].map(([Icon, label, val, colorClass], idx) => (
                <div
                  key={idx}
                  className="card bg-base-100 border-base-200 card-hover border shadow-sm"
                >
                  <div className="card-body flex-row items-center gap-4 p-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner ${colorClass}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-base-content/60 text-xs font-medium tracking-wider uppercase">
                        {label}
                      </p>
                      <p className="text-base font-semibold">{val}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Courses dynamically loaded */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800">
                <BookCopy className="h-7 w-7 text-sky-600" /> Assigned Courses
              </h2>
            </div>

            {courses.length === 0 ? (
              <div className="card group relative overflow-hidden border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-50 to-white"></div>
                <div className="card-body relative z-10 items-center">
                  <div className="mb-4 rounded-full bg-slate-100 p-5 shadow-inner ring-4 ring-slate-50 transition-all duration-300 group-hover:scale-110">
                    <BookCopy className="h-12 w-12 animate-pulse text-sky-400" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-slate-700">
                    No Courses Assigned Yet
                  </h3>
                  <p className="mx-auto max-w-md leading-relaxed text-slate-500">
                    You currently have no courses assigned to your profile for
                    this semester. Please check back later or contact the
                    department administrator if you believe this is an error.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.keys(coursesBySemester)
                  .sort((a, b) => a - b)
                  .map((semester) => (
                    <div
                      key={semester}
                      className="card overflow-hidden border border-slate-200 bg-white shadow-md"
                    >
                      <div className="flex items-center justify-between border-b border-sky-100 bg-gradient-to-r from-sky-50 to-white px-6 py-4">
                        <h3 className="flex items-center gap-3 text-lg font-bold text-slate-800">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-white shadow-md">
                            {semester}
                          </span>
                          Semester {semester}
                        </h3>
                        <span className="badge badge-ghost font-semibold text-slate-500">
                          {coursesBySemester[semester].length} Courses
                        </span>
                      </div>
                      <div className="bg-slate-50/50 p-6">
                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                          {coursesBySemester[semester].map((course, i) => (
                            <div
                              key={i}
                              className="card group border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                            >
                              <div className="h-2 w-full rounded-t-2xl bg-gradient-to-r from-sky-400 to-blue-500"></div>
                              <div className="card-body p-6">
                                <div className="mb-4 flex items-start justify-between">
                                  <span className="badge rounded-lg border-0 bg-sky-100 px-3 py-3 font-mono font-bold tracking-wide text-sky-800 shadow-sm">
                                    {course.courseCode}
                                  </span>
                                </div>
                                <h3 className="mb-6 text-xl leading-snug font-bold text-slate-800">
                                  {course.courseName}
                                </h3>
                                <div className="mt-auto flex flex-wrap gap-3">
                                  <button className="btn btn-sm flex-1 border-0 bg-sky-50 text-sky-700 shadow-sm transition-colors hover:bg-sky-600 hover:text-white">
                                    <CheckSquare className="mr-1 h-4 w-4" />{" "}
                                    Attendance
                                  </button>
                                  <Link
                                    to={`/teacher/courses/${course.courseCode}/materials`}
                                    className="btn btn-sm flex-1 border-0 bg-slate-50 text-slate-600 shadow-sm transition-colors hover:bg-slate-200"
                                  >
                                    <Files className="mr-1 h-4 w-4" /> Materials
                                  </Link>
                                  <Link
                                    to={`/teacher/assignments?course=${encodeURIComponent(course.courseCode)}`}
                                    className="btn btn-sm flex-1 border-0 bg-indigo-50 text-indigo-700 shadow-sm transition-colors hover:bg-indigo-600 hover:text-white"
                                  >
                                    <FileText className="mr-1 h-4 w-4" />{" "}
                                    Assignments
                                  </Link>
                                </div>
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
          <div className="card bg-base-100 border-base-200 border shadow-md">
            <div className="card-body p-5">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
                <CalendarClock className="text-secondary h-6 w-6" /> Today's
                Classes
              </h3>
              {todayClasses.length > 0 ? (
                <div className="space-y-3">
                  {todayClasses.map((cls) => (
                    <div
                      key={cls.id}
                      className="border-info bg-base-200/50 flex flex-col gap-1 rounded-r-lg border-l-4 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold">
                          {cls.courseCode}
                        </span>
                        <span className="badge badge-sm badge-info badge-outline">
                          {cls.timeSlot}
                        </span>
                      </div>
                      <div className="text-base-content/70 flex justify-between text-xs">
                        <span>Sem: {cls.semester}</span>
                        <span>Room: {cls.room}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-base-200/50 rounded-lg py-4 text-center">
                  <p className="text-base-content/60 text-sm font-medium">
                    No classes today.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card bg-base-100 border-base-200 card-hover border py-6 text-center shadow-sm">
              <Presentation className="text-info mx-auto mb-2 h-8 w-8 opacity-80" />
              <div className="text-info mb-1 text-3xl font-bold">
                {courses.length}
              </div>
              <div className="text-base-content/60 text-xs font-semibold tracking-wide uppercase">
                Total Courses
              </div>
            </div>
            <div className="card bg-base-100 border-base-200 card-hover border py-6 text-center shadow-sm">
              <Users className="text-success mx-auto mb-2 h-8 w-8 opacity-80" />
              <div className="text-success mb-1 text-3xl font-bold">~</div>
              <div className="text-base-content/60 text-xs font-semibold tracking-wide uppercase">
                Advisees
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card bg-base-100 border-base-200 border shadow-md">
            <div className="card-body p-5">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
                <Zap className="text-accent h-6 w-6" /> Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="btn btn-ghost hover:bg-base-200 w-full justify-start text-left font-medium">
                  <MessageSquare className="text-info mr-3 inline h-5 w-5" />{" "}
                  Post Announcement
                </button>
                <button className="btn btn-ghost hover:bg-base-200 w-full justify-start text-left font-medium">
                  <Calendar className="text-secondary mr-3 inline h-5 w-5" />{" "}
                  View Schedule
                </button>
                <button className="btn btn-ghost hover:bg-base-200 w-full justify-start text-left font-medium">
                  <Files className="text-accent mr-3 inline h-5 w-5" /> Manage
                  Resources
                </button>
                <button className="btn btn-ghost hover:bg-base-200 w-full justify-start text-left font-medium">
                  <CheckSquare className="text-success mr-3 inline h-5 w-5" />{" "}
                  Leave Requests
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
