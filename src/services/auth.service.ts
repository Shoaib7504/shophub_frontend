import apiClient, { extractData } from "@/lib/axios";
import type { LoginCredentials, RegisterCredentials, AuthResponse } from "@/types/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const res = await apiClient.post("/auth/login", credentials);
    return extractData<AuthResponse>(res);
  },

  async register(credentials: Omit<RegisterCredentials, "confirmPassword">): Promise<AuthResponse> {
    const res = await apiClient.post("/auth/register", credentials);
    return extractData<AuthResponse>(res);
  },

  async getProfile(): Promise<AuthResponse["user"]> {
    const res = await apiClient.get("/auth/me");
    return extractData<AuthResponse["user"]>(res);
  },
};
