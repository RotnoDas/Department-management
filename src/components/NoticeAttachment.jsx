import {
  Download,
  File,
  FileArchive,
  FileImage,
  FileText,
  Paperclip,
} from "lucide-react";
import {
  formatFileSize,
  getNoticeFileUrl,
  isImageAttachment,
} from "../utils/noticeFiles";

export function AttachmentIcon({ notice, className = "h-6 w-6" }) {
  const name = notice?.originalName || "";
  const mime = notice?.fileMime || "";

  if (isImageAttachment(notice)) {
    return <FileImage className={`${className} text-sky-500`} />;
  }
  if (mime.includes("pdf") || /\.pdf$/i.test(name)) {
    return <FileText className={`${className} text-rose-500`} />;
  }
  if (/\.(zip|rar|7z|tar|gz)$/i.test(name)) {
    return <FileArchive className={`${className} text-amber-500`} />;
  }
  if (/\.(doc|docx|txt|rtf|xls|xlsx|ppt|pptx)$/i.test(name)) {
    return <FileText className={`${className} text-indigo-500`} />;
  }
  return <File className={`${className} text-slate-500`} />;
}

export default function NoticeAttachment({
  notice,
  compact = false,
  showPreview = true,
}) {
  if (!notice?.filePath) return null;

  const fileUrl = getNoticeFileUrl(notice.filePath);
  const showImagePreview = showPreview && isImageAttachment(notice);

  return (
    <div className="space-y-3">
      {showImagePreview && (
        <a
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          className="block overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
          title="Open attachment preview"
        >
          <img
            src={fileUrl}
            alt={notice.originalName || "Notice attachment"}
            className={
              compact ? "h-32 w-full object-cover" : "h-48 w-full object-cover"
            }
          />
        </a>
      )}

      <div className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 shadow-inner">
            <AttachmentIcon notice={notice} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase">
              <Paperclip className="h-3.5 w-3.5" />
              Attachment
            </div>
            <p
              className="truncate text-sm font-semibold text-slate-800"
              title={notice.originalName}
            >
              {notice.originalName || "Attached file"}
            </p>
            <p className="text-xs font-medium text-slate-500">
              {formatFileSize(notice.fileSize)}
            </p>
          </div>
        </div>

        <a
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          className="btn btn-square btn-sm border-0 bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
          title="Open attachment"
        >
          <Download className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
