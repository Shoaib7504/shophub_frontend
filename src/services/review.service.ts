import apiClient, { extractData } from "@/lib/axios";
import type { Review, CreateReviewInput } from "@/types/review";

export const reviewService = {
  async getProductReviews(productId: string): Promise<Review[]> {
    const res = await apiClient.get("/reviews", { params: { productId } });
    const data = extractData<{ items: Review[] }>(res);
    return data.items;
  },

  async getAllReviews(params?: { page?: number; limit?: number }): Promise<{ reviews: Review[]; total: number }> {
    const res = await apiClient.get("/reviews", { params });
    const data = extractData<{ items: Review[]; pagination: { total: number } }>(res);
    return { reviews: data.items, total: data.pagination.total };
  },

  async createReview(data: CreateReviewInput): Promise<Review> {
    const res = await apiClient.post("/reviews", data);
    return extractData<Review>(res);
  },

  async deleteReview(id: string): Promise<void> {
    await apiClient.delete(`/reviews/${id}`);
  },
};
