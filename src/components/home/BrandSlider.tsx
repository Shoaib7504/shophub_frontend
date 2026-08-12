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
  // Repeat the list a few times so the marquee never runs out of items
  const marqueeBrands = [...brands, ...brands, ...brands];

  return (
    <section className="py-10 bg-white border-y border-surface-high overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 mb-6 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted font-display">
          Trusted Brand Partners
        </p>
        <span className="text-xs text-secondary font-medium hidden sm:inline-block font-display">
          100% Authentic Products
        </span>
      </div>

      <div className="relative w-full overflow-hidden flex">
        {/* Fade the edges of the marquee */}
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
                className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-background border border-surface-container hover:border-secondary/30 hover:bg-delivered-bg/30 hover:shadow-md transition-all duration-300 group cursor-default"
              >
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary font-display group-hover:text-secondary transition-colors">
                    {brand.name}
                  </p>
                  <p className="text-[10px] text-on-surface-muted uppercase tracking-wider">
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
