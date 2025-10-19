// src/features/hotels/filters.ts
export type SortKey = "price-asc" | "price-desc" | "rating-desc";

import type { DateRange } from "react-day-picker";
import { totalHotelPrice } from "./utils";

export type Hotel = {
  id: string | number;
  name: string;
  city: string;
  price: number;          // precio por noche
  rating: number;         // 0..10
  breakfastIncluded?: boolean;
  freeCancel?: boolean;
  // Si tu JSON no trae fechas, puedes omitir estos dos campos
  availableFrom?: string; // "2025-10-01"
  availableTo?: string;   // "2025-12-31"
  // Capacidad (si tu JSON no lo tiene, ignora esta parte)
  maxGuestsPerRoom?: number; // ej. 2
};

export type HotelFilters = {
  q: string;
  min: number;
  max: number;
  rating: number;
  breakfast: boolean;
  cancel: boolean;
  range?: DateRange;
  adults?: number;
  rooms?: number;
  sort?: "price-asc" | "price-desc" | "rating-desc";
};

export function applyHotelFilters(list: Hotel[], f: HotelFilters): Hotel[] {
  const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

  let out = list.filter((h) => {
    // Ciudad / destino
    if (f.q && !norm(h.city || "").includes(norm(f.q))) return false;

    // Rango de precio
    if (typeof h.price === "number") {
      if (h.price < f.min || h.price > f.max) return false;
    }

    // Rating mínimo
    if (typeof h.rating === "number" && h.rating < f.rating) return false;

    // Desayuno incluido
    if (f.breakfast && !h.breakfastIncluded) return false;

    // Cancelación gratis
    if (f.cancel && !h.freeCancel) return false;

    // Fechas (si están presentes en datos)
    if (f.range?.from && f.range?.to && (h.availableFrom || h.availableTo)) {
      const from = new Date(f.range.from);
      const to   = new Date(f.range.to);
      const avFrom = h.availableFrom ? new Date(h.availableFrom) : null;
      const avTo   = h.availableTo   ? new Date(h.availableTo)   : null;

      if (avFrom && from < avFrom) return false;
      if (avTo   && to   > avTo)   return false;
    }

    // Capacidad por habitaciones (si tienes estos datos)
    if (f.adults && f.rooms && h.maxGuestsPerRoom) {
      const capacity = h.maxGuestsPerRoom * f.rooms;
      if (f.adults > capacity) return false;
    }

    return true;
  });

  // Orden
  switch (f.sort) {
    case "price-asc":
      out = out.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      break;
    case "price-desc":
      out = out.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      break;
    case "rating-desc":
      out = out.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      break;
  }

  return out;
}
export function sortHotels(list: Hotel[], sort: SortKey, range?: DateRange, rooms = 1) {
  const clone = [...list];
  if (sort === "rating-desc") {
    return clone.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }
  if (sort === "price-asc") {
    return clone.sort((a, b) => totalHotelPrice(a, range, rooms) - totalHotelPrice(b, range, rooms));
  }
  // price-desc
  return clone.sort((a, b) => totalHotelPrice(b, range, rooms) - totalHotelPrice(a, range, rooms));
}