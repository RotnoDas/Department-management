import { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import { SEMESTER_COURSES } from "../../data/courses";
import { BookOpen } from "lucide-react";

export default function AdminCourses() {
  const [dbCourses, setDbCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, teachersRes] = await Promise.all([
        api.get("/admin/courses"),
        api.get("/admin/teachers"), // getting approved teachers
      ]);
      setDbCourses(coursesRes.data);
      // Filter only approved teachers for assignment
      setTeachers(teachersRes.data.filter((t) => t.status === "approved"));
    } catch (err) {
      toast.error("Failed to load courses data.");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (
    courseCode,
    courseName,
    semester,
    teacherUserId,
  ) => {
    setAssigning(courseCode);
    try {
      await api.post(`/admin/courses/assign-by-code`, {
        courseCode,
        courseName,
        semester,
        teacherUserId: teacherUserId || null,
      });
      toast.success("Course assigned successfully.");
      fetchData(); // refresh data
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to assign course.");
    } finally {
      setAssigning(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="page-transition space-y-8 pb-10">
      {/* Header with Branded Courses Logo */}
      <div className="card relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="card-body relative z-10 flex-row items-center justify-between p-8">
          <div className="flex items-center gap-8">
            <div className="group relative">
              <div className="flex h-20 w-20 transform items-center justify-center rounded-3xl border border-white/30 bg-white/20 shadow-2xl backdrop-blur-xl transition-transform duration-500 group-hover:rotate-6">
                <BookOpen className="h-10 w-10 text-white drop-shadow-lg" />
              </div>
              <div className="absolute -right-2 -bottom-2 flex h-8 w-8 transform items-center justify-center rounded-xl border-2 border-white bg-green-400 text-indigo-900 shadow-lg transition-transform group-hover:scale-110">
                <BookOpen className="h-4 w-4 font-bold" />
              </div>
            </div>

            <div>
              <h1 className="flex items-center gap-3 text-4xl font-black tracking-tight">
                Course Distribution
                <div className="badge badge-success badge-sm px-3 py-3 font-bold text-white uppercase shadow-lg">
                  Active
                </div>
              </h1>
              <p className="mt-2 text-lg font-medium text-white/80">
                Manage and assign faculty members to courses
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-10">
        {Object.keys(SEMESTER_COURSES)
          .sort((a, b) => a - b)
          .map((semester) => (
            <div
              key={semester}
              className="card bg-base-100 border-base-200 overflow-hidden border shadow-md"
            >
              <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-100 to-slate-50 px-6 py-5">
                <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
                  <span className="badge badge-primary badge-lg shadow-sm">
                    {semester}
                  </span>
                  Semester
                </h2>
                <div className="text-sm font-semibold text-slate-500">
                  {SEMESTER_COURSES[semester].length} Courses
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="bg-slate-50/50 text-sm font-semibold tracking-wider text-slate-600 uppercase">
                      <th className="px-6 py-4">Code</th>
                      <th className="px-6 py-4">Course Name</th>
                      <th className="px-6 py-4 text-center">Credits</th>
                      <th className="px-6 py-4">Current Faculty</th>
                      <th className="w-72 px-6 py-4">Assign New</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {SEMESTER_COURSES[semester].map((course) => {
                      const dbCourse = dbCourses.find(
                        (c) => c.courseCode === course.code,
                      );
                      const currentTeacherUserId =
                        dbCourse?.teacherUserId || "";
                      const currentTeacherName = dbCourse?.teacherName || null;

                      return (
                        <tr
                          key={course.code}
                          className="transition-colors hover:bg-slate-50/70"
                        >
                          <td className="px-6 py-4">
                            <span className="rounded bg-indigo-50 px-2 py-1 font-mono font-bold text-indigo-700">
                              {course.code}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-800">
                            {course.title}
                          </td>
                          <td className="px-6 py-4 text-center font-semibold text-slate-500">
                            {course.credits}
                          </td>
                          <td className="px-6 py-4">
                            {currentTeacherName ? (
                              <div className="flex items-center gap-2">
                                <div className="bg-success h-2 w-2 rounded-full"></div>
                                <span className="font-semibold text-slate-700">
                                  {currentTeacherName}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-slate-300"></div>
                                <span className="text-slate-400 italic">
                                  Unassigned
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <select
                                className="select select-bordered select-sm focus:border-primary focus:ring-primary/50 w-full bg-white shadow-sm transition-all focus:ring-1"
                                value={currentTeacherUserId}
                                onChange={(e) => {
                                  handleAssign(
                                    course.code,
                                    course.title,
                                    parseInt(semester),
                                    e.target.value,
                                  );
                                }}
                                disabled={assigning === course.code}
                              >
                                <option value="">-- Select Teacher --</option>
                                {teachers.map((t) => (
                                  <option key={t.userId} value={t.userId}>
                                    {t.name}
                                  </option>
                                ))}
                              </select>
                              {assigning === course.code && (
                                <span className="loading loading-spinner loading-xs text-primary ml-1"></span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
