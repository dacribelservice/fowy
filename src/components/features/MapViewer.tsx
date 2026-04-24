'use client'

import { useEffect, useState, memo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import Image from 'next/image'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// --- CONFIGURACIÓN DE ICONOS ---
const solarIcon = L.divIcon({
  className: 'custom-solar-marker',
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-8 h-8 bg-red-500/20 rounded-full animate-ping"></div>
      <div class="relative w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-lg shadow-red-500/50"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

const userIcon = L.divIcon({
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

  if (!isMounted) return <div className="w-full h-full bg-slate-50 animate-pulse" />;

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
          <Marker position={userLocation} icon={userIcon}>
            <Popup className="custom-popup-user">
               <span className="font-black uppercase text-[9px] text-blue-600 tracking-widest px-2">Tú</span>
            </Popup>
          </Marker>
        )}

        {businesses.map((biz) => (
          <Marker key={`marker-${biz.id}`} position={[biz.lat, biz.lng]} icon={solarIcon}>
            <Popup className="custom-biz-popup" maxWidth={300} minWidth={300}>
              <div className="relative w-[280px] p-3.5 bg-slate-100/95 backdrop-blur-md rounded-[2rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] border border-white/50 flex items-center gap-4 animate-zoom-premium overflow-hidden">
                
                {/* 1. Imagen Cuadrada Redondeada */}
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

                {/* 2. Content Area */}
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

                   {/* Nombre: Largo Fijo y Truncado */}
                   <h3 className="font-medium text-lg text-slate-800 tracking-tighter leading-tight mb-0.5 truncate block">
                      {biz.name}
                   </h3>
                   <p className="text-[9px] font-normal text-slate-400 italic mb-3 truncate block">{biz.zone}</p>

                   {/* 3. Botones Premium "Metalizados" */}
                   <div className="flex items-center gap-2">
                      <button className="flex-1 py-1.5 bg-gradient-to-b from-blue-500 to-blue-700 text-white text-[10px] font-black tracking-widest rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_10px_rgba(37,99,235,0.3)] border border-blue-800 active:translate-y-[1px] active:shadow-none transition-all uppercase">
                         Llegar
                      </button>
                      <button className="flex-1 py-1.5 bg-gradient-to-b from-orange-400 to-red-600 text-white text-[10px] font-black tracking-widest rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_10px_rgba(220,38,38,0.3)] border border-red-700 active:translate-y-[1px] active:shadow-none transition-all uppercase">
                         Menú
                      </button>
                   </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Global Popup Styling for Leaflet */}
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          padding: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
          border-radius: 2rem !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: auto !important;
        }
        .leaflet-popup-tip-container {
          display: none !important;
        }
        .leaflet-popup-close-button {
          display: none !important;
        }
        .custom-biz-popup {
          margin-bottom: 60px;
        }
      `}</style>
    </div>
  )
})

export default MapViewer
