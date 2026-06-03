import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";
import { addToast } from "../../utils/toast";
import Loading from "../../components/Loading";
import NoticeAttachment, {
  AttachmentIcon,
} from "../../components/NoticeAttachment";
import { formatFileSize } from "../../utils/noticeFiles";
import {
  AlertCircle,
  BellRing,
  Calendar,
  FilePlus,
  Megaphone,
  Pencil,
  Plus,
  Save,
  Send,
  Trash2,
  Upload,
  User,
  X,
  Sparkles,
  ShieldCheck,
  FileText,
  Info,
} from "lucide-react";

const emptyForm = {
  title: "",
  content: "",
};

const loadAdminNotices = async () => {
  const { data } = await api.get("/admin/notices");
  return data;
};

export default function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [editingNotice, setEditingNotice] = useState(null);
  const [removeExistingFile, setRemoveExistingFile] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const fetchNotices = async () => {
    try {
      const data = await loadAdminNotices();
      setNotices(data);
    } catch {
      addToast({ title: "Failed to load notices.", color: "danger" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;
    const loadInitialNotices = async () => {
      try {
        const data = await loadAdminNotices();
        if (isActive) setNotices(data);
      } catch {
        addToast({ title: "Failed to load notices.", color: "danger" });
      } finally {
        if (isActive) setLoading(false);
      }
    };

    loadInitialNotices();
    return () => {
      isActive = false;
    };
  }, []);

  const resetFileInput = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openPublishForm = () => {
    setEditingNotice(null);
    setForm(emptyForm);
    setRemoveExistingFile(false);
    resetFileInput();
    setIsModalOpen(true);
  };

  const openEditForm = (notice) => {
    setEditingNotice(notice);
    setForm({
      title: notice.title || "",
      content: notice.content || "",
    });
    setRemoveExistingFile(false);
    resetFileInput();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setIsModalOpen(false);
    setEditingNotice(null);
    setForm(emptyForm);
    setRemoveExistingFile(false);
    resetFileInput();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasExistingAttachment =
      editingNotice?.filePath && !removeExistingFile && !file;
    if (!form.title.trim())
      return addToast({ title: "Notice title is required.", color: "danger" });
    if (!form.content.trim() && !file && !hasExistingAttachment) {
      return addToast({
        title: "Write notice text or attach a file.",
        color: "danger",
      });
    }

    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("content", form.content.trim());
    if (file) formData.append("file", file);
    if (removeExistingFile) formData.append("removeFile", "true");

    setSaving(true);
    try {
      if (editingNotice) {
        await api.put(`/admin/notices/${editingNotice.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        addToast({ title: "Notice updated successfully.", color: "success" });
      } else {
        await api.post("/admin/notices", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        addToast({ title: "Notice published successfully.", color: "success" });
      }

      closeModal();
      fetchNotices();
    } catch (err) {
      addToast({
        title: err.response?.data?.error || "Failed to save notice.",
        color: "danger",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (notice) => {
    if (!window.confirm(`Delete "${notice.title}"?`)) return;

    try {
      await api.delete(`/admin/notices/${notice.id}`);
      addToast({ title: "Notice deleted.", color: "success" });
      fetchNotices();
    } catch (err) {
      addToast({
        title: err.response?.data?.error || "Failed to delete notice.",
        color: "danger",
      });
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const selectedFileNotice = file
    ? {
        originalName: file.name,
        fileMime: file.type,
        fileSize: file.size,
      }
    : null;
  const hasExistingAttachment =
    editingNotice?.filePath && !removeExistingFile && !file;
  const canSubmit =
    form.title.trim() && (form.content.trim() || file || hasExistingAttachment);

  if (loading) return <Loading />;

  return (
    <div className="page-transition space-y-8 pb-10">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-sky-100 via-indigo-50 to-white p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-100">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-white/40 blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-indigo-100/50 blur-2xl"></div>

        <div className="relative z-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-6">
            <div className="hidden h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-xl ring-1 ring-slate-100 transition-transform duration-500 hover:scale-105 hover:rotate-12 sm:flex">
              <Megaphone className="h-10 w-10 text-indigo-500" />
            </div>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/60 px-3 py-1 text-[10px] font-black tracking-widest text-indigo-600 uppercase shadow-sm ring-1 ring-slate-200/50 backdrop-blur-sm">
                  Admin Broadcast
                </span>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black tracking-widest text-indigo-700 uppercase shadow-sm ring-1 ring-indigo-100/30">
                  {notices.length} notices
                </span>
              </div>
              <h1 className="text-3xl font-black text-slate-800 sm:text-4xl">
                Notice Board
              </h1>
              <p className="mt-2 max-w-2xl text-lg font-medium text-slate-500">
                Publish text announcements with files, then revise or remove
                them whenever the department needs an update.
              </p>
            </div>
          </div>

          <button
            onClick={openPublishForm}
            className="group relative flex h-14 w-full items-center gap-2 overflow-hidden rounded-2xl bg-slate-900 px-8 text-xs font-black tracking-[0.2em] text-white uppercase shadow-xl transition-all duration-500 hover:-translate-y-1 hover:bg-indigo-600 hover:shadow-indigo-100 sm:w-auto"
          >
            <div className="relative z-10 flex items-center gap-2">
              <Plus className="h-5 w-5" />
              <span>Publish Notice</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        </div>
      </div>

      {notices.length === 0 ? (
        <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-white/50 p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-purple-50/50 opacity-60"></div>
          <div className="relative z-10 flex min-h-[300px] flex-col items-center justify-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 p-6 shadow-inner ring-4 ring-white transition-transform duration-500 hover:scale-110 hover:rotate-6">
              <Megaphone className="h-12 w-12 text-indigo-500" />
            </div>
            <h3 className="mb-3 text-3xl font-black tracking-tight text-slate-800">
              No Notices Published
            </h3>
            <p className="mx-auto max-w-sm text-base leading-relaxed font-medium text-slate-500">
              Create the first announcement with text, an attachment, or both to
              keep everyone updated.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {notices.map((notice) => (
            <article
              key={notice.id}
              className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] hover:ring-indigo-100"
            >
              <div className="relative z-10 flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-indigo-600 ring-1 ring-slate-100 transition-all duration-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-200">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <h2
                        className="line-clamp-2 text-lg leading-[1.2] font-black tracking-tight text-slate-800 transition-colors duration-300 group-hover:text-indigo-700"
                        title={notice.title}
                      >
                        {notice.title}
                      </h2>
                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        <span className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-black tracking-[0.1em] text-indigo-600 uppercase shadow-sm ring-1 ring-indigo-100/50 transition-all duration-300 group-hover:bg-white group-hover:ring-indigo-100">
                          <User className="h-3 w-3" />
                          {notice.authorName || "Admin"}
                        </span>
                        <span className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-[10px] font-black tracking-[0.1em] text-slate-500 uppercase shadow-sm ring-1 ring-slate-100 transition-all duration-300 group-hover:bg-white">
                          <Calendar className="h-3 w-3" />
                          {formatDate(notice.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {notice.content && (
                  <div className="mt-5 line-clamp-3 rounded-2xl bg-slate-50/50 p-4 text-sm leading-relaxed font-bold text-slate-500/80 ring-1 ring-slate-100/50 transition-colors group-hover:bg-white group-hover:ring-indigo-100/30">
                    {notice.content}
                  </div>
                )}

                <div className="mt-4">
                  <NoticeAttachment notice={notice} compact />
                </div>

                <div className="mt-auto flex items-center justify-end gap-2 border-t border-slate-50 pt-4">
                  <button
                    type="button"
                    onClick={() => openEditForm(notice)}
                    className="flex h-8 items-center gap-1.5 rounded-xl bg-indigo-50 px-3 text-[10px] font-bold text-indigo-600 shadow-sm transition-all hover:bg-indigo-600 hover:text-white hover:shadow-lg"
                    title="Edit notice"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(notice)}
                    className="flex h-8 items-center gap-1.5 rounded-xl bg-rose-50 px-3 text-[10px] font-bold text-rose-600 shadow-sm transition-all hover:bg-rose-600 hover:text-white hover:shadow-lg"
                    title="Delete notice"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Improved Publish/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-5xl overflow-hidden rounded-[2.5rem] bg-white p-1 shadow-2xl ring-1 ring-slate-200/50"
            >
              <div className="relative overflow-hidden rounded-[2.4rem] bg-white">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-50 bg-slate-50/50 px-8 py-6">
                  <div className="flex items-center gap-5">
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg ring-1 ring-slate-100">
                      <div className="absolute inset-0 rounded-2xl bg-indigo-500/5" />
                      {editingNotice ? (
                        <Pencil className="h-7 w-7 text-indigo-600" />
                      ) : (
                        <Plus className="h-7 w-7 text-indigo-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black tracking-tight text-slate-800">
                        {editingNotice
                          ? "Revise Notice"
                          : "Publish Announcement"}
                      </h3>
                      <p className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                        <Sparkles className="h-3 w-3 text-indigo-500" />
                        Departmental broadcast portal
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-100 transition-all hover:bg-rose-50 hover:text-rose-600"
                    disabled={saving}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-10">
                  <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                    {/* Left Side: Form Inputs */}
                    <div className="space-y-8 lg:col-span-7">
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 px-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                          <BellRing className="h-3 w-3 text-indigo-500" />{" "}
                          Notice Headline
                        </label>
                        <input
                          type="text"
                          value={form.title}
                          onChange={(e) =>
                            setForm((current) => ({
                              ...current,
                              title: e.target.value,
                            }))
                          }
                          className="h-14 w-full rounded-2xl border-none bg-slate-50 px-6 text-sm font-bold text-slate-700 ring-1 ring-slate-100 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100"
                          placeholder="e.g., Final Examination Schedule - Fall 2026"
                          required
                          disabled={saving}
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-center justify-between px-1">
                          <span className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                            <FileText className="h-3 w-3 text-indigo-500" />{" "}
                            Announcement Details
                          </span>
                          <span className="text-[9px] font-black tracking-widest text-slate-300 uppercase">
                            Rich Text Supported
                          </span>
                        </label>
                        <textarea
                          value={form.content}
                          onChange={(e) =>
                            setForm((current) => ({
                              ...current,
                              content: e.target.value,
                            }))
                          }
                          className="min-h-56 w-full rounded-2xl border-none bg-slate-50 p-6 text-sm leading-relaxed font-bold text-slate-700 ring-1 ring-slate-100 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100"
                          placeholder="Type your detailed message here. You can include links, schedules, or general instructions..."
                          disabled={saving}
                        ></textarea>
                      </div>
                    </div>

                    {/* Right Side: File Upload & Info */}
                    <div className="space-y-6 lg:col-span-5">
                      <div className="rounded-[2rem] bg-slate-50/50 p-6 ring-1 ring-slate-100">
                        <div className="mb-6 flex items-center gap-3">
                          <h3 className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">
                            Digital Media
                          </h3>
                          <div className="h-px flex-1 bg-slate-200/60"></div>
                        </div>

                        <label className="group/upload relative flex min-h-48 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[1.5rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/60 transition-all hover:bg-indigo-50 hover:ring-indigo-200">
                          <div className="relative z-10 flex flex-col items-center">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 transition-transform group-hover/upload:scale-110 group-hover/upload:rotate-3">
                              <Upload className="h-7 w-7" />
                            </div>
                            <span className="text-xs font-black tracking-widest text-slate-700 uppercase">
                              Attach Media File
                            </span>
                            <span className="mt-2 text-[9px] font-black tracking-[0.1em] text-slate-400 uppercase">
                              PDF, JPG, DOCX up to 10MB
                            </span>
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              setFile(e.target.files?.[0] || null);
                              setRemoveExistingFile(false);
                            }}
                            disabled={saving}
                          />
                        </label>

                        {selectedFileNotice && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-indigo-100"
                          >
                            <div className="flex min-w-0 items-center gap-4">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 shadow-inner">
                                <AttachmentIcon notice={selectedFileNotice} />
                              </div>
                              <div className="min-w-0">
                                <p
                                  className="truncate text-xs font-black text-slate-700"
                                  title={file.name}
                                >
                                  {file.name}
                                </p>
                                <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                                  {formatFileSize(file.size)}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={resetFileInput}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-500 transition-all hover:bg-rose-600 hover:text-white hover:shadow-lg"
                              disabled={saving}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </motion.div>
                        )}

                        {editingNotice?.filePath && !file && (
                          <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                            <div className="flex items-center justify-between gap-4">
                              <div className="min-w-0">
                                <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                                  Current Attachment
                                </p>
                                <p
                                  className="mt-0.5 truncate text-xs font-black text-slate-700"
                                  title={editingNotice.originalName}
                                >
                                  {editingNotice.originalName ||
                                    "Notice_Document.pdf"}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setRemoveExistingFile((current) => !current)
                                }
                                className={`flex h-8 items-center rounded-lg px-4 text-[9px] font-black tracking-widest uppercase transition-all ${
                                  removeExistingFile
                                    ? "bg-rose-600 text-white shadow-lg"
                                    : "bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                                }`}
                                disabled={saving}
                              >
                                {removeExistingFile ? "Removing" : "Detach"}
                              </button>
                            </div>
                            {removeExistingFile && (
                              <p className="mt-2 flex items-center gap-1.5 text-[9px] font-black tracking-widest text-rose-500 uppercase">
                                <AlertCircle className="h-3 w-3" />
                                File will be deleted on save
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="rounded-[1.5rem] bg-indigo-50/50 p-6 ring-1 ring-indigo-100">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-indigo-100">
                            <Info className="h-4 w-4 text-indigo-500" />
                          </div>
                          <p className="text-[10px] font-black tracking-widest text-indigo-700 uppercase">
                            Broadcast Rule
                          </p>
                        </div>
                        <p className="mt-4 text-[11px] leading-relaxed font-bold text-indigo-600/70">
                          Notices require a headline plus either text content or
                          a digital attachment. Students are notified instantly
                          upon publication.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer Actions */}
                  <div className="mt-12 flex flex-col-reverse items-center justify-between gap-6 rounded-3xl border border-slate-100 bg-slate-50/30 p-6 sm:flex-row">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-indigo-500 shadow-sm ring-1 ring-slate-100">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                          Authorization
                        </p>
                        <p className="text-xs font-black text-slate-700 uppercase">
                          Department Admin
                        </p>
                      </div>
                    </div>

                    <div className="flex w-full items-center gap-4 sm:w-auto">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="h-14 flex-1 px-8 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase transition-all hover:text-slate-600 sm:flex-none sm:px-10"
                        disabled={saving}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving || !canSubmit}
                        className="group/save relative flex h-14 flex-1 items-center justify-center gap-3 overflow-hidden rounded-2xl bg-slate-900 px-10 text-[10px] font-black tracking-[0.3em] text-white uppercase shadow-xl transition-all duration-500 hover:-translate-y-1 hover:bg-indigo-600 hover:shadow-indigo-100 disabled:opacity-50 disabled:hover:translate-y-0 sm:flex-none"
                      >
                        {saving ? (
                          <span className="loading loading-spinner"></span>
                        ) : (
                          <>
                            <div className="relative z-10 flex items-center gap-3">
                              {editingNotice ? (
                                <Save className="h-4 w-4" />
                              ) : (
                                <Send className="h-4 w-4" />
                              )}
                              <span>
                                {editingNotice ? "Save Changes" : "Publish Now"}
                              </span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 transition-opacity group-hover/save:opacity-100" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
