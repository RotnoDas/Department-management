import { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
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
      toast.error("Failed to load notices.");
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
        toast.error("Failed to load notices.");
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
    if (!form.title.trim()) return toast.error("Notice title is required.");
    if (!form.content.trim() && !file && !hasExistingAttachment) {
      return toast.error("Write notice text or attach a file.");
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
        toast.success("Notice updated successfully.");
      } else {
        await api.post("/admin/notices", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Notice published successfully.");
      }

      closeModal();
      fetchNotices();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save notice.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (notice) => {
    if (!window.confirm(`Delete "${notice.title}"?`)) return;

    try {
      await api.delete(`/admin/notices/${notice.id}`);
      toast.success("Notice deleted.");
      fetchNotices();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete notice.");
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
      <div className="card overflow-hidden border border-slate-200 bg-white shadow-xl">
        <div className="h-2 bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-500"></div>
        <div className="card-body flex-col items-start justify-between gap-6 p-6 sm:flex-row sm:items-center lg:p-8">
          <div className="flex items-center gap-5">
            <div className="hidden h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 sm:flex">
              <BellRing className="h-8 w-8" />
            </div>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 uppercase">
                  Admin Broadcast
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 uppercase">
                  {notices.length} notices
                </span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
                Notice Board
              </h1>
              <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500 sm:text-base">
                Publish text announcements with files, then revise or remove
                them whenever the department needs an update.
              </p>
            </div>
          </div>

          <button
            onClick={openPublishForm}
            className="btn w-full border-0 bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 sm:w-auto"
          >
            <Plus className="h-5 w-5" /> Publish Notice
          </button>
        </div>
      </div>

      {notices.length === 0 ? (
        <div className="card border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <div className="card-body min-h-[300px] items-center justify-center">
            <div className="mb-6 rounded-full bg-slate-100 p-6 shadow-inner ring-4 ring-slate-50">
              <Megaphone className="h-12 w-12 text-indigo-400" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-slate-700">
              No Notices Published
            </h3>
            <p className="mx-auto max-w-sm leading-relaxed text-slate-500">
              Create the first announcement with text, an attachment, or both.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {notices.map((notice) => (
            <article
              key={notice.id}
              className="card flex flex-col border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="h-1.5 w-full rounded-t-2xl bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500"></div>
              <div className="card-body flex flex-1 flex-col gap-4 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="rounded-xl bg-indigo-50 p-3 shadow-inner">
                      <AlertCircle className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2
                        className="line-clamp-2 text-xl leading-snug font-bold text-slate-900"
                        title={notice.title}
                      >
                        {notice.title}
                      </h2>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                        <span className="flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1 text-indigo-700">
                          <User className="h-3.5 w-3.5" />
                          {notice.authorName || "Admin"}
                        </span>
                        <span className="flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-slate-600">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(notice.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {notice.content && (
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed whitespace-pre-wrap text-slate-600 shadow-inner">
                    {notice.content}
                  </div>
                )}

                <NoticeAttachment notice={notice} compact />

                <div className="mt-auto flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => openEditForm(notice)}
                    className="btn btn-square btn-ghost btn-sm text-slate-500 hover:bg-indigo-50 hover:text-indigo-700"
                    title="Edit notice"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(notice)}
                    className="btn btn-square btn-ghost btn-sm text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                    title="Delete notice"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="modal modal-open backdrop-blur-sm">
          <div className="modal-box max-w-4xl overflow-hidden border border-slate-200 p-0 shadow-2xl">
            <div className="flex items-center justify-between bg-slate-950 px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/10 p-2">
                  {editingNotice ? (
                    <Pencil className="h-5 w-5" />
                  ) : (
                    <Megaphone className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    {editingNotice ? "Edit Notice" : "Publish Notice"}
                  </h3>
                  <p className="text-sm font-medium text-slate-300">
                    Add the message, attach a file, then publish it for
                    students.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="btn btn-circle btn-ghost btn-sm text-white hover:bg-white/10"
                disabled={saving}
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-slate-50 p-6">
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
