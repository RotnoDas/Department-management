import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import api from "../../api/axios";
import { addToast } from "../../utils/toast";
import Loading from "../../components/Loading";
import {
  File,
  Upload,
  Trash2,
  ArrowLeft,
  BookCopy,
  FileText,
  FileImage,
  FileArchive,
  Download,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  Zap,
} from "lucide-react";

export default function TeacherCourseMaterials() {
  const { courseCode } = useParams();
  const [courseName, setCourseName] = useState("");
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchMaterials();
  }, [courseCode]);

  const fetchMaterials = async () => {
    try {
      const { data } = await api.get(
        `/teacher/courses/${courseCode}/materials`,
      );
      setCourseName(data.courseName);
      setMaterials(data.materials);
    } catch (err) {
      addToast({ title: "Failed to load materials.", color: "danger" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title)
      return addToast({ title: "Title is required.", color: "danger" });
    if (!file && !description)
      return addToast({
        title: "Provide a description or a file.",
        color: "danger",
      });

    setUploading(true);
    const formData = new FormData();
    formData.append("title", title);
    if (description) formData.append("description", description);
    if (file) formData.append("file", file);

    try {
      await api.post(`/teacher/courses/${courseCode}/materials`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      addToast({ title: "Material uploaded successfully.", color: "success" });
      setTitle("");
      setDescription("");
      setFile(null);
      // Reset file input
      const fileInput = document.getElementById("file-upload");
      if (fileInput) fileInput.value = "";
      fetchMaterials();
    } catch (err) {
      addToast({
        title: err.response?.data?.error || "Upload failed.",
        color: "danger",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this material?")) return;
    try {
      await api.delete(`/teacher/materials/${id}`);
      addToast({ title: "Material deleted.", color: "success" });
      fetchMaterials();
    } catch (err) {
      addToast({
        title: err.response?.data?.error || "Delete failed.",
        color: "danger",
      });
    }
  };

  const formatDate = (dateString) => {
    const options = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getFileIcon = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    if (["pdf"].includes(ext))
      return <FileText className="h-6 w-6 text-rose-500" />;
    if (["jpg", "jpeg", "png", "gif"].includes(ext))
      return <FileImage className="h-6 w-6 text-sky-500" />;
    if (["zip", "rar"].includes(ext))
      return <FileArchive className="h-6 w-6 text-amber-500" />;
    return <File className="h-6 w-6 text-slate-400" />;
  };

  if (loading) return <Loading fullScreen text="Loading materials..." />;

  return (
    <div className="page-transition mx-auto max-w-[1600px] space-y-8 pb-12">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-sky-100 via-indigo-50 to-white p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-100">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-white/40 blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-6">
            <Link
              to="/teacher/dashboard"
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-50 hover:text-indigo-600 hover:shadow-md"
              title="Back"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="flex items-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-xl ring-1 ring-slate-100 transition-transform duration-500 hover:rotate-6">
                <BookCopy className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-800">
                  {courseCode}
                  <span className="mx-3 font-light text-slate-300">|</span>
                  <span className="font-bold text-slate-600">{courseName}</span>
                </h1>
                <p className="mt-1 text-sm font-black tracking-widest text-slate-400 uppercase">
                  Resource Management
                </p>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="rounded-2xl bg-white/60 px-6 py-3 shadow-sm ring-1 ring-slate-200/50 backdrop-blur-sm">
              <span className="text-[10px] font-black tracking-widest text-indigo-600 uppercase">
                {materials.length} Items Uploaded
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Upload Form Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 overflow-hidden rounded-[2.5rem] bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-100">
            <div className="bg-gradient-to-br from-indigo-50/50 to-white p-8">
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner ring-1 ring-indigo-100">
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight text-slate-800">
                    Publish New
                  </h3>
                  <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Add resources
                  </p>
                </div>
              </div>

              <form onSubmit={handleUpload} className="space-y-5">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-[10px] font-black tracking-widest text-slate-500 uppercase">
                      Material Title
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full rounded-xl font-bold transition-all focus:ring-2 focus:ring-indigo-100"
                    placeholder="e.g., Lecture 1 Notes"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-[10px] font-black tracking-widest text-slate-500 uppercase">
                      Description (Optional)
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-28 w-full rounded-xl font-bold transition-all focus:ring-2 focus:ring-indigo-100"
                    placeholder="Add context or notes here..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-[10px] font-black tracking-widest text-slate-500 uppercase">
                      Select File
                    </span>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    className="file-input file-input-bordered file-input-primary w-full rounded-xl"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </div>
                <button
                  type="submit"
                  className="btn group mt-4 h-14 w-full rounded-2xl border-0 bg-indigo-600 text-sm font-black tracking-[0.2em] text-white uppercase shadow-[0_8px_30px_rgba(99,102,241,0.3)] transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] hover:bg-indigo-700 hover:shadow-[0_20px_40px_rgba(99,102,241,0.4)] active:scale-95"
                  disabled={uploading || (!file && !description) || !title}
                >
                  {uploading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 transition-transform group-hover:animate-pulse" />
                      <span>Publish Resource</span>
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Materials List */}
        <div className="lg:col-span-2">
          {materials.length === 0 ? (
            <div className="relative overflow-hidden rounded-[3rem] bg-white/50 p-20 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-sky-50/50 opacity-60"></div>
              <div className="relative z-10 flex min-h-[300px] flex-col items-center justify-center">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-sky-100 p-6 shadow-inner ring-4 ring-white transition-transform duration-500 hover:scale-110">
                  <File className="h-12 w-12 text-indigo-500" />
                </div>
                <h3 className="mb-3 text-3xl font-black tracking-tight text-slate-800">
                  No Resources
                </h3>
                <p className="mx-auto max-w-sm text-lg leading-relaxed font-bold text-slate-400">
                  Start by uploading lecture notes or sharing links using the
                  sidebar tool.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {materials.map((m) => (
                <article
                  key={m.id}
                  className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/50 transition-all duration-500 hover:shadow-xl hover:ring-indigo-100"
                >
                  <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-start">
                    <div className="flex flex-1 items-start gap-5">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-100 transition-all duration-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-200">
                        {m.file_path ? (
                          getFileIcon(m.original_name)
                        ) : (
                          <FileText className="h-7 w-7 text-indigo-500 transition-colors group-hover:text-white" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-xl leading-[1.2] font-black tracking-tight text-slate-800 transition-colors group-hover:text-indigo-700">
                          {m.title}
                        </h2>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-black tracking-widest text-indigo-600 uppercase shadow-sm ring-1 ring-indigo-100/50 transition-all duration-300 group-hover:bg-white">
                            <Calendar className="h-3.5 w-3.5 opacity-50" />
                            {formatDate(m.created_at)}
                          </span>
                          {m.file_path && (
                            <span className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-[10px] font-black tracking-widest text-slate-500 uppercase shadow-sm ring-1 ring-slate-100 transition-all duration-300 group-hover:bg-white">
                              <File className="h-3.5 w-3.5 opacity-50" />
                              {m.original_name.split(".").pop().toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 sm:self-start">
                      {m.file_path && (
                        <a
                          href={`http://localhost:3001${m.file_path}`}
                          target="_blank"
                          rel="noreferrer"
                          className="group/dl flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-[10px] font-black tracking-widest text-white uppercase shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-600 hover:shadow-indigo-200"
                        >
                          <Download className="h-3.5 w-3.5 transition-transform group-hover/dl:scale-110" />
                          <span>Download</span>
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 shadow-sm transition-all hover:bg-rose-50 hover:text-rose-600"
                        title="Delete Material"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {m.description && (
                    <div className="mt-6 rounded-2xl bg-slate-50/50 p-5 text-sm leading-relaxed font-bold text-slate-500/80 ring-1 ring-slate-100/50 transition-colors group-hover:bg-white group-hover:ring-indigo-100/20">
                      <p className="whitespace-pre-wrap">{m.description}</p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
