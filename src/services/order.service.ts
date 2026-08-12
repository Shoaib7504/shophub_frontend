import apiClient, { extractData } from "@/lib/axios";
import type { Order, OrdersResponse, CreateOrderInput, UpdateOrderStatusInput } from "@/types/order";

interface RawOrder extends Omit<Order, "orderItems"> {
  items?: Order["orderItems"];
}

function mapOrder(order: RawOrder): Order {
  return { ...order, orderItems: order.items };
}

export const orderService = {
  // Endpoints for the logged-in user
  async getMyOrders(params?: { page?: number; limit?: number }): Promise<OrdersResponse> {
    const res = await apiClient.get("/orders", { params });
    return mapOrdersResponse(res);
  },

  async getMyOrder(id: string): Promise<Order> {
    const res = await apiClient.get(`/orders/${id}`);
    return mapOrder(extractData<RawOrder>(res));
  },

  async createOrder(data: CreateOrderInput): Promise<Order> {
    const res = await apiClient.post("/orders", data);
    return mapOrder(extractData<RawOrder>(res));
  },

  // Endpoints for admins
  async getAllOrders(params?: { page?: number; limit?: number; status?: string }): Promise<OrdersResponse> {
    const res = await apiClient.get("/orders", { params });
    return mapOrdersResponse(res);
  },

  async getOrder(id: string): Promise<Order> {
    const res = await apiClient.get(`/orders/${id}`);
    return mapOrder(extractData<RawOrder>(res));
  },

  async updateOrderStatus(id: string, data: UpdateOrderStatusInput): Promise<Order> {
    const res = await apiClient.patch(`/orders/${id}/status`, data);
    return mapOrder(extractData<RawOrder>(res));
  },

  async deleteOrder(id: string): Promise<void> {
    await apiClient.delete(`/orders/${id}`);
  },
};

function mapOrdersResponse(res: { data: { data: { items: RawOrder[]; pagination: { page: number; limit: number; total: number } } } }): OrdersResponse {
  const { items, pagination } = extractData<{ items: RawOrder[]; pagination: { page: number; limit: number; total: number } }>(res);
  return {
    orders: items.map(mapOrder),
    total: pagination.total,
    page: pagination.page,
    limit: pagination.limit,
  };
}
