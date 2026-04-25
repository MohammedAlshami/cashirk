/**
 * Backend API base URL (NestJS server). Set VITE_API_URL in .env.local. No trailing slash.
 */
export function getBackendUrl(): string {
  const url =
    (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_URL) ||
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) ||
    "http://localhost:8082";
  return String(url).replace(/\/$/, "");
}

/** Mapbox access token (Vite: VITE_MAPBOX_TOKEN, Next: NEXT_PUBLIC_MAPBOX_TOKEN). */
export function getMapboxToken(): string {
  const token =
    (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_MAPBOX_TOKEN) ||
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_MAPBOX_TOKEN) ||
    "";
  return String(token || "").trim();
}
