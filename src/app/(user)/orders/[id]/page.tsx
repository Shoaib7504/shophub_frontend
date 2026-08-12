"use client";

import { useParams } from "next/navigation";
import { useMyOrder } from "@/hooks/useOrders";
import { formatPrice, formatDate, stringToGradient } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/ui/StatusBadge";
import { Skeleton } from "@/components/ui/Skeleton";
import ErrorState from "@/components/ui/ErrorState";
import { Package, CheckCircle } from "lucide-react";
import type { OrderStatus } from "@/types/order";
import { cn } from "@/lib/utils";

const STATUS_STEPS: OrderStatus[] = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];

function OrderTimeline({ status }: { status: OrderStatus }) {
  const cancelled = status === "CANCELLED";
  const currentIdx = cancelled ? -1 : STATUS_STEPS.indexOf(status);

  return (
    <div className="relative">
      {cancelled ? (
        <div className="flex items-center gap-2 p-4 bg-error-container rounded-xl">
          <span className="text-sm font-medium text-error">This order was cancelled.</span>
        </div>
      ) : (
        <div className="flex items-center gap-0">
          {STATUS_STEPS.map((step, i) => {
            const done = i <= currentIdx;
            const active = i === currentIdx;
            return (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors",
                      done
                        ? "bg-secondary border-secondary"
                        : "bg-white border-outline-variant",
                      active && "ring-4 ring-secondary/20"
                    )}
                  >
                    {done ? (
                      <CheckCircle size={16} className="text-white" />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-xs font-medium text-center whitespace-nowrap",
                      done ? "text-secondary" : "text-on-surface-muted"
                    )}
                  >
                    {step.charAt(0) + step.slice(1).toLowerCase()}
                  </p>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-2 mb-5",
                      i < currentIdx ? "bg-secondary" : "bg-outline-variant"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, isError, refetch } = useMyOrder(id);

  if (isError) return <ErrorState onRetry={() => refetch()} />;

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      {/* Order number and status */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-primary font-display">
            Order Details
          </h1>
          <p className="text-sm font-mono text-on-surface-muted mt-1">
            #{order.id.toUpperCase()}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <p className="text-sm text-on-surface-muted">Placed on {formatDate(order.createdAt)}</p>

      {/* Delivery progress timeline */}
      <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-6">
        <h2 className="font-bold text-on-surface font-display mb-5">
          Order Status
        </h2>
        <OrderTimeline status={order.status} />
      </div>

      {/* Bought items */}
      <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-6">
        <h2 className="font-bold text-on-surface font-display mb-5">
          Items ({order.orderItems?.length ?? 0})
        </h2>
        <div className="divide-y divide-[#f0edef]">
          {order.orderItems?.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-3">
              <div
                className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
                style={{ background: stringToGradient(item.productId) }}
              >
                <Package size={18} className="text-white/60" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-on-surface line-clamp-1">
                  {item.product?.title ?? `Product ${item.productId.slice(0, 6)}`}
                </p>
                <p className="text-xs text-on-surface-muted">
                  {formatPrice(item.price)} × {item.quantity}
                </p>
              </div>
              <p className="text-sm font-bold text-primary font-display">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        {/* Grand total */}
        <div className="pt-4 border-t border-surface-high mt-2 flex justify-between items-center">
          <span className="font-bold text-on-surface font-display">
            Order Total
          </span>
          <span className="text-xl font-bold text-primary font-display">
            {formatPrice(order.total)}
          </span>
        </div>
      </div>
    </div>
  );
}
