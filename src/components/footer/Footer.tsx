import Link from "next/link";
import { ShoppingBag, Globe, MessageCircle, Camera, ShieldCheck } from "lucide-react";

const footerLinks = {
  Shop: [
    { label: "All Products", href: "/products" },
    { label: "Categories", href: "/categories" },
    { label: "New Arrivals", href: "/products?sort=newest" },
    { label: "Popular Deals", href: "/products?sort=popular" },
  ],
  Account: [
    { label: "My Profile", href: "/profile" },
    { label: "Order History", href: "/orders" },
    { label: "Shopping Cart", href: "/cart" },
    { label: "Account Settings", href: "/profile" },
  ],
  Support: [
    { label: "Help Center", href: "#" },
    { label: "Shipping Policy", href: "#" },
    { label: "30-Day Returns", href: "#" },
    { label: "Contact Us", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-primary text-white border-t border-white/10 mt-auto select-none">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand blurb + social icons */}
          <div className="lg:col-span-2 space-y-5">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-extrabold text-2xl font-display"
            >
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center border border-white/15">
                <ShoppingBag size={18} className="text-white" />
              </div>
              Shop<span className="text-mint">Hub</span>
            </Link>

            <p className="text-sm text-white/65 leading-relaxed max-w-sm">
              ShopHub provides a premium e-commerce experience with curated products, fast delivery, end-to-end buyer protection, and 24/7 dedicated support.
            </p>

            {/* Social media buttons */}
            <div className="flex items-center gap-3 pt-2">
              {[Globe, MessageCircle, Camera].map((Icon, i) => (
                <button
                  key={i}
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-secondary hover:scale-105 transition-all duration-200 border border-white/10"
                  aria-label="Social media link"
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Link columns (Shop, Support, About…) */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/40 font-display">
                {section}
              </h3>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-white/70 hover:text-mint transition-colors font-medium"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright + legal links */}
        <div className="border-t border-white/10 mt-14 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-mint" />
            <p>© {new Date().getFullYear()} ShopHub Inc. All rights reserved.</p>
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition-colors cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
