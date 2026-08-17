"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Star,
  Truck,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface SlideData {
  id: number;
  badge: string;
  badgeIcon: typeof Sparkles;
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix: string;
  description: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  gradientText: string;
  accentColor: string;
  btnBg: string;
  btnShadow: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  blob1Color: string;
  blob2Color: string;
  mockupBg: string;
  mockupTag: string;
  mockupTitle: string;
  mockupPrice: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    badge: "New Season Collection",
    badgeIcon: Sparkles,
    titlePrefix: "Discover the",
    titleHighlight: "Next Generation",
    titleSuffix: "of Shopping",
    description:
      "Explore curated luxury & daily essentials with express global delivery, end-to-end buyer protection, and 24/7 priority support.",
    primaryCtaText: "Shop Now",
    primaryCtaHref: "/products",
    secondaryCtaText: "Browse Departments",
    secondaryCtaHref: "/categories",
    gradientText: "from-[#34d399] via-[#10b981] to-[#059669]",
    accentColor: "#10b981",
    btnBg: "bg-secondary hover:bg-secondary-hover",
    btnShadow: "shadow-[0_0_30px_rgba(16,185,129,0.35)]",
    badgeBg: "bg-[#10b981]/15",
    badgeText: "text-[#34d399]",
    badgeBorder: "border-[#10b981]/30",
    blob1Color: "bg-[#10b981]/25",
    blob2Color: "bg-[#0284c7]/20",
    mockupBg: "linear-gradient(135deg, #064e3b 0%, #0f172a 100%)",
    mockupTag: "Masterpiece Choice",
    mockupTitle: "Studio Pro Wireless Headphones",
    mockupPrice: "$299.00",
  },
  {
    id: 2,
    badge: "Next-Gen Tech Gadgets",
    badgeIcon: Zap,
    titlePrefix: "Elevate Your",
    titleHighlight: "Digital & Smart",
    titleSuffix: "Ecosystem",
    description:
      "Power up your productivity with precision-engineered smart accessories, ergonomic setups, and limited-edition flagship tech.",
    primaryCtaText: "Explore Tech",
    primaryCtaHref: "/products?category=electronics",
    secondaryCtaText: "View Featured",
    secondaryCtaHref: "/products",
    gradientText: "from-[#38bdf8] via-[#818cf8] to-[#c084fc]",
    accentColor: "#38bdf8",
    btnBg: "bg-[#2563eb] hover:bg-[#1d4ed8]",
    btnShadow: "shadow-[0_0_30px_rgba(56,189,248,0.35)]",
    badgeBg: "bg-[#38bdf8]/15",
    badgeText: "text-[#38bdf8]",
    badgeBorder: "border-[#38bdf8]/30",
    blob1Color: "bg-[#38bdf8]/25",
    blob2Color: "bg-[#818cf8]/20",
    mockupBg: "linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)",
    mockupTag: "Trending Flagship",
    mockupTitle: "Ultra Magnetic 8-in-1 Hub",
    mockupPrice: "$149.00",
  },
  {
    id: 3,
    badge: "100% Authenticity Verified",
    badgeIcon: ShieldCheck,
    titlePrefix: "Curated for",
    titleHighlight: "Modern & Sleek",
    titleSuffix: "Living Spaces",
    description:
      "Handpicked catalog strictly vetted for premium durability, timeless aesthetics, and backed by hassle-free 30-day returns.",
    primaryCtaText: "Discover Deals",
    primaryCtaHref: "/products?sort=popular",
    secondaryCtaText: "Explore Catalog",
    secondaryCtaHref: "/categories",
    gradientText: "from-[#f59e0b] via-[#fbbf24] to-[#fef08a]",
    accentColor: "#fbbf24",
    btnBg: "bg-[#d97706] hover:bg-[#b45309]",
    btnShadow: "shadow-[0_0_30px_rgba(245,158,11,0.35)]",
    badgeBg: "bg-[#f59e0b]/15",
    badgeText: "text-[#fbbf24]",
    badgeBorder: "border-[#f59e0b]/30",
    blob1Color: "bg-[#f59e0b]/25",
    blob2Color: "bg-[#e11d48]/15",
    mockupBg: "linear-gradient(135deg, #78350f 0%, #0f172a 100%)",
    mockupTag: "Bestselling Choice",
    mockupTitle: "Minimalist Executive Wood Desk",
    mockupPrice: "$450.00",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  const slide = slides[current];
  const BadgeIcon = slide.badgeIcon;

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
    }),
  };

  return (
    <section
      className="relative overflow-hidden bg-[#090e1a] min-h-[620px] lg:min-h-[680px] flex items-center select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      {/* Soft glowing blobs behind the slide */}
      <motion.div
        key={`blob-1-${slide.id}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1.1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className={`absolute top-10 right-10 w-72 h-72 md:w-[500px] md:h-[500px] ${slide.blob1Color} rounded-full blur-[130px] pointer-events-none`}
      />
      <motion.div
        key={`blob-2-${slide.id}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className={`absolute bottom-5 left-10 w-60 h-60 md:w-[420px] md:h-[420px] ${slide.blob2Color} rounded-full blur-[120px] pointer-events-none`}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24 w-full">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={slide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center"
          >
            {/* Text column */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              {/* Badge above the title */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className={`inline-flex items-center gap-2 px-4 py-1.5 ${slide.badgeBg} backdrop-blur-md rounded-full border ${slide.badgeBorder} shadow-sm`}
              >
                <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                <BadgeIcon size={14} className={slide.badgeText} />
                <span
                  className={`text-xs font-bold ${slide.badgeText} uppercase tracking-wider font-display`}
                >
                  {slide.badge}
                </span>
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
              >
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] sm:leading-[1.08] tracking-tight font-display">
                  {slide.titlePrefix}{" "}
                  <span
                    className={`text-transparent bg-clip-text bg-gradient-to-r ${slide.gradientText}`}
                  >
                    {slide.titleHighlight}
                  </span>{" "}
                  <br />
                  {slide.titleSuffix}
                </h1>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
                className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl"
              >
                {slide.description}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-4 pt-2"
              >
                <Link
                  href={slide.primaryCtaHref}
                  className={`inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 ${slide.btnBg} text-white font-bold rounded-2xl transition-all duration-200 ${slide.btnShadow} hover:scale-[1.03] active:scale-[0.98] font-display text-sm sm:text-base`}
                >
                  {slide.primaryCtaText}
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href={slide.secondaryCtaHref}
                  className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/15 transition-all duration-200 border border-white/20 hover:border-white/35 backdrop-blur-md hover:scale-[1.03] active:scale-[0.98] font-display text-sm sm:text-base"
                >
                  {slide.secondaryCtaText}
                  <ChevronRight size={18} />
                </Link>
              </motion.div>

              {/* Stats: free delivery, returns, buyer protection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-white/12 max-w-lg"
              >
                <div className="bg-white/[0.06] backdrop-blur-md border border-white/12 rounded-2xl p-3.5 flex items-center gap-3 transition-transform hover:scale-[1.03]">
                  <div className="w-10 h-10 rounded-xl bg-[#10b981]/20 flex items-center justify-center text-[#34d399] flex-shrink-0">
                    <Truck size={20} />
                  </div>
                  <div>
                    <p className="text-base sm:text-lg font-extrabold text-white font-display leading-none">
                      Free
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">Delivery $50+</p>
                  </div>
                </div>

                <div className="bg-white/[0.06] backdrop-blur-md border border-white/12 rounded-2xl p-3.5 flex items-center gap-3 transition-transform hover:scale-[1.03]">
                  <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/20 flex items-center justify-center text-[#38bdf8] flex-shrink-0">
                    <RotateCcw size={20} />
                  </div>
                  <div>
                    <p className="text-base sm:text-lg font-extrabold text-white font-display leading-none">
                      30-Day
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">Easy Returns</p>
                  </div>
                </div>

                <div className="bg-white/[0.06] backdrop-blur-md border border-white/12 rounded-2xl p-3.5 flex items-center gap-3 transition-transform hover:scale-[1.03]">
                  <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/20 flex items-center justify-center text-[#fbbf24] flex-shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-base sm:text-lg font-extrabold text-white font-display leading-none">
                      100%
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">Buyer Protection</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Product card mockup on the right */}
            <div className="lg:col-span-5 hidden lg:flex justify-center relative">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-full max-w-md"
              >
                {/* The card itself */}
                <div className="bg-white/[0.08] backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-[0_25px_70px_rgba(0,0,0,0.5)] space-y-5">
                  <div
                    className="w-full h-60 rounded-2xl relative overflow-hidden flex items-center justify-center p-6 shadow-inner"
                    style={{ background: slide.mockupBg }}
                  >
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative text-center space-y-2.5">
                      <span className="inline-block px-3.5 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full uppercase tracking-wider font-display">
                        {slide.mockupTag}
                      </span>
                      <p className="text-white text-xl font-extrabold font-display leading-snug">
                        {slide.mockupTitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Starting From</p>
                      <p className="text-2xl font-extrabold text-white font-display">
                        {slide.mockupPrice}
                      </p>
                    </div>
                    <Link
                      href={slide.primaryCtaHref}
                      className="px-5 py-2.5 bg-white text-primary font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors shadow-md font-display"
                    >
                      Quick Order
                    </Link>
                  </div>
                </div>

                {/* Floating "secure checkout" badge */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="absolute -top-5 -right-6 bg-primary/90 backdrop-blur-xl rounded-2xl p-3.5 shadow-2xl border border-white/20 flex items-center gap-3 text-white"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#f59e0b]/20 flex items-center justify-center text-[#fbbf24]">
                    <Star size={18} fill="#fbbf24" />
                  </div>
                  <div>
                    <p className="text-xs font-bold font-display">
                      256-bit Secure Checkout
                    </p>
                    <p className="text-[11px] text-slate-400">Encrypted payments</p>
                  </div>
                </motion.div>

                {/* Floating "free delivery" badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                  className="absolute -bottom-6 -left-6 bg-primary/90 backdrop-blur-xl rounded-2xl p-3.5 shadow-2xl border border-white/20 flex items-center gap-3 text-white"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#10b981]/20 flex items-center justify-center text-[#34d399]">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold font-display">
                      Free Express Delivery
                    </p>
                    <p className="text-[11px] text-slate-400">On all orders over $50</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide controls: dots + arrows */}
        <div className="flex items-center justify-between mt-10 sm:mt-12 pt-6 border-t border-white/12">
          {/* Dot indicators */}
          <div className="flex items-center gap-2 sm:gap-3">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setDirection(idx > current ? 1 : -1);
                  setCurrent(idx);
                }}
                className={`relative h-2.5 rounded-full transition-all duration-300 ${
                  idx === current
                    ? "w-8 sm:w-12 bg-white"
                    : "w-2.5 bg-white/25 hover:bg-white/50"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Prev / next arrows */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
              aria-label="Previous slide"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
              aria-label="Next slide"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
