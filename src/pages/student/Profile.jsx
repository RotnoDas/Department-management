import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Pencil, User } from "lucide-react";
import Loading from "../../components/Loading";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = () =>
    api
      .get("/student/profile")
      .then((r) => {
        setProfile(r.data);
        setForm(r.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    try {
      await api.put("/student/profile", {
        name: form.name,
        phone: form.phone,
        batch: form.batch,
        semester: form.semester,
        session: form.session,
        cgpa: form.cgpa,
        address: form.address,
        bloodGroup: form.bloodGroup,
      });
      setEditing(false);
      setMsg("Profile updated successfully!");
      load();
    } catch (err) {
      setMsg(err.response?.data?.error || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading fullScreen text="Loading Profile..." />;

  const f = (key) => ({
    value: form[key] || "",
    onChange: (e) => setForm({ ...form, [key]: e.target.value }),
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      <div className="flex items-center justify-between bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">My Profile</h1>
          <p className="text-base-content/60 text-sm mt-1">
            View and edit your information
          </p>
        </div>
        {!editing ? (
          <button
            className="btn btn-primary text-white shadow-sm"
            onClick={() => {
              setEditing(true);
              setMsg("");
            }}
          >
            <Pencil className="w-4 h-4 mr-2" /> Edit Profile
          </button>
        ) : (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setEditing(false);
              setForm(profile);
            }}
          >
            Cancel
          </button>
        )}
      </div>

      {msg && (
        <div
          className={`alert ${msg.includes("success") ? "alert-success" : "alert-error"} py-3 text-sm`}
        >
          {msg}
        </div>
      )}

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Non-editable */}
            <Row label="Email" value={profile?.email} />
            <Row label="Roll" value={profile?.studentId || "Not set"} />

            {/* Editable */}
            {editing ? (
              <>
                <F label="Full Name" required>
                  <input
                    className="input input-bordered input-sm w-full"
                    {...f("name")}
                    required
                  />
                </F>
                <F label="Phone">
                  <input
                    className="input input-bordered input-sm w-full"
                    {...f("phone")}
                  />
                </F>
                <F label="Session">
                  <input
                    className="input input-bordered input-sm w-full"
                    placeholder="2024-2028"
                    {...f("batch")}
                  />
                </F>
                <F label="Semester">
                  <select
                    className="select select-bordered select-sm w-full"
                    {...f("semester")}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </F>
                <F label="Session">
                  <input
                    className="input input-bordered input-sm w-full"
                    placeholder="Fall 2024"
                    {...f("session")}
                  />
                </F>
                <F label="CGPA">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    className="input input-bordered input-sm w-full"
                    {...f("cgpa")}
                  />
                </F>
                <F label="Blood Group">
                  <select
                    className="select select-bordered select-sm w-full"
                    {...f("bloodGroup")}
                  >
                    <option value="">Select</option>
                    {BLOOD_GROUPS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </F>
                <F label="Address">
                  <input
                    className="input input-bordered input-sm w-full"
                    {...f("address")}
                  />
                </F>
              </>
            ) : (
              <>
                <Row label="Full Name" value={profile?.name} />
                <Row label="Phone" value={profile?.phone} />
                <Row label="Session" value={profile?.batch} />
                <Row label="Semester" value={`Semester ${profile?.semester}`} />
                <Row label="Session" value={profile?.session} />
                <Row
                  label="CGPA"
                  value={profile?.cgpa > 0 ? profile.cgpa.toFixed(2) : "N/A"}
                />
                <Row label="Blood Group" value={profile?.bloodGroup} />
                <Row label="Address" value={profile?.address} />
              </>
            )}
          </div>

          {editing && (
            <div className="border-base-200 mt-6 flex justify-end gap-3 border-t pt-4">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setEditing(false);
                  setForm(profile);
                }}
              >
                Discard
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleSave}
                disabled={saving}
              >
                {saving && (
                  <span className="loading loading-spinner loading-xs" />
                )}
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Row = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-base-content/50 text-xs font-medium tracking-wide uppercase">
      {label}
    </p>
    <p className="text-sm font-medium">
      {value || <span className="text-base-content/30 italic">Not set</span>}
    </p>
  </div>
);

const F = ({ label, required, children }) => (
  <div className="form-control">
    <label className="label py-0.5">
      <span className="label-text text-xs font-medium tracking-wide uppercase">
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </span>
    </label>
    {children}
  </div>
);
