"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation, ChevronRight, Star } from 'lucide-react';
import Link from 'next/link';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface ExplorerMapProps {
  businesses: any[];
  center?: [number, number];
  onSelectBusiness?: (biz: any) => void;
}

export default function ExplorerMap({ businesses, center, onSelectBusiness }: ExplorerMapProps) {
  const defaultCenter: [number, number] = [4.5709, -74.2973]; // Colombia
  const mapCenter = center || (businesses.length > 0 ? [businesses[0].latitude, businesses[0].longitude] : defaultCenter);

  return (
    <div className="h-full w-full relative z-0 grayscale-[0.8] contrast-[1.2]">
      <MapContainer 
        center={mapCenter as [number, number]} 
        zoom={center ? 17 : (businesses.length > 0 ? 16 : 14)} 
        scrollWheelZoom={true} 
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* User Location Marker (Blue Dot) */}
        {center && (
          <Marker 
            position={center} 
            icon={L.divIcon({
              className: 'user-location-marker',
              html: `
                <div class="relative flex items-center justify-center">
                  <div class="absolute w-8 h-8 bg-blue-500/20 rounded-full animate-ping"></div>
                  <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md"></div>
                </div>
              `,
              iconSize: [32, 32],
              iconAnchor: [16, 16],
            })}
          />
        )}
        
        {businesses.map((biz) => (
          <Marker 
            key={biz.id} 
            position={[biz.latitude, biz.longitude]} 
            eventHandlers={{
              click: () => onSelectBusiness?.(biz)
            }}
            icon={L.divIcon({
              className: 'custom-business-marker',
              html: `
                <div class="flex items-center gap-2 group">
                  <div style="background-color: ${biz.color_identity || '#FF5A5F'}" class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white transition-transform group-hover:scale-110">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                  </div>
                  <span style="color: ${biz.color_identity || '#FF5A5F'}" class="text-[11px] font-black whitespace-nowrap bg-white/40 backdrop-blur-[2px] px-2 py-0.5 rounded-full">
                    ${biz.name}
                  </span>
                </div>
              `,
              iconSize: [120, 40],
              iconAnchor: [16, 16],
            })}
          >
            <Popup className="premium-popup">
              <div className="w-64 p-2">
                <div className="flex gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                    <img src={biz.logo_url || "/placeholder-business.png"} alt={biz.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{biz.categories?.name}</span>
                      <div className="flex items-center gap-0.5">
                        <Star size={8} className="fill-amber-400 text-amber-400" />
                        <span className="text-[8px] font-black">4.9</span>
                      </div>
                    </div>
                    <h4 className="text-sm font-black text-slate-800 leading-tight truncate">{biz.name}</h4>
                  </div>
                </div>
                
                <Link 
                  href={`/${biz.slug}`}
                  className="w-full py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                >
                  Ver Menú
                  <ChevronRight size={12} />
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}

        <ChangeView center={mapCenter as [number, number]} zoom={center ? 17 : (businesses.length > 0 ? 16 : 14)} />
      </MapContainer>
    </div>
  );
}
