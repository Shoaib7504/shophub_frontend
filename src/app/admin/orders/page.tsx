"use client";

import { useState } from "react";
import { useAllOrders, useUpdateOrderStatus } from "@/hooks/useOrders";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { OrderStatusBadge } from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/Button";
import { formatPrice, formatDate, stringToGradient } from "@/lib/utils";
import { Eye, Package } from "lucide-react";
import type { Order, OrderStatus } from "@/types/order";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

const LIMIT = 10;

function OrderDetailModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const updateStatus = useUpdateOrderStatus();
  const [newStatus, setNewStatus] = useState<OrderStatus>(order.status);

  const handleUpdate = () => {
    updateStatus.mutate({ id: order.id, data: { status: newStatus } });
    onClose();
  };

  return (
    <Modal open onClose={onClose} title={`Order #${order.id.slice(0, 8).toUpperCase()}`} size="lg">
      <div className="space-y-5">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <p className="text-xs text-on-surface-muted mb-0.5">Customer</p>
            <p className="text-sm font-semibold text-on-surface">{order.user?.name ?? "—"}</p>
            <p className="text-xs text-on-surface-muted">{order.user?.email ?? ""}</p>
          </div>
          <div>
            <p className="text-xs text-on-surface-muted mb-0.5">Date</p>
            <p className="text-sm font-medium text-on-surface">{formatDate(order.createdAt)}</p>
          </div>
        </div>

        <div className="divide-y divide-[#f0edef] border border-surface-high rounded-xl overflow-hidden">
          {order.orderItems?.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3">
              <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: stringToGradient(item.productId) }}>
                <Package size={16} className="text-white/60" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-on-surface truncate">{item.product?.title ?? item.productId.slice(0, 12)}</p>
                <p className="text-xs text-on-surface-muted">{formatPrice(item.price)} × {item.quantity}</p>
              </div>
              <p className="text-sm font-bold text-primary">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between py-3 border-t border-surface-high">
          <span className="font-bold text-on-surface">Total</span>
          <span className="text-xl font-bold text-primary font-display">{formatPrice(order.total)}</span>
        </div>

        {/* Change the order status */}
        <div className="pt-3 border-t border-surface-high">
          <p className="text-sm font-medium text-on-surface mb-2">Update Status</p>
          <div className="flex gap-3">
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
              options={STATUS_OPTIONS.filter((o) => o.value !== "")}
              className="flex-1"
            />
            <Button onClick={handleUpdate} loading={updateStatus.isPending} size="sm">Update</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default function AdminOrdersPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  const { data, isLoading, isError, refetch } = useAllOrders({ status, page, limit: LIMIT });

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-primary font-display">Orders</h1>
        <p className="text-sm text-on-surface-muted">{data?.total ?? 0} orders total</p>
      </div>

      <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] overflow-hidden">
        <div className="p-4 border-b border-surface-high">
          <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} options={STATUS_OPTIONS} className="w-44" />
        </div>
        <div className="overflow-x-auto">
          {isError ? <div className="p-6"><ErrorState onRetry={() => refetch()} /></div>
            : isLoading ? <div className="p-6"><TableSkeleton /></div>
            : data?.orders.length === 0 ? <EmptyState title="No orders found" icon="orders" />
            : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-low text-left">
                    {["Order ID","Customer","Total","Status","Date","Actions"].map((h) => (
                      <th key={h} className="px-5 py-3 text-xs font-semibold text-on-surface-muted uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0edef]">
                  {data?.orders.map((o) => (
                    <tr key={o.id} className="hover:bg-[#f9f7f8] transition-colors">
                      <td className="px-5 py-3 font-mono text-xs text-on-surface-muted">#{o.id.slice(0,8).toUpperCase()}</td>
                      <td className="px-5 py-3 font-medium text-on-surface">{o.user?.name ?? "—"}</td>
                      <td className="px-5 py-3 font-bold text-primary font-display">{formatPrice(o.total)}</td>
                      <td className="px-5 py-3"><OrderStatusBadge status={o.status} /></td>
                      <td className="px-5 py-3 text-on-surface-muted whitespace-nowrap">{formatDate(o.createdAt)}</td>
                      <td className="px-5 py-3">
                        <button onClick={() => setViewOrder(o)} className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded-lg transition-all"><Eye size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
        {(data?.total ?? 0) > LIMIT && (
          <div className="p-4 border-t border-surface-high">
            <Pagination page={page} total={data?.total ?? 0} limit={LIMIT} onChange={setPage} />
          </div>
        )}
      </div>

      {viewOrder && <OrderDetailModal order={viewOrder} onClose={() => setViewOrder(null)} />}
    </div>
  );
}
