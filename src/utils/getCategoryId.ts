import type { CategoryRef } from "../types/menuItem";

export function getCategoryId(
  value?: string | CategoryRef | null,
): string {
  if (!value) return "";
  return typeof value === "string" ? value : value._id;
}
