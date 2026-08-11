import apiClient, { extractData } from "@/lib/axios";
import type { User, UsersResponse } from "@/types/user";

export const userService = {
  async getUsers(params?: { search?: string; role?: string; page?: number; limit?: number }): Promise<UsersResponse> {
    const res = await apiClient.get("/users", { params });
    const data = extractData<{ items: User[]; pagination: { page: number; limit: number; total: number } }>(res);
    return {
      users: data.items,
      total: data.pagination.total,
      page: data.pagination.page,
      limit: data.pagination.limit,
    };
  },

  async getUser(id: string): Promise<User> {
    const res = await apiClient.get(`/users/${id}`);
    return extractData<User>(res);
  },

  async updateUser(id: string, data: Partial<Pick<User, "name" | "email">>): Promise<User> {
    const res = await apiClient.patch(`/users/${id}`, data);
    return extractData<User>(res);
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },
};
