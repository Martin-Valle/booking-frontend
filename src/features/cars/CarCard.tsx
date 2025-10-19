export default function CarCard({c}:{c:any}){
  return (
    <article className="card p-4 grid md:grid-cols-[180px_1fr_auto] gap-4">
      <img src={c.img} className="w-full h-[120px] object-cover rounded-xl" />
      <div>
        <h3 className="font-semibold">{c.brand} {c.model}</h3>
        <div className="text-slate-600 text-sm">{c.seats} asientos • {c.bags} maletas</div>
        <div className="pill mt-2">{c.policy}</div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-extrabold">${c.price}/día</div>
        <button className="btn mt-1">Elegir</button>
      </div>
    </article>
  );
}
