import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { reviewService } from "@/services/review.service";
import type { CreateReviewInput } from "@/types/review";
import { PRODUCTS_KEY } from "./useProducts";

export const REVIEWS_KEY = "reviews";

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: [REVIEWS_KEY, "product", productId],
    queryFn: () => reviewService.getProductReviews(productId),
    enabled: !!productId,
  });
}

export function useAllReviews(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: [REVIEWS_KEY, "all", params],
    queryFn: () => reviewService.getAllReviews(params),
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReviewInput) => reviewService.createReview(data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: [REVIEWS_KEY, "product", variables.productId] });
      qc.invalidateQueries({ queryKey: [PRODUCTS_KEY, variables.productId] });
      toast.success("Review submitted!");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewService.deleteReview(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [REVIEWS_KEY] });
      toast.success("Review deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
