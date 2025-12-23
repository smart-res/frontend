export interface QRCodeModalProps {
  open: boolean,
  onClose: () => void,

  tableId: string,
  tableName?: string,
  capacity?: number,
  location?: string,

  qrUrl?: string,
  createdAt?: string,
  scansToday?: number,
  onRegenerate: (tableId: string) => void,
}
