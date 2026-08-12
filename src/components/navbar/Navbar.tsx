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

  // Navigated to a new page? Close the open menus
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
          ? "bg-white/85 backdrop-blur-xl border-b border-surface-high shadow-[0_4px_25px_rgba(15,23,42,0.05)]"
          : "bg-white border-b border-surface-high"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* ShopHub logo (links home) */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-extrabold text-xl text-primary font-display hover:opacity-85 transition-all group"
        >
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
            <ShoppingBag size={18} className="text-white" />
          </div>
          <span className="tracking-tight text-xl">
            Shop<span className="text-secondary">Hub</span>
          </span>
        </Link>

        {/* Main nav links (desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-background p-1.5 rounded-2xl border border-surface-container" aria-label="Main navigation">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 font-display",
                  active
                    ? "text-primary"
                    : "text-on-surface-variant hover:text-primary"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-white rounded-xl shadow-sm border border-surface-high"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Cart + account menu (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {/* Cart icon with item-count badge */}
          <Link
            href="/cart"
            className="relative p-2.5 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all duration-200"
            aria-label={`Cart with ${totalItems} items`}
          >
            <ShoppingCart size={21} />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center shadow-md font-display"
              >
                {totalItems > 99 ? "99+" : totalItems}
              </motion.span>
            )}
          </Link>

          {/* Account dropdown (or login/register links) */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-surface-high bg-background hover:bg-white text-sm font-semibold text-on-surface transition-all shadow-sm"
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
              >
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-bold font-display">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
                </div>
                <span className="max-w-28 truncate font-display">{user?.name}</span>
                <ChevronDown
                  size={15}
                  className={cn("transition-transform duration-200 text-on-surface-muted", userMenuOpen && "rotate-180")}
                />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-surface-high shadow-[0_12px_40px_rgba(15,23,42,0.12)] overflow-hidden z-50 p-1 space-y-0.5"
                  >
                    <div className="px-3.5 py-3 bg-background rounded-xl mb-1 border border-surface-container">
                      <p className="text-sm font-bold text-on-surface truncate font-display">{user?.name}</p>
                      <p className="text-xs text-on-surface-muted truncate">{user?.email}</p>
                    </div>
                    {user?.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-confirmed-text bg-confirmed-bg/50 hover:bg-confirmed-bg transition-colors"
                      >
                        <LayoutDashboard size={16} />
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-low hover:text-primary transition-colors"
                    >
                      <User size={16} />
                      My Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-low hover:text-primary transition-colors"
                    >
                      <Package size={16} />
                      My Orders
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold text-error hover:bg-error-container/60 transition-colors border-t border-surface-container mt-1"
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
                className="px-4 py-2.5 text-sm font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-xl transition-all font-display"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-primary-hover transition-all duration-200 shadow-md hover:shadow-lg font-display"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Cart + hamburger (mobile) */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/cart" className="relative p-2 rounded-xl text-on-surface-variant" aria-label="Cart">
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-secondary text-white text-[9px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Drop-down menu (mobile) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-b border-surface-high shadow-xl overflow-hidden"
          >
            <nav className="flex flex-col p-5 gap-1.5" aria-label="Mobile navigation">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "px-4 py-3 rounded-xl text-base font-semibold transition-colors font-display",
                    pathname === href
                      ? "bg-primary text-white"
                      : "text-on-surface-variant hover:bg-surface-low"
                  )}
                >
                  {label}
                </Link>
              ))}
              <div className="border-t border-surface-container pt-4 mt-2 space-y-2">
                {isAuthenticated ? (
                  <>
                    {user?.role === "ADMIN" && (
                      <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-confirmed-text bg-confirmed-bg rounded-xl">
                        <LayoutDashboard size={18} /> Admin Dashboard
                      </Link>
                    )}
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-on-surface-variant rounded-xl hover:bg-surface-low">
                      <User size={18} /> Profile
                    </Link>
                    <Link href="/orders" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-on-surface-variant rounded-xl hover:bg-surface-low">
                      <Package size={18} /> Orders
                    </Link>
                    <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-error rounded-xl hover:bg-error-container">
                      <LogOut size={18} /> Logout
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3 pt-2">
                    <Link href="/login" className="flex-1 text-center py-3 text-sm font-semibold border border-outline-variant rounded-xl hover:bg-surface-container transition-colors font-display">
                      Login
                    </Link>
                    <Link href="/register" className="flex-1 text-center py-3 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors font-display">
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
