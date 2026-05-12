import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Pencil } from "lucide-react";
import Loading from "../../components/Loading";

export default function TeacherProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = () =>
    api
      .get("/teacher/profile")
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
      await api.put("/teacher/profile", {
        name: form.name,
        phone: form.phone,
        designation: form.designation,
        specialization: form.specialization,
        officeRoom: form.officeRoom,
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
          <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">My Profile</h1>
          <p className="text-base-content/60 text-sm mt-1">
            Faculty profile information
          </p>
        </div>
        {!editing ? (
          <button
            className="btn btn-info text-white shadow-sm"
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
            <Row label="Email" value={profile?.email} />
            <Row label="Teacher ID" value={profile?.teacherId} />
            {editing ? (
              <>
                <F label="Full Name" required>
                  <input
                    className="input input-bordered input-sm w-full"
                    required
                    {...f("name")}
                  />
                </F>
                <F label="Phone">
                  <input
                    className="input input-bordered input-sm w-full"
                    {...f("phone")}
                  />
                </F>
                <F label="Designation">
                  <input
                    className="input input-bordered input-sm w-full"
                    {...f("designation")}
                  />
                </F>
                <F label="Specialization">
                  <input
                    className="input input-bordered input-sm w-full"
                    {...f("specialization")}
                  />
                </F>
                <F label="Office Room">
                  <input
                    className="input input-bordered input-sm w-full"
                    {...f("officeRoom")}
                  />
                </F>
              </>
            ) : (
              <>
                <Row label="Full Name" value={profile?.name} />
                <Row label="Phone" value={profile?.phone} />
                <Row label="Designation" value={profile?.designation} />
                <Row label="Specialization" value={profile?.specialization} />
                <Row label="Office Room" value={profile?.officeRoom} />
                <Row label="Joining Date" value={profile?.joiningDate} />
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
                className="btn btn-info btn-sm"
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
