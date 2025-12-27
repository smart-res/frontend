import api from "../axios";
import type { ModifierGroup, ModifierOption } from "../../types/menuModifiers";

export async function getAllModifierGroups(status: "active" | "inactive" | "all" = "all") {
  const res = await api.get("/api/admin/menu/modifier-groups", { params: { status } });
  return res.data as ModifierGroup[];
}

export async function getModifierOptions(groupId: string, status: "active" | "inactive" | "all" = "all") {
  const res = await api.get(`/api/admin/menu/modifier-groups/${groupId}/options`, { params: { status } });
  return res.data as ModifierOption[];
}

export async function getAdminItemDetails(itemId: string) {
  const res = await api.get(`/api/admin/menu/items/${itemId}`);
  return res.data as any;
}
