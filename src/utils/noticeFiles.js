export const FILE_HOST = "http://localhost:3001";

export const getNoticeFileUrl = (filePath) =>
  filePath ? `${FILE_HOST}${filePath}` : "";

export const formatFileSize = (size) => {
  const bytes = Number(size || 0);
  if (!bytes) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const isImageAttachment = (notice) => {
  const name = notice?.originalName || "";
  const mime = notice?.fileMime || "";
  return (
    mime.startsWith("image/") ||
    /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(name)
  );
};
