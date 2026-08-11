"use client";

import Link from "next/link";
import { ShoppingCart, Eye, Package } from "lucide-react";
import type { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { formatPrice, stringToGradient, truncate } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import RatingStars from "@/components/ui/RatingStars";
import Button from "@/components/ui/Button";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, items } = useCart();
  const isInCart = items.some((i) => i.productId === product.id);
  const outOfStock = product.stock === 0 || product.status !== "ACTIVE";

  const handleAddToCart = () => {
    if (outOfStock) return;
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      stock: product.stock,
      quantity: 1,
    });
    toast.success(`${truncate(product.title, 30)} added to cart!`);
  };

  const gradient = stringToGradient(product.id + product.title);

  return (
    <article className="group bg-white rounded-2xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] overflow-hidden transition-all duration-300 hover:shadow-[0px_8px_30px_rgba(15,23,42,0.1)] hover:-translate-y-0.5 flex flex-col">
      {/* Product Image Placeholder */}
      <Link href={`/products/${product.id}`} className="block relative overflow-hidden" aria-label={`View ${product.title}`}>
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote product image
          <img src={product.image} alt={product.title} className="w-full h-52 object-cover" />
        ) : (
          <div
            className="w-full h-52 flex items-center justify-center"
            style={{ background: gradient }}
            aria-hidden="true"
          >
            <Package size={40} className="text-white/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-[#0f172a]/0 group-hover:bg-[#0f172a]/5 transition-colors duration-300" />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <StatusBadge status={product.status} />
          {outOfStock && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#ba1a1a]/10 text-[#ba1a1a]">
              Out of Stock
            </span>
          )}
        </div>
        {/* Quick view on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-[#0f172a] text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
            <Eye size={13} />
            Quick View
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Category */}
        {product.category && (
          <span className="text-xs font-medium text-[#006c49] font-[family-name:var(--font-geist)] uppercase tracking-wide">
            {product.category.name}
          </span>
        )}

        {/* Title */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-semibold text-[#1b1b1d] font-[family-name:var(--font-geist)] leading-snug hover:text-[#0f172a] line-clamp-2">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <RatingStars rating={product.averageRating ?? 0} size={14} />
          <span className="text-xs text-[#76777d]">
            ({product._count?.reviews ?? 0})
          </span>
        </div>

        {/* Price + Stock */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-base font-bold text-[#0f172a] font-[family-name:var(--font-geist)]">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-[#76777d]">
            {product.stock > 0 ? `${product.stock} left` : ""}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-1">
          <Button
            variant="primary"
            size="sm"
            fullWidth
            disabled={outOfStock}
            onClick={handleAddToCart}
            className="text-xs"
          >
            <ShoppingCart size={13} />
            {isInCart ? "In Cart" : "Add to Cart"}
          </Button>
          <Link
            href={`/products/${product.id}`}
            className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg border border-[#c6c6cd] text-[#45464d] hover:bg-[#f0edef] hover:text-[#0f172a] transition-colors"
            aria-label="View details"
          >
            <Eye size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
