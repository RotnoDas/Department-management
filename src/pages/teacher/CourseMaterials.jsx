import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import api from "../../api/axios";
import { addToast } from "@heroui/toast";
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
    if (!title) return addToast({ title: "Title is required.", color: "danger" });
    if (!file && !description)
      return addToast({ title: "Provide a description or a file.", color: "danger" });

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
      addToast({ title: err.response?.data?.error || "Upload failed.", color: "danger" });
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
      addToast({ title: err.response?.data?.error || "Delete failed.", color: "danger" });
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

  const getFileIcon = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    if (["pdf"].includes(ext))
      return <FileText className="h-8 w-8 text-rose-500" />;
    if (["jpg", "jpeg", "png", "gif"].includes(ext))
      return <FileImage className="h-8 w-8 text-sky-500" />;
    if (["zip", "rar"].includes(ext))
      return <FileArchive className="h-8 w-8 text-amber-500" />;
    return <File className="h-8 w-8 text-slate-500" />;
  };

  if (loading) return <Loading />;

  return (
    <div className="page-transition mx-auto max-w-6xl space-y-8 pb-10">
      {/* Impressive Header */}
      <div className="card relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-48 w-48 rounded-full bg-white opacity-10 blur-2xl"></div>
        <div className="absolute bottom-0 left-10 -mb-10 h-32 w-32 rounded-full bg-violet-400 opacity-20 blur-xl"></div>
        <div className="card-body relative z-10 p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <Link
              to="/teacher/dashboard"
              className="btn btn-circle btn-ghost border-0 bg-white/10 text-white shadow-sm backdrop-blur-sm transition-all hover:bg-white/20"
              title="Back to Dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-6">
              <div className="rounded-2xl border border-white/30 bg-white/20 p-4 shadow-inner backdrop-blur-md">
                <BookCopy className="h-10 w-10 text-white drop-shadow-sm" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-md">
                  {courseCode} - {courseName}
                </h1>
                <p className="mt-2 font-medium text-indigo-100">
                  Manage resources, notes, and files for this course
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/50 p-6 shadow-sm backdrop-blur-sm lg:p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Upload Form Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24 overflow-hidden border border-slate-200 bg-white shadow-xl">
              <div className="h-2 w-full bg-gradient-to-r from-indigo-500 to-violet-600"></div>
              <div className="card-body p-6">
                <h2 className="card-title mb-6 flex items-center gap-3 text-xl font-bold text-slate-800">
                  <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600 shadow-inner">
                    <Upload className="h-5 w-5" />
                  </div>
                  Upload New
                </h2>
                <form onSubmit={handleUpload} className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-slate-700">
                        Material Title
                      </span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full bg-slate-50/50 focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="e.g., Lecture 1 Notes"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-slate-700">
                        Description / Content (Optional)
                      </span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered h-28 w-full bg-slate-50/50 focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="Add notes, links, or context here..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-slate-700">
                        Select File (Optional)
                      </span>
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      className="file-input file-input-bordered file-input-primary w-full bg-slate-50/50"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                    <label className="label">
                      <span className="label-text-alt font-medium text-slate-500">
                        PDF, DOCX, JPG, ZIP, etc.
                      </span>
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary mt-4 w-full border-0 bg-indigo-600 text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg"
                    disabled={uploading || (!file && !description) || !title}
                  >
                    {uploading ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      "Publish Material"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Materials List */}
          <div className="lg:col-span-2">
            {materials.length === 0 ? (
              <div className="card group relative overflow-hidden border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-50 to-white"></div>
                <div className="card-body relative z-10 min-h-[300px] items-center justify-center">
                  <div className="mb-6 rounded-full bg-slate-100 p-5 shadow-inner ring-4 ring-slate-50 transition-all duration-300 group-hover:scale-110">
                    <File className="h-12 w-12 animate-pulse text-indigo-400" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-slate-700">
                    No Materials Uploaded
                  </h3>
                  <p className="mx-auto max-w-sm leading-relaxed text-slate-500">
                    Upload a file or write a note from the sidebar to get
                    started and share resources with your students.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {materials.map((m) => (
                  <div
                    key={m.id}
                    className="card group flex flex-col border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="h-2 w-full rounded-t-2xl bg-gradient-to-r from-indigo-400 to-violet-500 opacity-80 transition-opacity group-hover:opacity-100"></div>
                    <div className="card-body gap-4 p-6 sm:p-8">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                        <div className="flex flex-1 items-center gap-4">
                          <div className="rounded-xl bg-slate-50 p-3 shadow-inner transition-transform group-hover:scale-110">
                            {m.file_path ? (
                              getFileIcon(m.original_name)
                            ) : (
                              <FileText className="h-8 w-8 text-indigo-500" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="line-clamp-2 text-xl leading-snug font-bold text-slate-800">
                              {m.title}
                            </h3>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                              {m.file_path && (
                                <>
                                  <span
                                    className="max-w-[200px] truncate rounded bg-slate-100 px-2 py-1"
                                    title={m.original_name}
                                  >
                                    {m.original_name}
                                  </span>
                                  <span>•</span>
                                </>
                              )}
                              <span className="rounded bg-indigo-50 px-2 py-1 text-indigo-700">
                                {formatDate(m.created_at)}
                              </span>
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
                              className="btn btn-primary btn-sm border-0 bg-indigo-600 text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg"
                              title="Download"
                            >
                              <Download className="mr-1 h-4 w-4" /> Download
                            </a>
                          )}
                          <button
                            onClick={() => handleDelete(m.id)}
                            className="btn btn-square btn-ghost btn-sm hover:bg-error/10 hover:text-error text-slate-400"
                            title="Delete Material"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      {/* Description Block */}
                      {m.description && (
                        <div className="mt-2 flex-1 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed whitespace-pre-wrap text-slate-600 shadow-inner">
                          {m.description}
                        </div>
                      )}
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
