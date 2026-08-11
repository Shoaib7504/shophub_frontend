import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { orderService } from "@/services/order.service";
import type { CreateOrderInput, UpdateOrderStatusInput } from "@/types/order";

export const ORDERS_KEY = "orders";
export const MY_ORDERS_KEY = "my-orders";

export function useMyOrders(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: [MY_ORDERS_KEY, params],
    queryFn: () => orderService.getMyOrders(params),
  });
}

export function useMyOrder(id: string) {
  return useQuery({
    queryKey: [MY_ORDERS_KEY, id],
    queryFn: () => orderService.getMyOrder(id),
    enabled: !!id,
  });
}

export function useAllOrders(params?: { page?: number; limit?: number; status?: string }) {
  return useQuery({
    queryKey: [ORDERS_KEY, params],
    queryFn: () => orderService.getAllOrders(params),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: [ORDERS_KEY, id],
    queryFn: () => orderService.getOrder(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderInput) => orderService.createOrder(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [MY_ORDERS_KEY] });
      toast.success("Order placed successfully!");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusInput }) =>
      orderService.updateOrderStatus(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ORDERS_KEY] });
      qc.invalidateQueries({ queryKey: [MY_ORDERS_KEY] });
      toast.success("Order status updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
