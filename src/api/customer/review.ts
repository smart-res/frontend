import api from "../axios";

export type ListReviewsRes = {
  page: number;
  limit: number;
  total: number;
  summary: null | {
    itemId: string;
    itemName: string;
    ratingAvg: number;
    ratingCount: number;
    ratingBreakdown: Record<"1"|"2"|"3"|"4"|"5", number>;
  };
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    photoUrls: string[];
    userId: string | null;
    createdAt: string;
  }>;
};

export function getItemReviews(itemId: string, params?: { page?: number; limit?: number; sort?: "latest"|"highest"|"lowest" }) {
  return api
    .get<ListReviewsRes>(`/customer/menu/${itemId}/reviews`, { params })
    .then((r) => r.data);
}
