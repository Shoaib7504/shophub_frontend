import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  Star,
  RotateCcw,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Lock,
} from "lucide-react";
import { ProductSkeleton } from "@/components/ui/Skeleton";
import { Suspense } from "react";
import HomeFeaturedProducts from "./HomeFeaturedProducts";
import HomeCategories from "./HomeCategories";
import HeroSlider from "@/components/home/HeroSlider";
import BrandSlider from "@/components/home/BrandSlider";

export const metadata: Metadata = {
  title: "ShopHub — Premium E-Commerce Experience",
  description:
    "Discover premium products. Shop with confidence — express delivery, end-to-end encryption, and quality guaranteed.",
};

const benefits = [
  {
    icon: ShieldCheck,
    title: "Secure Shopping",
    desc: "256-bit encrypted transactions protecting your payment information.",
    badgeColor: "bg-[#d1fae5]",
    iconColor: "text-[#065f46]",
    borderColor: "hover:border-[#006c49]/40",
  },
  {
    icon: Truck,
    title: "Express Shipping",
    desc: "Fast air freight delivery options with real-time tracking on every order.",
    badgeColor: "bg-[#dbeafe]",
    iconColor: "text-[#1e40af]",
    borderColor: "hover:border-[#3b82f6]/40",
  },
  {
    icon: Star,
    title: "Verified Quality",
    desc: "Curated catalog strictly inspected to meet high durability & aesthetic standards.",
    badgeColor: "bg-[#fef3c7]",
    iconColor: "text-[#92400e]",
    borderColor: "hover:border-[#f59e0b]/40",
  },
  {
    icon: RotateCcw,
    title: "Easy 30-Day Returns",
    desc: "30-day hassle-free full refund policy — simple and transparent.",
    badgeColor: "bg-[#e0e7ff]",
    iconColor: "text-[#3730a3]",
    borderColor: "hover:border-[#6366f1]/40",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── Motion Hero Slider ────────────────────────────────────── */}
      <HeroSlider />

      {/* ── Infinite Brand Marquee Slider ──────────────────────────── */}
      <BrandSlider />

      {/* ── Categories Section ───────────────────────────────────── */}
      <section className="py-20 bg-[#fcf8fa]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#006c49]/10 rounded-full text-[#006c49] text-xs font-bold uppercase tracking-wider mb-2 font-[family-name:var(--font-geist)]">
                <Sparkles size={12} />
                Explore By Category
              </div>
              <h2 className="text-3xl font-extrabold text-[#0f172a] font-[family-name:var(--font-geist)] tracking-tight">
                Shop By Department
              </h2>
            </div>
            <Link
              href="/categories"
              className="inline-flex items-center gap-1 text-sm font-bold text-[#006c49] hover:text-[#00503a] transition-colors font-[family-name:var(--font-geist)] group"
            >
              View all categories
              <ChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <Suspense
            fallback={
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-32 bg-white rounded-2xl animate-skeleton border border-[#eae7e9]" />
                ))}
              </div>
            }
          >
            <HomeCategories />
          </Suspense>
        </div>
      </section>

      {/* ── Featured Products Section ────────────────────────────── */}
      <section className="py-20 bg-white border-t border-[#eae7e9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0f172a]/5 rounded-full text-[#0f172a] text-xs font-bold uppercase tracking-wider mb-2 font-[family-name:var(--font-geist)]">
                Handpicked Selections
              </div>
              <h2 className="text-3xl font-extrabold text-[#0f172a] font-[family-name:var(--font-geist)] tracking-tight">
                Featured Products
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-sm font-bold text-[#0f172a] hover:text-[#006c49] transition-colors font-[family-name:var(--font-geist)] group"
            >
              View full catalog
              <ChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            }
          >
            <HomeFeaturedProducts />
          </Suspense>
        </div>
      </section>

      {/* ── "Why ShopHub" Feature Grid Section ───────────────────── */}
      <section className="py-20 bg-[#fcf8fa] border-t border-[#eae7e9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#006c49] font-[family-name:var(--font-geist)]">
              The ShopHub Promise
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] font-[family-name:var(--font-geist)] tracking-tight">
              Why Thousands Choose ShopHub
            </h2>
            <p className="text-base text-[#76777d]">
              We prioritize your peace of mind with enterprise security, rapid fulfillment, and unmatched catalog standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {benefits.map(({ icon: Icon, title, desc, badgeColor, iconColor, borderColor }) => (
              <div
                key={title}
                className={`bg-white rounded-3xl p-7 border border-[#f0edef] shadow-[0px_4px_25px_rgba(15,23,42,0.04)] ${borderColor} hover:shadow-[0px_12px_40px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col gap-5`}
              >
                <div className={`w-14 h-14 rounded-2xl ${badgeColor} flex items-center justify-center shadow-sm`}>
                  <Icon size={26} className={iconColor} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0f172a] font-[family-name:var(--font-geist)] mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-[#76777d] leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner Section ───────────────────────────────────── */}
      <section className="py-20 bg-[#0f172a] relative overflow-hidden">
        {/* Glow Blobs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#006c49]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#3b82f6]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/15">
            <Lock size={14} className="text-[#4edea3]" />
            <span className="text-xs font-semibold text-[#4edea3] uppercase tracking-wider font-[family-name:var(--font-geist)]">
              Instant Access & Free Membership
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-[family-name:var(--font-geist)] leading-tight tracking-tight">
            Start Your Premium Shopping Journey Today
          </h2>

          <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Create a free account in seconds to unlock personalized deals, save your order history, and enjoy express checkout.
          </p>

          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#006c49] text-white font-bold rounded-2xl hover:bg-[#00503a] transition-all duration-200 shadow-[0_0_30px_rgba(0,108,73,0.4)] hover:scale-105 active:scale-95 font-[family-name:var(--font-geist)] text-base"
            >
              Create Free Account
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-white/10 text-white font-bold rounded-2xl border border-white/20 hover:bg-white/15 backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 font-[family-name:var(--font-geist)] text-base"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
