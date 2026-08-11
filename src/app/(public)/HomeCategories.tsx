// Server Component: fetches categories for the homepage
import Link from "next/link";
import { categoryService } from "@/services/category.service";
import { stringToGradient } from "@/lib/utils";
import { Folder, Package } from "lucide-react";
import type { Category } from "@/types/category";

export default async function HomeCategories() {
  let categories: Category[];
  try {
    categories = await categoryService.getCategories();
  } catch {
    categories = [];
  }

  if (categories.length === 0) {
    return (
      <p className="text-sm text-[#76777d] text-center py-8">
        No categories available yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {categories.slice(0, 10).map((cat) => {
        const count = cat._count?.products ?? 0;
        return (
          <Link
            key={cat.id}
            href={`/categories`}
            className="group bg-white rounded-2xl overflow-hidden shadow-[0px_4px_20px_rgba(15,23,42,0.05)] hover:shadow-[0px_10px_36px_rgba(15,23,42,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col border border-[#f0edef]"
          >
            <div className="relative h-20 overflow-hidden">
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
                  <Folder size={22} className="text-white/80" />
                </div>
              )}
              {count > 0 && (
                <span className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-semibold text-[#0f172a] font-[family-name:var(--font-geist)] shadow-sm">
                  <Package size={9} />
                  {count}
                </span>
              )}
            </div>
            <div className="p-3 flex flex-col flex-1 gap-0.5">
              <p className="text-sm font-semibold text-[#1b1b1d] font-[family-name:var(--font-geist)] group-hover:text-[#006c49] transition-colors leading-snug">
                {cat.name}
              </p>
              <p className="text-xs text-[#76777d]">View category</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
