export default function FlightCard({f}:{f:any}){
  return (
    <article className="card p-4 flex items-center justify-between">
      <div>
        <div className="font-semibold">{f.from} → {f.to}</div>
        <div className="text-slate-600 text-sm">{f.airline} • {f.time} • {f.stops===0 ? "Directo":"Con escalas"} • {f.duration}</div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-extrabold">${f.price}</div>
        <button className="btn mt-1">Seleccionar</button>
      </div>
    </article>
  );
}
