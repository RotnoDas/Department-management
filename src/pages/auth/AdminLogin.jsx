import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password, "admin");
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="from-primary/20 via-base-200 to-secondary/20 relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br p-4">
      <div className="relative z-10 w-full max-w-md">
        <div className="animate-in fade-in slide-in-from-top mb-8 text-center duration-500">
          <div className="from-primary to-secondary text-white mx-auto mb-4 flex h-20 w-20 transform items-center justify-center rounded-3xl bg-gradient-to-br shadow-2xl transition-transform hover:scale-110">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h1 className="from-primary to-secondary bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent">
            Admin Portal
          </h1>
          <p className="text-base-content/60 mt-2 text-sm font-medium">
            CSE Department Management
          </p>
        </div>

        <div className="card bg-base-100/80 border-base-300 animate-in fade-in slide-in-from-bottom border shadow-2xl backdrop-blur-xl duration-500">
          <div className="card-body p-8">
            <h2 className="mb-6 text-center text-2xl font-bold">Admin Login</h2>

            {error && (
              <div className="alert alert-error animate-in fade-in slide-in-from-top mb-4 py-3 shadow-lg duration-300">
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-semibold">
                    Email Address
                  </span>
                </label>
                <input
                  type="email"
                  className="input input-bordered focus:input-primary w-full transition-all"
                  placeholder="admin@cse.edu"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-semibold">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    className="input input-bordered focus:input-primary w-full pr-12 transition-all"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    className="text-base-content/50 hover:text-base-content absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                    onClick={() => setShow(!show)}
                  >
                    {show ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full shadow-lg"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In as Admin"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
