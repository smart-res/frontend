export type TableStatus = 'active' | 'inactive' | 'occupied';

export interface Table {
  id: string;
  tableNumber: string;
  capacity: number;
  location: string;
  description?: string;
  status: TableStatus;
  qrToken?: string;
  qrTokenCreatedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
