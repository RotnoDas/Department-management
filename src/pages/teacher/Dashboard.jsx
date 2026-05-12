import { useState, useEffect } from "react";
import { Link } from "react-router";
import api from "../../api/axios";
import { 
  User, Briefcase, Microscope, CalendarClock, Phone, DoorOpen, 
  BookCopy, Zap, MessageSquare, Calendar, Files, CheckSquare, Clock, Users, Mail, Presentation
} from "lucide-react";
import Loading from "../../components/Loading";

export default function TeacherDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/teacher/profile")
      .then((r) => setProfile(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading fullScreen text="Loading Dashboard..." />;

  return (
    <div className="space-y-8 page-transition pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Faculty Dashboard</h1>
          <p className="text-base-content/60 mt-1">
            CSE Department — Faculty Portal
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/teacher/profile" className="btn btn-info shadow-lg hover:shadow-xl transition-all text-info-content">
            <User className="w-4 h-4 mr-2 inline" /> Edit Profile
          </Link>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="card bg-gradient-to-br from-cyan-100 via-sky-50 to-blue-100 border border-cyan-200/50 text-slate-900 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white opacity-60 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-10 -mb-10 w-40 h-40 bg-sky-200 opacity-40 rounded-full blur-2xl"></div>
        
        <div className="card-body flex-col md:flex-row items-center gap-8 relative z-10 p-8">
          <div className="avatar placeholder ring-4 ring-white shadow-xl rounded-full bg-white p-2 transition-transform hover:scale-105">
            <div className="bg-sky-600 text-white h-24 w-24 rounded-full flex items-center justify-center">
              <Presentation className="w-12 h-12" />
            </div>
          </div>
          
          <div className="text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold">{profile?.name}</h2>
              {profile?.designation && (
                <span className="badge border-sky-200 bg-white text-sky-700 px-4 py-3 rounded-lg font-bold shadow-sm">
                  {profile.designation}
                </span>
              )}
            </div>
            <p className="text-slate-600 font-semibold mb-4 flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-5 h-5 text-sky-600" />
              {profile?.email}
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm">
                <span className="text-slate-500 text-sm font-semibold">ID:</span>
                <span className="font-mono font-bold tracking-wider text-slate-800">{profile?.teacherId || "N/A"}</span>
              </div>
              {profile?.officeRoom && (
                <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm">
                  <span className="text-slate-500 text-sm font-semibold">Room:</span>
                  <span className="font-bold text-slate-800">{profile.officeRoom}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Professional Details Grid */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Briefcase className="text-info w-6 h-6" /> Professional Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                [Microscope, "Specialization", profile?.specialization || "Not set", "bg-purple-100 text-purple-600"],
                [CalendarClock, "Joining Date", profile?.joiningDate || "Not set", "bg-emerald-100 text-emerald-600"],
                [Phone, "Phone", profile?.phone || "Not set", "bg-amber-100 text-amber-600"],
                [DoorOpen, "Office Room", profile?.officeRoom || "Not set", "bg-cyan-100 text-cyan-600"],
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

          {/* Current Courses (Placeholder for UI impressiveness) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BookCopy className="text-info w-6 h-6" /> Assigned Courses
              </h2>
              <button className="btn btn-sm btn-ghost text-info">View All</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { code: "CSE 311", title: "Software Engineering", semester: "6th" },
                { code: "CSE 415", title: "Machine Learning", semester: "8th" }
              ].map((course, i) => (
                <div key={i} className="card bg-base-100 border border-base-200 card-hover shadow-sm group">
                  <div className="h-1.5 w-full bg-base-200 group-hover:bg-info transition-colors"></div>
                  <div className="card-body p-5">
                    <div className="flex justify-between items-start mb-2">
                      <span className="badge badge-info badge-sm font-mono">{course.code}</span>
                      <span className="text-xs font-medium text-base-content/60 bg-base-200 px-2 py-1 rounded">{course.semester} Sem</span>
                    </div>
                    <h3 className="text-lg font-bold mb-3">{course.title}</h3>
                    <div className="flex gap-2 mt-auto">
                      <button className="btn btn-xs btn-outline hover:bg-info hover:border-info text-base-content/70">Attendance</button>
                      <button className="btn btn-xs btn-outline hover:bg-info hover:border-info text-base-content/70">Materials</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card bg-base-100 shadow-sm border border-base-200 text-center py-6 card-hover">
              <Presentation className="w-8 h-8 mx-auto text-info mb-2 opacity-80" />
              <div className="text-3xl font-bold text-info mb-1">4</div>
              <div className="text-xs font-semibold text-base-content/60 uppercase tracking-wide">Classes Today</div>
            </div>
            <div className="card bg-base-100 shadow-sm border border-base-200 text-center py-6 card-hover">
              <Users className="w-8 h-8 mx-auto text-success mb-2 opacity-80" />
              <div className="text-3xl font-bold text-success mb-1">12</div>
              <div className="text-xs font-semibold text-base-content/60 uppercase tracking-wide">Advisees</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card bg-base-100 shadow-md border border-base-200">
            <div className="card-body p-5">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Zap className="text-accent w-6 h-6" /> Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="btn btn-ghost w-full justify-start text-left font-medium hover:bg-base-200">
                  <MessageSquare className="w-5 h-5 mr-3 text-info inline" /> Post Announcement
                </button>
                <button className="btn btn-ghost w-full justify-start text-left font-medium hover:bg-base-200">
                  <Calendar className="w-5 h-5 mr-3 text-secondary inline" /> View Schedule
                </button>
                <button className="btn btn-ghost w-full justify-start text-left font-medium hover:bg-base-200">
                  <Files className="w-5 h-5 mr-3 text-accent inline" /> Manage Resources
                </button>
                <button className="btn btn-ghost w-full justify-start text-left font-medium hover:bg-base-200">
                  <CheckSquare className="w-5 h-5 mr-3 text-success inline" /> Leave Requests
                </button>
              </div>
            </div>
          </div>
          
          {/* Today's Schedule Mini */}
          <div className="card bg-base-100 shadow-md border border-base-200">
            <div className="card-body p-5">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Clock className="text-warning w-6 h-6" /> Next Class
              </h3>
              <div className="bg-base-200 rounded-xl p-4 border border-base-300">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-primary">CSE 311</span>
                  <span className="badge badge-sm">10:00 AM</span>
                </div>
                <p className="text-sm font-medium">Software Engineering</p>
                <div className="flex items-center gap-2 mt-3 text-xs text-base-content/60">
                  <DoorOpen className="w-4 h-4" /> <span>Room 402</span>
                  <span>•</span>
                  <span>6th Semester</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
