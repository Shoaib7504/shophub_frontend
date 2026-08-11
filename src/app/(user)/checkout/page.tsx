"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useCreateOrder } from "@/hooks/useOrders";
import { formatPrice, stringToGradient } from "@/lib/utils";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { Package, User, Mail, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const createOrder = useCreateOrder();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <EmptyState
          title="Your cart is empty"
          description="Add products before checking out."
          icon="cart"
          action={{ label: "Browse Products", onClick: () => router.push("/products") }}
        />
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    try {
      await createOrder.mutateAsync({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });
      clearCart();
      toast.success("Order placed successfully!");
      router.push("/orders");
    } catch {
      // Error toast handled by the hook
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-[#0f172a] font-[family-name:var(--font-geist)] mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Customer + Items */}
        <div className="lg:col-span-3 space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-6">
            <h2 className="font-bold text-[#1b1b1d] font-[family-name:var(--font-geist)] mb-5 flex items-center gap-2">
              <User size={18} className="text-[#006c49]" />
              Customer Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-[#f6f3f5] rounded-xl">
                <User size={16} className="text-[#76777d]" />
                <div>
                  <p className="text-xs text-[#76777d]">Full Name</p>
                  <p className="text-sm font-medium text-[#1b1b1d]">{user?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#f6f3f5] rounded-xl">
                <Mail size={16} className="text-[#76777d]" />
                <div>
                  <p className="text-xs text-[#76777d]">Email</p>
                  <p className="text-sm font-medium text-[#1b1b1d]">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-6">
            <h2 className="font-bold text-[#1b1b1d] font-[family-name:var(--font-geist)] mb-5 flex items-center gap-2">
              <ShoppingBag size={18} className="text-[#006c49]" />
              Order Items ({items.length})
            </h2>
            <div className="divide-y divide-[#f0edef]">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 py-3">
                  <div
                    className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{ background: stringToGradient(item.productId) }}
                  >
                    <Package size={18} className="text-white/60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1b1b1d] line-clamp-1">{item.title}</p>
                    <p className="text-xs text-[#76777d]">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#0f172a] font-[family-name:var(--font-geist)] flex-shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-6 sticky top-24">
            <h2 className="font-bold text-[#1b1b1d] font-[family-name:var(--font-geist)] text-lg mb-5">
              Order Summary
            </h2>

            <div className="space-y-2 pb-4 border-b border-[#f0edef] mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-[#76777d]">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#76777d]">Shipping</span>
                <span className="font-medium text-[#006c49]">Free</span>
              </div>
            </div>

            <div className="flex justify-between font-bold text-[#0f172a] font-[family-name:var(--font-geist)] text-lg mb-6">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <Button
              variant="primary"
              fullWidth
              loading={createOrder.isPending}
              onClick={handlePlaceOrder}
            >
              Place Order
            </Button>

            <p className="text-xs text-[#76777d] text-center mt-3">
              By placing this order you agree to our terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
