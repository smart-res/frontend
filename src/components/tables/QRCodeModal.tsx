import { useState } from "react";
import {
  X,
  QrCode,
  Download,
  Printer,
  RefreshCw,
  Users,
  MapPin,
  Calendar,
  BarChart3,
} from "lucide-react";
import type { QRCodeModalProps } from "../../types/qrcode";
import { downloadTableQR } from "../../api/admin/tables";

const QRCodeModal = ({
  open,
  onClose,
  tableId,
  tableName,
  capacity,
  location,
  qrUrl,
  createdAt,
  scansToday,
  onRegenerate,
}: QRCodeModalProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!open) return null;

  const handleAskRegenerate = () => setConfirmOpen(true);

  const handleConfirmRegenerate = () => {
    onRegenerate(tableId);
    setConfirmOpen(false);
  };

  const handleCancelRegenerate = () => setConfirmOpen(false);

  const [downloading, setDownloading] = useState<"png" | "pdf" | null>(null);

  const handleDownloadQR = async (format: "png" | "pdf" = "png") => {
    try {
      setDownloading(format);

      const res = await downloadTableQR(tableId, format);
      const disposition = res.headers?.["content-disposition"] as string | undefined;
      const match = disposition?.match(/filename\*=UTF-8''([^;]+)|filename="?([^"]+)"?/i);
      const filename =
        (match?.[1] ? decodeURIComponent(match[1]) : match?.[2]) ||
        `table-${tableName}-qr.${format}`;

      const blob = res.data as Blob;
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/40 p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200 max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 sm:px-8 sm:py-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hidden sm:block">
              <QrCode size={24} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight leading-tight">
                {tableName}
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium uppercase tracking-wider">
                Table Assets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200/50 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {/* Left: QR */}
            <div className="flex flex-col items-center gap-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-1000" />
                <div className="relative bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-inner">
                  {qrUrl ? (
                    <img
                      src={qrUrl}
                      alt="QR Code"
                      className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                    />
                  ) : (
                    <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center bg-slate-50 text-slate-400 italic rounded-xl border-2 border-dashed border-slate-200">
                      Generating...
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col w-full gap-2 sm:max-w-[240px] md:max-w-none">
                <button
                  onClick={() => handleDownloadQR("png")}
                  disabled={downloading !== null}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Download size={18} />
                  {downloading === "png" ? "Downloading..." : "Download PNG"}
                </button>

                <button
                  onClick={() => handleDownloadQR("pdf")}
                  disabled={downloading !== null}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Printer size={18} />
                  {downloading === "pdf" ? "Downloading..." : "Download PDF"}
                </button>
              </div>
            </div>

            {/* Right: Metadata */}
            <div className="flex flex-col">
              <div className="space-y-5">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                  Details & Analytics
                </h4>

                <div className="grid grid-cols-1 gap-4">
                  <InfoRow icon={<Users size={16} />} label="Capacity" value={capacity ? `${capacity} seats` : "-"} />
                  <InfoRow icon={<MapPin size={16} />} label="Zone" value={location} />
                  <InfoRow icon={<Calendar size={16} />} label="Created" value={createdAt} />
                  <InfoRow icon={<BarChart3 size={16} />} label="Today's Scans" value={scansToday ?? 0} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-6 py-4 sm:px-8 sm:py-6 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={handleAskRegenerate}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 text-rose-600 hover:bg-rose-50 rounded-xl font-bold transition-colors text-sm order-2 sm:order-1"
          >
            <RefreshCw size={16} />
            Regenerate QR
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-colors text-sm order-1 sm:order-2"
          >
            Close
          </button>
        </div>

        {/* Confirm Regenerate Modal */}
        {confirmOpen && (
          <div className="absolute inset-0 z-[110] flex items-end sm:items-center justify-center bg-slate-900/40 p-0 sm:p-6">
            <div className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-6 py-5 border-b border-slate-100">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-base sm:text-lg font-black text-slate-800">
                      Regenerate QR Code?
                    </h4>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      Regenerating will invalidate previous codes. Use this only if the table link needs to be reset.
                    </p>
                  </div>
                  <button
                    onClick={handleCancelRegenerate}
                    className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="px-6 py-4 flex flex-col sm:flex-row gap-2 sm:justify-end">
                <button
                  type="button"
                  onClick={handleCancelRegenerate}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRegenerate}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                >
                  Regenerate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | number;
}) => (
  <div className="flex items-center justify-between group py-1">
    <div className="flex items-center gap-3">
      <div className="text-slate-400 group-hover:text-emerald-500 transition-colors">{icon}</div>
      <span className="text-slate-500 text-sm font-medium">{label}</span>
    </div>
    <span className="font-bold text-slate-800 text-sm text-right ml-4">{value ?? "-"}</span>
  </div>
);

export default QRCodeModal;
