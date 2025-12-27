import React from "react";

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute left-1/2 top-1/2 w-[95vw] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm hover:bg-gray-100"
            type="button"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
