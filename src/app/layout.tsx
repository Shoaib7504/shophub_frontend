import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ShopHub — Premium E-Commerce",
    template: "%s | ShopHub",
  },
  description:
    "Discover premium products with fast delivery, secure shopping, and an exceptional experience.",
  keywords: ["e-commerce", "shopping", "premium", "products"],
  openGraph: {
    title: "ShopHub — Premium E-Commerce",
    description: "Discover premium products with fast delivery and secure shopping.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fcf8fa]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
