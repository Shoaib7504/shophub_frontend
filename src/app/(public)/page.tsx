import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  Star,
  RotateCcw,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { ProductSkeleton } from "@/components/ui/Skeleton";
import { Suspense } from "react";
import HomeFeaturedProducts from "./HomeFeaturedProducts";
import HomeCategories from "./HomeCategories";

export const metadata: Metadata = {
  title: "ShopHub — Premium E-Commerce",
  description:
    "Discover premium products. Shop with confidence — fast delivery, secure checkout, and quality guaranteed.",
};

const benefits = [
  {
    icon: ShieldCheck,
    title: "Secure Shopping",
    desc: "End-to-end encrypted transactions protect your payment details.",
    color: "bg-[#d1fae5]",
    iconColor: "text-[#065f46]",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "Express shipping options with real-time tracking on every order.",
    color: "bg-[#dbeafe]",
    iconColor: "text-[#1e40af]",
  },
  {
    icon: Star,
    title: "Quality Products",
    desc: "Curated catalog reviewed and verified for premium quality standards.",
    color: "bg-[#fef3c7]",
    iconColor: "text-[#92400e]",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    desc: "30-day hassle-free returns — no questions asked.",
    color: "bg-[#e0e7ff]",
    iconColor: "text-[#3730a3]",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0f172a] min-h-[580px] flex items-center">
        {/* Background grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        {/* Gradient blobs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#006c49]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#3323cc]/15 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#006c49]/20 rounded-full border border-[#006c49]/30">
              <div className="w-1.5 h-1.5 rounded-full bg-[#4edea3]" />
              <span className="text-xs font-medium text-[#4edea3] font-[family-name:var(--font-geist)] tracking-wide uppercase">
                New Arrivals Available
              </span>
            </div>

            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight font-[family-name:var(--font-geist)]">
                Shop the
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4edea3] to-[#6cf8bb]">
                  Premium
                </span>
                <br />
                Collection
              </h1>
            </div>

            <p className="text-lg text-white/60 leading-relaxed max-w-md">
              Discover thousands of high-quality products with fast delivery,
              secure checkout, and satisfaction guaranteed on every order.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#006c49] text-white font-semibold rounded-xl hover:bg-[#00503a] transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,108,73,0.4)] font-[family-name:var(--font-geist)]"
              >
                Shop Now
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/15 transition-all duration-200 border border-white/20 font-[family-name:var(--font-geist)]"
              >
                Browse Categories
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4 border-t border-white/10">
              {[
                { value: "10K+", label: "Products" },
                { value: "50K+", label: "Customers" },
                { value: "4.9★", label: "Rating" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-white font-[family-name:var(--font-geist)]">{value}</p>
                  <p className="text-xs text-white/50 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Floating product cards mockup */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-sm">
              {/* Main card */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 space-y-4">
                <div
                  className="w-full h-48 rounded-xl"
                  style={{ background: "linear-gradient(135deg, hsl(160, 60%, 30%), hsl(180, 70%, 45%))" }}
                />
                <div className="space-y-1.5">
                  <div className="h-4 bg-white/20 rounded w-3/4" />
                  <div className="h-3 bg-white/10 rounded w-1/2" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-white/20 rounded w-24" />
                  <div className="h-8 bg-[#006c49] rounded-lg w-28" />
                </div>
              </div>
              {/* Floating mini cards */}
              <div className="absolute -top-6 -right-8 bg-white rounded-xl p-3 shadow-2xl w-40 border border-[#eae7e9]">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg" style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }} />
                  <div className="flex-1">
                    <div className="h-2.5 bg-[#eae7e9] rounded mb-1.5 w-full" />
                    <div className="h-2 bg-[#f0edef] rounded w-2/3" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-8 bg-white rounded-xl p-3 shadow-2xl border border-[#eae7e9]">
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-3 h-3 rounded-full bg-[#d97706]" />
                  ))}
                  <span className="text-xs font-semibold text-[#1b1b1d] ml-1">4.9</span>
                </div>
                <p className="text-xs text-[#76777d] mt-1">1,200+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────── */}
      <section className="py-16 bg-[#fcf8fa]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#006c49] mb-2 font-[family-name:var(--font-geist)]">Browse By</p>
              <h2 className="text-2xl font-bold text-[#0f172a] font-[family-name:var(--font-geist)]">Shop Categories</h2>
            </div>
            <Link
              href="/categories"
              className="flex items-center gap-1 text-sm font-medium text-[#45464d] hover:text-[#0f172a] transition-colors"
            >
              View all <ChevronRight size={16} />
            </Link>
          </div>
          <Suspense fallback={
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-28 bg-white rounded-2xl animate-skeleton" />
              ))}
            </div>
          }>
            <HomeCategories />
          </Suspense>
        </div>
      </section>

      {/* ── Featured Products ────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#006c49] mb-2 font-[family-name:var(--font-geist)]">Handpicked</p>
              <h2 className="text-2xl font-bold text-[#0f172a] font-[family-name:var(--font-geist)]">Featured Products</h2>
            </div>
            <Link
              href="/products"
              className="flex items-center gap-1 text-sm font-medium text-[#45464d] hover:text-[#0f172a] transition-colors"
            >
              View all <ChevronRight size={16} />
            </Link>
          </div>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
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

      {/* ── Benefits ─────────────────────────────────────────────── */}
      <section className="py-16 bg-[#fcf8fa]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#006c49] mb-2 font-[family-name:var(--font-geist)]">Why ShopHub</p>
            <h2 className="text-2xl font-bold text-[#0f172a] font-[family-name:var(--font-geist)]">The ShopHub Advantage</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map(({ icon: Icon, title, desc, color, iconColor }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] flex flex-col gap-4 hover:shadow-[0px_8px_30px_rgba(15,23,42,0.08)] transition-shadow duration-300">
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
                  <Icon size={22} className={iconColor} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1b1b1d] font-[family-name:var(--font-geist)] mb-1.5">{title}</h3>
                  <p className="text-sm text-[#76777d] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#0f172a]">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#4edea3] font-[family-name:var(--font-geist)]">
            Limited Time
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white font-[family-name:var(--font-geist)] leading-tight">
            Start Shopping Today
          </h2>
          <p className="text-white/60 text-lg">
            Join thousands of happy customers. New products added daily.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#006c49] text-white font-semibold rounded-xl hover:bg-[#00503a] transition-all duration-200 hover:shadow-[0_0_24px_rgba(0,108,73,0.4)] font-[family-name:var(--font-geist)]"
            >
              Create Free Account
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-transparent text-white font-semibold rounded-xl border border-white/25 hover:bg-white/10 transition-all duration-200 font-[family-name:var(--font-geist)]"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
