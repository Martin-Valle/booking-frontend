import { useState } from "react";

type Props = {
  value: { adults: number; rooms: number };
  onChange: (v: { adults: number; rooms: number }) => void;
};

export default function GuestsPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const { adults, rooms } = value;

  const pill = `${adults} adulto${adults !== 1 ? "s" : ""} · ${rooms} habitación${rooms !== 1 ? "es" : ""}`;

  const adjust = (field: "adults" | "rooms", delta: number) => {
    const next = Math.max(1, (field === "adults" ? adults : rooms) + delta);
    onChange(field === "adults" ? { adults: next, rooms } : { adults, rooms: next });
  };

  return (
    <div className="relative">
      <button type="button" className="input min-w-[220px] justify-start" onClick={() => setOpen(v => !v)}>
        {pill}
      </button>

      {open && (
        <div className="absolute left-0 mt-2 z-50 rounded-2xl bg-white shadow-card border border-slate-200 p-3 w-[260px]">
          <Row label="Adultos">
            <Counter value={adults} onDec={() => adjust("adults", -1)} onInc={() => adjust("adults", +1)} />
          </Row>
          <Row label="Habitaciones">
            <Counter value={rooms} onDec={() => adjust("rooms", -1)} onInc={() => adjust("rooms", +1)} />
          </Row>
          <div className="flex justify-end pt-2">
            <button className="btn" onClick={() => setOpen(false)}>Listo</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span>{label}</span>
      {children}
    </div>
  );
}

function Counter({ value, onDec, onInc }: { value: number; onDec: () => void; onInc: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <button className="pill" onClick={onDec} aria-label="disminuir">−</button>
      <span className="w-6 text-center">{value}</span>
      <button className="pill" onClick={onInc} aria-label="aumentar">＋</button>
    </div>
  );
}
