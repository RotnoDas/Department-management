import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import api from "../../api/axios";
import { addToast } from "../../utils/toast";
import Loading from "../../components/Loading";
import {
  ArrowLeft,
  BookCopy,
  Calendar,
  Download,
  File,
  FileArchive,
  FileImage,
  FileText,
  IdCard,
  User,
  Sparkles,
  Layers,
  Search,
  Filter,
} from "lucide-react";

export default function TeacherAssignments() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const selectedCourse = searchParams.get("course") || "all";

  useEffect(() => {
    let active = true;

    api
      .get("/teacher/assignments")
      .then(({ data }) => {
        if (!active) return;
        setCourses(data.courses);
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
  }, []);

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

  const handleCourseChange = (courseCode) => {
    if (courseCode === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ course: courseCode });
    }
  };

  if (loading) return <Loading fullScreen text="Loading tasks..." />;

  const filteredSubmissions =
    selectedCourse === "all"
      ? submissions
      : submissions.filter((item) => item.courseCode === selectedCourse);

  const groupedSubmissions = filteredSubmissions.reduce((acc, submission) => {
    const semester = submission.semester;
    if (!acc[semester]) acc[semester] = {};
    if (!acc[semester][submission.courseCode]) {
      acc[semester][submission.courseCode] = {
        courseName: submission.courseName,
        submissions: [],
      };
    }
    acc[semester][submission.courseCode].submissions.push(submission);
    return acc;
  }, {});

  const semesterKeys = Object.keys(groupedSubmissions).sort(
    (a, b) => Number(a) - Number(b),
  );
  const activeCourse = courses.find(
    (course) => course.courseCode === selectedCourse,
  );
  const courseCount = new Set(
    filteredSubmissions.map((submission) => submission.courseCode),
  ).size;
  const semesterCount = new Set(
    filteredSubmissions.map((submission) => submission.semester),
  ).size;

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
                <FileText className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-800">
                  Tasks & Submissions
                </h1>
                <p className="mt-1 text-sm font-black tracking-widest text-slate-400 uppercase">
                  Track and review student coursework
                </p>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="rounded-2xl bg-white/60 px-6 py-3 shadow-sm ring-1 ring-slate-200/50 backdrop-blur-sm">
              <span className="text-[10px] font-black tracking-widest text-indigo-600 uppercase">
                Teacher Review Mode
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary - Glued Effect */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-50 to-white p-6 text-slate-800 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-indigo-100">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                Submissions
              </p>
              <p className="mt-1 text-4xl font-black tracking-tighter text-slate-800">
                {submissions.length}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-indigo-100 shadow-sm ring-1 ring-indigo-200">
              <FileText className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
        <div className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-50 to-white p-6 text-slate-800 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-sky-100">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                Active Courses
              </p>
              <p className="mt-1 text-4xl font-black tracking-tighter text-slate-800">
                {courseCount}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-sky-100 shadow-sm ring-1 ring-sky-200">
              <BookCopy className="h-6 w-6 text-sky-600" />
            </div>
          </div>
        </div>
        <div className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-50 to-white p-6 text-slate-800 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-emerald-100">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                Total Semesters
              </p>
              <p className="mt-1 text-4xl font-black tracking-tighter text-slate-800">
                {semesterCount}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-emerald-100 shadow-sm ring-1 ring-emerald-200">
              <Layers className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Content Area */}
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-between gap-6 rounded-full bg-white/80 p-2 shadow-sm ring-1 ring-slate-200/60 backdrop-blur-md lg:flex-row lg:pr-6">
          <div className="group relative w-full flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center transition-colors group-focus-within:text-indigo-600">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by course or student..."
              className="w-full rounded-full border-none bg-transparent py-3 pr-10 pl-12 text-sm font-semibold text-slate-600 transition-all outline-none placeholder:text-slate-400 focus:ring-0"
              readOnly
              value={
                activeCourse
                  ? activeCourse.courseName
                  : "All Course Submissions"
              }
            />
          </div>

          <div className="flex h-10 items-center gap-1 rounded-full bg-slate-100/50 p-1 ring-1 ring-slate-200/30">
            <div className="mr-1 flex items-center gap-2 border-r border-slate-200 px-4">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                Filter By
              </span>
            </div>
            <select
              className="h-8 rounded-full bg-white px-4 text-xs font-black text-indigo-600 shadow-sm ring-1 ring-slate-200/50 transition-all outline-none hover:bg-slate-50"
              value={selectedCourse}
              onChange={(e) => handleCourseChange(e.target.value)}
            >
              <option value="all">All Courses</option>
              {courses.map((course) => (
                <option key={course.courseCode} value={course.courseCode}>
                  {course.courseCode}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredSubmissions.length === 0 ? (
          <div className="relative overflow-hidden rounded-[3rem] bg-white/50 p-20 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-sky-50/50 opacity-60"></div>
            <div className="relative z-10 flex min-h-[300px] flex-col items-center justify-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-sky-100 p-6 shadow-inner ring-4 ring-white transition-transform duration-500 hover:scale-110">
                <FileText className="h-12 w-12 text-indigo-500" />
              </div>
              <h3 className="mb-3 text-3xl font-black tracking-tight text-slate-800">
                No Submissions
              </h3>
              <p className="mx-auto max-w-sm text-lg leading-relaxed font-bold text-slate-400">
                Assignments from your assigned courses will appear here once
                submitted by students.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {semesterKeys.map((semester) => {
              const courseGroups = groupedSubmissions[semester];
              const courseCodes = Object.keys(courseGroups).sort();

              return (
                <section key={semester} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-black text-white shadow-lg shadow-indigo-100">
                      {semester}
                    </div>
                    <h3 className="text-2xl font-black tracking-tight text-slate-800">
                      Semester {semester}
                    </h3>
                    <div className="h-px flex-1 bg-slate-200"></div>
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                    {courseCodes.map((courseCode) => {
                      const group = courseGroups[courseCode];
                      return (
                        <div
                          key={courseCode}
                          className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 transition-all duration-300 hover:shadow-xl hover:ring-indigo-100"
                        >
                          <div className="flex flex-col justify-between border-b border-slate-50 bg-gradient-to-r from-slate-50/50 to-white px-8 py-6 sm:flex-row sm:items-center">
                            <div>
                              <span className="mb-2 inline-block rounded-lg bg-indigo-50 px-3 py-1 text-[10px] font-black tracking-widest text-indigo-600 uppercase shadow-sm ring-1 ring-indigo-100/50">
                                {courseCode}
                              </span>
                              <h4 className="text-xl font-black tracking-tight text-slate-800">
                                {group.courseName}
                              </h4>
                            </div>
                            <div className="mt-4 rounded-full bg-slate-50 px-4 py-2 text-[10px] font-black tracking-widest text-slate-400 uppercase shadow-sm ring-1 ring-slate-100 sm:mt-0">
                              {group.submissions.length} Submissions
                            </div>
                          </div>

                          <div className="divide-y divide-slate-100">
                            {group.submissions.map((submission) => (
                              <article
                                key={submission.id}
                                className="grid grid-cols-1 gap-6 p-8 transition-colors hover:bg-slate-50/30 xl:grid-cols-[1fr_1.5fr_auto]"
                              >
                                <div className="space-y-4">
                                  <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-100 transition-all duration-500 group-hover:bg-indigo-600 group-hover:text-white">
                                      <User className="h-6 w-6" />
                                    </div>
                                    <div>
                                      <p className="text-base font-black text-slate-800">
                                        {submission.studentName}
                                      </p>
                                      <div className="mt-0.5 flex items-center gap-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                        <IdCard className="h-3 w-3" /> Roll{" "}
                                        {submission.studentRoll}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div className="flex items-start gap-5">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
                                      {getFileIcon(submission.originalName)}
                                    </div>
                                    <div className="min-w-0">
                                      <h5 className="line-clamp-2 text-lg leading-tight font-black text-slate-800">
                                        {submission.title}
                                      </h5>
                                      <div className="mt-3 flex flex-wrap items-center gap-2">
                                        <span className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-[10px] font-black tracking-widest text-slate-500 uppercase ring-1 ring-slate-100">
                                          {submission.originalName}
                                        </span>
                                        {submission.fileSize && (
                                          <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                            {formatFileSize(
                                              submission.fileSize,
                                            )}
                                          </span>
                                        )}
                                        <span className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-black tracking-widest text-indigo-600 uppercase">
                                          <Calendar className="h-3 w-3" />{" "}
                                          {formatDate(submission.createdAt)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  {submission.note && (
                                    <div className="rounded-2xl bg-slate-50/50 p-4 text-sm leading-relaxed font-bold text-slate-500 ring-1 ring-slate-100/50">
                                      {submission.note}
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-start justify-end">
                                  <a
                                    href={`http://localhost:3001${submission.filePath}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-[10px] font-black tracking-[0.15em] text-white uppercase shadow-lg transition-all hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-indigo-100"
                                  >
                                    <Download className="h-4 w-4" /> Download
                                  </a>
                                </div>
                              </article>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
