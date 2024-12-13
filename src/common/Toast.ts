import { toast, ToastOptions } from "react-toastify";

type ToastType = "success" | "error" | "info" | "warning" | "default";

export const Toast = {
  show: (
    message: string,
    type: ToastType = "info",
    options: ToastOptions = {},
  ) => {
    const toastTypes: Record<
      ToastType,
      (msg: string, opts?: ToastOptions) => void
    > = {
      success: toast.success,
      error: toast.error,
      info: toast.info,
      warning: toast.warning,
      default: toast,
    };

    // Use the toast function dynamically
    toastTypes[type](message, { position: "top-right", ...options });
  },
};
