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

// Custom Icon for Businesses
const createBusinessIcon = (color: string) => {
  return new L.DivIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 36px;
        height: 36px;
        border-radius: 8px;
        border: 2px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        margin-left: -18px;
        margin-top: -18px;
      ">
        <div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

interface Business {
  id: string;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  logo_url: string | null;
  color_identity: string | null;
  category_name?: string;
}

interface ExplorerMapProps {
  businesses: Business[];
  center?: [number, number];
}

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function ExplorerMap({ businesses, center }: ExplorerMapProps) {
  const defaultCenter: [number, number] = [4.5709, -74.2973]; // Colombia
  const mapCenter = center || (businesses.length > 0 ? [businesses[0].latitude, businesses[0].longitude] : defaultCenter);

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer 
        center={mapCenter as [number, number]} 
        zoom={businesses.length > 0 ? 13 : 6} 
        scrollWheelZoom={true} 
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {businesses.map((biz) => (
          <Marker 
            key={biz.id} 
            position={[biz.latitude, biz.longitude]} 
            icon={createBusinessIcon(biz.color_identity || "#FF5A5F")}
          >
            <Popup className="premium-popup">
              <div className="w-64 p-2">
                <div className="flex gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                    <img src={biz.logo_url || "/placeholder-business.png"} alt={biz.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{biz.category_name}</span>
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

        <ChangeView center={mapCenter as [number, number]} zoom={businesses.length > 0 ? 13 : 6} />
      </MapContainer>

      {/* Floating Action Buttons */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-[1000]">
        <button 
          onClick={() => {
            if ("geolocation" in navigator) {
              navigator.geolocation.getCurrentPosition((pos) => {
                // This would need a way to pass back to parent or use map instance
              });
            }
          }}
          className="px-6 py-3 bg-white text-slate-900 rounded-full border border-slate-200 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
        >
          <Navigation size={16} className="text-slate-900" />
          Mi Ubicación
        </button>
      </div>
    </div>
  );
}
