"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export default function RatingStars({
  rating,
  max = 5,
  size = 16,
  interactive = false,
  onChange,
  className,
}: RatingStarsProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} role="group" aria-label={`Rating: ${rating} out of ${max}`}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i + 1 <= Math.round(rating);
        return (
          <button
            key={i}
            type={interactive ? "button" : undefined}
            tabIndex={interactive ? 0 : -1}
            disabled={!interactive}
            className={cn(
              "transition-transform duration-100",
              interactive && "hover:scale-110 cursor-pointer"
            )}
            onClick={interactive ? () => onChange?.(i + 1) : undefined}
            aria-label={interactive ? `Rate ${i + 1} out of ${max}` : undefined}
          >
            <Star
              size={size}
              className={cn(
                "transition-colors",
                filled ? "fill-warning text-warning" : "fill-transparent text-outline-variant"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
