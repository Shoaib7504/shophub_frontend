"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import type { AuthUser } from "@/types/auth";
import {
  LayoutDashboard,
  Package,
  Folder,
  Users,
  FileText,
  Star,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  LogOut,
  Menu,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Folder },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/orders", label: "Orders", icon: FileText },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
];

function isActive(pathname: string, href: string, exact?: boolean): boolean {
  return exact ? pathname === href : pathname.startsWith(href);
}

function SidebarContent({
  collapsed,
  pathname,
  user,
  onLogout,
  onNavigate,
}: {
  collapsed: boolean;
  pathname: string;
  user: AuthUser | null;
  onLogout: () => void;
  onNavigate: () => void;
}) {
  return (
    <>
      {/* Brand Header */}
      <Link
        href="/"
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-3 px-5 py-5 border-b border-[#eae7e9] hover:bg-[#fcf8fa] transition-colors",
          collapsed && "justify-center px-2"
        )}
        title="Return to store front"
      >
        <div className="w-9 h-9 bg-[#0f172a] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
          <ShoppingBag size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-extrabold text-[#0f172a] font-[family-name:var(--font-geist)] text-lg leading-none">
              Shop<span className="text-[#006c49]">Hub</span>
            </span>
            <span className="text-[10px] text-[#76777d] uppercase tracking-wider font-semibold mt-1">
              Admin Portal
            </span>
          </div>
        )}
      </Link>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(pathname, href, exact);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative group font-[family-name:var(--font-geist)]",
                collapsed && "justify-center px-2",
                active
                  ? "bg-[#0f172a] text-white shadow-md"
                  : "text-[#45464d] hover:bg-[#f0edef] hover:text-[#0f172a]"
              )}
            >
              {active && (
                <motion.div
                  layoutId="adminNavIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#006c49] rounded-r-full"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              <Icon size={19} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
              {collapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-[#0f172a] text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-50 shadow-lg">
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className={cn("p-3 border-t border-[#eae7e9]", collapsed && "flex justify-center")}>
        {!collapsed ? (
          <div className="flex items-center gap-3 p-2 bg-[#fcf8fa] rounded-xl border border-[#f0edef]">
            <div className="w-8 h-8 rounded-lg bg-[#0f172a] flex items-center justify-center text-white text-xs font-bold font-[family-name:var(--font-geist)]">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#1b1b1d] truncate font-[family-name:var(--font-geist)]">
                {user?.name}
              </p>
              <p className="text-[10px] text-[#006c49] font-semibold uppercase tracking-wider">
                Administrator
              </p>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 text-[#76777d] hover:text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg transition-all"
              aria-label="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={onLogout}
            className="p-2 text-[#76777d] hover:text-[#ba1a1a] hover:bg-[#ffdad6] rounded-xl transition-all"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) router.replace("/login");
      else if (user?.role !== "ADMIN") router.replace("/");
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcf8fa]">
        <div className="w-9 h-9 border-3 border-[#0f172a] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "ADMIN") return null;

  const sidebarProps = {
    collapsed,
    pathname,
    user,
    onLogout: logout,
    onNavigate: () => setMobileOpen(false),
  };

  const currentLabel =
    navItems.find((n) => isActive(pathname, n.href, n.exact))?.label ?? "Admin";

  return (
    <div className="min-h-screen bg-[#fcf8fa] flex">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 260 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="hidden md:flex flex-col bg-white border-r border-[#eae7e9] flex-shrink-0 z-30"
        style={{ minHeight: "100vh" }}
      >
        <SidebarContent {...sidebarProps} />
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0f172a]/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-72 bg-white flex flex-col shadow-2xl z-10"
            >
              <SidebarContent {...sidebarProps} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-[#eae7e9] flex items-center px-6 gap-4 sticky top-0 z-20 shadow-[0_2px_15px_rgba(15,23,42,0.03)]">
          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-[#45464d] hover:bg-[#f0edef] rounded-xl"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {/* Desktop collapse toggle */}
          <button
            className="hidden md:flex p-2 text-[#45464d] hover:bg-[#f0edef] rounded-xl transition-colors"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* Page Title & Breadcrumb */}
          <div className="flex-1 flex items-center gap-2">
            <span className="text-xs font-semibold text-[#76777d] uppercase tracking-wider hidden sm:inline-block font-[family-name:var(--font-geist)]">
              Admin Portal
            </span>
            <span className="text-xs text-[#c6c6cd] hidden sm:inline-block">/</span>
            <p className="text-base font-extrabold text-[#0f172a] font-[family-name:var(--font-geist)] capitalize">
              {currentLabel}
            </p>
          </div>

          {/* Admin badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#d1fae5] border border-[#006c49]/20 text-[#065f46] text-xs font-bold rounded-full font-[family-name:var(--font-geist)]">
            <ShieldCheck size={14} />
            <span>Admin Mode</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
