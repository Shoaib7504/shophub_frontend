"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useProduct } from "@/hooks/useProducts";
import { useProductReviews, useCreateReview } from "@/hooks/useReviews";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatPrice, formatDate, stringToGradient } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import RatingStars from "@/components/ui/RatingStars";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Package, Minus, Plus, ShoppingCart, User } from "lucide-react";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError, refetch } = useProduct(id);
  const { data: reviews, isLoading: reviewsLoading } = useProductReviews(id);
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const createReview = useCreateReview();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  if (isError) return <ErrorState onRetry={() => refetch()} />;

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="h-[400px] rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const outOfStock = product.stock === 0 || product.status !== "ACTIVE";
  const gradient = stringToGradient(product.id + product.title);

  const handleAddToCart = () => {
    if (outOfStock) return;
    addItem({ productId: product.id, title: product.title, price: product.price, stock: product.stock, quantity: qty });
    toast.success("Added to cart!");
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReview.mutate({ productId: id, rating, comment });
    setComment("");
    setRating(5);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Image + info side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product photo */}
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote product image
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-[420px] rounded-2xl object-cover"
          />
        ) : (
          <div
            className="w-full h-[420px] rounded-2xl flex items-center justify-center"
            style={{ background: gradient }}
          >
            <Package size={80} className="text-white/40" />
          </div>
        )}

        {/* Name, price, description… */}
        <div className="space-y-5">
          {product.category && (
            <span className="text-xs font-semibold uppercase tracking-widest text-secondary font-display">
              {product.category.name}
            </span>
          )}

          <h1 className="text-3xl font-bold text-primary font-display leading-tight">
            {product.title}
          </h1>

          <div className="flex items-center gap-3">
            <RatingStars rating={product.averageRating ?? 0} size={18} />
            <span className="text-sm text-on-surface-muted">{product._count?.reviews ?? 0} reviews</span>
            <StatusBadge status={product.status} />
          </div>

          <div className="text-3xl font-bold text-primary font-display">
            {formatPrice(product.price)}
          </div>

          {product.description && (
            <p className="text-on-surface-variant leading-relaxed text-sm">{product.description}</p>
          )}

          <div className="flex items-center gap-2 text-sm text-on-surface-muted">
            <span className={product.stock > 0 ? "text-delivered-text" : "text-error"}>
              ● {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          {/* Quantity picker + add to cart */}
          {!outOfStock && (
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-outline-variant rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-2.5 text-on-surface-variant hover:bg-surface-container transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-medium text-on-surface font-display">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-2.5 text-on-surface-variant hover:bg-surface-container transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
              <Button variant="primary" fullWidth onClick={handleAddToCart}>
                <ShoppingCart size={16} />
                Add to Cart
              </Button>
            </div>
          )}

          {outOfStock && (
            <div className="w-full py-3 text-center rounded-xl bg-cancelled-bg text-inactive-text text-sm font-medium">
              Out of Stock
            </div>
          )}
        </div>
      </div>

      {/* Reviews section */}
      <div className="border-t border-surface-high pt-12">
        <h2 className="text-xl font-bold text-primary font-display mb-8">
          Customer Reviews ({reviews?.length ?? 0})
        </h2>

        {/* Leave a review form */}
        {isAuthenticated ? (
          <form onSubmit={handleReviewSubmit} className="bg-white rounded-2xl p-6 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] mb-8 space-y-4">
            <h3 className="font-semibold text-on-surface font-display">Write a Review</h3>
            <div>
              <label className="text-sm font-medium text-on-surface mb-2 block">Your Rating</label>
              <RatingStars rating={rating} interactive onChange={setRating} size={24} />
            </div>
            <Textarea
              label="Your Comment (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product…"
            />
            <Button type="submit" loading={createReview.isPending}>Submit Review</Button>
          </form>
        ) : (
          <div className="bg-surface-low rounded-2xl p-6 mb-8 text-center">
            <p className="text-sm text-on-surface-variant">
              Please <a href="/login" className="text-secondary font-medium hover:underline">log in</a> to write a review.
            </p>
          </div>
        )}

        {/* Existing reviews */}
        {reviewsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : reviews?.length === 0 ? (
          <EmptyState title="No reviews yet" description="Be the first to review this product." icon="reviews" />
        ) : (
          <div className="space-y-4">
            {reviews?.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl p-6 shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <User size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{review.user?.name ?? "Anonymous"}</p>
                      <p className="text-xs text-on-surface-muted">{formatDate(review.createdAt)}</p>
                    </div>
                  </div>
                  <RatingStars rating={review.rating} size={14} />
                </div>
                {review.comment && (
                  <p className="text-sm text-on-surface-variant leading-relaxed">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
