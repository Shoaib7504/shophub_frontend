import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/order";
import type { ProductStatus } from "@/types/product";

type StatusVariant = OrderStatus | ProductStatus | "ADMIN" | "USER" | "active" | "inactive";

const statusConfig: Record<string, { label: string; className: string }> = {
  // Order statuses
  PENDING:   { label: "Pending",   className: "bg-pending-bg text-pending-text" },
  CONFIRMED: { label: "Confirmed", className: "bg-confirmed-bg text-confirmed-text" },
  SHIPPED:   { label: "Shipped",   className: "bg-shipped-bg text-shipped-text" },
  DELIVERED: { label: "Delivered", className: "bg-delivered-bg text-delivered-text" },
  CANCELLED: { label: "Cancelled", className: "bg-cancelled-bg text-cancelled-text" },
  // Product statuses
  ACTIVE:    { label: "Active",    className: "bg-delivered-bg text-delivered-text" },
  INACTIVE:  { label: "Inactive",  className: "bg-cancelled-bg text-inactive-text" },
  ARCHIVED:  { label: "Archived",  className: "bg-archived-bg text-on-surface-muted" },
  // User roles
  ADMIN:     { label: "Admin",     className: "bg-confirmed-bg text-confirmed-text" },
  USER:      { label: "User",      className: "bg-surface-container text-on-surface-variant"  },
};

interface StatusBadgeProps {
  status: StatusVariant | string;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, className: "bg-surface-container text-on-surface-variant" };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-display whitespace-nowrap",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

// Nice little alias so callers can use a clearer name for order statuses
export function OrderStatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  return <StatusBadge status={status} className={className} />;
}
