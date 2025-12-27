import api from "../axios";
import type { CategoryStatus, MenuCategory, Paginated } from "../../types/menu";

export type CategorySortBy = "displayOrder" | "name" | "createdAt";
export type SortDir = "asc" | "desc";

export type GetCategoriesParams = {
  q?: string;
  status?: CategoryStatus | "all";
  sortBy?: CategorySortBy;
  sortDir?: SortDir;
  page?: number;
  limit?: number;
};

export async function getAdminCategories(params: GetCategoriesParams) {
  const { data } = await api.get<Paginated<MenuCategory>>(
    "/api/admin/menu/categories",
    { params },
  );
  return data;
}

export type CreateCategoryDto = {
  name: string;
  description?: string;
  displayOrder?: number;
  status?: CategoryStatus;
};

export async function createAdminCategory(dto: CreateCategoryDto) {
  const { data } = await api.post<MenuCategory>("/api/admin/menu/categories", dto);
  return data;
}

export type UpdateCategoryDto = {
  name: string;
  description?: string;
  displayOrder?: number;
  status?: CategoryStatus;
};

export async function updateAdminCategory(id: string, dto: UpdateCategoryDto) {
  const { data } = await api.put<MenuCategory>(`/api/admin/menu/categories/${id}`, dto);
  return data;
}

export async function patchAdminCategoryStatus(id: string, status: CategoryStatus) {
  const { data } = await api.patch<MenuCategory>(
    `/api/admin/menu/categories/${id}/status`,
    { status },
  );
  return data;
}
