import type { User } from "./user";
import type { Product } from "./product";

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  userId: string;
  productId: string;
  user?: Pick<User, "id" | "name" | "email">;
  product?: Pick<Product, "id" | "title">;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewInput {
  rating: number;
  comment?: string;
  productId: string;
}
