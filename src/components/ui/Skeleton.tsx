import { cn } from "@/lib/utils";
import React from "react";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-surface-high rounded-lg animate-skeleton",
        className
      )}
      style={style}
      aria-hidden="true"
    />
  );
}

export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] flex flex-col gap-3">
      <Skeleton className="w-full h-48 rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex justify-between items-center mt-1">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
      <Skeleton className="h-9 w-full rounded-xl mt-1" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {/* Table heading */}
      <div className="flex gap-4 pb-3 border-b border-surface-high">
        {[30, 20, 15, 15, 20].map((w, i) => (
          <Skeleton key={i} className={`h-4`} style={{ width: `${w}%` }} />
        ))}
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3 border-b border-surface-container">
          {[30, 20, 15, 15, 20].map((w, j) => (
            <Skeleton key={j} className="h-4" style={{ width: `${w}%` }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
            <Skeleton className="h-4 w-1/2 mb-3" />
            <Skeleton className="h-8 w-2/3" />
          </div>
        ))}
      </div>
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );
}

export function OrderSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-3 w-48" />
      <div className="flex justify-between items-center pt-2 border-t border-surface-container">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}
