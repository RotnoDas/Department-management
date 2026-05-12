import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, Presentation, ShieldCheck } from "lucide-react";
import Logo from "../components/Logo";

const PANELS = [
  {
    role: "Student",
    title: "Student Portal",
    description:
      "Join as a student to access academic resources and manage your profile.",
    accent: "from-secondary/20 to-secondary/5",
    badge: "badge-secondary",
    icon: <GraduationCap className="text-secondary h-6 w-6" />,
    loginPath: "/student/login",
    signupPath: "/student/signup",
    helper: "Registration requires admin approval.",
  },
  {
    role: "Teacher",
    title: "Teacher Portal",
    description:
      "Faculty portal for managing courses and department activities.",
    accent: "from-info/20 to-info/5",
    badge: "badge-info",
    icon: <Presentation className="text-info h-6 w-6" />,
    loginPath: "/teacher/login",
    signupPath: "/teacher/signup",
    helper: "Registration requires admin approval.",
  },
  {
    role: "Admin",
    title: "Admin Portal",
    description: "Department management, user approval, and system oversight.",
    accent: "from-primary/20 to-primary/5",
    badge: "badge-primary",
    icon: <ShieldCheck className="text-primary h-6 w-6" />,
    loginPath: "/admin/login",
    signupPath: "/admin/signup",
    helper: "Full control over the department portal.",
  },
];

export default function PublicLanding() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    if (user.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    if (user.role === "teacher" && user.status === "approved") {
      navigate("/teacher/dashboard", { replace: true });
      return;
    }

    if (user.role === "student" && user.status === "approved") {
      navigate("/student/dashboard", { replace: true });
      return;
    }

    if (
      ["student", "teacher"].includes(user.role) &&
      user.status === "pending"
    ) {
      navigate("/pending", { replace: true });
      return;
    }

    if (
      ["student", "teacher"].includes(user.role) &&
      user.status === "rejected"
    ) {
      navigate("/rejected", { replace: true });
    }
  }, [loading, navigate, user]);

  if (loading) {
    return (
      <div className="bg-base-200 flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <main className="text-base-content min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.1),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.1),_transparent_40%),linear-gradient(180deg,_#f8fafc_0%,_#e2e8f0_100%)]">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-1 flex-col justify-center gap-12 py-4">
          <div className="max-w-4xl">
            <div className="mb-8">
              <Logo size="lg" />
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm backdrop-blur-md">
              <span className="mr-1 h-2 w-2 animate-ping rounded-full bg-indigo-500"></span>
              <span>CSE Department Management System</span>
            </div>

            <h1 className="mt-8 max-w-3xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                One Portal.
              </span>
              <br />
              <span className="text-slate-800">Complete Department.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed font-medium text-slate-600 sm:text-xl">
              A unified management system for students, faculty, and staff.
              Experience seamless coordination and streamlined administrative
              workflows in one place.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {PANELS.map((panel) => (
              <article
                key={panel.role}
                className={`border-base-200 rounded-3xl border bg-gradient-to-br ${panel.accent} p-5 shadow-sm backdrop-blur transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className={`badge ${panel.badge} badge-sm font-bold`}>
                      {panel.role}
                    </span>
                    <h2 className="mt-3 text-xl font-extrabold text-slate-900">
                      {panel.title}
                    </h2>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md">
                    {panel.icon}
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 font-medium text-slate-700">
                  {panel.description}
                </p>
                <p className="mt-3 text-xs leading-5 font-semibold text-slate-500 italic">
                  {panel.helper}
                </p>

                <div className="mt-5">
                  <Link
                    to={panel.loginPath}
                    className="btn btn-sm btn-neutral w-full rounded-xl"
                  >
                    Get Started
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
