import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { addToast } from "../../utils/toast";
import {
  Presentation,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import Logo from "../../components/Logo";

export default function TeacherLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const redirect = (user) => {
    if (user.status === "approved") {
      addToast({ title: "Welcome back, Professor!", color: "success" });
      return navigate("/teacher/dashboard");
    }
    if (user.status === "pending") {
      return navigate("/pending");
    }
    return navigate("/rejected");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password, "teacher");
      redirect(user);
    } catch (err) {
      const data = err.response?.data;
      if (data?.status === "pending") return navigate("/pending");
      if (data?.status === "rejected") return navigate("/rejected");
      addToast({ title: data?.error || "Login failed.", color: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8fafc] p-6 font-sans selection:bg-sky-100 selection:text-sky-900">
      {/* Background soft glow accents */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-[10%] left-[10%] h-[40%] w-[40%] rounded-full bg-sky-50/50 blur-[120px]"></div>
        <div className="absolute right-[10%] bottom-[10%] h-[40%] w-[40%] rounded-full bg-indigo-50/50 blur-[120px]"></div>
      </div>

      <div className="page-transition relative z-10 w-full max-w-md">
        <div className="mb-10 space-y-4 text-center">
          <Link
            to="/"
            className="inline-block transform transition-transform hover:scale-105 active:scale-95"
          >
            <Logo size="xl" withText={false} />
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-800">
              Faculty Sign In
            </h1>
            <p className="mt-1 text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">
              Access your professional hub
            </p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-[2.5rem] bg-white p-1 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/50">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 px-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  <Mail className="h-3 w-3 text-sky-500" /> Professional Email
                </label>
                <input
                  type="email"
                  className="h-14 w-full rounded-2xl border-none bg-slate-50 px-6 text-sm font-bold text-slate-700 ring-1 ring-slate-100 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-sky-100"
                  placeholder="teacher@cse.edu"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 px-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  <Lock className="h-3 w-3 text-sky-500" /> Password
                </label>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    className="h-14 w-full rounded-2xl border-none bg-slate-50 px-6 pr-14 text-sm font-bold text-slate-700 ring-1 ring-slate-100 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-sky-100"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-300 transition-colors hover:text-sky-600"
                    onClick={() => setShow(!show)}
                  >
                    {show ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="group/btn relative h-14 w-full overflow-hidden rounded-2xl bg-slate-900 text-xs font-black tracking-[0.2em] text-white uppercase shadow-xl transition-all duration-500 hover:-translate-y-1 hover:bg-sky-600 hover:shadow-sky-100 disabled:opacity-70"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 transition-opacity group-hover/btn:opacity-100" />
              </button>
            </form>

            <div className="mt-8 flex flex-col items-center gap-4 border-t border-slate-50 pt-8">
              <p className="text-xs font-bold text-slate-400">
                New faculty member?
              </p>
              <Link
                to="/teacher/signup"
                className="flex h-11 items-center justify-center rounded-xl bg-sky-50 px-6 text-[10px] font-black tracking-widest text-sky-600 uppercase ring-1 ring-sky-100 transition-all hover:bg-sky-600 hover:text-white hover:shadow-lg"
              >
                Request Faculty Access
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-sky-600"
          >
            <ArrowLeftIcon className="h-3 w-3" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

const ArrowLeftIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);
