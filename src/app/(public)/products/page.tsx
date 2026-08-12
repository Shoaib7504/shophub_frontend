"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import ProductCard from "@/components/product/ProductCard";
import { ProductSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import SearchInput from "@/components/ui/SearchInput";
import Select from "@/components/ui/Select";
import Pagination from "@/components/ui/Pagination";
import type { ProductFilters } from "@/types/product";
import { SlidersHorizontal } from "lucide-react";

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

const sortOptions = [
  { value: "createdAt:desc", label: "Newest First" },
  { value: "createdAt:asc", label: "Oldest First" },
  { value: "price:asc", label: "Price: Low to High" },
  { value: "price:desc", label: "Price: High to Low" },
  { value: "title:asc", label: "Name A–Z" },
];

const LIMIT = 12;

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    categoryId: "",
    status: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: LIMIT,
  });

  const { data, isLoading, isError, refetch } = useProducts(filters);
  const { data: categories } = useCategories();

  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...(categories ?? []).map((c) => ({ value: c.id, label: c.name })),
  ];

  const handleSort = (val: string) => {
    const [sortBy, sortOrder] = val.split(":") as [ProductFilters["sortBy"], ProductFilters["sortOrder"]];
    setFilters((f) => ({ ...f, sortBy, sortOrder, page: 1 }));
  };

  const currentSortValue = `${filters.sortBy}:${filters.sortOrder}`;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Page title + result count */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary font-display mb-1">
          All Products
        </h1>
        <p className="text-on-surface-muted">
          {data ? `${data.total} products found` : "Browse our collection"}
        </p>
      </div>

      {/* Search and filter bar */}
      <div className="bg-white rounded-2xl border border-surface-high shadow-[0px_4px_20px_rgba(15,23,42,0.04)] p-4 mb-8 flex flex-wrap gap-3 items-center">
        <SlidersHorizontal size={16} className="text-on-surface-muted flex-shrink-0" />
        <SearchInput
          value={filters.search ?? ""}
          onChange={(v) => setFilters((f) => ({ ...f, search: v, page: 1 }))}
          placeholder="Search products…"
          className="flex-1 min-w-48"
        />
        <Select
          value={filters.categoryId ?? ""}
          onChange={(e) => setFilters((f) => ({ ...f, categoryId: e.target.value, page: 1 }))}
          options={categoryOptions}
          className="w-40"
        />
        <Select
          value={filters.status ?? ""}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value as ProductFilters["status"], page: 1 }))}
          options={statusOptions}
          className="w-36"
        />
        <Select
          value={currentSortValue}
          onChange={(e) => handleSort(e.target.value)}
          options={sortOptions}
          className="w-44"
        />
      </div>

      {/* Product grid */}
      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: LIMIT }).map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      ) : data?.products.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try adjusting your search or filters."
          icon="products"
          action={{ label: "Clear Filters", onClick: () => setFilters({ page: 1, limit: LIMIT, sortBy: "createdAt", sortOrder: "desc" }) }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {data?.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Page selector */}
          <div className="mt-10">
            <Pagination
              page={filters.page ?? 1}
              total={data?.total ?? 0}
              limit={LIMIT}
              onChange={(p) => setFilters((f) => ({ ...f, page: p }))}
            />
          </div>
        </>
      )}
    </div>
  );
}
