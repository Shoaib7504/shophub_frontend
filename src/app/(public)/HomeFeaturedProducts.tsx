// Server Component: fetches featured products for the homepage
import ProductCard from "@/components/product/ProductCard";
import EmptyState from "@/components/ui/EmptyState";
import { productService } from "@/services/product.service";
import type { Product } from "@/types/product";

export default async function HomeFeaturedProducts() {
  let products: Product[];
  try {
    const data = await productService.getProducts({ status: "ACTIVE", limit: 8, page: 1 });
    products = data.products;
  } catch {
    // Backend might not be running during dev — show placeholder
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
