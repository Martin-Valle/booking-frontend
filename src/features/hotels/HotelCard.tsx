import type { Hotel } from "./filters";

type Props = {
  h: Hotel;
  total?: number;   // total calculado (opcional)
  nights?: number;  // noches (para leyenda)
  rooms?: number;   // habitaciones (para leyenda)
};

export default function HotelCard({ h, total, nights = 1, rooms = 1 }: Props) {
  const city = h.city ?? "";
  const km = h.distanceCenterKm ?? h.distanceKm ?? h.distance ?? null;

  return (
    <article className="card overflow-hidden">
      <div className="grid md:grid-cols-[220px_1fr_auto] gap-4">
        <img
          src={h.image}
          alt={h.name}
          className="w-full h-[180px] object-cover"
        />

        <div className="p-4">
          <h3 className="text-lg font-bold">{h.name}</h3>
          <div className="mt-1 text-slate-600">
            {city}
            {km != null && <> • {km} km del centro</>}
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {h.freeCancellation && <span className="pill">Cancelación gratis</span>}
            {h.breakfast && <span className="pill">Desayuno incluido</span>}
          </div>
        </div>

        <div className="p-4 flex flex-col items-end justify-between">
          <div className="text-right">
            {typeof total === "number" ? (
              <>
                <div className="text-2xl font-extrabold">
                  ${total.toLocaleString()}
                </div>
                <div className="text-slate-500 text-sm">
                  total por {nights} {nights === 1 ? "noche" : "noches"} · {rooms}{" "}
                  {rooms === 1 ? "habitación" : "habitaciones"}
                </div>
                <div className="text-slate-500 text-xs">
                  (${(h.price ?? 0).toLocaleString()}/noche · impuestos incluidos)
                </div>
              </>
            ) : (
              <>
                <div className="text-2xl font-extrabold">
                  ${(h.price ?? 0).toLocaleString()}
                </div>
                <div className="text-slate-500 text-sm">noche · impuestos incluidos</div>
              </>
            )}

            <button className="btn mt-2">Ver disponibilidad</button>
          </div>
        </div>
      </div>
    </article>
  );
}
