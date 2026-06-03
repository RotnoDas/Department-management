import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";

import { HeroUIProvider } from "@heroui/system";
import { Toast } from "@heroui/react";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import PublicLanding from "./pages/PublicLanding";
import ToastFlash from "./components/ToastFlash";

// Auth pages
import AdminLogin from "./pages/auth/AdminLogin";
import TeacherLogin from "./pages/auth/TeacherLogin";
import TeacherSignup from "./pages/auth/TeacherSignup";
import StudentLogin from "./pages/auth/StudentLogin";
import StudentSignup from "./pages/auth/StudentSignup";
import Pending from "./pages/auth/Pending";
import Rejected from "./pages/auth/Rejected";

// Admin
import AdminDashboard from "./pages/admin/Dashboard";
import AdminStudents from "./pages/admin/Students";
import AdminTeachers from "./pages/admin/Teachers";
import AdminCourses from "./pages/admin/Courses";
import AdminNotices from "./pages/admin/Notices";
import AdminRoutine from "./pages/admin/Routine";

// Student
import StudentDashboard from "./pages/student/Dashboard";
import StudentProfile from "./pages/student/Profile";
import StudentAttendance from "./pages/student/Attendance";
import StudentRoutine from "./pages/student/Routine";
import StudentNotices from "./pages/student/Notices";
import StudentCourseMaterials from "./pages/student/CourseMaterials";
import StudentAssignmentSubmission from "./pages/student/AssignmentSubmission";

// Teacher
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherProfile from "./pages/teacher/Profile";
import TeacherRoutine from "./pages/teacher/Routine";
import TeacherCourseMaterials from "./pages/teacher/CourseMaterials";
import TeacherAssignments from "./pages/teacher/Assignments";

const router = createBrowserRouter([
  // ── Public ────────────────────────────────────────────────
  { path: "/", element: <PublicLanding /> },
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/teacher/login", element: <TeacherLogin /> },
  { path: "/teacher/signup", element: <TeacherSignup /> },
  { path: "/student/login", element: <StudentLogin /> },
  { path: "/student/signup", element: <StudentSignup /> },
  { path: "/pending", element: <Pending /> },
  { path: "/rejected", element: <Rejected /> },

  // ── Admin ─────────────────────────────────────────────────
  {
    element: (
      <ProtectedRoute roles={["admin"]}>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/admin/dashboard", element: <AdminDashboard /> },
      { path: "/admin/students", element: <AdminStudents /> },
      { path: "/admin/teachers", element: <AdminTeachers /> },
      { path: "/admin/courses", element: <AdminCourses /> },
      { path: "/admin/routine", element: <AdminRoutine /> },
      { path: "/admin/notices", element: <AdminNotices /> },
    ],
  },

  // ── Student ───────────────────────────────────────────────
  {
    element: (
      <ProtectedRoute roles={["student"]}>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/student/dashboard", element: <StudentDashboard /> },
      { path: "/student/profile", element: <StudentProfile /> },
      { path: "/student/routine", element: <StudentRoutine /> },
      { path: "/student/attendance", element: <StudentAttendance /> },
      { path: "/student/notices", element: <StudentNotices /> },
      {
        path: "/student/courses/:courseCode/materials",
        element: <StudentCourseMaterials />,
      },
      {
        path: "/student/courses/:courseCode/assignments",
        element: <StudentAssignmentSubmission />,
      },
    ],
  },

  // ── Teacher ───────────────────────────────────────────────
  {
    element: (
      <ProtectedRoute roles={["teacher"]}>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/teacher/dashboard", element: <TeacherDashboard /> },
      { path: "/teacher/profile", element: <TeacherProfile /> },
      { path: "/teacher/routine", element: <TeacherRoutine /> },
      { path: "/teacher/assignments", element: <TeacherAssignments /> },
      {
        path: "/teacher/courses/:courseCode/materials",
        element: <TeacherCourseMaterials />,
      },
    ],
  },

  // ── Catch-all ─────────────────────────────────────────────
  { path: "*", element: <Navigate to="/" replace /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HeroUIProvider>
      <Toast.Provider placement="top end" maxVisibleToasts={4} width={420} />
      <ToastFlash />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </HeroUIProvider>
  </StrictMode>,
);
