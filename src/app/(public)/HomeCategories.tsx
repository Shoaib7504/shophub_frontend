// Server Component: fetches categories for the homepage
import Link from "next/link";
import { categoryService } from "@/services/category.service";
import { stringToGradient } from "@/lib/utils";
import { Folder, Package, ArrowUpRight } from "lucide-react";
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
      <div className="bg-white rounded-2xl p-8 text-center border border-[#f0edef]">
        <p className="text-sm text-[#76777d]">No categories available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
      {categories.slice(0, 10).map((cat) => {
        const count = cat._count?.products ?? 0;
        return (
          <Link
            key={cat.id}
            href={`/categories`}
            className="group bg-white rounded-2xl overflow-hidden shadow-[0px_4px_20px_rgba(15,23,42,0.04)] hover:shadow-[0px_12px_36px_rgba(15,23,42,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col border border-[#f0edef] relative"
          >
            {/* Image Container */}
            <div className="relative h-28 overflow-hidden bg-[#fcf8fa]">
              {cat.image ? (
                // eslint-disable-next-line @next/next/no-img-element -- remote category image
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                  style={{ background: stringToGradient(cat.id) }}
                >
                  <Folder size={26} className="text-white/80" />
                </div>
              )}

              {/* Overlay Gradient on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Product Count Badge */}
              {count > 0 && (
                <span className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-[#0f172a] font-[family-name:var(--font-geist)] shadow-sm">
                  <Package size={10} className="text-[#006c49]" />
                  {count}
                </span>
              )}
            </div>

            {/* Content Details */}
            <div className="p-4 flex items-center justify-between gap-2 flex-1 bg-white">
              <div>
                <h3 className="text-sm font-bold text-[#0f172a] font-[family-name:var(--font-geist)] group-hover:text-[#006c49] transition-colors leading-snug">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-[#76777d] mt-0.5">Explore collection</p>
              </div>

              <div className="w-7 h-7 rounded-xl bg-[#fcf8fa] group-hover:bg-[#006c49] flex items-center justify-center text-[#76777d] group-hover:text-white transition-all duration-300 flex-shrink-0">
                <ArrowUpRight size={14} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
