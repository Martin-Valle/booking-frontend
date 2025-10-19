import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../lib/api";
import HotelCard from "./HotelCard";
import type { Hotel, HotelFilters } from "./filters";
import { applyHotelFilters } from "./filters";

import SearchBar from "./SearchBar";
import type { DateRange } from "react-day-picker";
import { format, startOfDay } from "date-fns";

/* ---------- helpers de precio total ---------- */
function countNights(range?: DateRange) {
  if (!range?.from || !range?.to) return 1;
  const from = startOfDay(range.from).getTime();
  const to = startOfDay(range.to).getTime();
  const diff = Math.max(1, Math.round((to - from) / 86_400_000)); // ms por día
  return diff;
}

// Asumo h.price = precio por noche por habitación
function totalHotelPrice(h: Hotel, range?: DateRange, rooms = 1) {
  return Math.max(1, rooms) * countNights(range) * (h.price ?? 0);
}

/* ---------- ordenar usando precio total cuando toca ---------- */
type SortKey = HotelFilters["sort"]; // "price-asc" | "price-desc" | "rating-desc" | "rating-asc"

function sortHotels(list: Hotel[], sort: SortKey, range?: DateRange, rooms = 1) {
  const byTotalAsc = (a: Hotel, b: Hotel) =>
    totalHotelPrice(a, range, rooms) - totalHotelPrice(b, range, rooms);

  const byRatingAsc = (a: Hotel, b: Hotel) => (a.rating ?? 0) - (b.rating ?? 0);

  switch (sort) {
    case "price-asc":
      return [...list].sort(byTotalAsc);
    case "price-desc":
      return [...list].sort((a, b) => byTotalAsc(b, a));
    case "rating-desc":
      return [...list].sort((a, b) => byRatingAsc(b, a));
    case "rating-asc":
      return [...list].sort(byRatingAsc);
    default:
      return list;
  }
}

export function HotelsPage() {
  const [sp, setSp] = useSearchParams();

  // URL → estado inicial
  const initialQ = sp.get("q") ?? "";
  const initialFrom = sp.get("checkin");
  const initialTo = sp.get("checkout");
  const initialAdults = Number(sp.get("adults") ?? 2);
  const initialRooms = Number(sp.get("rooms") ?? 1);
  const initialSort = (sp.get("sort") as SortKey) ?? "price-asc";

  const initialRange: DateRange | undefined =
    initialFrom && initialTo ? { from: new Date(initialFrom), to: new Date(initialTo) } : undefined;

  // Datos
  const { data, isLoading, error } = useQuery({
    queryKey: ["hotels"],
    queryFn: () => apiGet<Hotel[]>("/hotels.json"),
  });

  // Filtros columna + barra
  const [filters, setFilters] = useState<HotelFilters>({
    q: initialQ,
    min: 0,
    max: 2000,
    rating: 0,
    breakfast: false,
    cancel: false,
    range: initialRange,
    adults: initialAdults,
    rooms: initialRooms,
    sort: initialSort,
  });

  // Reaccionar a cambios de URL (back/forward) y mantener sync
  useEffect(() => {
    const urlRange =
      initialFrom && initialTo ? { from: new Date(initialFrom), to: new Date(initialTo) } : undefined;

    setFilters((s) => ({
      ...s,
      q: initialQ,
      range: urlRange,
      adults: initialAdults,
      rooms: initialRooms,
      sort: initialSort,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQ, initialFrom, initialTo, initialAdults, initialRooms, initialSort]);

  // 1) filtrar
  const filtered = useMemo(() => applyHotelFilters(data || [], filters), [data, filters]);

  // 2) ordenar (precio total si aplica)
  const sorted = useMemo(
    () => sortHotels(filtered, filters.sort, filters.range, filters.rooms ?? 1),
    [filtered, filters.sort, filters.range, filters.rooms]
  );

  // SearchBar → estado + URL
  function handleSearch({
    destination,
    range,
    guests,
  }: {
    destination: string;
    range: DateRange | undefined;
    guests: { adults: number; rooms: number };
  }) {
    const next: HotelFilters = {
      ...filters,
      q: destination,
      range,
      adults: guests.adults,
      rooms: guests.rooms,
    };
    setFilters(next);

    const params: Record<string, string> = {};
    if (next.q) params.q = next.q;
    if (next.range?.from) params.checkin = format(next.range.from, "yyyy-MM-dd");
    if (next.range?.to) params.checkout = format(next.range.to, "yyyy-MM-dd");
    params.adults = String(next.adults ?? 2);
    params.rooms = String(next.rooms ?? 1);
    if (next.sort) params.sort = next.sort;
    setSp(params, { replace: true });
  }

  // Cambiar el select de orden → actualiza estado y URL
  function changeSort(next: SortKey) {
    setFilters((s) => ({ ...s, sort: next }));
    const params: Record<string, string> = {};
    if (filters.q) params.q = filters.q;
    if (filters.range?.from) params.checkin = format(filters.range.from, "yyyy-MM-dd");
    if (filters.range?.to) params.checkout = format(filters.range.to, "yyyy-MM-dd");
    params.adults = String(filters.adults ?? 2);
    params.rooms = String(filters.rooms ?? 1);
    params.sort = next;
    setSp(params, { replace: true });
  }

  // Input “Ciudad” (lateral) → URL (debounced) manteniendo resto
  useEffect(() => {
    const t = setTimeout(() => {
      const params: Record<string, string> = {};
      if (filters.q) params.q = filters.q;
      if (filters.range?.from) params.checkin = format(filters.range.from, "yyyy-MM-dd");
      if (filters.range?.to) params.checkout = format(filters.range.to, "yyyy-MM-dd");
      params.adults = String(filters.adults ?? 2);
      params.rooms = String(filters.rooms ?? 1);
      if (filters.sort) params.sort = filters.sort;
      setSp(params, { replace: true });
    }, 300);
    return () => clearTimeout(t);
  }, [filters.q, filters.range?.from, filters.range?.to, filters.adults, filters.rooms, filters.sort, setSp]);

  const nights = countNights(filters.range);
  const rooms = filters.rooms ?? 1;

  return (
    <section className="container py-6 space-y-6">
      {/* SearchBar sticky (opcional, ya lo tienes) */}
      <div className="sticky top-16 z-30 bg-white/70 backdrop-blur border-b border-slate-200 py-2">
        <SearchBar
          initialDestination={filters.q}
          initialRange={filters.range}
          initialGuests={{ adults: filters.adults ?? 2, rooms }}
          onSearch={handleSearch}
        />
      </div>

      {/* Chips de filtros activos */}
      <div className="flex flex-wrap gap-2">
        {filters.q && (
          <button className="pill" onClick={() => setFilters((s) => ({ ...s, q: "" }))}>
            {filters.q} ✕
          </button>
        )}
        {filters.breakfast && (
          <button className="pill" onClick={() => setFilters((s) => ({ ...s, breakfast: false }))}>
            Desayuno ✕
          </button>
        )}
        {filters.cancel && (
          <button className="pill" onClick={() => setFilters((s) => ({ ...s, cancel: false }))}>
            Cancelación ✕
          </button>
        )}
        {filters.rating > 0 && (
          <button className="pill" onClick={() => setFilters((s) => ({ ...s, rating: 0 }))}>
            ≥ {filters.rating}/10 ✕
          </button>
        )}
        {filters.range?.from && filters.range?.to && (
          <button className="pill" onClick={() => setFilters((s) => ({ ...s, range: undefined }))}>
            {format(filters.range.from, "dd/MM")}–{format(filters.range.to, "dd/MM")} ✕
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Filtros laterales */}
        <aside className="card p-4 space-y-3 h-fit">
          <h2 className="font-semibold">Filtros</h2>

          <input
            className="input"
            placeholder="Ciudad"
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              className="input"
              placeholder="Min $"
              value={filters.min}
              onChange={(e) => setFilters({ ...filters, min: Number(e.target.value) })}
            />
            <input
              type="number"
              className="input"
              placeholder="Max $"
              value={filters.max}
              onChange={(e) => setFilters({ ...filters, max: Number(e.target.value) })}
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.breakfast}
              onChange={(e) => setFilters({ ...filters, breakfast: e.target.checked })}
            />
            Desayuno incluido
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.cancel}
              onChange={(e) => setFilters({ ...filters, cancel: e.target.checked })}
            />
            Cancelación gratis
          </label>

          <label className="flex items-center gap-2">
            Rating mínimo
            <input
              type="number"
              min={0}
              max={10}
              className="input"
              value={filters.rating}
              onChange={(e) => setFilters({ ...filters, rating: Number(e.target.value) })}
            />
          </label>

          <div className="pt-2">
            <label className="text-sm block mb-1">Ordenar por</label>
            <select
              className="input"
              value={filters.sort}
              onChange={(e) => changeSort(e.target.value as SortKey)}
            >
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="rating-desc">Mejor puntuación</option>
              <option value="rating-asc">Peor puntuación</option>
            </select>
          </div>
        </aside>

        {/* Resultados */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-slate-600">
              {isLoading ? "Cargando…" : `${sorted.length} opciones encontradas`}
            </p>
          </div>

          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card h-[180px] animate-pulse" />
            ))}

          {error && <div className="card p-4 text-red-600">Error cargando hoteles</div>}

          {!isLoading &&
            sorted.map((h) => (
              <HotelCard
                key={h.id}
                h={h}
                total={totalHotelPrice(h, filters.range, rooms)}
                nights={nights}
                rooms={rooms}
              />
            ))}

          {!isLoading && sorted.length === 0 && (
            <div className="card p-6">No encontramos resultados con esos filtros.</div>
          )}
        </div>
      </div>
    </section>
  );
}
