import apiClient, { extractData } from "@/lib/axios";
import type { Category, CreateCategoryInput, UpdateCategoryInput } from "@/types/category";

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    // Ask for the max the backend allows so lists aren't stuck at the default 10
    const res = await apiClient.get("/categories", { params: { limit: 100 } });
    const data = extractData<{ items: Category[] }>(res);
    return data.items;
  },

  async getCategory(id: string): Promise<Category> {
    const res = await apiClient.get(`/categories/${id}`);
    return extractData<Category>(res);
  },

  async createCategory(data: CreateCategoryInput): Promise<Category> {
    const res = await apiClient.post("/categories", data);
    return extractData<Category>(res);
  },

  async updateCategory(id: string, data: UpdateCategoryInput): Promise<Category> {
    const res = await apiClient.patch(`/categories/${id}`, data);
    return extractData<Category>(res);
  },

  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete(`/categories/${id}`);
  },
};
