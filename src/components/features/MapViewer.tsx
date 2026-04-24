'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Arreglo para los iconos de Leaflet en Next.js
// Marcador circular con efecto de pulso (Solar Flare)
export const solarIcon = L.divIcon({
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

// Marcador azul para el usuario
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

// Componente auxiliar para centrar el mapa cuando cambian las coordenadas
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom, { animate: true })
  }, [center, zoom, map])
  return null
}

interface MapViewerProps {
  center?: [number, number]
  zoom?: number
  userLocation?: [number, number] | null
  businesses?: Array<{ id: number, name: string, lat: number, lng: number, zone: string }>
}

export default function MapViewer({ 
  center = [3.4516, -76.5320], 
  zoom = 13, 
  userLocation = null,
  businesses = [
    { id: 1, name: 'Bunker Burger', lat: 3.4475, lng: -76.5413, zone: 'San Antonio' },
    { id: 2, name: 'Solar Pizza', lat: 3.4591, lng: -76.5328, zone: 'Granada' }
  ]
}: MapViewerProps) {
  return (
    <div className="w-full h-full rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl relative">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <ChangeView center={center} zoom={zoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Marcador del Usuario */}
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <div className="p-1 text-center">
                <p className="text-[10px] font-black uppercase text-blue-600">Tu Ubicación</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Marcadores de Negocios */}
        {businesses.map((biz) => (
          <Marker key={biz.id} position={[biz.lat, biz.lng]} icon={solarIcon}>
            <Popup>
              <div className="p-1 text-center">
                <h3 className="font-black text-xs uppercase italic text-red-600 tracking-tighter">{biz.name}</h3>
                <p className="text-[9px] font-bold text-slate-400">{biz.zone}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating Info Card (Solar Flare) */}
      <div className="absolute top-8 left-8 z-[1000] bg-white/95 backdrop-blur-xl p-5 rounded-[2rem] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.15)] border border-white max-w-[220px] animate-fowy-up">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-2 w-2 bg-red-600 rounded-full animate-pulse" />
          <p className="text-[9px] font-black text-red-600 uppercase tracking-[0.3em] italic">
            {userLocation ? 'Ubicación Detectada' : 'Cali en Vivo'}
          </p>
        </div>
        <h2 className="text-xl font-black text-slate-900 leading-none italic uppercase tracking-tighter">
          {userLocation ? 'Negocios cerca de ti' : 'Explora tu Ciudad'}
        </h2>
      </div>
    </div>
  )
}
