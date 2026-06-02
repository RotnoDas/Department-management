import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import api from "../../api/axios";
import { addToast } from "@heroui/toast";
import Loading from "../../components/Loading";
import {
  File,
  ArrowLeft,
  BookCopy,
  FileText,
  FileImage,
  FileArchive,
  Download,
} from "lucide-react";

export default function StudentCourseMaterials() {
  const { courseCode } = useParams();
  const [courseName, setCourseName] = useState("");
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaterials();
  }, [courseCode]);

  const fetchMaterials = async () => {
    try {
      const { data } = await api.get(
        `/student/courses/${courseCode}/materials`,
      );
      setCourseName(data.courseName);
      setMaterials(data.materials);
    } catch (err) {
      addToast({ title: "Failed to load materials or unauthorized access.", color: "danger" });
    } finally {
      setLoading(false);
    }
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
    <div className="page-transition mx-auto max-w-5xl space-y-8 pb-10">
      {/* Impressive Header matching the Theme */}
      <div className="card relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-48 w-48 rounded-full bg-white opacity-10 blur-2xl"></div>
        <div className="absolute bottom-0 left-10 -mb-10 h-32 w-32 rounded-full bg-violet-400 opacity-20 blur-xl"></div>
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
                <BookCopy className="h-10 w-10 text-white drop-shadow-sm" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-md">
                  {courseCode} - {courseName}
                </h1>
                <p className="mt-2 font-medium text-indigo-100">
                  Access notes, links, and resources shared by your faculty
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/50 p-6 shadow-sm backdrop-blur-sm lg:p-8">
        {materials.length === 0 ? (
          <div className="card group relative overflow-hidden border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-50 to-white"></div>
            <div className="card-body relative z-10 min-h-[300px] items-center justify-center">
              <div className="mb-6 rounded-full bg-slate-100 p-5 shadow-inner ring-4 ring-slate-50 transition-all duration-300 group-hover:scale-110">
                <File className="h-12 w-12 animate-pulse text-indigo-400" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-slate-700">
                No Resources Yet
              </h3>
              <p className="mx-auto max-w-sm leading-relaxed text-slate-500">
                Your faculty has not uploaded any materials for this course yet.
                Check back soon!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {materials.map((m) => (
              <div
                key={m.id}
                className="card group flex flex-col border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="h-2 w-full rounded-t-2xl bg-gradient-to-r from-indigo-400 to-sky-500 opacity-80 transition-opacity group-hover:opacity-100"></div>
                <div className="card-body flex flex-1 flex-col gap-4 p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-slate-50 p-3 shadow-inner transition-transform group-hover:scale-110">
                      {m.filePath ? (
                        getFileIcon(m.originalName)
                      ) : (
                        <FileText className="h-8 w-8 text-indigo-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3
                        className="line-clamp-2 text-lg leading-snug font-bold text-slate-800"
                        title={m.title}
                      >
                        {m.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                        {m.filePath && (
                          <>
                            <span
                              className="max-w-[120px] truncate rounded bg-slate-100 px-2 py-1"
                              title={m.originalName}
                            >
                              {m.originalName}
                            </span>
                            <span>•</span>
                          </>
                        )}
                        <span className="rounded bg-indigo-50 px-2 py-1 text-indigo-700">
                          {formatDate(m.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {m.description && (
                    <div className="mt-2 flex-1 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed whitespace-pre-wrap text-slate-600 shadow-inner">
                      {m.description}
                    </div>
                  )}

                  {m.filePath && (
                    <div className="mt-auto border-t border-slate-100 pt-4">
                      <a
                        href={`http://localhost:3001${m.filePath}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary w-full border-0 bg-indigo-600 text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg"
                      >
                        <Download className="mr-2 h-4 w-4" /> Download File
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
