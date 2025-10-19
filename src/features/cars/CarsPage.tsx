import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../lib/api";
import CarCard from "./CarCard";

export function CarsPage(){
  const { data, isLoading, error } = useQuery({ queryKey:["cars"], queryFn:()=>apiGet<any[]>("/cars.json") });
  return (
    <section className="container py-6">
      <h1 className="text-2xl font-bold mb-4">Alquiler de autos</h1>
      <div className="grid gap-3">
        {isLoading && Array.from({length:4}).map((_,i)=><div key={i} className="card h-[120px] animate-pulse"/>)}
        {error && <div className="card p-4 text-red-600">No pudimos cargar autos</div>}
        {data?.map(c => <CarCard key={c.id} c={c}/>)}
      </div>
    </section>
  );
}
