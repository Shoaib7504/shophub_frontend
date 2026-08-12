// JWT helpers.
// We keep the token in localStorage, and also put a copy in a cookie so the
// proxy (Next.js middleware) can read it server-side.

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
  // Also save it to a cookie so the proxy can see it
  document.cookie = `${COOKIE_NAME}=${token}; path=/; SameSite=Lax`;
}

export function removeToken(): void {
  if (!isClient()) return;
  localStorage.removeItem(TOKEN_KEY);
  // Remove the cookie too
  document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export function getCookieToken(): string | null {
  if (!isClient()) return null;
  const match = document.cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

// Decode the token payload without checking the signature. The server does that.
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
