import { Modal } from "./Modal";
import { AlertTriangle, Loader2 } from "lucide-react";

type ConfirmModalProps = {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  tone?: "danger" | "warning";
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
};

export function ConfirmModal({
  open,
  title = "Confirm",
  description = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  tone = "danger",
  loading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  const isDanger = tone === "danger";

  return (
    <Modal open={open} title={title} onClose={onClose as any}>
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div
            className={[
              "h-10 w-10 rounded-2xl flex items-center justify-center shrink-0",
              isDanger ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600",
            ].join(" ")}
          >
            <AlertTriangle size={18} />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900">{title}</p>
            <p className="mt-1 text-sm text-slate-500 leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all disabled:opacity-60"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={[
              "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2 text-sm font-black text-white transition-all active:scale-95 disabled:opacity-70",
              isDanger ? "bg-rose-600 hover:bg-rose-700" : "bg-amber-600 hover:bg-amber-700",
            ].join(" ")}
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
