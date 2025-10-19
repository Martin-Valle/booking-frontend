// src/features/hotels/utils.ts
import { startOfDay } from "date-fns";
import type { DateRange } from "react-day-picker";
import type { Hotel } from "./filters";

export function countNights(range?: DateRange) {
  if (!range?.from || !range?.to) return 1;
  const from = startOfDay(range.from).getTime();
  const to   = startOfDay(range.to).getTime();
  const diff = Math.max(1, Math.round((to - from) / 86_400_000));
  return diff;
}

export function totalHotelPrice(h: Hotel, range?: DateRange, rooms = 1) {
  const nights = countNights(range);
  return Math.max(1, rooms) * nights * h.price; // asumiendo h.price = precio x noche x habitación
}
