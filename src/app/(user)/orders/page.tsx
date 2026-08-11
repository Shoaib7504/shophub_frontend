"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMyOrders } from "@/hooks/useOrders";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/ui/StatusBadge";
import { OrderSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { Package, ArrowRight } from "lucide-react";

export default function OrdersPage() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useMyOrders();

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-[#0f172a] font-[family-name:var(--font-geist)] mb-2">
        My Orders
      </h1>
      <p className="text-[#76777d] mb-8">
        {data ? `${data.orders.length} order${data.orders.length !== 1 ? "s" : ""} total` : " "}
      </p>

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <OrderSkeleton key={i} />)}
        </div>
      ) : data?.orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
          <EmptyState
            title="No orders yet"
            description="Start shopping to see your orders here."
            icon="orders"
            action={{ label: "Shop Now", onClick: () => router.push("/products") }}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {data?.orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Package size={15} className="text-[#76777d]" />
                    <p className="text-xs font-mono text-[#76777d]">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <p className="text-xs text-[#76777d]">{formatDate(order.createdAt)}</p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#f0edef]">
                <div>
                  <p className="text-xs text-[#76777d]">
                    {order.orderItems?.length ?? 0} items
                  </p>
                  <p className="text-base font-bold text-[#0f172a] font-[family-name:var(--font-geist)] mt-0.5">
                    {formatPrice(order.total)}
                  </p>
                </div>
                <Link
                  href={`/orders/${order.id}`}
                  className="flex items-center gap-1.5 text-sm font-medium text-[#0f172a] hover:text-[#006c49] transition-colors"
                >
                  View Details <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
