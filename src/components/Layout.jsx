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
  ],
  student: [
    {
      to: "/student/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      to: "/student/attendance",
      label: "Attendance",
      icon: <CheckSquare className="h-5 w-5" />,
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
      to: "/teacher/profile",
      label: "My Profile",
      icon: <User className="h-5 w-5" />,
    },
  ],
};

const ROLE_GRADIENT = {
  admin: "from-indigo-500 to-purple-600 shadow-indigo-500/30",
  teacher: "from-sky-500 to-blue-600 shadow-sky-500/30",
  student: "from-blue-500 to-cyan-600 shadow-blue-500/30",
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
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex min-h-screen">
        {/* ── Premium Light Sidebar ── */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white text-slate-700 shadow-xl transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        >
          {/* Brand */}
          <div className="border-b border-slate-100 bg-white/80 p-6 backdrop-blur">
            <Logo size="md" />
          </div>

          {/* Nav links */}
          <nav className="custom-scrollbar flex-1 space-y-2 overflow-y-auto p-4">
            <p className="mb-4 px-4 text-[10px] font-extrabold tracking-[0.2em] text-slate-400 uppercase">
              Main Navigation
            </p>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-r ${ROLE_GRADIENT[user?.role] || "from-indigo-500 to-purple-600"} translate-x-1 text-white shadow-lg`
                      : "text-slate-600 hover:translate-x-1 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                <span
                  className={`transition-transform duration-300 ${open ? "" : "group-hover:scale-110"}`}
                >
                  {link.icon}
                </span>
                <span className="tracking-wide">{link.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User profile footer */}
          <div className="border-t border-slate-100 bg-slate-50 p-5">
            <div className="mb-4 flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="avatar placeholder">
                <div
                  className={`flex items-center justify-center bg-gradient-to-br ${ROLE_GRADIENT[user?.role]?.replace(/shadow-[a-z0-5/-]+/g, "") || "from-indigo-500 to-purple-600"} h-12 w-12 rounded-xl text-white shadow-md`}
                >
                  {ROLE_ICON[user?.role] || <User className="h-6 w-6" />}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-800">
                  {user?.name}
                </p>
                <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  {ROLE_LABEL[user?.role]}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="group flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-rose-500 transition-all hover:border-rose-200 hover:bg-rose-50 hover:shadow-sm"
            >
              <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="flex min-w-0 flex-1 flex-col bg-slate-50">
          {/* Topbar */}
          <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-slate-200 bg-white/80 px-4 shadow-sm backdrop-blur-xl sm:px-8">
            <button
              className="btn btn-ghost btn-sm btn-circle hover:bg-slate-100 lg:hidden"
              onClick={() => setOpen(!open)}
            >
              <Menu className="h-5 w-5 text-slate-700" />
            </button>

            <div className="flex-1" />

            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
              <div
                className={`badge badge-sm border-0 bg-gradient-to-r font-bold tracking-wider text-white uppercase shadow-sm ${ROLE_GRADIENT[user?.role]?.replace(/shadow-[a-z0-5/-]+/g, "") || "from-indigo-500 to-purple-600"}`}
              >
                {ROLE_LABEL[user?.role]}
              </div>
              <div className="hidden sm:block">
                <span className="text-sm font-bold text-slate-700">
                  {user?.name}
                </span>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="page-transition flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
