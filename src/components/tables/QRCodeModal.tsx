import type { QRCodeModalProps } from "../../types/qrcode";

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
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-lg p-6 space-y-5">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">QR Code – {tableName}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col items-center gap-3">
            {qrUrl ? (
              <img
                src={qrUrl}
                alt="QR Code"
                className="w-52 h-52 border rounded"
              />
            ) : (
              <div className="w-52 h-52 flex items-center justify-center bg-gray-100">
                No QR
              </div>
            )}

            <div className="flex gap-2">
              <a
                href={qrUrl}
                download
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Download PNG
              </a>

              <button
                className="px-3 py-1 text-sm bg-indigo-500 text-white rounded hover:bg-indigo-600"
                onClick={() => window.print()}
              >
                Download PDF
              </button>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <InfoRow label="Table Name" value={tableName} />
            <InfoRow label="Capacity" value={capacity ? `${capacity} seats` : '-'} />
            <InfoRow label="Location" value={location} />
            <InfoRow label="QR Created" value={createdAt} />
            <InfoRow label="Scans Today" value={scansToday ?? 0} />
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <button
            onClick={() => onRegenerate(tableId)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Regenerate QR
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

const InfoRow = ({ label, value }: { label: string; value?: string | number }) => (
  <div className="flex justify-between">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium">{value ?? '-'}</span>
  </div>
);

export default QRCodeModal;
