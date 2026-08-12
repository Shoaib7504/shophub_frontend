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
      {/* ShopHub logo + "Admin Portal" */}
      <Link
        href="/"
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-3 px-5 py-5 border-b border-surface-high hover:bg-background transition-colors",
          collapsed && "justify-center px-2"
        )}
        title="Return to store front"
      >
        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
          <ShoppingBag size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-extrabold text-primary font-display text-lg leading-none">
              Shop<span className="text-secondary">Hub</span>
            </span>
            <span className="text-[10px] text-on-surface-muted uppercase tracking-wider font-semibold mt-1">
              Admin Portal
            </span>
          </div>
        )}
      </Link>

      {/* Sidebar links */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(pathname, href, exact);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative group font-display",
                collapsed && "justify-center px-2",
                active
                  ? "bg-primary text-white shadow-md"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
              )}
            >
              {active && (
                <motion.div
                  layoutId="adminNavIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-secondary rounded-r-full"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              <Icon size={19} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
              {collapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-primary text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-50 shadow-lg">
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logged-in admin + logout */}
      <div className={cn("p-3 border-t border-surface-high", collapsed && "flex justify-center")}>
        {!collapsed ? (
          <div className="flex items-center gap-3 p-2 bg-background rounded-xl border border-surface-container">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-bold font-display">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-on-surface truncate font-display">
                {user?.name}
              </p>
              <p className="text-[10px] text-secondary font-semibold uppercase tracking-wider">
                Administrator
              </p>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 text-on-surface-muted hover:text-error hover:bg-error-container rounded-lg transition-all"
              aria-label="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={onLogout}
            className="p-2 text-on-surface-muted hover:text-error hover:bg-error-container rounded-xl transition-all"
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-9 h-9 border-3 border-primary border-t-transparent rounded-full animate-spin" />
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
    <div className="min-h-screen bg-background flex">
      {/* Sidebar (desktop) */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 260 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="hidden md:flex flex-col bg-white border-r border-surface-high flex-shrink-0 z-30"
        style={{ minHeight: "100vh" }}
      >
        <SidebarContent {...sidebarProps} />
      </motion.aside>

      {/* Sidebar sliding in from the left (mobile) */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary/50 backdrop-blur-sm"
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

      {/* Everything to the right of the sidebar */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-surface-high flex items-center px-6 gap-4 sticky top-0 z-20 shadow-[0_2px_15px_rgba(15,23,42,0.03)]">
          {/* Open the menu on mobile */}
          <button
            className="md:hidden p-2 text-on-surface-variant hover:bg-surface-container rounded-xl"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {/* Collapse/expand the sidebar on desktop */}
          <button
            className="hidden md:flex p-2 text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* Current page title */}
          <div className="flex-1 flex items-center gap-2">
            <span className="text-xs font-semibold text-on-surface-muted uppercase tracking-wider hidden sm:inline-block font-display">
              Admin Portal
            </span>
            <span className="text-xs text-outline-variant hidden sm:inline-block">/</span>
            <p className="text-base font-extrabold text-primary font-display capitalize">
              {currentLabel}
            </p>
          </div>

          {/* "Admin Mode" badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-delivered-bg border border-secondary/20 text-delivered-text text-xs font-bold rounded-full font-display">
            <ShieldCheck size={14} />
            <span>Admin Mode</span>
          </div>
        </header>

        {/* Where the page content goes */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
