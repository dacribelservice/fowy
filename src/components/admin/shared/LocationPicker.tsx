"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface LocationPickerProps {
  initialCity: string;
  initialCountry: string;
  initialLat?: number;
  initialLng?: number;
  onLocationChange: (data: { city: string; country: string; lat: number; lng: number }) => void;
}

function LocationMarker({ position, setPosition, onLocationChange, isLocating }: any) {
  const map = useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`);
        const data = await res.json();
        const address = data.address || {};
        
        // Priority for city representation
        const city = address.city || address.town || address.village || address.county || address.state_district || address.state || '';
        const country = address.country || '';
        
        onLocationChange({ city, country, lat, lng });
      } catch (error) {
        console.error("Error reverse geocoding:", error);
      }
    },
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position} />
  );
}

export default function LocationPicker({
  initialCity,
  initialCountry,
  initialLat,
  initialLng,
  onLocationChange
}: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(
    initialLat && initialLng ? [initialLat, initialLng] : null
  );

  const defaultCenter: [number, number] = [4.5709, -74.2973]; // Default Colombia
  const center = position || defaultCenter;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="text-fowy-orange" size={20} />
        <div>
          <h4 className="text-sm font-black text-slate-800 tracking-tight">Ubicación del Negocio</h4>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Haz clic en el mapa para fijar el punto exacto</p>
        </div>
      </div>
      
      <div className="h-[300px] w-full rounded-[24px] overflow-hidden border-2 border-slate-100 shadow-inner relative z-0">
        <MapContainer center={center} zoom={position ? 15 : 6} scrollWheelZoom={true} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} onLocationChange={onLocationChange} />
        </MapContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ciudad</label>
          <div className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-700 outline-none truncate">
            {initialCity || "No definida"}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">País</label>
          <div className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-700 outline-none truncate">
            {initialCountry || "No definido"}
          </div>
        </div>
      </div>
    </div>
  );
}
