import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { addToast } from "../../utils/toast";
import {
  GraduationCap,
  CheckCircle,
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  Layers,
  MapPin,
  Droplet,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import Logo from "../../components/Logo";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function StudentSignup() {
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    studentId: "",
    phone: "",
    batch: "",
    semester: "1",
    bloodGroup: "",
    address: "",
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
        ...form,
        role: "student",
      });
      addToast({
        title: "Registration successful!",
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
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f1f5f9] p-6">
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute top-[10%] left-[10%] h-[40%] w-[40%] rounded-full bg-emerald-100/30 blur-[120px]"></div>
        </div>
        <div className="relative z-10 w-full max-w-md space-y-8 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white text-emerald-500 shadow-xl ring-1 ring-slate-200/50 transition-transform duration-500 hover:scale-110">
            <CheckCircle className="h-12 w-12" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black tracking-tight text-slate-800">
              Registration Received!
            </h2>
            <p className="mx-auto max-w-xs text-sm leading-relaxed font-bold text-slate-400">
              Your student account is{" "}
              <span className="text-indigo-600">pending admin approval</span>.
              You'll be able to sign in once your application is reviewed.
            </p>
          </div>
          <Link
            to="/student/login"
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-slate-900 text-xs font-black tracking-[0.2em] text-white uppercase shadow-lg transition-all hover:bg-indigo-600"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f1f5f9] p-6 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Background soft glow accents */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-[10%] left-[10%] h-[40%] w-[40%] rounded-full bg-indigo-200/20 blur-[120px]"></div>
        <div className="absolute right-[10%] bottom-[10%] h-[40%] w-[40%] rounded-full bg-sky-200/20 blur-[120px]"></div>
      </div>

      <div className="page-transition relative z-10 w-full max-w-2xl py-12">
        <div className="mb-10 space-y-4 text-center">
          <Link
            to="/"
            className="inline-block transform transition-transform hover:scale-105 active:scale-95"
          >
            <Logo size="xl" withText={false} />
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-800">
              Join the Department
            </h1>
            <p className="mt-1 text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">
              Student Registration Portal
            </p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-[3rem] bg-white p-1 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/60">
          <div className="p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field
                  label="Full Name"
                  icon={<User className="h-3 w-3 text-indigo-500" />}
                  required
                >
                  <input
                    className="h-12 w-full rounded-xl border-none bg-slate-50 px-4 text-sm font-bold text-slate-700 ring-1 ring-slate-200/50 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    placeholder="Full Name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </Field>

                <Field
                  label="Email Address"
                  icon={<Mail className="h-3 w-3 text-indigo-500" />}
                  required
                >
                  <input
                    type="email"
                    className="h-12 w-full rounded-xl border-none bg-slate-50 px-4 text-sm font-bold text-slate-700 ring-1 ring-slate-200/50 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    placeholder="alice@student.cse.edu"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </Field>

                <Field
                  label="Password"
                  icon={<Lock className="h-3 w-3 text-indigo-500" />}
                  required
                >
                  <input
                    type="password"
                    className="h-12 w-full rounded-xl border-none bg-slate-50 px-4 text-sm font-bold text-slate-700 ring-1 ring-slate-200/50 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    placeholder="Min 6 characters"
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                </Field>

                <Field
                  label="Confirm Password"
                  icon={<ShieldCheck className="h-3 w-3 text-indigo-500" />}
                  required
                >
                  <input
                    type="password"
                    className="h-12 w-full rounded-xl border-none bg-slate-50 px-4 text-sm font-bold text-slate-700 ring-1 ring-slate-200/50 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    placeholder="Repeat password"
                    required
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
                    }
                  />
                </Field>

                <Field
                  label="Student Roll"
                  icon={<Layers className="h-3 w-3 text-sky-500" />}
                >
                  <input
                    className="h-12 w-full rounded-xl border-none bg-slate-50 px-4 text-sm font-bold text-slate-700 ring-1 ring-slate-200/50 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    placeholder="e.g. 220106"
                    value={form.studentId}
                    onChange={(e) =>
                      setForm({ ...form, studentId: e.target.value })
                    }
                  />
                </Field>

                <Field
                  label="Phone"
                  icon={<Phone className="h-3 w-3 text-emerald-500" />}
                >
                  <input
                    className="h-12 w-full rounded-xl border-none bg-slate-50 px-4 text-sm font-bold text-slate-700 ring-1 ring-slate-200/50 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    placeholder="+880"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </Field>

                <Field
                  label="Academic Batch"
                  icon={<Calendar className="h-3 w-3 text-amber-500" />}
                >
                  <input
                    className="h-12 w-full rounded-xl border-none bg-slate-50 px-4 text-sm font-bold text-slate-700 ring-1 ring-slate-200/50 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    placeholder="e.g. 2024-2028"
                    value={form.batch}
                    onChange={(e) =>
                      setForm({ ...form, batch: e.target.value })
                    }
                  />
                </Field>

                <Field
                  label="Current Semester"
                  icon={<Sparkles className="h-3 w-3 text-indigo-500" />}
                >
                  <select
                    className="h-12 w-full rounded-xl border-none bg-slate-50 px-4 text-sm font-bold text-slate-700 ring-1 ring-slate-200/50 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    value={form.semester}
                    onChange={(e) =>
                      setForm({ ...form, semester: e.target.value })
                    }
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="Blood Group"
                  icon={<Droplet className="h-3 w-3 text-rose-500" />}
                >
                  <select
                    className="h-12 w-full rounded-xl border-none bg-slate-50 px-4 text-sm font-bold text-slate-700 ring-1 ring-slate-200/50 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    value={form.bloodGroup}
                    onChange={(e) =>
                      setForm({ ...form, bloodGroup: e.target.value })
                    }
                  >
                    <option value="">Select Group</option>
                    {BLOOD_GROUPS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="Address"
                  icon={<MapPin className="h-3 w-3 text-indigo-500" />}
                >
                  <input
                    className="h-12 w-full rounded-xl border-none bg-slate-50 px-4 text-sm font-bold text-slate-700 ring-1 ring-slate-200/50 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    placeholder="City, District"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                  />
                </Field>
              </div>

              <button
                type="submit"
                className="group/btn relative h-14 w-full overflow-hidden rounded-2xl bg-slate-900 text-xs font-black tracking-[0.2em] text-white uppercase shadow-xl transition-all duration-500 hover:-translate-y-1 hover:bg-indigo-600 hover:shadow-indigo-100 disabled:opacity-70"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    <span>Create Student Account</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 transition-opacity group-hover/btn:opacity-100" />
              </button>
            </form>

            <div className="mt-8 flex flex-col items-center gap-4 border-t border-slate-50 pt-8">
              <p className="text-xs font-bold text-slate-400">
                Already have an account?
              </p>
              <Link
                to="/student/login"
                className="flex h-11 items-center justify-center rounded-xl bg-slate-50 px-6 text-[10px] font-black tracking-widest text-slate-600 uppercase ring-1 ring-slate-100 transition-all hover:bg-white hover:text-indigo-600 hover:shadow-sm"
              >
                Sign In Instead
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-indigo-600"
          >
            <ArrowLeftIcon className="h-3 w-3" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

const Field = ({ label, icon, required, children }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 px-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
      <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-slate-50 text-indigo-500 ring-1 ring-slate-100">
        {icon}
      </span>
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    {children}
  </div>
);

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
