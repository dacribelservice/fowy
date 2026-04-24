'use client'

import { useEffect, useState, memo, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import Image from 'next/image'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// --- COMPONENTE DE CONTROL DE VISTA ---
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap()
  useEffect(() => {
    if (map) {
      try {
        const timeout = setTimeout(() => {
          if (map && (map as any)._container) {
            map.setView(center, zoom, { animate: true })
            map.invalidateSize()
          }
        }, 50)
        return () => clearTimeout(timeout)
      } catch (e) {
        console.warn("Leaflet sync error suppressed:", e)
      }
    }
  }, [center, zoom, map])
  return null
}

interface Business {
  id: number;
  name: string;
  lat: number;
  lng: number;
  zone: string;
  logo?: string;
  rate?: string;
  status?: string;
  category?: string;
}

interface MapViewerProps {
  center?: [number, number]
  zoom?: number
  userLocation?: [number, number] | null
  businesses?: Business[]
}

const MapViewer = memo(function MapViewer({ 
  center = [3.4516, -76.5320], 
  zoom = 13, 
  userLocation = null,
  businesses = []
}: MapViewerProps) {
  const [isMounted, setIsMounted] = useState(false)

  // --- ICONOS SEGUROS PARA SSR ---
  // Los creamos dentro del componente para evitar errores de construcción en Vercel
  const icons = useMemo(() => {
    if (typeof window === 'undefined') return null;
    
    return {
      solar: L.divIcon({
        className: 'custom-solar-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-8 h-8 bg-red-500/20 rounded-full animate-ping"></div>
            <div class="relative w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-lg"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      }),
      user: L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-8 h-8 bg-blue-500/20 rounded-full animate-pulse"></div>
            <div class="relative w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })
    }
  }, [])

  useEffect(() => {
    setIsMounted(true)
    if (typeof window !== 'undefined') {
       delete (L.Icon.Default.prototype as any)._getIconUrl;
       L.Icon.Default.mergeOptions({
         iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
         iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
         shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
       });
    }
  }, [])

  if (!isMounted || !icons) return <div className="w-full h-full bg-slate-50 animate-pulse" />;

  return (
    <div className="w-full h-full relative overflow-hidden">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false}
        className="w-full h-full z-0"
        zoomControl={false}
        style={{ background: '#f8fafc' }}
      >
        <ChangeView center={center} zoom={zoom} />
        
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {userLocation && (
          <Marker position={userLocation} icon={icons.user}>
            <Popup className="custom-popup-user">
               <span className="font-black uppercase text-[9px] text-blue-600 tracking-widest px-2">Tú</span>
            </Popup>
          </Marker>
        )}

        {businesses.map((biz) => (
          <Marker key={`marker-${biz.id}`} position={[biz.lat, biz.lng]} icon={icons.solar}>
            <Popup className="custom-biz-popup" maxWidth={300} minWidth={300}>
              <div className="relative w-[280px] p-3.5 bg-slate-100/95 backdrop-blur-md rounded-[2.2rem] shadow-xl border border-white/50 flex items-center gap-4 animate-zoom-premium overflow-hidden">
                
                {/* 1. Imagen Business */}
                <div className="relative h-20 w-20 rounded-2xl overflow-hidden shadow-sm shrink-0 border border-white/20">
                   {biz.logo && (
                      <Image 
                        src={biz.logo} 
                        alt={biz.name} 
                        fill 
                        sizes="80px" 
                        className="object-cover"
                      />
                   )}
                </div>

                {/* 2. Info Content Area */}
                <div className="flex-1 min-w-0 pr-1">
                   <div className="flex items-center gap-2 mb-0.5">
                      <div className="flex items-center gap-1.5">
                         <div className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                         </div>
                         <span className="text-[9px] font-black text-emerald-600 tracking-tight uppercase">Abierto</span>
                      </div>
                      <div className="flex items-center gap-0.5 ml-1">
                         <span className="text-amber-400 text-[10px]">★</span>
                         <span className="text-[10px] font-black text-slate-300">{biz.rate || '4.5'}</span>
                      </div>
                   </div>

                   <h3 className="font-medium text-lg text-slate-800 tracking-tighter leading-tight mb-0.5 truncate block">
                      {biz.name}
                   </h3>
                   <p className="text-[9px] font-normal text-slate-400 italic mb-3 truncate block">{biz.zone}</p>

                   {/* 3. Botones Premium (Simplificados para Vercel) */}
                   <div className="flex items-center gap-2">
                      <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black tracking-widest rounded-xl shadow-md border-b-2 border-blue-800 transition-all uppercase">
                         Llegar
                      </button>
                      <button className="flex-1 py-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white text-[10px] font-black tracking-widest rounded-xl shadow-md border-b-2 border-red-800 transition-all uppercase">
                         Menú
                      </button>
                   </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

    </div>
  )
})

export default MapViewer
