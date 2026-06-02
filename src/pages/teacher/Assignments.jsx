import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import api from "../../api/axios";
import { addToast } from "@heroui/toast";
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
          title: err.response?.data?.error || "Failed to load assignment submissions.", 
          color: "danger" 
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
      return <FileText className="h-7 w-7 text-rose-500" />;
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext))
      return <FileImage className="h-7 w-7 text-sky-500" />;
    if (["zip", "rar", "7z", "tar"].includes(ext))
      return <FileArchive className="h-7 w-7 text-amber-500" />;
    return <File className="h-7 w-7 text-slate-500" />;
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

  const handleCourseChange = (courseCode) => {
    if (courseCode === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ course: courseCode });
    }
  };

  if (loading) return <Loading />;

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
    <div className="page-transition mx-auto max-w-7xl space-y-8 pb-10">
      <div className="card relative overflow-hidden bg-gradient-to-br from-sky-700 via-blue-700 to-indigo-700 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-48 w-48 rounded-full bg-white opacity-10 blur-2xl"></div>
        <div className="absolute bottom-0 left-10 -mb-10 h-32 w-32 rounded-full bg-sky-400 opacity-20 blur-xl"></div>
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
                <FileText className="h-10 w-10 text-white drop-shadow-sm" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-md">
                  Assignment Submissions
                </h1>
                <p className="mt-2 font-medium text-sky-100">
                  Semester-wise submissions from your assigned courses
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="card border border-slate-200 bg-white shadow-sm">
          <div className="card-body flex-row items-center gap-4 p-5">
            <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Submissions
              </p>
              <p className="text-2xl font-extrabold text-slate-800">
                {filteredSubmissions.length}
              </p>
            </div>
          </div>
        </div>
        <div className="card border border-slate-200 bg-white shadow-sm">
          <div className="card-body flex-row items-center gap-4 p-5">
            <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-700">
              <BookCopy className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Courses
              </p>
              <p className="text-2xl font-extrabold text-slate-800">
                {courseCount}
              </p>
            </div>
          </div>
        </div>
        <div className="card border border-slate-200 bg-white shadow-sm">
          <div className="card-body flex-row items-center gap-4 p-5">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Semesters
              </p>
              <p className="text-2xl font-extrabold text-slate-800">
                {semesterCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {activeCourse
                ? `${activeCourse.courseCode} - ${activeCourse.courseName}`
                : "All Assigned Courses"}
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Grouped by semester, course, student name, and roll
            </p>
          </div>
          <select
            className="select select-bordered w-full bg-white md:w-80"
            value={selectedCourse}
            onChange={(e) => handleCourseChange(e.target.value)}
          >
            <option value="all">All Assigned Courses</option>
            {courses.map((course) => (
              <option key={course.courseCode} value={course.courseCode}>
                {course.courseCode} - Semester {course.semester}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredSubmissions.length === 0 ? (
        <div className="card group relative overflow-hidden border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <div className="card-body relative z-10 min-h-[300px] items-center justify-center">
            <div className="mb-6 rounded-full bg-slate-100 p-5 shadow-inner ring-4 ring-slate-50 transition-all duration-300 group-hover:scale-110">
              <File className="h-12 w-12 text-sky-400" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-slate-700">
              No Submissions Found
            </h3>
            <p className="mx-auto max-w-sm leading-relaxed text-slate-500">
              Student assignment submissions for your assigned courses will
              appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {semesterKeys.map((semester) => {
            const courseGroups = groupedSubmissions[semester];
            const courseCodes = Object.keys(courseGroups).sort();

            return (
              <section
                key={semester}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md"
              >
                <div className="flex flex-col gap-2 border-b border-sky-100 bg-gradient-to-r from-sky-50 to-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="flex items-center gap-3 text-lg font-bold text-slate-800">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600 text-white shadow-md">
                      {semester}
                    </span>
                    Semester {semester}
                  </h3>
                  <span className="badge badge-ghost font-semibold text-slate-500">
                    {courseCodes.length} Courses
                  </span>
                </div>

                <div className="space-y-6 bg-slate-50/50 p-5 sm:p-6">
                  {courseCodes.map((courseCode) => {
                    const group = courseGroups[courseCode];

                    return (
                      <div
                        key={courseCode}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                      >
                        <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <span className="badge rounded-lg border-0 bg-sky-100 px-3 py-3 font-mono font-bold tracking-wide text-sky-800 shadow-sm">
                              {courseCode}
                            </span>
                            <h4 className="mt-3 text-lg font-bold text-slate-800">
                              {group.courseName}
                            </h4>
                          </div>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">
                            {group.submissions.length} Submissions
                          </span>
                        </div>

                        <div className="divide-y divide-slate-100">
                          {group.submissions.map((submission) => (
                            <div
                              key={submission.id}
                              className="grid grid-cols-1 gap-4 p-5 xl:grid-cols-[1.1fr_1.3fr_auto]"
                            >
                              <div className="min-w-0 space-y-2">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 shrink-0 text-sky-600" />
                                  <span className="truncate text-base font-bold text-slate-800">
                                    {submission.studentName}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                                  <IdCard className="h-4 w-4 shrink-0" />
                                  Roll: {submission.studentRoll || "N/A"}
                                </div>
                              </div>

                              <div className="min-w-0 space-y-3">
                                <div className="flex items-start gap-3">
                                  <div className="rounded-xl bg-slate-50 p-2 shadow-inner">
                                    {getFileIcon(submission.originalName)}
                                  </div>
                                  <div className="min-w-0">
                                    <h5 className="line-clamp-2 font-bold text-slate-800">
                                      {submission.title}
                                    </h5>
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
                                      <span className="rounded bg-sky-50 px-2 py-1 text-sky-700">
                                        {formatDate(submission.createdAt)}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {submission.note && (
                                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm leading-relaxed whitespace-pre-wrap text-slate-600">
                                    {submission.note}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-start justify-end">
                                <a
                                  href={`http://localhost:3001${submission.filePath}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-primary btn-sm border-0 bg-sky-600 text-white shadow-md transition-all hover:bg-sky-700 hover:shadow-lg"
                                >
                                  <Download className="mr-1 h-4 w-4" />
                                  Download
                                </a>
                              </div>
                            </div>
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
  );
}
