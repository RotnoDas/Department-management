import { toast } from "@heroui/react";

const FLASH_TOAST_KEY = "cse-department:toast";

const COLOR_TO_VARIANT = {
  danger: "danger",
  error: "danger",
  success: "success",
  warning: "warning",
  primary: "accent",
  secondary: "accent",
  info: "accent",
  default: "default",
};

const normalizeToast = (options = {}) => {
  const {
    title,
    message,
    description,
    color = "default",
    variant,
    ...rest
  } = options;

  return {
    title: title || message || description || "Done",
    description: title || message ? description : undefined,
    variant: variant || COLOR_TO_VARIANT[color] || "default",
    options: rest,
  };
};

export const addToast = (options) => {
  const normalized = normalizeToast(options);
  const toastOptions = {
    ...normalized.options,
    description: normalized.description,
  };

  if (normalized.variant === "success") {
    return toast.success(normalized.title, toastOptions);
  }

  if (normalized.variant === "danger") {
    return toast.danger(normalized.title, toastOptions);
  }

  if (normalized.variant === "warning") {
    return toast.warning(normalized.title, toastOptions);
  }

  if (normalized.variant === "accent") {
    return toast.info(normalized.title, toastOptions);
  }

  return toast(normalized.title, {
    ...toastOptions,
    variant: normalized.variant,
  });
};

export const queueToast = (options) => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(FLASH_TOAST_KEY, JSON.stringify(options));
};

export const flushQueuedToast = () => {
  if (typeof window === "undefined") return;

  const rawToast = window.sessionStorage.getItem(FLASH_TOAST_KEY);
  if (!rawToast) return;

  window.sessionStorage.removeItem(FLASH_TOAST_KEY);

  try {
    addToast(JSON.parse(rawToast));
  } catch {
    addToast({ title: rawToast, color: "primary" });
  }
};

export { toast };
