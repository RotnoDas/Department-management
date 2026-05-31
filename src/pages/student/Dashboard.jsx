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
} from "lucide-react";
import Loading from "../../components/Loading";

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/student/profile"), api.get("/student/courses")])
      .then(([profileRes, coursesRes]) => {
        setProfile(profileRes.data);
        setAssignedCourses(coursesRes.data);
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
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            My Dashboard
          </h1>
          <p className="text-base-content/60 mt-1">
            Welcome back to your student portal
          </p>
        </div>
        <Link
          to="/student/profile"
          className="btn btn-primary shadow-lg transition-all hover:shadow-xl"
        >
          <User className="mr-2 inline h-4 w-4" /> Edit Profile
        </Link>
      </div>

      {/* Welcome banner */}
      <div className="card relative overflow-hidden border border-indigo-200/50 bg-gradient-to-br from-indigo-100 via-blue-50 to-cyan-100 text-slate-900 shadow-xl">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-40 w-40 rounded-full bg-white opacity-60 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-indigo-200 opacity-40 blur-2xl"></div>
        <div className="card-body relative z-10 flex-col items-center gap-6 p-8 sm:flex-row">
          <div className="avatar placeholder rounded-full bg-white p-2 shadow-xl ring-4 ring-white">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600 text-white">
              <GraduationCap className="h-10 w-10" />
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="mb-1 text-3xl font-bold">
              Welcome, {profile?.name}!
            </h2>
            <p className="mb-3 font-semibold text-slate-600">
              {profile?.email}
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
              <span className="badge rounded-xl border-indigo-200 bg-white px-4 py-3 font-bold text-indigo-700 shadow-sm">
                Batch {profile?.batch || "N/A"}
              </span>
              <span className="badge rounded-xl border-cyan-200 bg-white px-4 py-3 font-bold text-cyan-700 shadow-sm">
                Semester {profile?.semester || "N/A"}
              </span>
              {profile?.studentId && (
                <span className="badge rounded-xl border-slate-200 bg-white px-4 py-3 font-mono font-bold text-slate-700 shadow-sm">
                  ID: {profile.studentId}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* Info grid */}
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <BookOpen className="text-primary h-6 w-6" /> Academic Info
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                [
                  IdCard,
                  "Roll",
                  profile?.studentId || "Not set",
                  "bg-blue-100 text-blue-600",
                ],
                [
                  CalendarDays,
                  "Session",
                  profile?.batch || "Not set",
                  "bg-purple-100 text-purple-600",
                ],
                [
                  Droplet,
                  "Blood Group",
                  profile?.bloodGroup || "Not set",
                  "bg-red-100 text-red-600",
                ],
                [
                  Phone,
                  "Phone",
                  profile?.phone || "Not set",
                  "bg-green-100 text-green-600",
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

          {/* Coursework Section */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <Library className="text-primary h-6 w-6" /> Current Coursework
              </h2>
              <span className="badge badge-primary badge-outline font-semibold">
                Semester {profile?.semester}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {semesterCourses.length > 0 ? (
                semesterCourses.map((course) => {
                  const assignedData = assignedCourses.find(
                    (c) => c.courseCode === course.code,
                  );
                  const teacherName =
                    assignedData?.teacherName || "Pending Assignment";

                  return (
                    <div
                      key={course.code}
                      className="card bg-base-100 border-base-200 card-hover group flex flex-col overflow-hidden border shadow-sm"
                    >
                      <div className="from-primary/50 to-secondary/50 group-hover:from-primary group-hover:to-secondary h-2 w-full bg-gradient-to-r transition-all"></div>
                      <div className="card-body flex-1 p-5">
                        <div className="mb-2 flex items-start justify-between">
                          <div className="badge badge-primary badge-sm font-mono tracking-wider shadow-sm">
                            {course.code}
                          </div>
                          <div className="text-base-content/70 bg-base-200 flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold">
                            <Star className="text-warning fill-warning h-3 w-3" />{" "}
                            {course.credits} Cr
                          </div>
                        </div>
                        <h3
                          className="mb-3 text-lg leading-tight font-bold"
                          title={course.title}
                        >
                          {course.title}
                        </h3>
                        <div className="mb-4">
                          <p className="text-base-content/40 mb-1 text-xs font-semibold tracking-wider uppercase">
                            Assigned Faculty
                          </p>
                          <div className="flex items-center gap-2">
                            <User
                              className={`h-4 w-4 ${assignedData?.teacherName ? "text-primary" : "text-base-content/30"}`}
                            />
                            <span
                              className={`text-sm font-medium ${!assignedData?.teacherName ? "text-base-content/40 italic" : "text-base-content/80"}`}
                            >
                              {teacherName}
                            </span>
                          </div>
                        </div>
                        <div className="border-base-200/50 mt-auto flex gap-2 border-t pt-4">
                          <Link
                            to={`/student/courses/${course.code}/materials`}
                            className="btn btn-sm btn-outline hover:bg-primary hover:border-primary flex-1 transition-colors hover:text-white"
                          >
                            <ExternalLink className="mr-1 inline h-4 w-4" />{" "}
                            Resources
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="card bg-base-100 border-base-200 col-span-full border-2 border-dashed py-12 text-center">
                  <Library className="text-base-content/30 mx-auto mb-3 h-12 w-12" />
                  <h3 className="text-lg font-bold">No Coursework Found</h3>
                  <p className="text-base-content/50 mx-auto mt-2 max-w-sm">
                    Looks like your courses for this semester haven't been
                    assigned yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* CGPA Widget */}
          <div className="card bg-base-100 border-base-200 card-hover relative overflow-hidden border shadow-md">
            <div className="bg-primary/10 absolute -top-10 -right-10 h-32 w-32 rounded-full blur-2xl"></div>
            <div className="card-body relative z-10">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-bold">
                  <Target className="text-secondary h-6 w-6" /> Performance
                </h3>
              </div>

              <div className="flex flex-col items-center justify-center py-4">
                <div
                  className="radial-progress text-primary bg-base-200 border-base-100 border-4 text-2xl font-bold shadow-inner"
                  style={{
                    "--value": ((profile?.cgpa || 0) / 4) * 100,
                    "--size": "8rem",
                    "--thickness": "12px",
                  }}
                >
                  {profile?.cgpa > 0 ? profile.cgpa.toFixed(2) : "N/A"}
                </div>
                <p className="text-base-content/60 mt-4 text-sm font-medium tracking-wider uppercase">
                  Overall CGPA
                </p>
                <p className="text-base-content/40 mt-1 text-xs">Out of 4.00</p>
              </div>

              {profile?.cgpa > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="text-base-content/60 flex justify-between text-xs">
                    <span>Target: 4.00</span>
                    <span>
                      {((profile.cgpa / 4) * 100).toFixed(0)}% Achieved
                    </span>
                  </div>
                  <progress
                    className="progress progress-primary w-full"
                    value={profile.cgpa}
                    max="4.0"
                  ></progress>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions (Dummy) */}
          <div className="card bg-base-100 border-base-200 border shadow-md">
            <div className="card-body p-5">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
                <Zap className="text-accent h-6 w-6" /> Quick Links
              </h3>
              <div className="space-y-2">
                <Link
                  to="/student/attendance"
                  className="btn btn-ghost hover:bg-base-200 w-full justify-start text-left font-medium"
                >
                  <BarChart3 className="text-primary mr-3 inline h-5 w-5" />{" "}
                  View Attendance
                </Link>
                <button className="btn btn-ghost hover:bg-base-200 w-full justify-start text-left font-medium">
                  <FileText className="text-secondary mr-3 inline h-5 w-5" />{" "}
                  Request Transcript
                </button>
                <button className="btn btn-ghost hover:bg-base-200 w-full justify-start text-left font-medium">
                  <Calendar className="text-accent mr-3 inline h-5 w-5" />{" "}
                  Academic Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
