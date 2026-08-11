import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/order";
import type { ProductStatus } from "@/types/product";

type StatusVariant = OrderStatus | ProductStatus | "ADMIN" | "USER" | "active" | "inactive";

const statusConfig: Record<string, { label: string; className: string }> = {
  // Order statuses
  PENDING:   { label: "Pending",   className: "bg-[#fef3c7] text-[#92400e]" },
  CONFIRMED: { label: "Confirmed", className: "bg-[#e0e7ff] text-[#3730a3]" },
  SHIPPED:   { label: "Shipped",   className: "bg-[#dbeafe] text-[#1e40af]" },
  DELIVERED: { label: "Delivered", className: "bg-[#d1fae5] text-[#065f46]" },
  CANCELLED: { label: "Cancelled", className: "bg-[#f1f5f9] text-[#475569]" },
  // Product statuses
  ACTIVE:    { label: "Active",    className: "bg-[#d1fae5] text-[#065f46]" },
  INACTIVE:  { label: "Inactive",  className: "bg-[#f1f5f9] text-[#64748b]" },
  ARCHIVED:  { label: "Archived",  className: "bg-[#e4e2e4] text-[#76777d]" },
  // User roles
  ADMIN:     { label: "Admin",     className: "bg-[#e0e7ff] text-[#3730a3]" },
  USER:      { label: "User",      className: "bg-[#f0edef] text-[#45464d]"  },
};

interface StatusBadgeProps {
  status: StatusVariant | string;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, className: "bg-[#f0edef] text-[#45464d]" };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-[family-name:var(--font-geist)] whitespace-nowrap",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

// Specialized alias for order status — same component, just for clarity
export function OrderStatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  return <StatusBadge status={status} className={className} />;
}
