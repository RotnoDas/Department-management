import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { Presentation, CheckCircle } from "lucide-react";

export default function TeacherSignup() {
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    teacherId: "",
    phone: "",
    designation: "",
    specialization: "",
    officeRoom: "",
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
        role: "teacher",
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
      <div className="from-info/10 via-base-200 to-secondary/10 flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
        <div className="card bg-base-100 w-full max-w-sm text-center shadow-xl">
          <div className="card-body p-10">
            <div className="mb-3 flex justify-center text-info">
              <CheckCircle className="h-16 w-16" />
            </div>
            <h2 className="text-success text-2xl font-bold">
              Registration Successful!
            </h2>
            <p className="text-base-content/60 mt-2 text-sm">
              Your teacher account is <strong>pending admin approval</strong>.
              You will be notified once an admin reviews your application.
            </p>
            <Link to="/teacher/login" className="btn btn-info mt-6 text-white">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="from-info/20 via-base-200 to-secondary/20 flex min-h-screen items-center justify-center bg-gradient-to-br p-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="mb-6 text-center">
          <div className="bg-info mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg">
            <Presentation className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold">Teacher Registration</h1>
          <p className="text-base-content/60 mt-1 text-sm">
            CSE Department — Create a teacher account
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
                    placeholder="teacher@cse.edu"
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
                <F label="Teacher ID">
                  <input
                    className="input input-bordered w-full"
                    placeholder="e.g. T-101"
                    value={form.teacherId}
                    onChange={(e) =>
                      setForm({ ...form, teacherId: e.target.value })
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
                <F label="Designation">
                  <input
                    className="input input-bordered w-full"
                    placeholder="e.g. Professor"
                    value={form.designation}
                    onChange={(e) =>
                      setForm({ ...form, designation: e.target.value })
                    }
                  />
                </F>
                <F label="Specialization">
                  <input
                    className="input input-bordered w-full"
                    placeholder="e.g. AI & ML"
                    value={form.specialization}
                    onChange={(e) =>
                      setForm({ ...form, specialization: e.target.value })
                    }
                  />
                </F>
                <F label="Office Room">
                  <input
                    className="input input-bordered w-full"
                    placeholder="e.g. Room 402"
                    value={form.officeRoom}
                    onChange={(e) =>
                      setForm({ ...form, officeRoom: e.target.value })
                    }
                  />
                </F>
              </div>

              <button
                type="submit"
                className="btn btn-info w-full mt-6 text-white"
                disabled={loading}
              >
                {loading ? "Registering…" : "Create Teacher Account"}
              </button>
            </form>

            <p className="text-base-content/60 mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link
                to="/teacher/login"
                className="text-info font-medium hover:underline"
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
