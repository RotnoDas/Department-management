import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import api from "../../api/axios";
import { addToast } from "../../utils/toast";
import Loading from "../../components/Loading";
import {
  ArrowLeft,
  BookCopy,
  CheckSquare,
  Download,
  File,
  FileArchive,
  FileImage,
  FileText,
  Upload,
  User,
  Sparkles,
  Layers,
  Zap,
  Calendar,
} from "lucide-react";

export default function StudentAssignmentSubmission() {
  const { courseCode } = useParams();
  const [courseName, setCourseName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    let active = true;

    api
      .get(`/student/courses/${courseCode}/assignments`)
      .then(({ data }) => {
        if (!active) return;
        setCourseName(data.courseName);
        setTeacherName(data.teacherName || "Pending Assignment");
        setCanSubmit(data.canSubmit);
        setSubmissions(data.submissions);
      })
      .catch((err) => {
        if (!active) return;
        addToast({
          title:
            err.response?.data?.error ||
            "Failed to load assignment submissions.",
          color: "danger",
        });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [courseCode]);

  const refreshAssignments = async () => {
    const { data } = await api.get(
      `/student/courses/${courseCode}/assignments`,
    );
    setCourseName(data.courseName);
    setTeacherName(data.teacherName || "Pending Assignment");
    setCanSubmit(data.canSubmit);
    setSubmissions(data.submissions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim())
      return addToast({
        title: "Assignment title is required.",
        color: "danger",
      });
    if (!file)
      return addToast({ title: "Select a file to submit.", color: "danger" });

    setUploading(true);
    const formData = new FormData();
    formData.append("title", title.trim());
    if (note.trim()) formData.append("note", note.trim());
    formData.append("file", file);

    try {
      await api.post(`/student/courses/${courseCode}/assignments`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      addToast({
        title: "Assignment submitted successfully.",
        color: "success",
      });
      setTitle("");
      setNote("");
      setFile(null);
      const fileInput = document.getElementById("assignment-file-upload");
      if (fileInput) fileInput.value = "";
      await refreshAssignments();
    } catch (err) {
      addToast({
        title: err.response?.data?.error || "Submission failed.",
        color: "danger",
      });
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    if (["pdf"].includes(ext))
      return <FileText className="h-6 w-6 text-rose-500" />;
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext))
      return <FileImage className="h-6 w-6 text-sky-500" />;
    if (["zip", "rar", "7z", "tar"].includes(ext))
      return <FileArchive className="h-6 w-6 text-amber-500" />;
    return <File className="h-6 w-6 text-slate-400" />;
  };

  const formatDate = (dateString) => {
    const options = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex += 1;
    }
    return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
  };

  if (loading) return <Loading fullScreen text="Loading tasks..." />;

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
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-xl ring-1 ring-slate-100 transition-transform duration-500 hover:rotate-6">
                <Upload className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-800">
                  {courseCode}
                  <span className="mx-3 font-light text-slate-300">|</span>
                  <span className="font-bold text-slate-600">{courseName}</span>
                </h1>
                <p className="mt-1 text-sm font-black tracking-widest text-slate-400 uppercase">
                  Assignment Hub & Tracking
                </p>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="rounded-2xl bg-white/60 px-6 py-3 shadow-sm ring-1 ring-slate-200/50 backdrop-blur-sm">
              <span className="text-[10px] font-black tracking-widest text-indigo-600 uppercase">
                Course: {courseCode}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Submission Form Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 overflow-hidden rounded-[2.5rem] bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-100">
            <div className="bg-gradient-to-br from-indigo-50/50 to-white p-8">
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner ring-1 ring-indigo-100">
                  <BookCopy className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight text-slate-800">
                    New Submission
                  </h3>
                  <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Hand in your work
                  </p>
                </div>
              </div>

              <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <p className="mb-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
                  Target Faculty
                </p>
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-indigo-600" />
                  <span className="text-sm font-black text-slate-700">
                    {teacherName}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-[10px] font-black tracking-widest text-slate-500 uppercase">
                      Assignment Title
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full rounded-xl font-bold transition-all focus:ring-2 focus:ring-indigo-100"
                    placeholder="e.g., Lab Report 2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={!canSubmit}
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-[10px] font-black tracking-widest text-slate-500 uppercase">
                      Notes (Optional)
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24 w-full rounded-xl font-bold transition-all focus:ring-2 focus:ring-indigo-100"
                    placeholder="Message for your teacher..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    disabled={!canSubmit}
                  ></textarea>
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-[10px] font-black tracking-widest text-slate-500 uppercase">
                      Select File
                    </span>
                  </label>
                  <input
                    id="assignment-file-upload"
                    type="file"
                    className="file-input file-input-bordered file-input-primary w-full rounded-xl"
                    onChange={(e) => setFile(e.target.files[0])}
                    disabled={!canSubmit}
                  />
                </div>
                <button
                  type="submit"
                  className="btn group mt-4 h-14 w-full rounded-2xl border-0 bg-indigo-600 text-sm font-black tracking-[0.2em] text-white uppercase shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1 hover:scale-[1.02] hover:bg-indigo-700 hover:shadow-xl"
                  disabled={uploading || !canSubmit || !title.trim() || !file}
                >
                  {uploading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 group-hover:animate-pulse" />
                      <span>Submit Assignment</span>
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="lg:col-span-2">
          {submissions.length === 0 ? (
            <div className="relative overflow-hidden rounded-[3rem] bg-white/50 p-20 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-sky-50/50 opacity-60"></div>
              <div className="relative z-10 flex min-h-[300px] flex-col items-center justify-center">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-sky-100 p-6 shadow-inner ring-4 ring-white transition-transform duration-500 hover:scale-110">
                  <File className="h-12 w-12 text-indigo-500" />
                </div>
                <h3 className="mb-3 text-3xl font-black tracking-tight text-slate-800">
                  No Submissions
                </h3>
                <p className="mx-auto max-w-sm text-lg leading-relaxed font-bold text-slate-400">
                  Your submitted assignments will be archived here for tracking.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              <div className="mb-2 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-black tracking-tight text-slate-800">
                  Your Portfolio
                </h3>
                <div className="h-px flex-1 bg-slate-200"></div>
              </div>

              {submissions.map((submission) => (
                <article
                  key={submission.id}
                  className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/50 transition-all duration-500 hover:shadow-xl hover:ring-indigo-100"
                >
                  <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-start">
                    <div className="flex flex-1 items-start gap-5">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-100 transition-all duration-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-200">
                        {getFileIcon(submission.originalName)}
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-xl leading-[1.2] font-black tracking-tight text-slate-800 transition-colors group-hover:text-indigo-700">
                          {submission.title}
                        </h2>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-black tracking-widest text-indigo-600 uppercase shadow-sm ring-1 ring-indigo-100/50 transition-all duration-300 group-hover:bg-white">
                            <Calendar className="h-3.5 w-3.5 opacity-50" />
                            {formatDate(submission.createdAt)}
                          </span>
                          <span className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-[10px] font-black tracking-widest text-slate-500 uppercase shadow-sm ring-1 ring-slate-100 transition-all duration-300 group-hover:bg-white">
                            <CheckSquare className="h-3.5 w-3.5 text-emerald-500" />
                            Submitted
                          </span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={`http://localhost:3001${submission.filePath}`}
                      target="_blank"
                      rel="noreferrer"
                      className="group/dl flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-[10px] font-black tracking-[0.15em] text-white uppercase shadow-lg transition-all hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-indigo-100 sm:self-start"
                    >
                      <Download className="h-4 w-4 transition-transform group-hover/dl:scale-110" />
                      <span>Download</span>
                    </a>
                  </div>

                  {submission.note && (
                    <div className="mt-6 rounded-2xl bg-slate-50/50 p-5 text-sm leading-relaxed font-bold text-slate-500/80 ring-1 ring-slate-100/50 transition-colors group-hover:bg-white group-hover:ring-indigo-100/20">
                      <p className="whitespace-pre-wrap">{submission.note}</p>
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
