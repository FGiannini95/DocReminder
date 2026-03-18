// Unified API base configuration for both development and production.
// In production, calls go through Nginx proxy at `/api`.
// In development, auto-detects if accessing via network IP for mobile testing

const getApiBase = (): string => {
  // If accessing via network IP (mobile testing), use network IP for API too
  if (typeof window !== "undefined" && window.location.hostname === "192.168.0.43") {
    return "http://192.168.0.43:3000";
  }

  // Otherwise use env variable (localhost for dev, /api for prod)
  return import.meta.env.VITE_API_BASE || "";
};

export const API_BASE = getApiBase();
export const AUTH_URL = `${API_BASE}/auth`;
export const DOC_URL = `${API_BASE}/docs`;
