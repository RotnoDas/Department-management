import { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import {
  BellRing,
  Plus,
  Megaphone,
  User,
  Calendar,
  X,
  Send,
  AlertCircle,
} from "lucide-react";

export default function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const { data } = await api.get("/admin/notices");
      setNotices(data);
    } catch (err) {
      toast.error("Failed to load notices.");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!title || !content)
      return toast.error("Title and content are required.");
    setPublishing(true);
    try {
      await api.post("/admin/notices", { title, content });
      toast.success("Notice published successfully.");
      setIsModalOpen(false);
      setTitle("");
      setContent("");
      fetchNotices();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to publish notice.");
    } finally {
      setPublishing(false);
    }
  };

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
    <div className="page-transition space-y-8 pb-10">
      {/* Header with Branded Logo */}
      <div className="card relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="card-body relative z-10 flex-col items-center justify-between gap-6 p-8 sm:flex-row">
          <div className="flex items-center gap-6 md:gap-8">
            <div className="group relative hidden sm:block">
              <div className="flex h-20 w-20 transform items-center justify-center rounded-3xl border border-white/30 bg-white/20 shadow-2xl backdrop-blur-xl transition-transform duration-500 group-hover:rotate-6">
                <BellRing className="h-10 w-10 text-white drop-shadow-lg" />
              </div>
              <div className="absolute -right-2 -bottom-2 flex h-8 w-8 transform items-center justify-center rounded-xl border-2 border-white bg-pink-400 text-white shadow-lg transition-transform group-hover:scale-110">
                <Megaphone className="h-4 w-4 font-bold" />
              </div>
            </div>

            <div className="text-center sm:text-left">
              <h1 className="flex flex-wrap items-center justify-center gap-3 text-3xl font-black tracking-tight sm:justify-start sm:text-4xl">
                Notice Board
                <div className="badge badge-secondary badge-sm border-0 bg-pink-500 px-3 py-3 font-bold text-white uppercase shadow-lg">
                  Broadcast
                </div>
              </h1>
              <p className="mt-2 text-lg font-medium text-white/80">
                Publish and manage departmental announcements
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn w-full border-0 bg-white text-indigo-700 shadow-xl transition-transform hover:scale-105 hover:bg-indigo-50 sm:w-auto"
          >
            <Plus className="mr-1 h-5 w-5" /> Publish Notice
          </button>
        </div>
      </div>

      {notices.length === 0 ? (
        <div className="card group relative overflow-hidden border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-50 to-white"></div>
          <div className="card-body relative z-10 min-h-[300px] items-center justify-center">
            <div className="mb-6 rounded-full bg-slate-100 p-6 shadow-inner ring-4 ring-slate-50 transition-all duration-300 group-hover:scale-110">
              <Megaphone className="h-12 w-12 animate-pulse text-indigo-400" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-slate-700">
              No Notices Published
            </h3>
            <p className="mx-auto max-w-sm leading-relaxed text-slate-500">
              You haven't published any announcements yet. Click the "Publish
              Notice" button above to broadcast your first message.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="card group flex flex-col border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="h-1.5 w-full rounded-t-2xl bg-gradient-to-r from-indigo-500 to-pink-500 opacity-80 transition-opacity group-hover:opacity-100"></div>
              <div className="card-body gap-4 p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-slate-50 p-3 shadow-inner transition-transform group-hover:scale-110">
                    <AlertCircle className="h-6 w-6 text-indigo-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2
                      className="line-clamp-2 text-xl leading-snug font-bold text-slate-800"
                      title={notice.title}
                    >
                      {notice.title}
                    </h2>
                  </div>
                </div>

                <div className="mt-2 flex-1 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed whitespace-pre-wrap text-slate-600 shadow-inner">
                  {notice.content}
                </div>

                <div className="mt-auto border-t border-slate-100 pt-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1 text-indigo-700">
                      <User className="h-3.5 w-3.5" />{" "}
                      {notice.authorName || "Admin"}
                    </span>
                    <span className="flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-slate-600">
                      <Calendar className="h-3.5 w-3.5" />{" "}
                      {formatDate(notice.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Publish Modal */}
      {isModalOpen && (
        <div className="modal modal-open backdrop-blur-sm">
          <div className="modal-box max-w-2xl overflow-hidden border border-slate-200 p-0 shadow-2xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-white">
              <h3 className="flex items-center gap-2 text-xl font-bold">
                <Megaphone className="h-5 w-5" /> Broadcast Notice
              </h3>
              <button
                onClick={() => !publishing && setIsModalOpen(false)}
                className="btn btn-circle btn-ghost btn-sm text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handlePublish}
              className="space-y-5 bg-slate-50/30 p-6"
            >
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-slate-700">
                    Notice Title
                  </span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input input-bordered w-full bg-white focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="e.g., Upcoming Midterm Examinations"
                  required
                  disabled={publishing}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-slate-700">
                    Detailed Content
                  </span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="textarea textarea-bordered h-40 w-full bg-white text-base focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Write the full announcement details here..."
                  required
                  disabled={publishing}
                ></textarea>
              </div>

              <div className="modal-action mt-6 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-ghost hover:bg-slate-200"
                  disabled={publishing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn border-0 bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                  disabled={publishing || !title || !content}
                >
                  {publishing ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Publish Now
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          <div
            className="modal-backdrop bg-slate-900/40"
            onClick={() => !publishing && setIsModalOpen(false)}
          ></div>
        </div>
      )}
    </div>
  );
}
