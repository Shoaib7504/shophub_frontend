// Server component, grabs the featured products for the homepage
import { unstable_cache } from "next/cache";
import ProductCard from "@/components/product/ProductCard";
import EmptyState from "@/components/ui/EmptyState";
import { productService } from "@/services/product.service";
import type { Product } from "@/types/product";

const getFeaturedProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const data = await productService.getProducts({ status: "ACTIVE", limit: 8, page: 1 });
    return data.products;
  },
  ["featured-products"],
  { revalidate: 60 }
);

export default async function HomeFeaturedProducts() {
  let products: Product[];
  try {
    products = await getFeaturedProducts();
  } catch {
    // No backend running? Just show an empty state instead of crashing
    products = [];
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="No products yet"
        description="Products will appear here once they are added."
        icon="products"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
