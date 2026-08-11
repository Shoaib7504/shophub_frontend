"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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

  // Close mobile menus when the route changes (adjusted during render)
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
        "fixed top-0 left-0 right-0 z-40 h-20 transition-all duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-[#eae7e9] shadow-[0_1px_8px_rgba(15,23,42,0.04)]"
          : "bg-white border-b border-[#eae7e9]"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-[#0f172a] font-[family-name:var(--font-geist)] hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-[#0f172a] rounded-lg flex items-center justify-center">
            <ShoppingBag size={16} className="text-white" />
          </div>
          ShopHub
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                pathname === href
                  ? "text-[#0f172a] bg-[#f0edef]"
                  : "text-[#45464d] hover:text-[#0f172a] hover:bg-[#f6f3f5]"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Cart */}
          <Link
            href="/cart"
            className="relative p-2.5 rounded-xl text-[#45464d] hover:text-[#0f172a] hover:bg-[#f0edef] transition-all"
            aria-label={`Cart with ${totalItems} items`}
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#006c49] text-white text-[10px] font-bold flex items-center justify-center font-[family-name:var(--font-geist)]">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          {/* Auth */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-[#45464d] hover:text-[#0f172a] hover:bg-[#f0edef] transition-all"
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
              >
                <div className="w-7 h-7 rounded-full bg-[#0f172a] flex items-center justify-center text-white text-xs font-semibold font-[family-name:var(--font-geist)]">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
                </div>
                <span className="max-w-24 truncate">{user?.name}</span>
                <ChevronDown
                  size={14}
                  className={cn("transition-transform", userMenuOpen && "rotate-180")}
                />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-[#eae7e9] shadow-[0_8px_30px_rgba(15,23,42,0.1)] overflow-hidden animate-slide-down">
                  <div className="px-4 py-3 border-b border-[#f0edef]">
                    <p className="text-sm font-semibold text-[#1b1b1d] truncate">{user?.name}</p>
                    <p className="text-xs text-[#76777d] truncate">{user?.email}</p>
                  </div>
                  {user?.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#3730a3] hover:bg-[#e0e7ff] transition-colors"
                    >
                      <LayoutDashboard size={15} />
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#45464d] hover:bg-[#f6f3f5] transition-colors"
                  >
                    <User size={15} />
                    My Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#45464d] hover:bg-[#f6f3f5] transition-colors"
                  >
                    <Package size={15} />
                    My Orders
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors border-t border-[#f0edef]"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-[#45464d] hover:text-[#0f172a] hover:bg-[#f0edef] rounded-xl transition-all"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium bg-[#0f172a] text-white rounded-xl hover:bg-[#1e293b] transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile: Cart + Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/cart" className="relative p-2 rounded-lg text-[#45464d]" aria-label="Cart">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#006c49] text-white text-[9px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="p-2 rounded-lg text-[#45464d] hover:bg-[#f0edef] transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-[#eae7e9] shadow-lg animate-slide-down">
          <nav className="flex flex-col p-4 gap-1" aria-label="Mobile navigation">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  pathname === href
                    ? "bg-[#f0edef] text-[#0f172a]"
                    : "text-[#45464d] hover:bg-[#f6f3f5]"
                )}
              >
                {label}
              </Link>
            ))}
            <div className="border-t border-[#f0edef] pt-3 mt-2 space-y-1">
              {isAuthenticated ? (
                <>
                  {user?.role === "ADMIN" && (
                    <Link href="/admin" className="flex items-center gap-2 px-4 py-3 text-sm text-[#3730a3] rounded-xl hover:bg-[#e0e7ff]">
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                  )}
                  <Link href="/profile" className="flex items-center gap-2 px-4 py-3 text-sm text-[#45464d] rounded-xl hover:bg-[#f6f3f5]">
                    <User size={15} /> Profile
                  </Link>
                  <Link href="/orders" className="flex items-center gap-2 px-4 py-3 text-sm text-[#45464d] rounded-xl hover:bg-[#f6f3f5]">
                    <Package size={15} /> Orders
                  </Link>
                  <button onClick={logout} className="flex items-center gap-2 w-full px-4 py-3 text-sm text-[#ba1a1a] rounded-xl hover:bg-[#ffdad6]">
                    <LogOut size={15} /> Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2 px-1">
                  <Link href="/login" className="flex-1 text-center py-2.5 text-sm font-medium border border-[#c6c6cd] rounded-xl hover:bg-[#f0edef] transition-colors">
                    Login
                  </Link>
                  <Link href="/register" className="flex-1 text-center py-2.5 text-sm font-medium bg-[#0f172a] text-white rounded-xl hover:bg-[#1e293b] transition-colors">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
