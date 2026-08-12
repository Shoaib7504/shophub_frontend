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
    badgeColor: "bg-delivered-bg",
    iconColor: "text-delivered-text",
    borderColor: "hover:border-secondary/40",
  },
  {
    icon: Truck,
    title: "Express Shipping",
    desc: "Fast air freight delivery options with real-time tracking on every order.",
    badgeColor: "bg-shipped-bg",
    iconColor: "text-shipped-text",
    borderColor: "hover:border-[#3b82f6]/40",
  },
  {
    icon: Star,
    title: "Verified Quality",
    desc: "Curated catalog strictly inspected to meet high durability & aesthetic standards.",
    badgeColor: "bg-pending-bg",
    iconColor: "text-pending-text",
    borderColor: "hover:border-[#f59e0b]/40",
  },
  {
    icon: RotateCcw,
    title: "Easy 30-Day Returns",
    desc: "30-day hassle-free full refund policy — simple and transparent.",
    badgeColor: "bg-confirmed-bg",
    iconColor: "text-confirmed-text",
    borderColor: "hover:border-[#6366f1]/40",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero slider */}
      <HeroSlider />

      {/* Brand logos ticker */}
      <BrandSlider />

      {/* Categories */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/10 rounded-full text-secondary text-xs font-bold uppercase tracking-wider mb-2 font-display">
                <Sparkles size={12} />
                Explore By Category
              </div>
              <h2 className="text-3xl font-extrabold text-primary font-display tracking-tight">
                Shop By Department
              </h2>
            </div>
            <Link
              href="/categories"
              className="inline-flex items-center gap-1 text-sm font-bold text-secondary hover:text-secondary-hover transition-colors font-display group"
            >
              View all categories
              <ChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <Suspense
            fallback={
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-32 bg-white rounded-2xl animate-skeleton border border-surface-high" />
                ))}
              </div>
            }
          >
            <HomeCategories />
          </Suspense>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-20 bg-white border-t border-surface-high">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/5 rounded-full text-primary text-xs font-bold uppercase tracking-wider mb-2 font-display">
                Handpicked Selections
              </div>
              <h2 className="text-3xl font-extrabold text-primary font-display tracking-tight">
                Featured Products
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-secondary transition-colors font-display group"
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

      {/* "Why ShopHub" benefits grid */}
      <section className="py-20 bg-background border-t border-surface-high">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-secondary font-display">
              The ShopHub Promise
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary font-display tracking-tight">
              Why Thousands Choose ShopHub
            </h2>
            <p className="text-base text-on-surface-muted">
              We prioritize your peace of mind with enterprise security, rapid fulfillment, and unmatched catalog standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {benefits.map(({ icon: Icon, title, desc, badgeColor, iconColor, borderColor }) => (
              <div
                key={title}
                className={`bg-white rounded-3xl p-7 border border-surface-container shadow-[0px_4px_25px_rgba(15,23,42,0.04)] ${borderColor} hover:shadow-[0px_12px_40px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col gap-5`}
              >
                <div className={`w-14 h-14 rounded-2xl ${badgeColor} flex items-center justify-center shadow-sm`}>
                  <Icon size={26} className={iconColor} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary font-display mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-on-surface-muted leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-20 bg-primary relative overflow-hidden">
        {/* Soft glowing circles in the background */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#3b82f6]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/15">
            <Lock size={14} className="text-mint" />
            <span className="text-xs font-semibold text-mint uppercase tracking-wider font-display">
              Instant Access & Free Membership
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display leading-tight tracking-tight">
            Start Your Premium Shopping Journey Today
          </h2>

          <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Create a free account in seconds to unlock personalized deals, save your order history, and enjoy express checkout.
          </p>

          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-secondary text-white font-bold rounded-2xl hover:bg-secondary-hover transition-all duration-200 shadow-[0_0_30px_rgba(0,108,73,0.4)] hover:scale-105 active:scale-95 font-display text-base"
            >
              Create Free Account
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-white/10 text-white font-bold rounded-2xl border border-white/20 hover:bg-white/15 backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 font-display text-base"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
