"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Package,
  ChevronDown,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Close mobile menus when the route changes
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMobileOpen(false);
    setUserMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300",
        scrolled
          ? "bg-white/85 backdrop-blur-xl border-b border-[#eae7e9] shadow-[0_4px_25px_rgba(15,23,42,0.05)]"
          : "bg-white border-b border-[#eae7e9]"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-extrabold text-xl text-[#0f172a] font-[family-name:var(--font-geist)] hover:opacity-85 transition-all group"
        >
          <div className="w-9 h-9 bg-[#0f172a] rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
            <ShoppingBag size={18} className="text-white" />
          </div>
          <span className="tracking-tight text-xl">
            Shop<span className="text-[#006c49]">Hub</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-[#fcf8fa] p-1.5 rounded-2xl border border-[#f0edef]" aria-label="Main navigation">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 font-[family-name:var(--font-geist)]",
                  active
                    ? "text-[#0f172a]"
                    : "text-[#45464d] hover:text-[#0f172a]"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-white rounded-xl shadow-sm border border-[#eae7e9]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Cart Icon with Motion Badge */}
          <Link
            href="/cart"
            className="relative p-2.5 rounded-xl text-[#45464d] hover:text-[#0f172a] hover:bg-[#f0edef] transition-all duration-200"
            aria-label={`Cart with ${totalItems} items`}
          >
            <ShoppingCart size={21} />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[#006c49] text-white text-[10px] font-bold flex items-center justify-center shadow-md font-[family-name:var(--font-geist)]"
              >
                {totalItems > 99 ? "99+" : totalItems}
              </motion.span>
            )}
          </Link>

          {/* Auth Menu */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-[#eae7e9] bg-[#fcf8fa] hover:bg-white text-sm font-semibold text-[#1b1b1d] transition-all shadow-sm"
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
              >
                <div className="w-7 h-7 rounded-lg bg-[#0f172a] flex items-center justify-center text-white text-xs font-bold font-[family-name:var(--font-geist)]">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
                </div>
                <span className="max-w-28 truncate font-[family-name:var(--font-geist)]">{user?.name}</span>
                <ChevronDown
                  size={15}
                  className={cn("transition-transform duration-200 text-[#76777d]", userMenuOpen && "rotate-180")}
                />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-[#eae7e9] shadow-[0_12px_40px_rgba(15,23,42,0.12)] overflow-hidden z-50 p-1 space-y-0.5"
                  >
                    <div className="px-3.5 py-3 bg-[#fcf8fa] rounded-xl mb-1 border border-[#f0edef]">
                      <p className="text-sm font-bold text-[#1b1b1d] truncate font-[family-name:var(--font-geist)]">{user?.name}</p>
                      <p className="text-xs text-[#76777d] truncate">{user?.email}</p>
                    </div>
                    {user?.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#3730a3] bg-[#e0e7ff]/50 hover:bg-[#e0e7ff] transition-colors"
                      >
                        <LayoutDashboard size={16} />
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#45464d] hover:bg-[#f6f3f5] hover:text-[#0f172a] transition-colors"
                    >
                      <User size={16} />
                      My Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#45464d] hover:bg-[#f6f3f5] hover:text-[#0f172a] transition-colors"
                    >
                      <Package size={16} />
                      My Orders
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]/60 transition-colors border-t border-[#f0edef] mt-1"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2.5 text-sm font-semibold text-[#45464d] hover:text-[#0f172a] hover:bg-[#f0edef] rounded-xl transition-all font-[family-name:var(--font-geist)]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 text-sm font-semibold bg-[#0f172a] text-white rounded-xl hover:bg-[#1e293b] transition-all duration-200 shadow-md hover:shadow-lg font-[family-name:var(--font-geist)]"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile: Cart + Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/cart" className="relative p-2 rounded-xl text-[#45464d]" aria-label="Cart">
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#006c49] text-white text-[9px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="p-2 rounded-xl text-[#45464d] hover:bg-[#f0edef] transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-b border-[#eae7e9] shadow-xl overflow-hidden"
          >
            <nav className="flex flex-col p-5 gap-1.5" aria-label="Mobile navigation">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "px-4 py-3 rounded-xl text-base font-semibold transition-colors font-[family-name:var(--font-geist)]",
                    pathname === href
                      ? "bg-[#0f172a] text-white"
                      : "text-[#45464d] hover:bg-[#f6f3f5]"
                  )}
                >
                  {label}
                </Link>
              ))}
              <div className="border-t border-[#f0edef] pt-4 mt-2 space-y-2">
                {isAuthenticated ? (
                  <>
                    {user?.role === "ADMIN" && (
                      <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#3730a3] bg-[#e0e7ff] rounded-xl">
                        <LayoutDashboard size={18} /> Admin Dashboard
                      </Link>
                    )}
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#45464d] rounded-xl hover:bg-[#f6f3f5]">
                      <User size={18} /> Profile
                    </Link>
                    <Link href="/orders" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#45464d] rounded-xl hover:bg-[#f6f3f5]">
                      <Package size={18} /> Orders
                    </Link>
                    <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-[#ba1a1a] rounded-xl hover:bg-[#ffdad6]">
                      <LogOut size={18} /> Logout
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3 pt-2">
                    <Link href="/login" className="flex-1 text-center py-3 text-sm font-semibold border border-[#c6c6cd] rounded-xl hover:bg-[#f0edef] transition-colors font-[family-name:var(--font-geist)]">
                      Login
                    </Link>
                    <Link href="/register" className="flex-1 text-center py-3 text-sm font-semibold bg-[#0f172a] text-white rounded-xl hover:bg-[#1e293b] transition-colors font-[family-name:var(--font-geist)]">
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
