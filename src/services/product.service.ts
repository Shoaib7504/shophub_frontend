import apiClient, { extractData } from "@/lib/axios";
import type { Product, ProductsResponse, CreateProductInput, UpdateProductInput, ProductFilters } from "@/types/product";

export const productService = {
  async getProducts(filters?: ProductFilters): Promise<ProductsResponse> {
    const res = await apiClient.get("/products", { params: filters });
    const data = extractData<{ items: Product[]; pagination: { page: number; limit: number; total: number } }>(res);
    return {
      products: data.items,
      total: data.pagination.total,
      page: data.pagination.page,
      limit: data.pagination.limit,
    };
  },

  async getProduct(id: string): Promise<Product> {
    const res = await apiClient.get(`/products/${id}`);
    return extractData<Product>(res);
  },

  async createProduct(data: CreateProductInput): Promise<Product> {
    const res = await apiClient.post("/products", data);
    return extractData<Product>(res);
  },

  async updateProduct(id: string, data: UpdateProductInput): Promise<Product> {
    const res = await apiClient.patch(`/products/${id}`, data);
    return extractData<Product>(res);
  },

  // The backend doesn't delete the row, it just marks it as deleted
  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  },
};
