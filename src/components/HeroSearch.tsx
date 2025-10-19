import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import DateRange from "./DateRange";

const schema = z.object({
  city: z.string().min(2, "Escribe una ciudad"),
  dateFrom: z.date(),
  dateTo: z.date(),
  guests: z.number().min(1).max(10)
});
type Form = z.infer<typeof schema>;

export default function HeroSearch(){
  const nav = useNavigate();
  const { register, handleSubmit, setValue, formState:{errors} } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues:{ city:"Quito", guests:2, dateFrom:new Date(), dateTo:new Date(Date.now()+86400000)}
  });

  return (
    <form
      onSubmit={handleSubmit(v => {
        const qs = new URLSearchParams({
          q: v.city,
          from: v.dateFrom.toISOString(),
          to: v.dateTo.toISOString(),
          guests: String(v.guests)
        }).toString();
        nav(`/hotels?${qs}`);
      })}
      className="card p-4 md:p-5 flex flex-col md:flex-row gap-3"
    >
      <input className="input" placeholder="Ciudad o destino" {...register("city")} />
      <DateRange
        onChange={(f,t)=>{ setValue("dateFrom", f); setValue("dateTo", t); }}
      />
      <input type="number" className="input" min={1} max={10} {...register("guests",{valueAsNumber:true})}/>
      <button className="btn w-full md:w-auto">Buscar</button>
    </form>
  );
}
