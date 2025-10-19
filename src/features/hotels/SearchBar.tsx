// ...imports arriba
import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import es from "date-fns/locale/es";

type Props = {
  initialDestination?: string;
  initialRange?: DateRange;
  initialGuests?: { adults: number; rooms: number }; // 👈 añade esto si aún no lo tienes
  onSearch: (p: {
    destination: string;
    range: DateRange | undefined;
    guests: { adults: number; rooms: number };      // 👈 y esto
  }) => void;
};

export default function SearchBar({
  initialDestination = "",
  initialRange,
  initialGuests = { adults: 2, rooms: 1 },
  onSearch,
}: Props) {
  const [destination, setDestination] = useState(initialDestination);
  const [range, setRange] = useState<DateRange | undefined>(initialRange);

  // 👇 estado de huéspedes + popovers
  const [guests, setGuests] = useState(initialGuests);
  const [openCal, setOpenCal] = useState(false);
  const [openGuests, setOpenGuests] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  // cerrar popovers al hacer click fuera
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setOpenCal(false);
        setOpenGuests(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const labelRange =
    range?.from && range?.to
      ? `${format(range.from, "MMM d", { locale: es })} — ${format(range.to, "MMM d", { locale: es })}`
      : "Fecha de entrada — Fecha de salida";

  const labelGuests =
    `${guests.adults} ${guests.adults === 1 ? "adulto" : "adultos"} · ` +
    `${guests.rooms} ${guests.rooms === 1 ? "habitación" : "habitaciones"}`;

  // pequeño control para sumar/restar
  function Qty({
    value,
    onChange,
    min = 1,
  }: { value: number; onChange: (n: number) => void; min?: number }) {
    return (
      <div className="inline-flex items-center gap-2">
        <button
          type="button"
          className="pill px-2"
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          −
        </button>
        <span className="w-6 text-center">{value}</span>
        <button
          type="button"
          className="pill px-2"
          onClick={() => onChange(value + 1)}
        >
          +
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <div className="w-full rounded-2xl bg-white shadow-card border border-slate-200 p-2 flex items-stretch gap-2">
        {/* Destino */}
        <input
          className="flex-1 input rounded-xl"
          placeholder="¿A dónde vas?"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch({ destination, range, guests });
          }}
        />

        {/* Fechas */}
        <button
          type="button"
          className="input min-w-[240px] justify-start"
          onClick={() => {
            setOpenCal((v) => !v);
            setOpenGuests(false);
          }}
        >
          {labelRange}
        </button>

        {/* Huéspedes – SIN header duplicado, abre directo los contadores */}
        <div className="relative">
          <button
            type="button"
            className="input min-w-[240px] justify-start"
            onClick={() => {
              setOpenGuests((v) => !v);
              setOpenCal(false);
            }}
          >
            {labelGuests}
          </button>

          {openGuests && (
            <div className="absolute right-0 mt-2 z-50 rounded-2xl bg-white shadow-card border border-slate-200 p-3 w-[280px]">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Adultos</span>
                <Qty
                  value={guests.adults}
                  onChange={(n) => setGuests((g) => ({ ...g, adults: n }))}
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Habitaciones</span>
                <Qty
                  value={guests.rooms}
                  onChange={(n) => setGuests((g) => ({ ...g, rooms: n }))}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  className="pill"
                  onClick={() => setGuests({ adults: 2, rooms: 1 })}
                >
                  Reset
                </button>
                <button className="btn" onClick={() => setOpenGuests(false)}>
                  Listo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Buscar */}
        <button
          className="btn px-6"
          onClick={() => onSearch({ destination, range, guests })}
        >
          Buscar
        </button>
      </div>

      {/* Popover calendario */}
      {openCal && (
        <div className="absolute left-0 mt-2 z-50 rounded-2xl bg-white shadow-card border border-slate-200 p-3">
          <DayPicker
            mode="range"
            numberOfMonths={2}
            locale={es}
            selected={range}
            onSelect={setRange}
            pagedNavigation
            weekStartsOn={1}
            showOutsideDays
          />
          <div className="flex justify-end gap-2 px-1 pb-1">
            <button className="pill" onClick={() => setRange(undefined)}>
              Limpiar
            </button>
            <button className="btn" onClick={() => setOpenCal(false)}>
              Listo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
