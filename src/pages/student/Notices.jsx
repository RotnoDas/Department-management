import { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../../api/axios";
import { addToast } from "../../utils/toast";
import Loading from "../../components/Loading";
import NoticeAttachment from "../../components/NoticeAttachment";
import {
  ArrowLeft,
  Bell,
  Calendar,
  Megaphone,
  Paperclip,
  User,
  Sparkles,
} from "lucide-react";

export default function StudentNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const { data } = await api.get("/student/notices");
        setNotices(data);
      } catch {
        addToast({ title: "Failed to load notices.", color: "danger" });
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const attachmentCount = notices.filter((notice) => notice.filePath).length;

  if (loading) return <Loading fullScreen text="Loading notices..." />;

  return (
    <div className="page-transition mx-auto max-w-[1400px] space-y-8 pb-12">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-sky-100 via-indigo-50 to-white p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-100">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-white/40 blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-6">
            <Link
              to="/student/dashboard"
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-50 hover:text-indigo-600 hover:shadow-md"
              title="Back"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="flex items-center gap-6">
              <div className="group relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-xl ring-1 ring-slate-100 transition-transform duration-500 hover:scale-105 hover:rotate-12">
                  <Bell className="h-8 w-8 text-indigo-600" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 h-6 w-6 animate-pulse text-yellow-500" />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-800">
                  Notice Board
                </h1>
                <p className="mt-1 text-sm font-black tracking-widest text-slate-400 uppercase">
                  Department Broadcast & Updates
                </p>
              </div>
            </div>
          </div>
          <div className="hidden gap-3 lg:flex">
            <div className="rounded-2xl bg-white/60 px-5 py-2.5 shadow-sm ring-1 ring-slate-200/50 backdrop-blur-sm">
              <span className="text-[10px] font-black tracking-widest text-indigo-600 uppercase">
                {notices.length} Active Notices
              </span>
            </div>
            {attachmentCount > 0 && (
              <div className="rounded-2xl bg-emerald-50 px-5 py-2.5 shadow-sm ring-1 ring-emerald-100">
                <span className="flex items-center gap-2 text-[10px] font-black tracking-widest text-emerald-600 uppercase">
                  <Paperclip className="h-3.5 w-3.5" /> {attachmentCount}{" "}
                  Documents
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {notices.length === 0 ? (
        <div className="relative overflow-hidden rounded-[3rem] bg-white/50 p-20 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-sky-50/50 opacity-60"></div>
          <div className="relative z-10 flex min-h-[300px] flex-col items-center justify-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-sky-100 p-6 shadow-inner ring-4 ring-white transition-transform duration-500 hover:scale-110">
              <Megaphone className="h-12 w-12 text-indigo-500" />
            </div>
            <h3 className="mb-3 text-3xl font-black tracking-tight text-slate-800">
              Board is Clear
            </h3>
            <p className="mx-auto max-w-sm text-lg leading-relaxed font-bold text-slate-400">
              Check back soon for latest department announcements and files.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {notices.map((notice) => (
            <article
              key={notice.id}
              className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] hover:ring-indigo-100"
            >
              <div className="relative z-10">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-6">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-indigo-600 ring-1 ring-slate-100 transition-all duration-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-200">
                      <Megaphone className="h-7 w-7" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-2xl leading-[1.2] font-black tracking-tight text-slate-800 transition-colors duration-300 group-hover:text-indigo-700 sm:text-3xl">
                        {notice.title}
                      </h2>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2 text-[10px] font-black tracking-[0.15em] text-indigo-600 uppercase shadow-sm ring-1 ring-indigo-100/50 transition-all duration-300 group-hover:bg-white group-hover:ring-indigo-100">
                          <User className="h-4 w-4" />
                          {notice.authorName || "Admin"}
                        </span>
                        <span className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2 text-[10px] font-black tracking-[0.15em] text-slate-500 uppercase shadow-sm ring-1 ring-slate-200/50 transition-all duration-300 group-hover:bg-white">
                          <Calendar className="h-4 w-4" />
                          {formatDate(notice.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {notice.content && (
                  <div className="mt-8 rounded-r-[1.5rem] border-l-4 border-indigo-100 bg-slate-50/50 py-4 pr-6 pl-8">
                    <p className="text-lg leading-relaxed font-bold tracking-tight whitespace-pre-wrap text-slate-600">
                      {notice.content}
                    </p>
                  </div>
                )}

                <div className="mt-10">
                  <NoticeAttachment notice={notice} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
