import type { Product } from "./product";
import type { User } from "./user";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  orderId: string;
  productId: string;
  product?: Pick<Product, "id" | "title" | "price">;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  total: number;
  status: OrderStatus;
  userId: string;
  user?: Pick<User, "id" | "name" | "email">;
  orderItems?: OrderItem[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

// Cart types (frontend only, not backed by Prisma)
export interface CartItem {
  productId: string;
  title: string;
  price: number;
  stock: number;
  quantity: number;
}
