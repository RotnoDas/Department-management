import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import api from "../../api/axios";
import { addToast } from "../../utils/toast";
import Loading from "../../components/Loading";
import {
  File,
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
      addToast({
        title: "Failed to load materials or unauthorized access.",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
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

  const formatDate = (dateString) => {
    const options = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (loading) return <Loading fullScreen text="Loading materials..." />;

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
                <BookCopy className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-800">
                  {courseCode}
                  <span className="mx-3 font-light text-slate-300">|</span>
                  <span className="font-bold text-slate-600">{courseName}</span>
                </h1>
                <p className="mt-1 text-sm font-black tracking-widest text-slate-400 uppercase">
                  Course Materials & Resources
                </p>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="rounded-2xl bg-white/60 px-6 py-3 shadow-sm ring-1 ring-slate-200/50 backdrop-blur-sm">
              <span className="text-[10px] font-black tracking-widest text-indigo-600 uppercase">
                {materials.length} Resources Available
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {materials.length === 0 ? (
          <div className="relative overflow-hidden rounded-[3rem] bg-white/50 p-20 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-sky-50/50 opacity-60"></div>
            <div className="relative z-10 flex flex-col items-center justify-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-sky-100 p-6 shadow-inner ring-4 ring-white transition-transform duration-500 hover:scale-110">
                <File className="h-12 w-12 text-indigo-500" />
              </div>
              <h3 className="mb-3 text-3xl font-black tracking-tight text-slate-800">
                Library is Empty
              </h3>
              <p className="mx-auto max-w-sm text-lg leading-relaxed font-bold text-slate-400">
                No materials have been uploaded for this course yet. Please
                check back later.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {materials.map((m) => (
              <div
                key={m.id}
                className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:ring-indigo-100"
              >
                <div className="relative z-10 flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-5">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-100 transition-all duration-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-200">
                        {m.filePath ? (
                          getFileIcon(m.originalName)
                        ) : (
                          <FileText className="h-7 w-7 text-indigo-500 transition-colors group-hover:text-white" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h2 className="line-clamp-2 text-lg leading-[1.2] font-black tracking-tight text-slate-800 transition-colors group-hover:text-indigo-700">
                          {m.title}
                        </h2>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-black tracking-widest text-indigo-600 uppercase shadow-sm ring-1 ring-indigo-100/50 transition-all duration-300 group-hover:bg-white">
                            <Calendar className="h-3.5 w-3.5 opacity-50" />
                            {formatDate(m.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {m.description && (
                    <div className="mt-6 line-clamp-3 rounded-2xl bg-slate-50/50 p-4 text-sm leading-relaxed font-bold text-slate-500/80 ring-1 ring-slate-100/50 transition-colors group-hover:bg-white group-hover:ring-indigo-100/20">
                      {m.description}
                    </div>
                  )}

                  <div className="mt-auto pt-6">
                    {m.filePath ? (
                      <a
                        href={`http://localhost:3001${m.filePath}`}
                        target="_blank"
                        rel="noreferrer"
                        className="group/dl flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 text-sm font-black tracking-widest text-white uppercase shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-600 hover:shadow-indigo-200"
                      >
                        <Download className="h-4 w-4 transition-transform group-hover/dl:scale-110" />
                        <span>Download File</span>
                      </a>
                    ) : (
                      <div className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/30">
                        <span className="text-[10px] font-black tracking-widest text-slate-300 uppercase">
                          Text Content Only
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
