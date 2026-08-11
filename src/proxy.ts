import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes: require authentication
const PROTECTED_PREFIXES = ["/profile", "/cart", "/checkout", "/orders"];
// Admin routes: require ADMIN role (checked client-side too in the layout)
const ADMIN_PREFIXES = ["/admin"];
// Auth routes: redirect to home if already logged in
const AUTH_ROUTES = ["/login", "/register"];

// Cookie name mirrored from src/lib/auth.ts
const COOKIE_NAME = "auth-token";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // Redirect authenticated users away from login/register
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r)) && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect unauthenticated users away from protected routes
  const isProtected =
    PROTECTED_PREFIXES.some((r) => pathname.startsWith(r)) ||
    ADMIN_PREFIXES.some((r) => pathname.startsWith(r));

  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
