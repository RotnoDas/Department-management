import { useState, useEffect } from "react";
import api from "../../api/axios";
import { addToast } from "../../utils/toast";
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
  ShieldCheck,
  Sparkles,
  XCircle,
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
      const message = "Profile updated successfully!";
      setMsg(message);
      addToast({ title: message, color: "success" });
      load();
    } catch (err) {
      const message = err.response?.data?.error || "Update failed.";
      setMsg(message);
      addToast({ title: message, color: "danger" });
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
    <div className="page-transition mx-auto max-w-[1400px] space-y-8 pb-12">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-sky-100 via-indigo-50 to-white p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-100">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-white/40 blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-8">
            <div className="group relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white shadow-2xl ring-1 ring-slate-100 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-6">
                <User className="h-12 w-12 text-indigo-600" />
              </div>
              <div className="absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-xl border-2 border-white bg-emerald-500 text-white shadow-lg transition-transform group-hover:scale-110">
                <ShieldCheck className="h-5 w-5 font-bold" />
              </div>
              <Sparkles className="absolute -top-3 -right-3 h-6 w-6 animate-pulse text-yellow-500" />
            </div>

            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-800">
                My Profile
                <span className="mx-3 font-light text-slate-300">|</span>
                <span className="text-indigo-600">Faculty Account</span>
              </h1>
              <p className="mt-1 text-sm font-black tracking-widest text-slate-400 uppercase">
                Manage your professional identity and contact info
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            {!editing ? (
              <button
                className="btn h-12 rounded-2xl border-0 bg-white px-6 text-sm font-black text-indigo-600 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-indigo-600 hover:text-white hover:shadow-xl hover:shadow-indigo-100"
                onClick={() => {
                  setEditing(true);
                  setMsg("");
                }}
              >
                <Pencil className="mr-2 h-4 w-4" /> Edit Profile
              </button>
            ) : (
              <button
                className="btn h-12 rounded-2xl border-0 bg-rose-50 px-6 text-sm font-black text-rose-600 shadow-sm ring-1 ring-rose-200 transition-all hover:bg-rose-600 hover:text-white"
                onClick={() => {
                  setEditing(false);
                  setForm(profile);
                  setMsg("");
                }}
              >
                <X className="mr-2 h-4 w-4" /> Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {msg && (
        <div
          className={`alert rounded-3xl ${msg.includes("success") ? "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-emerald-100" : "border-rose-200 bg-rose-50 text-rose-700 shadow-rose-100"} animate-in fade-in slide-in-from-top-4 border-2 shadow-lg transition-all`}
        >
          {msg.includes("success") ? (
            <BadgeCheck className="h-6 w-6" />
          ) : (
            <XCircle className="h-6 w-6" />
          )}
          <span className="font-bold tracking-tight">{msg}</span>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Account Details */}
        <div className="space-y-6 lg:col-span-1">
          <div className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/60 transition-all duration-300">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner ring-1 ring-indigo-100">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-slate-800">
                  Account
                </h3>
                <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Core Credentials
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <StaticRow
                icon={<Mail className="h-5 w-5 text-indigo-400" />}
                label="Verified Email"
                value={profile?.email}
              />
              <StaticRow
                icon={<BadgeCheck className="h-5 w-5 text-sky-400" />}
                label="Department ID"
                value={profile?.teacherId}
              />
              <StaticRow
                icon={<CalendarDays className="h-5 w-5 text-purple-400" />}
                label="Joining Date"
                value={
                  profile?.joiningDate
                    ? new Date(profile.joiningDate).toLocaleDateString(
                        "en-US",
                        { month: "long", day: "numeric", year: "numeric" },
                      )
                    : "Not set"
                }
              />
            </div>

            <div className="mt-8 rounded-2xl bg-slate-50/50 p-5 ring-1 ring-slate-100/50">
              <p className="mb-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Security Note
              </p>
              <p className="text-xs leading-relaxed font-bold text-slate-500">
                Email and official ID are managed by the department and cannot
                be changed here.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Information Pods */}
        <div className="lg:col-span-2">
          <div className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/60 transition-all duration-300">
            <div className="mb-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-inner ring-1 ring-blue-100">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight text-slate-800">
                    Professional
                  </h3>
                  <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Faculty information
                  </p>
                </div>
              </div>
              {editing && (
                <div className="flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 ring-1 ring-indigo-100">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-600" />
                  <span className="text-[10px] font-black tracking-widest text-indigo-600 uppercase">
                    Editing
                  </span>
                </div>
              )}
            </div>

            {!editing ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <DisplayField label="Full Name" value={profile?.name} />
                <DisplayField label="Phone Number" value={profile?.phone} />
                <DisplayField
                  label="Current Designation"
                  value={profile?.designation}
                />
                <DisplayField label="Office Room" value={profile?.officeRoom} />
                <DisplayField
                  label="Specialization & Research"
                  value={profile?.specialization}
                  className="md:col-span-2"
                />
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <EditField
                    label="Full Name"
                    icon={<User className="h-4 w-4 text-indigo-400" />}
                    required
                  >
                    <input
                      className="input input-bordered w-full rounded-xl font-bold focus:ring-2 focus:ring-indigo-100"
                      required
                      {...f("name")}
                    />
                  </EditField>

                  <EditField
                    label="Phone"
                    icon={<Phone className="h-4 w-4 text-emerald-400" />}
                  >
                    <input
                      className="input input-bordered w-full rounded-xl font-bold focus:ring-2 focus:ring-indigo-100"
                      {...f("phone")}
                      placeholder="+880"
                    />
                  </EditField>

                  <EditField
                    label="Designation"
                    icon={<Briefcase className="h-4 w-4 text-amber-400" />}
                  >
                    <input
                      className="input input-bordered w-full rounded-xl font-bold focus:ring-2 focus:ring-indigo-100"
                      {...f("designation")}
                      placeholder="Associate Professor"
                    />
                  </EditField>

                  <EditField
                    label="Office Room"
                    icon={<DoorOpen className="h-4 w-4 text-sky-400" />}
                  >
                    <input
                      className="input input-bordered w-full rounded-xl font-bold focus:ring-2 focus:ring-indigo-100"
                      {...f("officeRoom")}
                      placeholder="CSE-301"
                    />
                  </EditField>
                </div>

                <EditField
                  label="Specialization & Research Areas"
                  icon={<Microscope className="h-4 w-4 text-purple-400" />}
                >
                  <textarea
                    className="textarea textarea-bordered h-28 w-full rounded-xl font-bold focus:ring-2 focus:ring-indigo-100"
                    {...f("specialization")}
                    placeholder="e.g. AI, Machine Learning, Data Science"
                  />
                </EditField>

                <div className="mt-10 flex justify-end gap-3 border-t border-slate-50 pt-8">
                  <button
                    type="button"
                    className="btn h-12 rounded-2xl border-0 bg-slate-100 px-8 text-sm font-black text-slate-500 hover:bg-slate-200"
                    onClick={() => {
                      setEditing(false);
                      setForm(profile);
                    }}
                    disabled={saving}
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="btn h-12 rounded-2xl border-0 bg-indigo-600 px-8 text-sm font-black text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700"
                    disabled={saving}
                  >
                    {saving ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Update Profile
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const StaticRow = ({ icon, label, value }) => (
  <div className="group/row flex items-start gap-4">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-100 transition-all duration-300 group-hover/row:bg-white group-hover/row:shadow-sm">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="mb-0.5 text-[10px] font-black tracking-widest text-slate-400 uppercase">
        {label}
      </p>
      <p className="truncate font-black text-slate-700">
        {value || (
          <span className="text-xs font-medium text-slate-300 italic">
            Not set
          </span>
        )}
      </p>
    </div>
  </div>
);

const DisplayField = ({ label, value, className = "" }) => (
  <div className={`group/field ${className}`}>
    <p className="mb-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
      {label}
    </p>
    <div className="rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-4 transition-all duration-300 group-hover/field:bg-white group-hover/field:shadow-md group-hover/field:ring-1 group-hover/field:ring-indigo-100">
      <p className="font-black text-slate-700">
        {value || (
          <span className="text-sm font-medium text-slate-300 italic">
            Not provided
          </span>
        )}
      </p>
    </div>
  </div>
);

const EditField = ({ label, required, icon, children }) => (
  <div className="form-control w-full">
    <label className="label py-1">
      <span className="label-text flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-500 uppercase">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
          {icon}
        </span>
        {label}
        {required && <span className="font-black text-rose-500">*</span>}
      </span>
    </label>
    {children}
  </div>
);
