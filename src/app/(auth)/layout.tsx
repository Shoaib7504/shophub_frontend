import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex flex-col items-center justify-center p-4">
      {/* ShopHub logo link */}
      <Link
        href="/"
        className="flex items-center gap-2 mb-8 font-bold text-xl text-white font-display hover:opacity-80 transition-opacity"
      >
        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
          <ShoppingBag size={16} className="text-white" />
        </div>
        ShopHub
      </Link>

      {/* The login/register form goes in here */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden">
        {children}
      </div>

      <p className="mt-6 text-xs text-white/30">
        © {new Date().getFullYear()} ShopHub. All rights reserved.
      </p>
    </div>
  );
}
