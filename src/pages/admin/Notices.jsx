import { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Notice Board Management
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary shadow-sm shadow-indigo-500/30"
        >
          Publish Notice
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="card border border-slate-200 bg-white shadow-sm"
          >
            <div className="card-body p-6">
              <h2 className="card-title text-slate-800">{notice.title}</h2>
              <p className="mb-4 text-sm whitespace-pre-wrap text-slate-500">
                {notice.content}
              </p>
              <div className="mt-auto flex items-center justify-between text-xs text-slate-400">
                <span>By {notice.authorName || "Admin"}</span>
                <span>{formatDate(notice.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
        {notices.length === 0 && (
          <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-slate-500">No notices published yet.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="mb-4 text-lg font-bold">Publish New Notice</h3>
            <form onSubmit={handlePublish} className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text font-medium">Title</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="Notice Title"
                  required
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-medium">Content</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="textarea textarea-bordered h-32 w-full"
                  placeholder="Notice details..."
                  required
                ></textarea>
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-ghost"
                  disabled={publishing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={publishing}
                >
                  {publishing ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Publish"
                  )}
                </button>
              </div>
            </form>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => !publishing && setIsModalOpen(false)}
          ></div>
        </div>
      )}
    </div>
  );
}
