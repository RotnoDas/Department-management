import { useState, useEffect } from "react";
import api from "../../api/axios";
import { CheckCircle, Clock, Library, BarChart3 } from "lucide-react";
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

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError("");
        },
        (error) => {
          setLocationError(
            "Location access denied. Please enable location to mark attendance.",
          );
          console.error("Location error:", error);
        },
      );
    } else {
      setLocationError("Geolocation is not supported by your browser");
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
      alert("Please enable location access to mark attendance");
      getLocation();
      return;
    }

    setMarking((m) => ({ ...m, [sessionId]: true }));
    try {
      const res = await api.post("/attendance/student/mark", {
        sessionId,
        latitude: location.latitude,
        longitude: location.longitude,
      });

      alert(res.data.message || "Attendance marked successfully!");
      loadData();
    } catch (e) {
      const error = e.response?.data?.error || "Failed to mark attendance";
      alert(error);
    } finally {
      setMarking((m) => ({ ...m, [sessionId]: false }));
    }
  };

  if (loading) {
    return <Loading fullScreen text="Loading Attendance..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 text-white shadow-2xl">
        <div className="card-body p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-xl backdrop-blur-sm">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold">Attendance</h1>
              <p className="mt-1 text-white/90">
                Mark your attendance for active classes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Location Status */}
      {locationError && (
        <div className="alert alert-warning shadow-lg">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>{locationError}</span>
          <button className="btn btn-sm" onClick={getLocation}>
            Enable Location
          </button>
        </div>
      )}

      {location && (
        <div className="alert alert-success shadow-lg">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Location enabled - You can mark attendance</span>
        </div>
      )}

      {/* Active Sessions */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4 flex items-center text-2xl">
            <Clock className="text-primary mr-2 h-6 w-6" />
            Active Classes
          </h2>

          {activeSessions.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mb-4">
                <Library className="text-base-content/20 mx-auto h-16 w-16" />
              </div>
              <h3 className="text-xl font-bold">No Active Classes</h3>
              <p className="text-base-content/60 mt-2">
                There are no classes available for attendance right now
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {activeSessions.map((session) => (
                <div
                  key={session.sessionId}
                  className={`card border-2 ${
                    session.attendanceId
                      ? "border-success bg-success/5"
                      : "border-primary bg-primary/5"
                  } shadow-lg`}
                >
                  <div className="card-body p-5">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold">
                          {session.courseName}
                        </h3>
                        <p className="text-base-content/60 text-sm">
                          {session.courseCode}
                        </p>
                      </div>
                      {session.attendanceId && (
                        <span className="badge badge-success gap-2">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Marked
                        </span>
                      )}
                    </div>

                    {/* Class Time - Prominent Display */}
                    <div className="bg-base-200 mb-3 rounded-lg p-3">
                      <div className="flex items-center justify-center gap-2">
                        <svg
                          className="text-primary h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-primary text-lg font-bold">
                          {session.startTime} - {session.endTime}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span>{session.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>Within {session.radius}m radius</span>
                      </div>
                    </div>

                    {!session.attendanceId && (
                      <button
                        className="btn btn-primary mt-4 w-full"
                        onClick={() => markAttendance(session.sessionId)}
                        disabled={marking[session.sessionId] || !location}
                      >
                        {marking[session.sessionId] ? (
                          <>
                            <span className="loading loading-spinner loading-sm" />
                            Marking...
                          </>
                        ) : (
                          <>
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
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Mark Attendance
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Attendance Statistics */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4 flex items-center text-2xl">
            <BarChart3 className="text-primary mr-2 h-6 w-6" />
            Attendance Statistics
          </h2>

          {stats.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-base-content/60">
                No attendance data available yet
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Total Sessions</th>
                    <th>Attended</th>
                    <th>Present</th>
                    <th>Late</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((stat) => (
                    <tr key={stat.courseCode}>
                      <td>
                        <div>
                          <div className="font-bold">{stat.courseName}</div>
                          <div className="text-base-content/60 text-sm">
                            {stat.courseCode}
                          </div>
                        </div>
                      </td>
                      <td>{stat.totalSessions}</td>
                      <td>{stat.attendedSessions}</td>
                      <td>
                        <span className="badge badge-success badge-sm">
                          {stat.presentCount}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-warning badge-sm">
                          {stat.lateCount}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <progress
                            className={`progress w-20 ${
                              stat.percentage >= 75
                                ? "progress-success"
                                : stat.percentage >= 60
                                  ? "progress-warning"
                                  : "progress-error"
                            }`}
                            value={stat.percentage}
                            max="100"
                          ></progress>
                          <span className="font-bold">{stat.percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
