import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fcf8fa] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 bg-[#0f172a] rounded-2xl flex items-center justify-center mb-6">
        <ShoppingBag size={36} className="text-white" />
      </div>
      <h1 className="text-7xl font-bold text-[#0f172a] font-[family-name:var(--font-geist)] mb-3">
        404
      </h1>
      <p className="text-xl font-semibold text-[#1b1b1d] mb-2 font-[family-name:var(--font-geist)]">
        Page not found
      </p>
      <p className="text-[#76777d] max-w-sm mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#0f172a] text-white font-semibold rounded-xl hover:bg-[#1e293b] transition-all font-[family-name:var(--font-geist)]"
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>
    </div>
  );
}
