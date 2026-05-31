import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import PublicLanding from "./pages/PublicLanding";

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

// Student
import StudentDashboard from "./pages/student/Dashboard";
import StudentProfile from "./pages/student/Profile";
import StudentAttendance from "./pages/student/Attendance";
import StudentNotices from "./pages/student/Notices";
import StudentCourseMaterials from "./pages/student/CourseMaterials";

// Teacher
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherProfile from "./pages/teacher/Profile";
import TeacherCourseMaterials from "./pages/teacher/CourseMaterials";

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
      { path: "/student/attendance", element: <StudentAttendance /> },
      { path: "/student/notices", element: <StudentNotices /> },
      {
        path: "/student/courses/:courseCode/materials",
        element: <StudentCourseMaterials />,
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
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
