"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPrice, stringToGradient } from "@/lib/utils";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { Minus, Plus, Trash2, ArrowRight, Package } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-primary font-display mb-8">
          Your Cart
        </h1>
        <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
          <EmptyState
            title="Your cart is empty"
            description="Browse our collection and add something you love."
            icon="cart"
            action={{ label: "Continue Shopping", onClick: () => router.push("/products") }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary font-display">
          Your Cart
        </h1>
        <button
          onClick={clearCart}
          className="text-sm text-error hover:underline transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-5 flex gap-4"
            >
              {/* Colored square instead of a product photo */}
              <div
                className="w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center"
                style={{ background: stringToGradient(item.productId) }}
              >
                <Package size={24} className="text-white/50" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-on-surface font-display text-sm leading-snug line-clamp-2 mb-1">
                  {item.title}
                </p>
                <p className="text-secondary font-bold font-display text-base">
                  {formatPrice(item.price)}
                </p>
              </div>

              {/* Quantity stepper + remove button */}
              <div className="flex flex-col items-end justify-between gap-2">
                <button
                  onClick={() => removeItem(item.productId)}
                  className="p-1.5 text-on-surface-muted hover:text-error hover:bg-error-container rounded-lg transition-all"
                  aria-label="Remove item"
                >
                  <Trash2 size={15} />
                </button>
                <div className="flex items-center border border-outline-variant rounded-xl overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="px-2.5 py-2 text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-40"
                    aria-label="Decrease"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-on-surface font-display">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="px-2.5 py-2 text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-40"
                    aria-label="Increase"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Totals and checkout button */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-6 sticky top-24">
            <h2 className="font-bold text-on-surface font-display text-lg mb-5">
              Order Summary
            </h2>
            <div className="space-y-3 mb-5 pb-5 border-b border-surface-container">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-on-surface-variant line-clamp-1 flex-1 mr-2">
                    {item.title} × {item.quantity}
                  </span>
                  <span className="font-medium text-on-surface flex-shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-base font-bold text-primary font-display mb-6">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <Link href="/checkout">
              <Button variant="primary" fullWidth>
                Proceed to Checkout
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link
              href="/products"
              className="block text-center text-sm text-on-surface-muted hover:text-primary mt-3 transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
