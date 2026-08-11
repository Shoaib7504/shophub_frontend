import type { Category } from "./category";

export type ProductStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export interface Product {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  price: number;
  stock: number;
  status: ProductStatus;
  categoryId: string;
  category?: Category;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    reviews: number;
  };
  averageRating?: number;
}

export interface CreateProductInput {
  title: string;
  description?: string;
  image?: string | null;
  price: number;
  stock: number;
  status: ProductStatus;
  categoryId: string;
}

export interface UpdateProductInput {
  title?: string;
  description?: string;
  image?: string | null;
  price?: number;
  stock?: number;
  status?: ProductStatus;
  categoryId?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  status?: ProductStatus | "ALL" | "";
  sortBy?: "price" | "createdAt" | "title";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
