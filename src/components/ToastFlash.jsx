import { useEffect } from "react";
import { flushQueuedToast } from "../utils/toast";

export default function ToastFlash() {
  useEffect(() => {
    flushQueuedToast();
  }, []);

  return null;
}
