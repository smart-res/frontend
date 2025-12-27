import api from "../axios";
import type { MenuItem, Paginated, ItemStatus } from "../../types/menuItem";
export type ItemSort = "price" | "popularity" | "createdAt";
export type SortDir = "asc" | "desc";

export type GetItemsParams = {
  name?: string;          
  categoryId?: string;
  status?: ItemStatus;     
  sort?: ItemSort;         
  order?: SortDir;        
  page?: number;
  limit?: number;
};

export type CreateItemDto = {
  name: string;
  categoryId: string;
  price: number;
  description?: string;
  prepTimeMinutes?: number;
  status: ItemStatus;
  isChefRecommended?: boolean;
};

export type UpdateItemDto = Partial<CreateItemDto>;

export async function getAdminItems(params: GetItemsParams) {
  const { data } = await api.get<Paginated<MenuItem>>("/api/admin/menu/items", { params });
  return data;
}

export async function getAdminItemById(id: string) {
  const { data } = await api.get<MenuItem>(`/api/admin/menu/items/${id}`);
  return data;
}

export async function createAdminItem(dto: CreateItemDto) {
  const { data } = await api.post<MenuItem>("/api/admin/menu/items", dto);
  return data;
}

export async function updateAdminItem(id: string, dto: UpdateItemDto) {
  const { data } = await api.put<MenuItem>(`/api/admin/menu/items/${id}`, dto);
  return data;
}

export async function deleteAdminItem(id: string) {
  const { data } = await api.delete<{ success: boolean }>(`/api/admin/menu/items/${id}`);
  return data;
}

export async function setItemModifierGroups(id: string, groupIds: string[]) {
  const { data } = await api.post<{ success: boolean; modifierGroupIds: string[] }>(
    `/api/admin/menu/items/${id}/modifier-groups`,
    { groupIds },
  );
  return data;
}