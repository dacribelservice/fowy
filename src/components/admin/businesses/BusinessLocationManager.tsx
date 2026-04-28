import React from "react";
import dynamic from "next/dynamic";
import { BusinessData } from "@/app/admin/negocios/[id]/page";

const DynamicLocationPicker = dynamic(
  () => import("@/components/admin/shared/LocationPicker"),
  { 
    ssr: false, 
    loading: () => (
      <div className="h-[300px] w-full rounded-[24px] bg-slate-50 animate-pulse flex items-center justify-center text-slate-400 font-bold text-xs uppercase tracking-widest border-2 border-slate-100">
        Cargando Mapa...
      </div>
    ) 
  }
);

interface Props {
  business: BusinessData;
  onChange: (updates: Partial<BusinessData>) => void;
}

export function BusinessLocationManager({ business, onChange }: Props) {
  return (
    <div className="md:col-span-2 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ubicación Geográfica</label>
      </div>
      <DynamicLocationPicker
        initialCity={business.city}
        initialCountry={business.country}
        initialLat={business.latitude || undefined}
        initialLng={business.longitude || undefined}
        onLocationChange={(data) => {
          onChange({
            city: data.city,
            country: data.country,
            latitude: data.lat,
            longitude: data.lng
          });
        }}
      />
    </div>
  );
}
