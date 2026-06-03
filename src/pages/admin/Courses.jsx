import { useState, useEffect } from "react";
import api from "../../api/axios";
import { addToast } from "../../utils/toast";
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
      addToast({ title: "Failed to load courses data.", color: "danger" });
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
      addToast({ title: "Course assigned successfully.", color: "success" });
      fetchData(); // refresh data
    } catch (err) {
      addToast({
        title: err.response?.data?.error || "Failed to assign course.",
        color: "danger",
      });
    } finally {
      setAssigning(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="page-transition space-y-8 pb-10">
      {/* Header with Branded Courses Logo */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-sky-100 via-indigo-50 to-white p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-100">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-white/40 blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-indigo-100/50 blur-2xl"></div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="group relative">
              <div className="flex h-20 w-20 transform items-center justify-center rounded-3xl bg-white shadow-xl ring-1 ring-slate-100 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                <BookOpen className="h-10 w-10 text-indigo-600" />
              </div>
              <div className="absolute -right-2 -bottom-2 flex h-8 w-8 transform items-center justify-center rounded-xl border-2 border-white bg-green-400 text-white shadow-lg transition-transform group-hover:scale-110">
                <BookOpen className="h-4 w-4 font-bold" />
              </div>
            </div>

            <div>
              <h1 className="flex items-center gap-3 text-4xl font-black tracking-tight text-slate-800">
                Course Distribution
                <div className="rounded-full bg-white/60 px-3 py-1 text-[10px] font-black tracking-widest text-indigo-600 uppercase shadow-sm ring-1 ring-slate-200/50 backdrop-blur-sm">
                  Active
                </div>
              </h1>
              <p className="mt-2 text-lg font-medium text-slate-500">
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
              className="group relative overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:border-indigo-100 hover:shadow-xl"
            >
              <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 opacity-70 transition-opacity duration-300 group-hover:opacity-100"></div>

              <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-white px-8 py-6 backdrop-blur-sm">
                <h2 className="flex items-center gap-3 text-2xl font-black text-slate-800">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-inner ring-1 ring-indigo-100">
                    {semester}
                  </span>
                  Semester
                </h2>
                <div className="rounded-xl bg-slate-50 px-3 py-1.5 text-xs font-bold tracking-wider text-slate-500 uppercase ring-1 ring-slate-100">
                  {SEMESTER_COURSES[semester].length} Courses
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      <th className="px-8 py-5">Code</th>
                      <th className="px-8 py-5">Course Name</th>
                      <th className="px-8 py-5 text-center">Credits</th>
                      <th className="px-8 py-5">Current Faculty</th>
                      <th className="w-72 px-8 py-5">Assign New</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/50">
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
                          className="transition-colors hover:bg-slate-50/40"
                        >
                          <td className="px-8 py-5">
                            <span className="rounded-lg bg-indigo-50 px-3 py-1.5 font-mono text-xs font-bold text-indigo-600 ring-1 ring-indigo-100/50">
                              {course.code}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-sm font-bold text-slate-700">
                            {course.title}
                          </td>
                          <td className="px-8 py-5 text-center text-sm font-bold text-slate-500">
                            {course.credits}
                          </td>
                          <td className="px-8 py-5">
                            {currentTeacherName ? (
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                                <span className="text-sm font-bold text-slate-700">
                                  {currentTeacherName}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-slate-300"></div>
                                <span className="text-sm font-semibold text-slate-400 italic">
                                  Unassigned
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                              <select
                                className="select select-bordered select-sm w-full rounded-xl bg-white font-semibold shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
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
                                <span className="loading loading-spinner loading-xs ml-1 text-indigo-500"></span>
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
