"use client";

import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { stringToGradient } from "@/lib/utils";
import { Folder, Package, ArrowRight } from "lucide-react";

export default function CategoriesPage() {
  const { data: categories, isLoading, isError, refetch } = useCategories();

  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0f172a] font-[family-name:var(--font-geist)]">
          Categories
        </h1>
        <p className="text-[#76777d] mt-1">Browse products by category</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : categories?.length === 0 ? (
        <EmptyState title="No categories yet" description="Categories will appear here once added." icon="categories" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories?.map((cat) => {
            const count = cat._count?.products ?? 0;
            return (
              <Link
                key={cat.id}
                href={`/products?categoryId=${cat.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-[0px_4px_20px_rgba(15,23,42,0.05)] hover:shadow-[0px_10px_36px_rgba(15,23,42,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col border border-[#f0edef]"
              >
                {/* Banner */}
                <div className="relative h-28 overflow-hidden">
                  {cat.image ? (
                    // eslint-disable-next-line @next/next/no-img-element -- remote category image
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: stringToGradient(cat.id) }}
                    >
                      <Folder size={36} className="text-white/80" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Count pill */}
                  {count > 0 && (
                    <span className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-[11px] font-semibold text-[#0f172a] font-[family-name:var(--font-geist)] shadow-sm">
                      <Package size={10} />
                      {count}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col flex-1 gap-2">
                  <p className="font-semibold text-[#1b1b1d] font-[family-name:var(--font-geist)] group-hover:text-[#006c49] transition-colors leading-snug">
                    {cat.name}
                  </p>
                  {cat.description ? (
                    <p className="text-xs text-[#76777d] line-clamp-2 leading-relaxed">{cat.description}</p>
                  ) : (
                    <p className="text-xs text-[#c6c6cd]">No description</p>
                  )}
                  <span className="mt-auto pt-1 flex items-center gap-1 text-xs font-medium text-[#006c49] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Browse
                    <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
