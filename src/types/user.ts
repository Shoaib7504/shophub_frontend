import type { Role } from "./auth";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}
