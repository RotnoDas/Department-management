import { useState, useEffect } from "react";
import { Link } from "react-router";
import api from "../../api/axios";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import { Bell, ArrowLeft, Megaphone, Calendar, User } from "lucide-react";

export default function StudentNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const { data } = await api.get("/student/notices");
        setNotices(data);
      } catch (err) {
        toast.error("Failed to load notices.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (loading) return <Loading />;

  return (
    <div className="page-transition mx-auto max-w-4xl space-y-8 pb-10">
      {/* Impressive Header Banner */}
      <div className="card relative overflow-hidden bg-gradient-to-br from-indigo-500 via-blue-600 to-sky-600 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-48 w-48 rounded-full bg-white opacity-10 blur-2xl"></div>
        <div className="absolute bottom-0 left-10 -mb-10 h-32 w-32 rounded-full bg-sky-300 opacity-20 blur-xl"></div>
        <div className="card-body relative z-10 p-8 sm:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <Link
              to="/student/dashboard"
              className="btn btn-circle btn-ghost border-0 bg-white/10 text-white shadow-sm backdrop-blur-sm transition-all hover:bg-white/20"
              title="Back to Dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-6">
              <div className="rounded-2xl border border-white/30 bg-white/20 p-4 shadow-inner backdrop-blur-md">
                <Bell className="h-10 w-10 text-white drop-shadow-sm" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-md sm:text-4xl">
                  Notice Board
                </h1>
                <p className="mt-2 font-medium text-indigo-100">
                  Stay updated with the latest departmental announcements
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {notices.length === 0 ? (
          <div className="card group relative overflow-hidden border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-50 to-white"></div>
            <div className="card-body relative z-10 min-h-[300px] items-center justify-center">
              <div className="mb-6 rounded-full bg-slate-100 p-5 shadow-inner ring-4 ring-slate-50 transition-all duration-300 group-hover:scale-110">
                <Bell className="h-12 w-12 animate-pulse text-indigo-400" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-slate-700">
                No Notices Yet
              </h3>
              <p className="mx-auto max-w-sm leading-relaxed text-slate-500">
                There are currently no active announcements from the department.
                Check back later!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="card group flex flex-col border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="h-1.5 w-full rounded-t-2xl bg-gradient-to-r from-indigo-400 to-sky-500 opacity-80 transition-opacity group-hover:opacity-100"></div>
                <div className="card-body gap-4 p-6 sm:p-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-slate-50 p-3 shadow-inner transition-transform group-hover:scale-110">
                        <Megaphone className="h-6 w-6 text-indigo-500" />
                      </div>
                      <div>
                        <h2 className="text-xl leading-snug font-bold text-slate-800">
                          {notice.title}
                        </h2>
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-500">
                          <span className="flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1 text-indigo-700">
                            <User className="h-4 w-4" />{" "}
                            {notice.authorName || "Admin"}
                          </span>
                          <span className="flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-slate-600">
                            <Calendar className="h-4 w-4" />{" "}
                            {formatDate(notice.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="divider my-1"></div>

                  <p className="leading-relaxed whitespace-pre-wrap text-slate-600">
                    {notice.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
