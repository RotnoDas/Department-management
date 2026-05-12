import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { GraduationCap, CheckCircle } from "lucide-react";

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
        ...form,
        role: "student",
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
      <div className="from-secondary/10 via-base-200 to-primary/10 flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
        <div className="card bg-base-100 w-full max-w-sm text-center shadow-xl">
          <div className="card-body p-10">
            <div className="mb-3 flex justify-center text-secondary">
              <CheckCircle className="h-16 w-16" />
            </div>
            <h2 className="text-success text-2xl font-bold">
              Registration Successful!
            </h2>
            <p className="text-base-content/60 mt-2 text-sm">
              Your student account is <strong>pending admin approval</strong>.
              You will be notified once an admin reviews your application.
            </p>
            <Link to="/student/login" className="btn btn-secondary mt-6">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="from-secondary/20 via-base-200 to-primary/20 flex min-h-screen items-center justify-center bg-gradient-to-br p-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="mb-6 text-center">
          <div className="bg-secondary mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold">Student Registration</h1>
          <p className="text-base-content/60 mt-1 text-sm">
            CSE Department — Create a student account
          </p>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-8">
            {error && (
              <div className="alert alert-error mb-4 py-3">
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <F label="Full Name" required>
                  <input
                    className="input input-bordered w-full"
                    placeholder="Your full name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </F>
                <F label="Email Address" required>
                  <input
                    type="email"
                    className="input input-bordered w-full"
                    placeholder="alice@student.cse.edu"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </F>
                <F label="Password" required>
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
                </F>
                <F label="Confirm Password" required>
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
                </F>
                <F label="Roll">
                  <input
                    className="input input-bordered w-full"
                    placeholder="e.g. 220106"
                    value={form.studentId}
                    onChange={(e) =>
                      setForm({ ...form, studentId: e.target.value })
                    }
                  />
                </F>
                <F label="Phone">
                  <input
                    className="input input-bordered w-full"
                    placeholder="e.g. 01712345678"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </F>
                <F label="Session">
                  <input
                    className="input input-bordered w-full"
                    placeholder="e.g. 2024-2028"
                    value={form.batch}
                    onChange={(e) =>
                      setForm({ ...form, batch: e.target.value })
                    }
                  />
                </F>
                <F label="Semester">
                  <select
                    className="select select-bordered w-full"
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
                </F>
                <F label="Blood Group">
                  <select
                    className="select select-bordered w-full"
                    value={form.bloodGroup}
                    onChange={(e) =>
                      setForm({ ...form, bloodGroup: e.target.value })
                    }
                  >
                    <option value="">Select blood group</option>
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                      (g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ),
                    )}
                  </select>
                </F>
                <F label="Address">
                  <input
                    className="input input-bordered w-full"
                    placeholder="City, District"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                  />
                </F>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  type="submit"
                  className="btn btn-secondary w-full"
                  disabled={loading}
                >
                  {loading ? "Registering…" : "Create Student Account"}
                </button>
              </div>
            </form>

            <p className="text-base-content/60 mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link
                to="/student/login"
                className="text-secondary font-medium hover:underline"
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

function F({ label, required, children }) {
  return (
    <div className="form-control">
      <label className="label py-1">
        <span className="label-text font-medium">
          {label}
          {required && <span className="text-error ml-0.5">*</span>}
        </span>
      </label>
      {children}
    </div>
  );
}
