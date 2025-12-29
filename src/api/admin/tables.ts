import api from "../axios";
import type { Table, TableStatus } from "../../types/tables";

export const getTables = async (params?: {
   status?: TableStatus;
   keyword?: string;
}): Promise<Table[]> => {
   const res = await api.get("/api/admin/tables", { params });
   return res.data.map((t: any) => ({ ...t, id: t._id }));
};

export const getTableById = async (id: string): Promise<Table> => {
   const res = await api.get(`/api/admin/tables/${id}`);
   return { ...res.data, id: res.data._id };
};

export const createTable = async (data: Partial<Table>): Promise<Table> => {
   const res = await api.post("/api/admin/tables", data);
   return { ...res.data, id: res.data._id };
};

export const updateTable = async (
   id: string,
   data: Partial<Table>
): Promise<Table> => {
   const res = await api.put(`/api/admin/tables/${id}`, data);
   return { ...res.data, id: res.data._id };
};

export const updateTableStatus = async (
   id: string,
   status: TableStatus
): Promise<Table> => {
   const res = await api.patch(`/api/admin/tables/${id}/status`, { status });
   return { ...res.data, id: res.data._id };
};

export const getTableQR = async (
   id: string
): Promise<{ qrUrl: string; token: string; createdAt: string }> => {
   const res = await api.get(`/api/admin/tables/${id}/qr`);
   return res.data;
};

export const generateTableQR = async (
   id: string
): Promise<{ qrUrl: string; token: string; createdAt: string }> => {
   const res = await api.post(`/api/admin/tables/${id}/qr/generate`);
   return res.data;
};

export const downloadTableQR = async (
   id: string,
   format: "png" | "pdf" = "png"
) => {
   const res = await api.get(`/api/admin/tables/${id}/qr/download`, {
      params: { format },
      responseType: "blob",
   });
   return res.data;
};

export const downloadAllTableQRs = async (format: "zip" | "pdf" = "zip") => {
   const res = await api.get(`/api/admin/tables/qr/download-all`, {
      params: { format },
      responseType: "blob",
   });
   return res.data;
};

export const regenerateAllTableQR = async (): Promise<{
   affected: number;
   tables: string[];
}> => {
   const res = await api.post("/api/admin/tables/qr/regenerate-all");
   return res.data;
};
