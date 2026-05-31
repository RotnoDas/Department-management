import { useState, useEffect } from "react";
import api from "../../api/axios";
import {
  Pencil,
  Save,
  X,
  User,
  Phone,
  Briefcase,
  Microscope,
  DoorOpen,
  Mail,
  BadgeCheck,
  CalendarDays,
} from "lucide-react";
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
    <div className="page-transition mx-auto max-w-4xl space-y-8 pb-10">
      {/* Impressive Header Banner */}
      <div className="card relative overflow-hidden bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-10 -mb-10 h-40 w-40 rounded-full bg-sky-300 opacity-20 blur-2xl"></div>

        <div className="card-body relative z-10 p-8 sm:p-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-6">
              <div className="avatar placeholder relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-blue-600 shadow-2xl ring-4 ring-white/30 backdrop-blur-sm">
                  <User className="h-12 w-12" />
                </div>
                <div className="bg-success absolute right-0 bottom-0 rounded-full border-2 border-white p-1.5 shadow-md">
                  <BadgeCheck className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-md sm:text-4xl">
                  {profile?.name}
                </h1>
                <p className="mt-2 flex items-center gap-2 font-medium text-blue-100">
                  <Briefcase className="h-4 w-4" />
                  {profile?.designation || "Faculty Member"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="badge border-white/20 bg-white/10 text-white shadow-sm backdrop-blur-md">
                    ID: {profile?.teacherId || "N/A"}
                  </span>
                  <span className="badge border-white/20 bg-white/10 text-white shadow-sm backdrop-blur-md">
                    Role: {profile?.role?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="sm:self-start">
              {!editing ? (
                <button
                  className="btn border-0 bg-white text-blue-700 shadow-lg transition-transform hover:scale-105 hover:bg-blue-50"
                  onClick={() => {
                    setEditing(true);
                    setMsg("");
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" /> Edit Profile
                </button>
              ) : (
                <button
                  className="btn btn-ghost border-white/30 text-white backdrop-blur-sm hover:bg-white/20"
                  onClick={() => {
                    setEditing(false);
                    setForm(profile);
                    setMsg("");
                  }}
                >
                  <X className="mr-1 h-4 w-4" /> Cancel Edit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {msg && (
        <div
          className={`alert ${msg.includes("success") ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"} border shadow-sm`}
        >
          {msg.includes("success") ? (
            <BadgeCheck className="h-5 w-5" />
          ) : (
            <X className="h-5 w-5" />
          )}
          <span>{msg}</span>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Contact & Static Info */}
        <div className="space-y-6 lg:col-span-1">
          <div className="card sticky top-24 border border-slate-200 bg-white shadow-md">
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
              <h3 className="flex items-center gap-2 font-bold text-slate-800">
                <User className="h-5 w-5 text-sky-500" /> Account Details
              </h3>
            </div>
            <div className="card-body space-y-6 p-6">
              <StaticRow
                icon={<Mail className="h-5 w-5 text-slate-400" />}
                label="Email Address"
                value={profile?.email}
              />
              <StaticRow
                icon={<BadgeCheck className="h-5 w-5 text-slate-400" />}
                label="Teacher ID"
                value={profile?.teacherId}
              />
              <StaticRow
                icon={<CalendarDays className="h-5 w-5 text-slate-400" />}
                label="Joining Date"
                value={profile?.joiningDate}
              />

              <div className="divider my-0"></div>

              <div className="rounded-xl border border-sky-100 bg-sky-50 p-4">
                <h4 className="mb-1 text-sm font-bold text-sky-800">
                  Need help?
                </h4>
                <p className="text-xs leading-relaxed text-sky-600">
                  If you need to change your email address or official Teacher
                  ID, please contact the IT Administrator.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Profile Data */}
        <div className="lg:col-span-2">
          <div className="card border border-slate-200 bg-white shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
              <h3 className="flex items-center gap-2 font-bold text-slate-800">
                <Briefcase className="h-5 w-5 text-blue-500" /> Professional
                Information
              </h3>
              {editing && (
                <span className="badge badge-info badge-sm animate-pulse">
                  Editing Mode
                </span>
              )}
            </div>

            <div className="card-body p-6 lg:p-8">
              {!editing ? (
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
                  <DisplayField label="Full Name" value={profile?.name} />
                  <DisplayField label="Phone Number" value={profile?.phone} />
                  <DisplayField
                    label="Current Designation"
                    value={profile?.designation}
                  />
                  <DisplayField
                    label="Specialization / Research"
                    value={profile?.specialization}
                  />
                  <DisplayField
                    label="Office Room"
                    value={profile?.officeRoom}
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <EditField
                      label="Full Name"
                      icon={<User className="h-4 w-4 text-slate-400" />}
                      required
                    >
                      <input
                        className="input input-bordered w-full bg-slate-50 transition-colors focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                        required
                        {...f("name")}
                      />
                    </EditField>

                    <EditField
                      label="Phone Number"
                      icon={<Phone className="h-4 w-4 text-slate-400" />}
                    >
                      <input
                        className="input input-bordered w-full bg-slate-50 transition-colors focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                        {...f("phone")}
                        placeholder="+1 (555) 000-0000"
                      />
                    </EditField>

                    <EditField
                      label="Designation"
                      icon={<Briefcase className="h-4 w-4 text-slate-400" />}
                    >
                      <input
                        className="input input-bordered w-full bg-slate-50 transition-colors focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                        {...f("designation")}
                        placeholder="e.g. Associate Professor"
                      />
                    </EditField>

                    <EditField
                      label="Office Room"
                      icon={<DoorOpen className="h-4 w-4 text-slate-400" />}
                    >
                      <input
                        className="input input-bordered w-full bg-slate-50 transition-colors focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                        {...f("officeRoom")}
                        placeholder="e.g. Room 402, Building B"
                      />
                    </EditField>
                  </div>

                  <EditField
                    label="Specialization / Research Area"
                    icon={<Microscope className="h-4 w-4 text-slate-400" />}
                  >
                    <textarea
                      className="textarea textarea-bordered h-24 w-full bg-slate-50 transition-colors focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                      {...f("specialization")}
                      placeholder="e.g. Artificial Intelligence, Machine Learning, Data Science"
                    />
                  </EditField>

                  <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-6">
                    <button
                      className="btn btn-ghost hover:bg-slate-100"
                      onClick={() => {
                        setEditing(false);
                        setForm(profile);
                        setMsg("");
                      }}
                      disabled={saving}
                    >
                      Discard Changes
                    </button>
                    <button
                      className="btn border-0 bg-blue-600 text-white shadow-md hover:bg-blue-700"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? (
                        <span className="loading loading-spinner loading-sm" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Save Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
const StaticRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="mt-1">{icon}</div>
    <div>
      <p className="mb-1 text-xs font-bold tracking-wider text-slate-400 uppercase">
        {label}
      </p>
      <p className="font-medium text-slate-700">
        {value || <span className="text-slate-300 italic">Not set</span>}
      </p>
    </div>
  </div>
);

const DisplayField = ({ label, value }) => (
  <div>
    <p className="mb-1.5 text-xs font-bold tracking-wider text-slate-400 uppercase">
      {label}
    </p>
    <p className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-2.5 font-medium text-slate-800 shadow-inner">
      {value || <span className="text-slate-400 italic">Not provided</span>}
    </p>
  </div>
);

const EditField = ({ label, required, icon, children }) => (
  <div className="form-control w-full">
    <label className="label px-1 py-1">
      <span className="label-text flex items-center gap-2 font-semibold text-slate-700">
        {icon} {label}
        {required && <span className="text-error font-bold">*</span>}
      </span>
    </label>
    {children}
  </div>
);
