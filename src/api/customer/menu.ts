import api from "../axios";

export type CustomerMenuQuery = {
  q?: string;
  categoryId?: string;
  sort?: "createdAt" | "price" | "popularity";
  page?: number;
  limit?: number;
};

export type CustomerMenuResponse = {
  restaurantId: string;
  page: number;
  limit: number;
  total: number;
  categories: { id: string; name: string; displayOrder: number }[];
  items: {
    id: string;
    categoryId?: string;
    name: string;
    description?: string;
    price: number;
    status: string;
    canOrder: boolean;
    isChefRecommended?: boolean;
    ratingAvg?: number;
    ratingCount?: number;
    primaryPhotoUrl?: string | null;
    modifierGroups: any[];
  }[];
};

export async function getCustomerMenu(params: CustomerMenuQuery) {
  const res = await api.get<CustomerMenuResponse>("api/menu", { params });
  return res.data;
}

