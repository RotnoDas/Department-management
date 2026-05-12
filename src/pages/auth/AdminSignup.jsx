import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { ShieldCheck, CheckCircle } from "lucide-react";

export default function AdminSignup() {
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword)
      return setError("Passwords do not match.");
    setLoading(true);
    try {
      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
        role: "admin",
      });
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.error || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (success)
    return (
      <div className="from-primary/10 via-base-200 to-secondary/10 flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
        <div className="card bg-base-100 w-full max-w-sm text-center shadow-xl">
          <div className="card-body p-10">
            <div className="mb-3 flex justify-center text-primary">
              <CheckCircle className="h-16 w-16" />
            </div>
            <h2 className="text-success text-2xl font-bold">
              Registration Successful!
            </h2>
            <p className="text-base-content/60 mt-2 text-sm">
              Your admin account is <strong>pending approval</strong>. Please
              contact the existing admin to approve your account.
            </p>
            <Link to="/admin/login" className="btn btn-primary mt-6">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="from-primary/20 via-base-200 to-secondary/20 flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="bg-primary mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold">Admin Registration</h1>
          <p className="text-base-content/60 mt-1 text-sm">
            CSE Department — Create an admin account
          </p>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-8">
            {error && (
              <div className="alert alert-error mb-4 py-3">
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  placeholder="Admin Name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-medium">Email Address</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  placeholder="admin@cse.edu"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-medium">Password</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  placeholder="Min 6 characters"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-medium">
                    Confirm Password
                  </span>
                </label>
                <input
                  type="password"
                  className="input input-bordered w-full"
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
                className="btn btn-primary w-full mt-4"
                disabled={loading}
              >
                {loading ? "Registering…" : "Create Admin Account"}
              </button>
            </form>

            <p className="text-base-content/60 mt-6 text-center text-sm">
              Already have an account?{" "}
              <Link
                to="/admin/login"
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
