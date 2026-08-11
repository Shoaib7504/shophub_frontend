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
      <div className="w-16 h-16 rounded-2xl bg-[#f0edef] flex items-center justify-center">
        {customIcon ?? <Icon size={28} className="text-[#76777d]" />}
      </div>
      <div className="space-y-1.5 max-w-xs">
        <p className="text-base font-semibold text-[#1b1b1d] font-[family-name:var(--font-geist)]">
          {title}
        </p>
        {description && (
          <p className="text-sm text-[#76777d]">{description}</p>
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
