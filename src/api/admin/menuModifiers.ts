import api from "../axios";
import type { ModifierSelectionType, ModifierStatus } from "../../types/menuModifiers";

export type CreateModifierGroupPayload = {
  name: string;
  selectionType: ModifierSelectionType;
  isRequired?: boolean;
  minSelections?: number;
  maxSelections?: number;
  displayOrder?: number;
  status?: ModifierStatus;
};

export async function createModifierGroup(payload: CreateModifierGroupPayload) {
  const res = await api.post("/api/admin/menu/modifier-groups", payload);
  return res.data;
}

export async function updateModifierGroup(id: string, payload: Partial<CreateModifierGroupPayload>) {
  const res = await api.put(`/api/admin/menu/modifier-groups/${id}`, payload);
  return res.data;
}

export async function deleteModifierGroup(id: string) {
  const res = await api.delete(`/api/admin/menu/modifier-groups/${id}`);
  return res.data;
}

export async function createModifierOption(
  groupId: string,
  payload: { name: string; priceAdjustment?: number; displayOrder?: number }
) {
  const res = await api.post(`/api/admin/menu/modifier-groups/${groupId}/options`, payload);
  return res.data;
}

export async function updateModifierOption(
  optionId: string,
  payload: Partial<{ name: string; priceAdjustment: number; status: ModifierStatus; displayOrder: number }>
) {
  const res = await api.put(`/api/admin/menu/modifier-options/${optionId}`, payload);
  return res.data;
}

export async function deleteModifierOption(optionId: string) {
  const res = await api.delete(`/api/admin/menu/modifier-options/${optionId}`);
  return res.data;
}

export async function setItemModifierGroups(itemId: string, groupIds: string[]) {
  const res = await api.post(`/api/admin/menu/items/${itemId}/modifier-groups`, { groupIds });
  return res.data as { success: true; modifierGroupIds: string[] };
}
