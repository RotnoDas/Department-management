import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { addToast } from "../../utils/toast";
import {
  ShieldCheck,
  CheckCircle,
  User,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Zap,
} from "lucide-react";
import Logo from "../../components/Logo";

export default function AdminSignup() {
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return addToast({ title: "Passwords do not match.", color: "danger" });
    }
    setLoading(true);
    try {
      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
        role: "admin",
      });
      addToast({
        title: "Admin account request sent.",
        color: "success",
      });
      setSuccess(true);
    } catch (err) {
      addToast({
        title: err.response?.data?.error || "Registration failed.",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success)
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8fafc] p-6">
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute top-[10%] left-[10%] h-[40%] w-[40%] rounded-full bg-purple-50/50 blur-[120px]"></div>
        </div>
        <div className="relative z-10 w-full max-w-md space-y-8 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white text-purple-500 shadow-xl ring-1 ring-slate-100 transition-transform duration-500 hover:scale-110">
            <CheckCircle className="h-12 w-12" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black tracking-tight text-slate-800">
              Admin Request Sent!
            </h2>
            <p className="mx-auto max-w-xs text-sm leading-relaxed font-bold text-slate-400">
              Your administrative account is{" "}
              <span className="text-purple-600">pending verification</span>.
              Please contact the primary administrator for activation.
            </p>
          </div>
          <Link
            to="/admin/login"
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-slate-900 text-xs font-black tracking-[0.2em] text-white uppercase shadow-lg transition-all hover:bg-purple-600"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8fafc] p-6 font-sans selection:bg-purple-100 selection:text-purple-900">
      {/* Background soft glow accents */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-[10%] left-[10%] h-[40%] w-[40%] rounded-full bg-purple-50/50 blur-[120px]"></div>
        <div className="absolute right-[10%] bottom-[10%] h-[40%] w-[40%] rounded-full bg-indigo-50/50 blur-[120px]"></div>
      </div>

      <div className="page-transition relative z-10 w-full max-w-md py-12">
        <div className="mb-10 space-y-4 text-center">
          <Link
            to="/"
            className="inline-block transform transition-transform hover:scale-105 active:scale-95"
          >
            <Logo size="xl" withText={false} />
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-800">
              System Admin Portal
            </h1>
            <p className="mt-1 text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">
              Admin Account Registration
            </p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-[3rem] bg-white p-1 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/50">
          <div className="p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 px-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  <User className="h-3 w-3 text-purple-500" /> Full Name
                </label>
                <input
                  className="input-field"
                  placeholder="Admin Name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 px-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  <Mail className="h-3 w-3 text-purple-500" /> Admin Email
                </label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="admin@cse.edu"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 px-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  <Lock className="h-3 w-3 text-purple-500" /> Secure Password
                </label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Min 6 characters"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 px-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  <ShieldCheck className="h-3 w-3 text-purple-500" /> Confirm
                  Password
                </label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Repeat password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                className="group/btn relative h-14 w-full overflow-hidden rounded-2xl bg-slate-900 text-xs font-black tracking-[0.2em] text-white uppercase shadow-xl transition-all duration-500 hover:-translate-y-1 hover:bg-purple-600 hover:shadow-purple-100 disabled:opacity-70"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    <span>Initialize Account</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 transition-opacity group-hover/btn:opacity-100" />
              </button>
            </form>

            <div className="mt-8 flex flex-col items-center gap-4 border-t border-slate-50 pt-8">
              <p className="text-xs font-bold text-slate-400">
                Already registered?
              </p>
              <Link
                to="/admin/login"
                className="flex h-11 items-center justify-center rounded-xl bg-slate-50 px-6 text-[10px] font-black tracking-widest text-slate-600 uppercase ring-1 ring-slate-100 transition-all hover:bg-white hover:text-purple-600 hover:shadow-sm"
              >
                Sign In Instead
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-purple-600"
          >
            <ArrowLeftIcon className="h-3 w-3" /> Back to Home
          </Link>
        </div>
      </div>

      <style>{`
         .input-field {
            @apply h-12 w-full rounded-xl border-none bg-slate-50 px-4 text-sm font-bold text-slate-700 ring-1 ring-slate-100 transition-all focus:bg-white focus:ring-2 focus:ring-purple-100 outline-none;
         }
      `}</style>
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
