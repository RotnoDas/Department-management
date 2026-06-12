import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import {
  GraduationCap,
  Presentation,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  BookOpen,
  Clock,
  Users,
  ArrowRight,
} from "lucide-react";
import Logo from "../components/Logo";

const PANELS = [
  {
    role: "Student",
    title: "Student Portal",
    description:
      "Access lecture notes, submit assignments, track attendance, and manage your academic profile.",
    accent: "from-indigo-50 to-white",
    icon: <GraduationCap className="h-6 w-6 text-indigo-600" />,
    loginPath: "/student/login",
    signupPath: "/student/signup",
    badgeColor: "text-indigo-600 bg-indigo-50 ring-indigo-100",
  },
  {
    role: "Teacher",
    title: "Faculty Hub",
    description:
      "Manage course distributions, publish study materials, and review student assignment submissions.",
    accent: "from-sky-50 to-white",
    icon: <Presentation className="h-6 w-6 text-sky-600" />,
    loginPath: "/teacher/login",
    signupPath: "/teacher/signup",
    badgeColor: "text-sky-600 bg-sky-50 ring-sky-100",
  },
  {
    role: "Admin",
    title: "Admin Control",
    description:
      "Full oversight of the department portal, user approvals, course assignments, and routine management.",
    accent: "from-purple-50 to-white",
    icon: <ShieldCheck className="h-6 w-6 text-purple-600" />,
    loginPath: "/admin/login",
    signupPath: "/admin/signup",
    badgeColor: "text-purple-600 bg-purple-50 ring-purple-100",
  },
];

export default function PublicLanding() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !user) return;
    
    if (user.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    } else if (user.role === "teacher" && user.status === "approved") {
      navigate("/teacher/dashboard", { replace: true });
    } else if (user.role === "student" && user.status === "approved") {
      navigate("/student/dashboard", { replace: true });
    } else if (["student", "teacher"].includes(user.role) && user.status === "pending") {
      navigate("/pending", { replace: true });
    } else if (
      ["student", "teacher"].includes(user.role) &&
      user.status === "rejected"
    ) {
      navigate("/rejected", { replace: true });
    }
  }, [loading, navigate, user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 shadow-inner">
          <span className="loading loading-spinner loading-lg text-indigo-600" />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Background dynamic blur gradients */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-[10%] -left-[10%] h-[50%] w-[50%] rounded-full bg-indigo-100/30 blur-[120px]"></div>
        <div className="absolute top-[20%] -right-[5%] h-[40%] w-[40%] rounded-full bg-sky-100/30 blur-[100px]"></div>
        <div className="absolute -bottom-[10%] left-[20%] h-[45%] w-[45%] rounded-full bg-purple-100/20 blur-[110px]"></div>
      </div>

      <section className="relative z-10 mx-auto max-w-[1400px] px-6 py-12 lg:px-10">
        {/* Navigation Bar */}
        <header className="mb-20 flex items-center justify-between">
          <Logo size="lg" />
          <div className="hidden items-center gap-6 md:flex">
            <a
              href="#features"
              className="text-sm font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-indigo-600"
            >
              Features
            </a>
            <a
              href="#portals"
              className="text-sm font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-indigo-600"
            >
              Portals
            </a>
            <Link
              to="/student/login"
              className="flex h-11 items-center justify-center rounded-2xl bg-indigo-600 px-6 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-indigo-100 transition-all hover:-translate-y-0.5 hover:bg-indigo-700"
            >
              Sign In
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <div className="mb-32 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200/60 backdrop-blur-md">
              <div className="h-2 w-2 animate-ping rounded-full bg-indigo-500" />
              <span className="text-[10px] font-black tracking-[0.2em] text-indigo-600 uppercase">
                Department Management v2.0
              </span>
            </div>

            <h1 className="text-6xl leading-[1.05] font-black tracking-tighter text-black sm:text-7xl xl:text-8xl">
              Computer Science and Engineering
            </h1>

            <p className="max-w-xl text-lg leading-relaxed font-bold text-slate-400">
              A unified, high-performance ecosystem for students, faculty, and
              administrators. Streamline workflows, manage academics, and track
              progress in real-time.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/student/signup"
                className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-slate-900 px-8 text-sm font-black tracking-widest text-white uppercase shadow-2xl transition-all hover:-translate-y-1 hover:bg-indigo-600"
              >
                Join as Student <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#portals"
                className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-white px-8 text-sm font-black tracking-widest text-slate-600 uppercase shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-1 hover:bg-slate-50"
              >
                Explore Portals
              </a>
            </div>

            <div className="flex items-center gap-8 pt-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[10px] font-black text-slate-400 ring-1 ring-slate-200"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-xs font-black tracking-widest text-slate-400 uppercase">
                Trusted by <span className="text-indigo-600">500+</span>{" "}
                Students
              </p>
            </div>
          </div>

          {/* Hero Decoration */}
          <div className="relative hidden lg:block">
            <div className="relative z-10 grid grid-cols-2 gap-6 p-4">
              <div className="space-y-6 pt-12">
                <HeroCard
                  icon={<Clock className="text-indigo-600" />}
                  label="Smart Routine"
                  desc="Dynamic scheduling for theory and lab classes"
                />
                <HeroCard
                  icon={<Users className="text-sky-600" />}
                  label="Member Central"
                  desc="Unified student and faculty directory"
                />
              </div>
              <div className="space-y-6">
                <HeroCard
                  icon={<Sparkles className="text-yellow-500" />}
                  label="Academic Dashboard"
                  desc="Intuitive dashboard for academic tasks"
                />
                <HeroCard
                  icon={<ShieldCheck className="text-purple-600" />}
                  label="Secure Access"
                  desc="Role-based access control system"
                />
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent opacity-60 blur-3xl" />
          </div>
        </div>

        {/* Entry Portals Section */}
        <div id="portals" className="space-y-12 py-20">
          <div className="space-y-4 text-center">
            <h2 className="text-[10px] font-black tracking-[0.4em] text-indigo-600 uppercase">
              Choose Your Path
            </h2>
            <p className="text-4xl font-black tracking-tight text-slate-800">
              Unified Access Portals
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {PANELS.map((panel) => (
              <article
                key={panel.role}
                className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:ring-indigo-100"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-white opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10 flex flex-1 flex-col">
                  <div className="mb-8 flex items-start justify-between">
                    <div
                      className={`rounded-xl px-4 py-1.5 text-[10px] font-black tracking-widest uppercase shadow-sm ring-1 ${panel.badgeColor}`}
                    >
                      {panel.role}
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xl ring-1 ring-slate-100 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                      {panel.icon}
                    </div>
                  </div>

                  <h3 className="mb-4 text-2xl font-black tracking-tight text-slate-800 transition-colors group-hover:text-indigo-700">
                    {panel.title}
                  </h3>
                  <p className="mb-10 text-base leading-relaxed font-bold text-slate-400 transition-colors group-hover:text-slate-500">
                    {panel.description}
                  </p>

                  <div className="mt-auto flex flex-col gap-3 border-t border-slate-50 pt-6">
                    <Link
                      to={panel.loginPath}
                      className="flex h-12 w-full items-center justify-center rounded-xl bg-slate-900 text-xs font-black tracking-[0.2em] text-white uppercase shadow-lg transition-all hover:bg-indigo-600 hover:shadow-indigo-100"
                    >
                      Sign In
                    </Link>
                    <Link
                      to={panel.signupPath}
                      className="flex h-12 w-full items-center justify-center rounded-xl bg-white text-xs font-black tracking-[0.2em] text-slate-600 uppercase shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-50 hover:text-indigo-600"
                    >
                      Create Account
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 border-t border-slate-200/50 pt-10 text-center">
          <p className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">
            &copy; 2026 Pabna University of Science & Technology{" "}
            <span className="mx-2">•</span> Department of CSE
          </p>
        </footer>
      </section>
    </main>
  );
}

const HeroCard = ({ icon, label, desc }) => (
  <div className="group relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 shadow-inner ring-1 ring-slate-100 transition-all group-hover:bg-white">
      {icon}
    </div>
    <h4 className="text-sm font-black tracking-tight text-slate-800">
      {label}
    </h4>
    <p className="mt-1 text-[10px] leading-relaxed font-bold tracking-widest text-slate-400 uppercase">
      {desc}
    </p>
  </div>
);
