import { useEffect, useRef, useState } from "react";
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
            className="btn w-full rounded-xl border-0 bg-indigo-600 px-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-xl sm:w-auto"
          >
            <Plus className="mr-1 h-5 w-5" /> Publish Notice
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
              className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] hover:ring-indigo-100"
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
                    className="flex h-8 items-center gap-1.5 rounded-xl bg-indigo-50 px-3 text-[10px] font-bold text-indigo-600 shadow-sm transition-all hover:bg-indigo-100 hover:text-indigo-700"
                    title="Edit notice"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(notice)}
                    className="flex h-8 items-center gap-1.5 rounded-xl bg-rose-50 px-3 text-[10px] font-bold text-rose-600 shadow-sm transition-all hover:bg-rose-100 hover:text-rose-700"
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

      {isModalOpen && (
        <div className="modal modal-open bg-slate-900/40 backdrop-blur-md">
          <div className="modal-box max-w-4xl overflow-hidden rounded-[2rem] border border-white/20 bg-white/95 p-0 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
                  {editingNotice ? (
                    <Pencil className="h-6 w-6 text-indigo-600" />
                  ) : (
                    <Megaphone className="h-6 w-6 text-indigo-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold tracking-tight text-slate-800">
                    {editingNotice ? "Edit Notice" : "Publish Notice"}
                  </h3>
                  <p className="mt-0.5 text-sm font-medium text-slate-500">
                    Add the message, attach a file, then publish it for
                    students.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="btn btn-circle btn-ghost bg-white shadow-sm hover:bg-rose-50 hover:text-rose-600"
                disabled={saving}
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
                <div className="space-y-5">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-slate-700">
                        Notice Title
                      </span>
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
                      className="input input-bordered w-full bg-white text-base focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="e.g., Semester final exam schedule"
                      required
                      disabled={saving}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-slate-700">
                        Notice Text
                      </span>
                      <span className="label-text-alt text-slate-500">
                        Optional when a file is attached
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
                      className="textarea textarea-bordered h-56 w-full bg-white text-base leading-relaxed focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="Write the announcement details here..."
                      disabled={saving}
                    ></textarea>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <label className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
                      <FilePlus className="h-4 w-4 text-indigo-600" />
                      Attachment
                    </label>
                    <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center hover:border-indigo-400 hover:bg-indigo-50/40">
                      <Upload className="mb-3 h-9 w-9 text-indigo-500" />
                      <span className="text-sm font-bold text-slate-800">
                        Upload any notice file
                      </span>
                      <span className="mt-1 text-xs font-medium text-slate-500">
                        JPG, PNG, PDF, DOCX, XLSX, PPTX, ZIP, and more
                      </span>
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
                      <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-inner">
                            <AttachmentIcon notice={selectedFileNotice} />
                          </div>
                          <div className="min-w-0">
                            <p
                              className="truncate text-sm font-bold text-slate-800"
                              title={file.name}
                            >
                              {file.name}
                            </p>
                            <p className="text-xs font-semibold text-slate-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={resetFileInput}
                          className="btn btn-square btn-ghost btn-sm text-slate-500 hover:bg-white hover:text-rose-600"
                          title="Remove selected file"
                          disabled={saving}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {editingNotice?.filePath && !file && (
                      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-500 uppercase">
                              Current attachment
                            </p>
                            <p
                              className="truncate text-sm font-semibold text-slate-800"
                              title={editingNotice.originalName}
                            >
                              {editingNotice.originalName || "Attached file"}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setRemoveExistingFile((current) => !current)
                            }
                            className={
                              removeExistingFile
                                ? "btn btn-sm border-0 bg-rose-600 text-white hover:bg-rose-700"
                                : "btn btn-sm border-slate-200 bg-white text-slate-700 hover:bg-rose-50 hover:text-rose-600"
                            }
                            disabled={saving}
                          >
                            {removeExistingFile ? "Undo Remove" : "Remove"}
                          </button>
                        </div>
                        {removeExistingFile && (
                          <p className="mt-2 text-xs font-medium text-rose-600">
                            This file will be removed when you save.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-600 shadow-sm">
                    <p className="font-bold text-slate-800">Publishing rule</p>
                    <p className="mt-1">
                      A notice needs a title and either notice text or one
                      attachment. Students see the final version immediately
                      after saving.
                    </p>
                  </div>
                </div>
              </div>

              <div className="modal-action mt-6 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn btn-ghost hover:bg-slate-200"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn border-0 bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                  disabled={saving || !canSubmit}
                >
                  {saving ? (
                    <span className="loading loading-spinner"></span>
                  ) : editingNotice ? (
                    <>
                      <Save className="h-4 w-4" /> Save Changes
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Publish Now
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          <button
            type="button"
            className="modal-backdrop bg-slate-950/50"
            onClick={closeModal}
            aria-label="Close notice form"
          ></button>
        </div>
      )}
    </div>
  );
}
