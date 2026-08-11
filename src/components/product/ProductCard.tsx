"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Eye, Package, Check } from "lucide-react";
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
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group bg-white rounded-2xl border border-[#f0edef] shadow-[0px_4px_20px_rgba(15,23,42,0.04)] hover:shadow-[0px_12px_40px_rgba(15,23,42,0.1)] overflow-hidden transition-shadow duration-300 flex flex-col h-full"
    >
      {/* Image Showcase Container */}
      <Link
        href={`/products/${product.id}`}
        className="block relative overflow-hidden bg-[#fcf8fa] h-56"
        aria-label={`View ${product.title}`}
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-56 flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
            style={{ background: gradient }}
            aria-hidden="true"
          >
            <Package size={44} className="text-white/60" />
          </div>
        )}

        {/* Hover Overlay Filter */}
        <div className="absolute inset-0 bg-[#0f172a]/0 group-hover:bg-[#0f172a]/10 transition-colors duration-300 pointer-events-none" />

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <StatusBadge status={product.status} />
          {outOfStock && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ba1a1a] text-white shadow-sm font-[family-name:var(--font-geist)]">
              Out of Stock
            </span>
          )}
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-[#0f172a] text-xs font-bold px-4 py-2 rounded-full shadow-lg border border-white/40 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 font-[family-name:var(--font-geist)]">
            <Eye size={14} />
            Quick View
          </span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1 gap-2.5">
        {/* Category Badge */}
        {product.category && (
          <span className="text-[11px] font-bold text-[#006c49] font-[family-name:var(--font-geist)] uppercase tracking-wider">
            {product.category.name}
          </span>
        )}

        {/* Title */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-base font-bold text-[#0f172a] font-[family-name:var(--font-geist)] leading-snug group-hover:text-[#006c49] transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>

        {/* Rating Stars & Review Count */}
        <div className="flex items-center gap-2 my-0.5">
          <RatingStars rating={product.averageRating ?? 0} size={14} />
          <span className="text-xs text-[#76777d] font-medium">
            ({product._count?.reviews ?? 0})
          </span>
        </div>

        {/* Price & Stock info */}
        <div className="flex items-baseline justify-between mt-auto pt-2">
          <div>
            <span className="text-xs text-[#76777d] block font-medium">Price</span>
            <span className="text-lg font-extrabold text-[#0f172a] font-[family-name:var(--font-geist)]">
              {formatPrice(product.price)}
            </span>
          </div>

          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-md ${
              product.stock > 0
                ? "bg-[#d1fae5] text-[#065f46]"
                : "bg-[#f1f5f9] text-[#64748b]"
            }`}
          >
            {product.stock > 0 ? `${product.stock} in stock` : "Sold Out"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant={isInCart ? "secondary" : "primary"}
            size="sm"
            fullWidth
            disabled={outOfStock}
            onClick={handleAddToCart}
            className="text-xs font-semibold py-2.5 rounded-xl shadow-sm"
          >
            {isInCart ? <Check size={14} /> : <ShoppingCart size={14} />}
            {isInCart ? "In Cart" : "Add to Cart"}
          </Button>
          <Link
            href={`/products/${product.id}`}
            className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl border border-[#c6c6cd] text-[#45464d] hover:bg-[#f0edef] hover:text-[#0f172a] hover:border-[#0f172a] transition-all"
            aria-label="View product details"
          >
            <Eye size={15} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
