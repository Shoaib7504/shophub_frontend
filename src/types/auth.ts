export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export type Role = "ADMIN" | "USER";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}
