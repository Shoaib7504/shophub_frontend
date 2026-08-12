import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Pages that need you to be logged in
const PROTECTED_PREFIXES = ["/profile", "/cart", "/checkout", "/orders"];
// Admin pages. The role check runs again in the admin layout.
const ADMIN_PREFIXES = ["/admin"];
// Visiting these while logged in just sends you home
const AUTH_ROUTES = ["/login", "/register"];

// Same cookie name as the one set in src/lib/auth.ts
const COOKIE_NAME = "auth-token";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // Logged in? Skip the login/register page
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r)) && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Not logged in? Send them to the login page
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
