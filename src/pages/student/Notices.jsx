import { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";

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
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (loading) return <Loading />;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Department Notices
        </h1>
      </div>

      <div className="space-y-4">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="card border border-slate-200 bg-white shadow-sm"
          >
            <div className="card-body p-6">
              <h2 className="card-title text-xl text-slate-800">
                {notice.title}
              </h2>
              <div className="mb-4 flex gap-4 text-xs text-slate-400">
                <span>Published by {notice.authorName || "Admin"}</span>
                <span>{formatDate(notice.createdAt)}</span>
              </div>
              <p className="leading-relaxed whitespace-pre-wrap text-slate-600">
                {notice.content}
              </p>
            </div>
          </div>
        ))}
        {notices.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-slate-500">No notices available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
