import { type ReactNode } from "react";
import { Package, ShoppingCart, Users, FileText, Star, Folder } from "lucide-react";
import Button from "./Button";

const iconMap = {
  products: Package,
  cart: ShoppingCart,
  users: Users,
  orders: FileText,
  reviews: Star,
  categories: Folder,
  default: Package,
};

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: keyof typeof iconMap;
  customIcon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  title,
  description,
  icon = "default",
  customIcon,
  action,
}: EmptyStateProps) {
  const Icon = iconMap[icon];

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center">
        {customIcon ?? <Icon size={28} className="text-on-surface-muted" />}
      </div>
      <div className="space-y-1.5 max-w-xs">
        <p className="text-base font-semibold text-on-surface font-display">
          {title}
        </p>
        {description && (
          <p className="text-sm text-on-surface-muted">{description}</p>
        )}
      </div>
      {action && (
        <Button variant="primary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
