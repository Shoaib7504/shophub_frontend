"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
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
      {/* Logo */}
      <Link
        href="/"
        onClick={onNavigate}
        className={cn("flex items-center gap-2.5 px-4 py-5 border-b border-[#eae7e9] hover:bg-[#f6f3f5] transition-colors", collapsed && "justify-center px-2")}
        title="Go to home page"
      >
        <div className="w-8 h-8 bg-[#0f172a] rounded-lg flex items-center justify-center flex-shrink-0">
          <ShoppingBag size={16} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-[#0f172a] font-[family-name:var(--font-geist)]">ShopHub</span>
        )}
      </Link>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(pathname, href, exact);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group",
                collapsed && "justify-center px-2",
                active
                  ? "bg-[#0f172a] text-white"
                  : "text-[#45464d] hover:bg-[#f0edef] hover:text-[#0f172a]"
              )}
            >
              {/* Active indicator */}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#006c49] rounded-r-full" />
              )}
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
              {collapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-[#0f172a] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-50">
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className={cn("p-3 border-t border-[#eae7e9]", collapsed && "flex justify-center")}>
        {!collapsed ? (
          <div className="flex items-center gap-3 p-2">
            <div className="w-8 h-8 rounded-lg bg-[#0f172a] flex items-center justify-center text-white text-sm font-semibold font-[family-name:var(--font-geist)]">
              {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1b1b1d] truncate">{user?.name}</p>
              <p className="text-xs text-[#76777d]">Admin</p>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 text-[#76777d] hover:text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg transition-all"
              aria-label="Logout"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button
            onClick={onLogout}
            className="p-2 text-[#76777d] hover:text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg transition-all"
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
        <div className="w-8 h-8 border-2 border-[#0f172a] border-t-transparent rounded-full animate-spin" />
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

  return (
    <div className="min-h-screen bg-[#fcf8fa] flex">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-white border-r border-[#eae7e9] transition-all duration-300 flex-shrink-0",
          collapsed ? "w-16" : "w-64"
        )}
        style={{ minHeight: "100vh" }}
      >
        <SidebarContent {...sidebarProps} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-[#1b1b1d]/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 bg-white flex flex-col shadow-2xl animate-slide-right">
            <SidebarContent {...sidebarProps} />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-[#eae7e9] flex items-center px-6 gap-4 sticky top-0 z-30">
          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-[#45464d] hover:bg-[#f0edef] rounded-lg"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {/* Desktop collapse toggle */}
          <button
            className="hidden md:flex p-2 text-[#45464d] hover:bg-[#f0edef] rounded-lg transition-colors"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* Page breadcrumb */}
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#1b1b1d] font-[family-name:var(--font-geist)] capitalize">
              {navItems.find((n) => isActive(pathname, n.href, n.exact))?.label ?? "Admin"}
            </p>
          </div>

          {/* Admin badge */}
          <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#e0e7ff] text-[#3730a3] text-xs font-semibold rounded-full font-[family-name:var(--font-geist)]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3730a3]" />
            Admin
          </span>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
