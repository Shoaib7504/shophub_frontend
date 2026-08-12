"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Eye, Package, Check, ArrowRight } from "lucide-react";
import type { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { formatPrice, stringToGradient, truncate } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import RatingStars from "@/components/ui/RatingStars";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, items } = useCart();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const isInCart = items.some((i) => i.productId === product.id);
  const outOfStock = product.stock === 0 || product.status !== "ACTIVE";

  const handleAddToCart = (closeAfter = false) => {
    if (outOfStock) return;
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      stock: product.stock,
      quantity: 1,
    });
    toast.success(`${truncate(product.title, 30)} added to cart!`);
    if (closeAfter) setQuickViewOpen(false);
  };

  const gradient = stringToGradient(product.id + product.title);

  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group bg-white rounded-2xl border border-surface-container shadow-[0px_4px_20px_rgba(15,23,42,0.04)] hover:shadow-[0px_12px_40px_rgba(15,23,42,0.1)] overflow-hidden transition-shadow duration-300 flex flex-col h-full"
    >
      {/* Product image (with a colored fallback when there's none) */}
      <Link
        href={`/products/${product.id}`}
        className="block relative overflow-hidden bg-background h-56"
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

        {/* Slight darkening on hover */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 pointer-events-none" />

        {/* Status + out of stock badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <StatusBadge status={product.status} />
          {outOfStock && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-error text-white shadow-sm font-display">
              Out of Stock
            </span>
          )}
        </div>

        {/* Quick view button that appears on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            type="button"
            onClick={() => setQuickViewOpen(true)}
            className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-primary text-xs font-bold px-4 py-2 rounded-full shadow-lg border border-white/40 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 font-display hover:bg-white cursor-pointer"
            aria-haspopup="dialog"
          >
            <Eye size={14} />
            Quick View
          </button>
        </div>
      </Link>

      {/* Quick view popup */}
      <Modal open={quickViewOpen} onClose={() => setQuickViewOpen(false)} size="xl">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
          {/* Image */}
          <div className="sm:col-span-2">
            <div className="relative w-full h-48 sm:h-full min-h-48 rounded-xl overflow-hidden bg-background">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 40vw"
                  className="object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: gradient }}
                  aria-hidden="true"
                >
                  <Package size={40} className="text-white/60" />
                </div>
              )}
            </div>
          </div>

          {/* Product details */}
          <div className="sm:col-span-3 flex flex-col gap-3.5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              {product.category && (
                <span className="text-[11px] font-bold text-secondary font-display uppercase tracking-wider">
                  {product.category.name}
                </span>
              )}
              <StatusBadge status={product.status} />
            </div>

            <h3 className="text-xl font-bold text-primary font-display leading-snug">
              {product.title}
            </h3>

            <div className="flex items-center gap-2">
              <RatingStars rating={product.averageRating ?? 0} size={15} />
              <span className="text-xs text-on-surface-muted font-medium">
                ({product._count?.reviews ?? 0}) review{product._count?.reviews === 1 ? "" : "s"}
              </span>
            </div>

            {product.description && (
              <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3">
                {product.description}
              </p>
            )}

            <div className="flex items-baseline justify-between mt-auto pt-1">
              <span className="text-2xl font-extrabold text-primary font-display">
                {formatPrice(product.price)}
              </span>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-md ${
                  product.stock > 0
                    ? "bg-delivered-bg text-delivered-text"
                    : "bg-cancelled-bg text-inactive-text"
                }`}
              >
                {product.stock > 0
                  ? product.stock <= 10
                    ? `Only ${product.stock} left in stock`
                    : `${product.stock} in stock`
                  : "Sold Out"}
              </span>
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                variant={isInCart ? "secondary" : "primary"}
                disabled={outOfStock}
                onClick={() => handleAddToCart(true)}
                className="flex-1"
              >
                {isInCart ? <Check size={16} /> : <ShoppingCart size={16} />}
                {isInCart ? "In Cart" : "Add to Cart"}
              </Button>
              <Link
                href={`/products/${product.id}`}
                onClick={() => setQuickViewOpen(false)}
                className="inline-flex items-center justify-center gap-1.5 px-4 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary hover:border-primary transition-all text-sm font-medium"
              >
                View Details
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </Modal>

      {/* Card body */}
      <div className="p-5 flex flex-col flex-1 gap-2.5">
        {/* Category Badge */}
        {product.category && (
          <span className="text-[11px] font-bold text-secondary font-display uppercase tracking-wider">
            {product.category.name}
          </span>
        )}

        {/* Title */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-base font-bold text-primary font-display leading-snug group-hover:text-secondary transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>

        {/* Rating + number of reviews */}
        <div className="flex items-center gap-2 my-0.5">
          <RatingStars rating={product.averageRating ?? 0} size={14} />
          <span className="text-xs text-on-surface-muted font-medium">
            ({product._count?.reviews ?? 0})
          </span>
        </div>

        {/* Price and stock level */}
        <div className="flex items-baseline justify-between mt-auto pt-2">
          <div>
            <span className="text-xs text-on-surface-muted block font-medium">Price</span>
            <span className="text-lg font-extrabold text-primary font-display">
              {formatPrice(product.price)}
            </span>
          </div>

          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-md ${
              product.stock > 0
                ? "bg-delivered-bg text-delivered-text"
                : "bg-cancelled-bg text-inactive-text"
            }`}
          >
            {product.stock > 0 ? `${product.stock} in stock` : "Sold Out"}
          </span>
        </div>

        {/* Add to cart button */}
        <div className="flex gap-2 pt-2">
          <Button
            variant={isInCart ? "secondary" : "primary"}
            size="sm"
            fullWidth
            disabled={outOfStock}
            onClick={() => handleAddToCart()}
            className="text-xs font-semibold py-2.5 rounded-xl shadow-sm"
          >
            {isInCart ? <Check size={14} /> : <ShoppingCart size={14} />}
            {isInCart ? "In Cart" : "Add to Cart"}
          </Button>
          <Link
            href={`/products/${product.id}`}
            className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary hover:border-primary transition-all"
            aria-label="View product details"
          >
            <Eye size={15} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
