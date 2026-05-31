import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import api from "../../api/axios";
import { toast } from "react-toastify";
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
        toast.error(
          err.response?.data?.error || "Failed to load assignment submissions.",
        );
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
    if (!title.trim()) return toast.error("Assignment title is required.");
    if (!file) return toast.error("Select a file to submit.");

    setUploading(true);
    const formData = new FormData();
    formData.append("title", title.trim());
    if (note.trim()) formData.append("note", note.trim());
    formData.append("file", file);

    try {
      await api.post(`/student/courses/${courseCode}/assignments`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Assignment submitted successfully.");
      setTitle("");
      setNote("");
      setFile(null);
      const fileInput = document.getElementById("assignment-file-upload");
      if (fileInput) fileInput.value = "";
      await refreshAssignments();
    } catch (err) {
      toast.error(err.response?.data?.error || "Submission failed.");
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    if (["pdf"].includes(ext))
      return <FileText className="h-8 w-8 text-rose-500" />;
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext))
      return <FileImage className="h-8 w-8 text-sky-500" />;
    if (["zip", "rar", "7z", "tar"].includes(ext))
      return <FileArchive className="h-8 w-8 text-amber-500" />;
    return <File className="h-8 w-8 text-slate-500" />;
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

  if (loading) return <Loading />;

  return (
    <div className="page-transition mx-auto max-w-6xl space-y-8 pb-10">
      <div className="card relative overflow-hidden bg-gradient-to-br from-cyan-700 via-blue-700 to-indigo-700 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-48 w-48 rounded-full bg-white opacity-10 blur-2xl"></div>
        <div className="absolute bottom-0 left-10 -mb-10 h-32 w-32 rounded-full bg-cyan-400 opacity-20 blur-xl"></div>
        <div className="card-body relative z-10 p-8">
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
                <Upload className="h-10 w-10 text-white drop-shadow-sm" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-md">
                  {courseCode} - {courseName}
                </h1>
                <p className="mt-2 font-medium text-cyan-100">
                  Submit coursework files and track your previous submissions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/50 p-6 shadow-sm backdrop-blur-sm lg:p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="card sticky top-24 overflow-hidden border border-slate-200 bg-white shadow-xl">
              <div className="h-2 w-full bg-gradient-to-r from-cyan-500 to-blue-600"></div>
              <div className="card-body p-6">
                <h2 className="card-title mb-4 flex items-center gap-3 text-xl font-bold text-slate-800">
                  <div className="rounded-lg bg-cyan-100 p-2 text-cyan-700 shadow-inner">
                    <BookCopy className="h-5 w-5" />
                  </div>
                  New Submission
                </h2>

                <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    Assigned Faculty
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                    <User className="h-4 w-4 text-cyan-600" />
                    {teacherName}
                  </div>
                </div>

                {!canSubmit && (
                  <div className="alert mb-4 border-amber-200 bg-amber-50 text-amber-800">
                    <FileText className="h-5 w-5" />
                    <span>No faculty is assigned to this course yet.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-slate-700">
                        Assignment Title
                      </span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full bg-slate-50/50 focus:ring-2 focus:ring-cyan-500/20"
                      placeholder="e.g., Lab Report 2"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={!canSubmit}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-slate-700">
                        Note (Optional)
                      </span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered h-24 w-full bg-slate-50/50 focus:ring-2 focus:ring-cyan-500/20"
                      placeholder="Add a short note for your teacher..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      disabled={!canSubmit}
                    ></textarea>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-slate-700">
                        Assignment File
                      </span>
                    </label>
                    <input
                      id="assignment-file-upload"
                      type="file"
                      className="file-input file-input-bordered file-input-info w-full bg-slate-50/50"
                      onChange={(e) => setFile(e.target.files[0])}
                      disabled={!canSubmit}
                    />
                    <label className="label">
                      <span className="label-text-alt font-medium text-slate-500">
                        Any file type is accepted.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-info mt-4 w-full border-0 text-white shadow-md transition-all hover:shadow-lg"
                    disabled={uploading || !canSubmit || !title.trim() || !file}
                  >
                    {uploading ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Submit Assignment
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {submissions.length === 0 ? (
              <div className="card group relative overflow-hidden border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
                <div className="card-body relative z-10 min-h-[300px] items-center justify-center">
                  <div className="mb-6 rounded-full bg-slate-100 p-5 shadow-inner ring-4 ring-slate-50 transition-all duration-300 group-hover:scale-110">
                    <File className="h-12 w-12 text-cyan-400" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-slate-700">
                    No Submissions Yet
                  </h3>
                  <p className="mx-auto max-w-sm leading-relaxed text-slate-500">
                    Submit your assignment file from the form to keep it visible
                    here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="card group flex flex-col border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="h-2 w-full rounded-t-2xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-80 transition-opacity group-hover:opacity-100"></div>
                    <div className="card-body gap-4 p-6 sm:p-8">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                        <div className="flex flex-1 items-center gap-4">
                          <div className="rounded-xl bg-slate-50 p-3 shadow-inner transition-transform group-hover:scale-110">
                            {getFileIcon(submission.originalName)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="line-clamp-2 text-xl leading-snug font-bold text-slate-800">
                              {submission.title}
                            </h3>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                              <span
                                className="max-w-[220px] truncate rounded bg-slate-100 px-2 py-1"
                                title={submission.originalName}
                              >
                                {submission.originalName}
                              </span>
                              {submission.fileSize && (
                                <span className="rounded bg-slate-100 px-2 py-1">
                                  {formatFileSize(submission.fileSize)}
                                </span>
                              )}
                              <span className="rounded bg-cyan-50 px-2 py-1 text-cyan-700">
                                {formatDate(submission.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <a
                          href={`http://localhost:3001${submission.filePath}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-info btn-sm border-0 text-white shadow-md transition-all hover:shadow-lg sm:self-start"
                        >
                          <Download className="mr-1 h-4 w-4" /> Download
                        </a>
                      </div>

                      {submission.note && (
                        <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed whitespace-pre-wrap text-slate-600 shadow-inner">
                          {submission.note}
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                        <CheckSquare className="h-4 w-4" />
                        Submitted
                      </div>
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
