export const API_BASE = import.meta.env.VITE_API_URL ?? "";

export async function apiGet<T>(path: string): Promise<T> {
  // Si hay API real, usa fetch(API_BASE + path)
  // Para demo, lee de /public/data
  const url = path.startsWith("/data") ? path : `/data${path}`;
  const res = await fetch(url);
  if(!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}
