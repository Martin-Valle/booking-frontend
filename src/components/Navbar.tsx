// src/components/Navbar.tsx
import { Link, NavLink, useLocation } from "react-router-dom";
import { Hotel, Plane, Car } from "lucide-react";

export default function Navbar() {
  const loc = useLocation();

  // "Alojamientos" activo en "/" y en cualquier ruta bajo /hotels
  const hotelsOn = loc.pathname === "/" || loc.pathname.startsWith("/hotels");

  const base = "px-3 py-2 rounded-full hover:bg-slate-100";
  const cls = (on: boolean) => (on ? `${base} bg-slate-200` : base);

  return (
    <header className="bg-white shadow-sm">
      <div className="container flex items-center gap-4 py-3">
        <Link to="/" className="text-xl font-bold text-brand">VoyNow</Link>

        <nav className="flex gap-1">
          {/* Apunta a "/" para que sea el predeterminado
              y márcalo activo también cuando estés en /hotels */}
          <NavLink to="/" end className={() => cls(hotelsOn)} aria-current={hotelsOn ? "page" : undefined}>
            <Hotel className="inline mr-1" size={18} /> Alojamientos
          </NavLink>

          <NavLink to="/flights" end className={({ isActive }) => cls(isActive)}>
            <Plane className="inline mr-1" size={18} /> Vuelos
          </NavLink>

          <NavLink to="/cars" end className={({ isActive }) => cls(isActive)}>
            <Car className="inline mr-1" size={18} /> Autos
          </NavLink>
        </nav>

        <div className="ml-auto flex gap-2">
          <button className="btn">Iniciar sesión</button>
        </div>
      </div>
    </header>
  );
}
