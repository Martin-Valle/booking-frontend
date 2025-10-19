import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function DateRange({onChange}:{onChange:(from:Date,to:Date)=>void}){
  const [range, setRange] = useState<{from?:Date;to?:Date}>({});
  return (
    <div className="card px-3">
      <DayPicker
        mode="range"
        selected={range}
        onSelect={(r)=>{
          setRange(r || {});
          if(r?.from && r?.to) onChange(r.from, r.to);
        }}
      />
    </div>
  );
}
