// ─────────────────────────────────────────────────────────────────────────────
// JWT Token helpers
// NOTE: Currently using localStorage for simplicity.
// To migrate to HTTP-only cookies, replace these helpers with
// server-side cookie reads (e.g., via Next.js Route Handlers) and
// remove NEXT_PUBLIC_ exposure of the token.
// For middleware access, the token is also mirrored to a client cookie "auth-token".
// ─────────────────────────────────────────────────────────────────────────────

const TOKEN_KEY = "shophub_token";
const COOKIE_NAME = "auth-token";

function isClient(): boolean {
  return typeof window !== "undefined";
}

export function getToken(): string | null {
  if (!isClient()) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (!isClient()) return;
  localStorage.setItem(TOKEN_KEY, token);
  // Mirror to cookie so Next.js middleware (Edge) can read it
  document.cookie = `${COOKIE_NAME}=${token}; path=/; SameSite=Lax`;
}

export function removeToken(): void {
  if (!isClient()) return;
  localStorage.removeItem(TOKEN_KEY);
  // Clear the middleware cookie too
  document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export function getCookieToken(): string | null {
  if (!isClient()) return null;
  const match = document.cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

// Decode JWT payload WITHOUT verification (verification is the backend's job)
export function decodeToken(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || typeof decoded.exp !== "number") return true;
  return decoded.exp * 1000 < Date.now();
}
