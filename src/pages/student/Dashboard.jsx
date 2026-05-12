import { useState, useEffect } from "react";
import { Link } from "react-router";
import api from "../../api/axios";
import { SEMESTER_COURSES } from "../../data/courses";
import { 
  User, BookOpen, IdCard, CalendarDays, Droplet, Phone, Target, Zap, 
  BarChart3, FileText, Calendar, Library, Star, ExternalLink, GraduationCap
} from "lucide-react";
import Loading from "../../components/Loading";

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/student/profile")
      .then((r) => setProfile(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading fullScreen text="Loading Dashboard..." />;

  const semesterCourses = SEMESTER_COURSES[profile?.semester] || [];

  return (
    <div className="space-y-8 page-transition pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">My Dashboard</h1>
          <p className="text-base-content/60 mt-1">
            Welcome back to your student portal
          </p>
        </div>
        <Link to="/student/profile" className="btn btn-primary shadow-lg hover:shadow-xl transition-all">
          <User className="w-4 h-4 mr-2 inline" /> Edit Profile
        </Link>
      </div>

      {/* Welcome banner */}
      <div className="card bg-gradient-to-br from-indigo-100 via-blue-50 to-cyan-100 border border-indigo-200/50 text-slate-900 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-white opacity-60 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-indigo-200 opacity-40 rounded-full blur-2xl"></div>
        <div className="card-body flex-col sm:flex-row items-center gap-6 relative z-10 p-8">
          <div className="avatar placeholder ring-4 ring-white shadow-xl rounded-full bg-white p-2">
            <div className="bg-indigo-600 text-white h-20 w-20 rounded-full flex items-center justify-center">
              <GraduationCap className="w-10 h-10" />
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold mb-1">Welcome, {profile?.name}!</h2>
            <p className="text-slate-600 font-semibold mb-3">{profile?.email}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-3">
              <span className="badge border-indigo-200 bg-white text-indigo-700 px-4 py-3 rounded-xl font-bold shadow-sm">
                Batch {profile?.batch || "N/A"}
              </span>
              <span className="badge border-cyan-200 bg-white text-cyan-700 px-4 py-3 rounded-xl font-bold shadow-sm">
                Semester {profile?.semester || "N/A"}
              </span>
              {profile?.studentId && (
                <span className="badge border-slate-200 bg-white text-slate-700 px-4 py-3 rounded-xl font-mono font-bold shadow-sm">
                  ID: {profile.studentId}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Info grid */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="text-primary w-6 h-6" /> Academic Info
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                [IdCard, "Roll", profile?.studentId || "Not set", "bg-blue-100 text-blue-600"],
                [CalendarDays, "Session", profile?.batch || "Not set", "bg-purple-100 text-purple-600"],
                [Droplet, "Blood Group", profile?.bloodGroup || "Not set", "bg-red-100 text-red-600"],
                [Phone, "Phone", profile?.phone || "Not set", "bg-green-100 text-green-600"],
              ].map(([Icon, label, val, colorClass], idx) => (
                <div key={idx} className="card bg-base-100 shadow-sm border border-base-200 card-hover">
                  <div className="card-body flex-row items-center gap-4 p-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${colorClass}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-base-content/60 text-xs font-medium uppercase tracking-wider">{label}</p>
                      <p className="text-base font-semibold">{val}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coursework Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Library className="text-primary w-6 h-6" /> Current Coursework
              </h2>
              <span className="badge badge-primary badge-outline font-semibold">
                Semester {profile?.semester}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {semesterCourses.length > 0 ? (
                semesterCourses.map((course) => (
                  <div
                    key={course.code}
                    className="card bg-base-100 border border-base-200 card-hover shadow-sm overflow-hidden group"
                  >
                    <div className="h-2 w-full bg-gradient-to-r from-primary/50 to-secondary/50 group-hover:from-primary group-hover:to-secondary transition-all"></div>
                    <div className="card-body p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div className="badge badge-primary badge-sm font-mono tracking-wider shadow-sm">
                          {course.code}
                        </div>
                        <div className="flex items-center gap-1 text-xs font-semibold text-base-content/70 bg-base-200 px-2 py-1 rounded-md">
                          <Star className="w-3 h-3 text-warning fill-warning" /> {course.credits} Cr
                        </div>
                      </div>
                      <h3 className="text-lg leading-tight font-bold mb-4 line-clamp-2" title={course.title}>
                        {course.title}
                      </h3>
                      <div className="mt-auto flex gap-2">
                        <button className="btn btn-sm btn-outline flex-1 hover:bg-primary hover:text-white hover:border-primary transition-colors">
                          <ExternalLink className="w-4 h-4 mr-1 inline" /> Resources
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card bg-base-100 border-base-200 col-span-full border-2 border-dashed py-12 text-center">
                  <Library className="w-12 h-12 mx-auto text-base-content/30 mb-3" />
                  <h3 className="text-lg font-bold">No Coursework Found</h3>
                  <p className="text-base-content/50 max-w-sm mx-auto mt-2">
                    Looks like your courses for this semester haven't been assigned yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* CGPA Widget */}
          <div className="card bg-base-100 shadow-md border border-base-200 card-hover relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
            <div className="card-body relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Target className="text-secondary w-6 h-6" /> Performance
                </h3>
              </div>
              
              <div className="flex flex-col items-center justify-center py-4">
                <div className="radial-progress text-primary font-bold text-2xl shadow-inner bg-base-200 border-4 border-base-100" 
                     style={{ "--value": ((profile?.cgpa || 0) / 4) * 100, "--size": "8rem", "--thickness": "12px" }}>
                  {profile?.cgpa > 0 ? profile.cgpa.toFixed(2) : "N/A"}
                </div>
                <p className="text-base-content/60 mt-4 text-sm font-medium uppercase tracking-wider">Overall CGPA</p>
                <p className="text-xs text-base-content/40 mt-1">Out of 4.00</p>
              </div>

              {profile?.cgpa > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs text-base-content/60">
                    <span>Target: 4.00</span>
                    <span>{(((profile.cgpa) / 4) * 100).toFixed(0)}% Achieved</span>
                  </div>
                  <progress className="progress progress-primary w-full" value={profile.cgpa} max="4.0"></progress>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions (Dummy) */}
          <div className="card bg-base-100 shadow-md border border-base-200">
            <div className="card-body p-5">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Zap className="text-accent w-6 h-6" /> Quick Links
              </h3>
              <div className="space-y-2">
                <Link to="/student/attendance" className="btn btn-ghost w-full justify-start text-left font-medium hover:bg-base-200">
                  <BarChart3 className="w-5 h-5 mr-3 text-primary inline" /> View Attendance
                </Link>
                <button className="btn btn-ghost w-full justify-start text-left font-medium hover:bg-base-200">
                  <FileText className="w-5 h-5 mr-3 text-secondary inline" /> Request Transcript
                </button>
                <button className="btn btn-ghost w-full justify-start text-left font-medium hover:bg-base-200">
                  <Calendar className="w-5 h-5 mr-3 text-accent inline" /> Academic Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
