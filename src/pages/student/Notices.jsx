import { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../../api/axios";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import NoticeAttachment from "../../components/NoticeAttachment";
import {
  ArrowLeft,
  Bell,
  Calendar,
  Megaphone,
  Paperclip,
  User,
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

  const attachmentCount = notices.filter((notice) => notice.filePath).length;

  if (loading) return <Loading />;

  return (
    <div className="page-transition mx-auto max-w-5xl space-y-8 pb-10">
      <div className="card overflow-hidden border border-slate-200 bg-white shadow-xl">
        <div className="h-2 bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500"></div>
        <div className="card-body p-6 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Link
                to="/student/dashboard"
                className="btn btn-circle border-0 bg-slate-100 text-slate-700 shadow-sm hover:bg-indigo-50 hover:text-indigo-700"
                title="Back to Dashboard"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                  <Bell className="h-8 w-8" />
                </div>
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 uppercase">
                      Student Notice Board
                    </span>
                    {attachmentCount > 0 && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 uppercase">
                        <Paperclip className="h-3.5 w-3.5" />
                        {attachmentCount} files
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
                    Notice Board
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500 sm:text-base">
                    Department announcements and shared files are collected
                    here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {notices.length === 0 ? (
        <div className="card border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <div className="card-body min-h-[300px] items-center justify-center">
            <div className="mb-6 rounded-full bg-slate-100 p-5 shadow-inner ring-4 ring-slate-50">
              <Bell className="h-12 w-12 text-indigo-400" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-slate-700">
              No Notices Yet
            </h3>
            <p className="mx-auto max-w-sm leading-relaxed text-slate-500">
              There are currently no active announcements from the department.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {notices.map((notice) => (
            <article
              key={notice.id}
              className="card border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="h-1.5 w-full rounded-t-2xl bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500"></div>
              <div className="card-body gap-5 p-6 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-indigo-50 p-3 shadow-inner">
                      <Megaphone className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-xl leading-snug font-bold text-slate-900 sm:text-2xl">
                        {notice.title}
                      </h2>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-500">
                        <span className="flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1 text-indigo-700">
                          <User className="h-4 w-4" />
                          {notice.authorName || "Admin"}
                        </span>
                        <span className="flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-slate-600">
                          <Calendar className="h-4 w-4" />
                          {formatDate(notice.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {notice.content && (
                  <>
                    <div className="divider my-0"></div>
                    <p className="leading-relaxed whitespace-pre-wrap text-slate-600">
                      {notice.content}
                    </p>
                  </>
                )}

                <NoticeAttachment notice={notice} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
