import { useState, useEffect } from "react";
import api from "../../api/axios";
import { addToast } from "../../utils/toast";
import {
  CheckCircle,
  Clock,
  Library,
  BarChart3,
  MapPin,
  Target,
  Check,
  X,
  AlertCircle,
  Info,
  ChevronRight,
  Zap,
} from "lucide-react";
import Loading from "../../components/Loading";

export default function StudentAttendance() {
  const [activeSessions, setActiveSessions] = useState([]);
  const [stats, setStats] = useState([]);
  const [todayClasses, setTodayClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState({});
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    loadData();
    getLocation();
    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getLocation = (showToast = false) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError("");
          if (showToast) {
            addToast({ title: "Location access enabled.", color: "success" });
          }
        },
        (error) => {
          const message =
            "Location access denied. Please enable location to mark attendance.";
          setLocationError(message);
          if (showToast) addToast({ title: message, color: "warning" });
          console.error("Location error:", error);
        },
      );
    } else {
      const message = "Geolocation is not supported by your browser";
      setLocationError(message);
      if (showToast) addToast({ title: message, color: "danger" });
    }
  };

  const loadData = async () => {
    try {
      const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
      const [sessionsRes, statsRes, todayRes] = await Promise.all([
        api.get("/attendance/student/active-sessions"),
        api.get("/attendance/student/stats"),
        api.get(`/student/today-classes?day=${today}`),
      ]);
      setActiveSessions(sessionsRes.data.sessions || []);
      setStats(statsRes.data.stats || []);
      setTodayClasses(todayRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (sessionId) => {
    if (!location) {
      addToast({
        title: "Please enable location access to mark attendance.",
        color: "warning",
      });
      getLocation(true);
      return;
    }

    setMarking((m) => ({ ...m, [sessionId]: true }));
    try {
      const res = await api.post("/attendance/student/mark", {
        sessionId,
        latitude: location.latitude,
        longitude: location.longitude,
      });

      addToast({
        title: res.data.message || "Attendance marked successfully!",
        color: "success",
      });
      loadData();
    } catch (e) {
      const error = e.response?.data?.error || "Failed to mark attendance";
      addToast({ title: error, color: "danger" });
    } finally {
      setMarking((m) => ({ ...m, [sessionId]: false }));
    }
  };

  if (loading) {
    return <Loading fullScreen text="Loading Attendance..." />;
  }

  return (
    <div className="page-transition mx-auto max-w-[1400px] space-y-8 pb-12">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-sky-100 via-indigo-50 to-white p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-100">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-white/40 blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-xl ring-1 ring-slate-100 transition-transform duration-500 hover:rotate-6">
              <CheckCircle className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-800">
                Attendance
              </h1>
              <p className="mt-1 text-lg font-bold text-slate-400">
                Class Presence{" "}
                <span className="mx-1 text-indigo-600/50">•</span> Smart
                Tracking
              </p>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="rounded-2xl bg-white/60 px-6 py-3 shadow-sm ring-1 ring-slate-200/50 backdrop-blur-sm">
              <span className="text-[10px] font-black tracking-widest text-indigo-600 uppercase">
                Live Status Enabled
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Messages */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {locationError ? (
          <div className="flex items-center justify-between rounded-2xl border-2 border-amber-100 bg-amber-50 p-4 text-amber-800 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-bold tracking-tight">
                {locationError}
              </p>
            </div>
            <button
              className="btn btn-sm rounded-xl border-0 bg-white text-amber-600 shadow-sm transition-all hover:bg-amber-600 hover:text-white"
              onClick={() => getLocation(true)}
            >
              Enable
            </button>
          </div>
        ) : (
          location && (
            <div className="flex items-center gap-3 rounded-2xl border-2 border-emerald-100 bg-emerald-50 p-4 text-emerald-800 shadow-sm">
              <CheckCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-bold tracking-tight">
                Location enabled — Ready to mark attendance
              </p>
            </div>
          )
        )}
        <div className="flex items-center gap-3 rounded-2xl border-2 border-indigo-100 bg-indigo-50 p-4 text-indigo-800 shadow-sm">
          <Info className="h-5 w-5 shrink-0" />
          <p className="text-sm font-bold tracking-tight">
            Attendance window opens for 15 minutes at start time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Active Sessions - Main Section */}
        <div className="space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between px-2">
            <div>
              <h2 className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                Schedule
              </h2>
              <p className="mt-1 text-2xl font-black tracking-tight text-slate-800">
                Active & Upcoming
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-2 text-[10px] font-black tracking-widest text-slate-400 uppercase shadow-sm ring-1 ring-slate-100">
              Today
            </div>
          </div>

          {activeSessions.length === 0 ? (
            <div className="relative overflow-hidden rounded-[3rem] bg-white/50 p-20 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-sky-50/50 opacity-60"></div>
              <div className="relative z-10 flex min-h-[300px] flex-col items-center justify-center">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-sky-100 p-6 shadow-inner ring-4 ring-white transition-transform duration-500 hover:scale-110">
                  <Clock className="h-12 w-12 text-indigo-500" />
                </div>
                <h3 className="mb-3 text-3xl font-black tracking-tight text-slate-800">
                  No Classes Active
                </h3>
                <p className="mx-auto max-w-sm text-lg leading-relaxed font-bold text-slate-400">
                  There are no active or upcoming classes scheduled for you
                  today.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {activeSessions.map((session, index) => (
                <div
                  key={session.sessionId || index}
                  className={`group relative overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                    session.attendanceId
                      ? "ring-emerald-100 hover:ring-emerald-200"
                      : session.isActive
                        ? "ring-indigo-100 hover:ring-indigo-200"
                        : "opacity-80 ring-slate-100"
                  }`}
                >
                  <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center">
                    <div className="flex flex-1 items-start gap-5">
                      <div
                        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-sm ring-1 transition-all duration-500 ${
                          session.attendanceId
                            ? "bg-emerald-50 text-emerald-600 ring-emerald-100"
                            : session.isActive
                              ? "bg-indigo-50 text-indigo-600 ring-indigo-100 group-hover:bg-indigo-600 group-hover:text-white"
                              : "bg-slate-50 text-slate-400 ring-slate-100"
                        }`}
                      >
                        {session.attendanceId ? (
                          <Check className="h-8 w-8" />
                        ) : (
                          <Clock className="h-8 w-8" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xl font-black tracking-tight text-slate-800 transition-colors group-hover:text-indigo-700">
                          {session.courseName}
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-[10px] font-black tracking-widest text-slate-500 uppercase ring-1 ring-slate-100">
                            {session.courseCode}
                          </span>
                          {session.isActive && !session.attendanceId && (
                            <span className="flex animate-pulse items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-black tracking-widest text-indigo-600 uppercase ring-1 ring-indigo-100">
                              Live Now
                            </span>
                          )}
                          {session.isPast && !session.attendanceId && (
                            <span className="rounded-lg bg-rose-50 px-2.5 py-1 text-[10px] font-black tracking-widest text-rose-600 uppercase ring-1 ring-rose-100">
                              Missed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-4 sm:items-end">
                      <div className="rounded-2xl bg-slate-50/80 px-6 py-3 shadow-inner ring-1 ring-slate-100 transition-colors group-hover:bg-white">
                        <span className="text-lg font-black tracking-tighter text-slate-800">
                          {session.startTime} — {session.endTime}
                        </span>
                      </div>

                      {!session.attendanceId && session.isActive && (
                        <div className="w-full sm:w-auto">
                          {session.isMarkable ? (
                            <button
                              className="group/btn flex h-12 w-full items-center justify-center gap-2 rounded-2xl border-0 bg-indigo-600 px-8 text-sm font-black tracking-widest text-white uppercase shadow-lg shadow-indigo-100 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 sm:w-auto"
                              onClick={() => markAttendance(session.sessionId)}
                              disabled={marking[session.sessionId] || !location}
                            >
                              {marking[session.sessionId] ? (
                                <span className="loading loading-spinner loading-sm" />
                              ) : (
                                <>
                                  <Zap className="h-4 w-4 transition-transform group-hover/btn:animate-pulse" />
                                  Mark Present
                                </>
                              )}
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2 text-[10px] font-black tracking-widest text-rose-600 uppercase ring-1 ring-rose-100">
                              <AlertCircle className="h-4 w-4" />
                              Expired
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-slate-50 pt-5">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-indigo-400" />
                      <span className="text-xs font-bold tracking-wide text-slate-500 uppercase">
                        {session.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-sky-400" />
                      <span className="text-xs font-bold tracking-wide text-slate-500 uppercase">
                        Radius: {session.radius}m
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - Statistics */}
        <div className="space-y-8">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/60">
            <div className="mb-10 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 shadow-inner ring-1 ring-sky-100">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-slate-800">
                  Statistics
                </h3>
                <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Historical Data
                </p>
              </div>
            </div>

            {stats.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-[11px] font-black tracking-widest text-slate-300 uppercase">
                  No data available
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {stats.map((stat) => (
                  <div key={stat.courseCode} className="group/stat space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-slate-800 transition-colors group-hover/stat:text-indigo-600">
                          {stat.courseName}
                        </p>
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                          {stat.courseCode}
                        </p>
                      </div>
                      <span className="text-lg font-black tracking-tighter text-slate-800">
                        {stat.percentage}%
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-50 shadow-inner ring-1 ring-slate-100">
                        <div
                          className={`h-full transition-all duration-1000 ${
                            stat.percentage >= 75
                              ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                              : stat.percentage >= 60
                                ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                                : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]"
                          }`}
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] font-black tracking-widest text-slate-400 uppercase">
                        <span>
                          {stat.attendedSessions} / {stat.totalSessions}{" "}
                          Sessions
                        </span>
                        <span
                          className={
                            stat.percentage < 75
                              ? "text-rose-500"
                              : "text-emerald-600"
                          }
                        >
                          {stat.percentage < 75
                            ? "Low Attendance"
                            : "Good Standing"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="rounded-xl bg-slate-50/50 p-2.5 text-center ring-1 ring-slate-100 transition-colors group-hover/stat:bg-white group-hover/stat:shadow-sm">
                        <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                          Present
                        </p>
                        <p className="text-sm font-black text-emerald-600">
                          {stat.presentCount}
                        </p>
                      </div>
                      <div className="rounded-xl bg-slate-50/50 p-2.5 text-center ring-1 ring-slate-100 transition-colors group-hover/stat:bg-white group-hover/stat:shadow-sm">
                        <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                          Late
                        </p>
                        <p className="text-sm font-black text-amber-600">
                          {stat.lateCount}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
