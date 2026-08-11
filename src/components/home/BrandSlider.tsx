"use client";

import { motion } from "framer-motion";
import {
  Apple,
  Smartphone,
  Shirt,
  Headphones,
  Tv,
  Watch,
  Flame,
  Zap,
} from "lucide-react";

const brands = [
  { name: "Apple", icon: Apple, category: "Tech & Devices" },
  { name: "Sony", icon: Headphones, category: "Audio & Gaming" },
  { name: "Nike", icon: Shirt, category: "Sportswear" },
  { name: "Samsung", icon: Smartphone, category: "Electronics" },
  { name: "Adidas", icon: Flame, category: "Footwear" },
  { name: "Bose", icon: Headphones, category: "Premium Audio" },
  { name: "LG", icon: Tv, category: "Home Tech" },
  { name: "Puma", icon: Zap, category: "Athletics" },
  { name: "Garmin", icon: Watch, category: "Wearables" },
];

export default function BrandSlider() {
  // Duplicate array for seamless infinite marquee loop
  const marqueeBrands = [...brands, ...brands, ...brands];

  return (
    <section className="py-10 bg-white border-y border-[#eae7e9] overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 mb-6 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#76777d] font-[family-name:var(--font-geist)]">
          Trusted Brand Partners
        </p>
        <span className="text-xs text-[#006c49] font-medium hidden sm:inline-block font-[family-name:var(--font-geist)]">
          100% Authentic Products
        </span>
      </div>

      <div className="relative w-full overflow-hidden flex">
        {/* Left & Right gradient fade masks */}
        <div className="absolute top-0 left-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <motion.div
          animate={{ x: ["0%", "-33.333%"] }}
          transition={{
            ease: "linear",
            duration: 25,
            repeat: Infinity,
          }}
          className="flex items-center gap-6 sm:gap-8 whitespace-nowrap min-w-max"
        >
          {marqueeBrands.map((brand, index) => {
            const Icon = brand.icon;
            return (
              <div
                key={`${brand.name}-${index}`}
                className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#fcf8fa] border border-[#f0edef] hover:border-[#006c49]/30 hover:bg-[#d1fae5]/30 hover:shadow-md transition-all duration-300 group cursor-default"
              >
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#0f172a] shadow-sm group-hover:bg-[#006c49] group-hover:text-white transition-colors duration-300">
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0f172a] font-[family-name:var(--font-geist)] group-hover:text-[#006c49] transition-colors">
                    {brand.name}
                  </p>
                  <p className="text-[10px] text-[#76777d] uppercase tracking-wider">
                    {brand.category}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
