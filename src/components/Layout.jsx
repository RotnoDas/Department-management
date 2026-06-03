import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import {
  BarChart3,
  School,
  UsersRound,
  LayoutDashboard,
  CheckSquare,
  User,
  LogOut,
  Menu,
  ShieldCheck,
  BookOpen,
  Bell,
  FileText,
  Calendar,
  ChevronRight,
} from "lucide-react";
import Logo from "./Logo";

const NAV = {
  admin: [
    {
      to: "/admin/dashboard",
      label: "Dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      to: "/admin/students",
      label: "Students",
      icon: <UsersRound className="h-5 w-5" />,
    },
    {
      to: "/admin/teachers",
      label: "Teachers",
      icon: <School className="h-5 w-5" />,
    },
    {
      to: "/admin/courses",
      label: "Courses",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      to: "/admin/routine",
      label: "Routine",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      to: "/admin/notices",
      label: "Notices",
      icon: <Bell className="h-5 w-5" />,
    },
  ],
  student: [
    {
      to: "/student/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      to: "/student/routine",
      label: "Routine",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      to: "/student/attendance",
      label: "Attendance",
      icon: <CheckSquare className="h-5 w-5" />,
    },
    {
      to: "/student/notices",
      label: "Notices",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      to: "/student/profile",
      label: "My Profile",
      icon: <User className="h-5 w-5" />,
    },
  ],
  teacher: [
    {
      to: "/teacher/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      to: "/teacher/routine",
      label: "Routine",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      to: "/teacher/assignments",
      label: "Assignments",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      to: "/teacher/profile",
      label: "My Profile",
      icon: <User className="h-5 w-5" />,
    },
  ],
};

const ROLE_LABEL = {
  admin: "Administrator",
  teacher: "Faculty",
  student: "Student",
};

const ROLE_ICON = {
  admin: <ShieldCheck className="h-6 w-6" />,
  teacher: <School className="h-6 w-6" />,
  student: <UsersRound className="h-6 w-6" />,
};

export default function Layout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const links = NAV[user?.role] || [];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Background soft glow accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-indigo-50/50 blur-[120px]"></div>
        <div className="absolute top-[20%] -right-[5%] h-[30%] w-[30%] rounded-full bg-sky-50/50 blur-[100px]"></div>
        <div className="absolute -bottom-[10%] left-[20%] h-[35%] w-[35%] rounded-full bg-purple-50/40 blur-[110px]"></div>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-md transition-opacity lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="relative z-10 flex min-h-screen">
        {/* ── Side Panel (Sidebar) ── */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-80 flex-col bg-white/70 backdrop-blur-3xl transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] lg:sticky lg:top-0 lg:h-screen ${open ? "translate-x-0" : "-translate-x-full"} border-r border-slate-200/50 shadow-[0_0_50px_-12px_rgba(0,0,0,0.05)] lg:translate-x-0`}
        >
          {/* Brand/Logo Section */}
          <div className="flex h-32 items-end px-8 pb-4">
            <Logo size="md" />
          </div>

          {/* Navigation Section */}
          <nav className="custom-scrollbar flex-1 space-y-1 overflow-y-auto px-6 py-8">
            <div className="mb-6 flex items-center gap-3 px-4">
              <div className="h-px flex-1 bg-slate-100"></div>
              <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">
                Main Menu
              </span>
              <div className="h-px flex-1 bg-slate-100"></div>
            </div>

            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `group relative flex items-center gap-4 rounded-2xl px-5 py-3.5 text-sm font-black transition-all duration-500 ${
                    isActive
                      ? "bg-white text-indigo-600 shadow-[0_10px_25px_-5px_rgba(79,70,229,0.15)] ring-1 ring-indigo-500/20"
                      : "text-slate-500 hover:bg-white/50 hover:text-indigo-600"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`transition-all duration-500 ${
                        isActive
                          ? "scale-110 text-indigo-600"
                          : "group-hover:scale-110 group-hover:text-indigo-600"
                      }`}
                    >
                      {link.icon}
                    </span>
                    <span className="flex-1 tracking-tight">{link.label}</span>
                    <ChevronRight
                      className={`h-4 w-4 transition-all duration-500 ${isActive ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User Profile Section */}
          <div className="p-6">
            <div className="relative overflow-hidden rounded-[2rem] bg-white p-5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] ring-1 ring-slate-100 transition-all duration-500 hover:shadow-xl">
              <div className="relative z-10 flex items-center gap-4">
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-100">
                    {ROLE_ICON[user?.role] || <User className="h-6 w-6" />}
                  </div>
                  <div className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 shadow-sm" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black tracking-tight text-slate-800">
                    {user?.name}
                  </p>
                  <p className="text-[10px] font-black tracking-widest text-indigo-500 uppercase">
                    {ROLE_LABEL[user?.role]}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="group mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-50 py-3.5 text-xs font-black tracking-widest text-slate-400 uppercase transition-all duration-500 hover:bg-rose-50 hover:text-rose-600 hover:shadow-lg hover:shadow-rose-100"
            >
              <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* ── Main Content Area ── */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top Navbar */}
          <header className="sticky top-0 z-30 flex h-[4.5rem] items-center gap-4 px-6 sm:px-10">
            <div className="absolute inset-x-0 top-0 h-full border-b border-slate-200/40 bg-white/60 backdrop-blur-xl" />

            <button
              className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-50 lg:hidden"
              onClick={() => setOpen(!open)}
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex-1" />

            <div className="relative z-10 flex items-center gap-4 rounded-2xl bg-white/80 px-5 py-2.5 shadow-sm ring-1 ring-slate-200/50 backdrop-blur-md transition-all hover:shadow-md hover:ring-indigo-100">
              <div className="flex hidden flex-col items-end sm:flex">
                <span className="text-sm font-black tracking-tight text-slate-800">
                  {user?.name}
                </span>
                <span className="text-[9px] leading-none font-black tracking-[0.2em] text-indigo-500 uppercase">
                  {ROLE_LABEL[user?.role]}
                </span>
              </div>
              <div className="hidden h-8 w-px bg-slate-200 sm:block" />
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-inner ring-1 ring-indigo-100">
                {ROLE_ICON[user?.role] || <User className="h-5 w-5" />}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
