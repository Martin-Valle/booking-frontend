import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../lib/api";
import FlightCard from "./FlightCard";

export function FlightsPage(){
  const { data, isLoading, error } = useQuery({ queryKey:["flights"], queryFn:()=>apiGet<any[]>("/flights.json") });
  return (
    <section className="container py-6">
      <h1 className="text-2xl font-bold mb-4">Vuelos</h1>
      <div className="grid gap-3">
        {isLoading && Array.from({length:4}).map((_,i)=><div key={i} className="card h-[80px] animate-pulse"/>)}
        {error && <div className="card p-4 text-red-600">No pudimos cargar vuelos</div>}
        {data?.map(f => <FlightCard key={f.id} f={f}/>)}
      </div>
    </section>
  );
}
