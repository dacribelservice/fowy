"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, HelpCircle, Edit } from 'lucide-react';
import Autocomplete from "@/components/admin/shared/Autocomplete";
import citiesList from "../../../../public/colombia.json";

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

// Clean and normalize strings for fuzzy matching
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .trim();
}

// Fuzzy matching translation logic
function findStandardCity(osmCity: string, osmState: string): string | null {
  if (!osmCity) return null;
  
  const normCity = normalizeString(osmCity);
  const normState = osmState ? normalizeString(osmState) : "";
  
  // Clean prefixes commonly returned by OSM
  const cityCleaned = normCity
    .replace(/^santiago de /, "")
    .replace(/^san jose de /, "")
    .replace(/^san juan de /, "")
    .replace(/^santa cruz de /, "")
    .trim();

  // 1. Try exact match on cleaned name and department check
  let bestMatch = citiesList.find(c => {
    const parts = c.split(", ");
    const cName = normalizeString(parts[0]);
    const cState = normalizeString(parts[1]);
    return cName === cityCleaned && (!normState || cState.includes(normState) || normState.includes(cState));
  });

  if (bestMatch) return bestMatch;

  // 2. Try looser check (match city name anywhere)
  bestMatch = citiesList.find(c => {
    const parts = c.split(", ");
    const cName = normalizeString(parts[0]);
    return cName.includes(cityCleaned) || cityCleaned.includes(cName);
  });

  return bestMatch || null;
}

function LocationMarker({ position, setPosition, onLocationChange, onLocationError }: any) {
  const map = useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`);
        if (!res.ok) throw new Error("Nominatim fetch failed");
        
        const data = await res.json();
        const address = data.address || {};
        
        const city = address.city || address.town || address.village || address.county || address.state_district || address.state || '';
        const state = address.state || '';
        const country = address.country || '';
        
        onLocationChange(city, state, country, lat, lng);
      } catch (error) {
        console.error("Error reverse geocoding:", error);
        onLocationError(lat, lng);
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

const HOT_RELOAD_KEY = Math.random().toString(36).substring(7);

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

  const [cityValue, setCityValue] = useState(initialCity || "");
  const [countryValue, setCountryValue] = useState(initialCountry || "");
  const [isManualMode, setIsManualMode] = useState(!initialCity); // If city is empty/null, start in manual mode

  const defaultCenter: [number, number] = [4.624335, -74.063644]; // Bogotá center fallback
  const center = position || defaultCenter;

  const handleLocationChange = (rawCity: string, rawState: string, rawCountry: string, lat: number, lng: number) => {
    const standardCity = findStandardCity(rawCity, rawState);
    
    if (standardCity) {
      setCityValue(standardCity);
      setCountryValue("Colombia");
      setIsManualMode(false);
      onLocationChange({ city: standardCity, country: "Colombia", lat, lng });
    } else {
      // If fuzzy match fails, let the user select manually
      setCityValue("");
      setCountryValue("Colombia");
      setIsManualMode(true);
      onLocationChange({ city: "", country: "Colombia", lat, lng });
    }
  };

  const handleLocationError = (lat: number, lng: number) => {
    setIsManualMode(true);
    setCityValue("");
    onLocationChange({ city: "", country: "Colombia", lat, lng });
  };

  const handleManualCitySelect = (selectedCity: string) => {
    setCityValue(selectedCity);
    setCountryValue("Colombia");
    const [currentLat, currentLng] = position || defaultCenter;
    onLocationChange({ city: selectedCity, country: "Colombia", lat: currentLat, lng: currentLng });
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <MapPin className="text-fowy-orange" size={20} />
          <div>
            <h4 className="text-sm font-black text-slate-800 tracking-tight">Ubicación del Negocio</h4>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Haz clic en el mapa para fijar el punto exacto</p>
          </div>
        </div>
        {!isManualMode && cityValue && (
          <button
            type="button"
            onClick={() => setIsManualMode(true)}
            className="flex items-center gap-1 text-[9px] font-black text-fowy-orange uppercase tracking-wider hover:underline"
          >
            <Edit size={10} /> Corregir Ciudad
          </button>
        )}
      </div>
      
      <div className="h-[300px] w-full rounded-[24px] overflow-hidden border-2 border-slate-100 shadow-inner relative z-0">
        <MapContainer key={HOT_RELOAD_KEY} center={center} zoom={position ? 15 : 6} scrollWheelZoom={true} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker 
            position={position} 
            setPosition={setPosition} 
            onLocationChange={handleLocationChange} 
            onLocationError={handleLocationError}
          />
        </MapContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Ciudad Input/Dropdown */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
            Ciudad
            {isManualMode && (
              <span className="text-[8px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-black uppercase">
                Selección Manual
              </span>
            )}
          </label>
          
          {isManualMode ? (
            <Autocomplete
              value={cityValue}
              onChange={handleManualCitySelect}
              options={citiesList}
              placeholder="Escribe para buscar tu ciudad..."
            />
          ) : (
            <div className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-700 outline-none truncate flex items-center justify-between">
              <span>{cityValue || "Haz clic en el mapa..."}</span>
              {!cityValue && <HelpCircle size={14} className="text-slate-300 animate-pulse" />}
            </div>
          )}
        </div>

        {/* País Input */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">País</label>
          <div className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-700 outline-none truncate">
            {countryValue || "Colombia"}
          </div>
        </div>
      </div>
    </div>
  );
}
