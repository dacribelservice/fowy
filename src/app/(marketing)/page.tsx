'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { calculateDistance } from '@/lib/geo'
import { logUncoveredDemand } from '@/lib/supabase'

// Carga perezosa del mapa para evitar errores de SSR en Next.js
const MapViewer = dynamic(() => import('@/components/features/MapViewer'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 font-black uppercase tracking-widest text-[9px]">Sincronizando Radar...</div>
})

// --- SVGS PREMIUM REFINADOS ---
const Icons = {
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  User: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  MapPin: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  Check: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  Close: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  )
}

const CATEGORIES = [
  { id: 'burgers', label: 'Hamburguesas' },
  { id: 'pizza', label: 'Pizza' },
  { id: 'pollo', label: 'Pollo' },
  { id: 'hotdogs', label: 'Perros' },
  { id: 'salchipapas', label: 'Salchipapas' },
  { id: 'fastfood', label: 'Rápida' },
  { id: 'mexican', label: 'Mexicana' },
  { id: 'desserts', label: 'Postres' },
]

interface Business {
  id: number;
  name: string;
  slug: string;
  lat: number;
  lng: number;
  zone: string;
  logo: string;
}

const ALL_BUSINESSES: Business[] = [
  { id: 101, name: 'Bunker Burger', slug: 'burgers', lat: 3.4475, lng: -76.5413, zone: 'San Antonio', logo: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=200&h=200&auto=format&fit=crop' },
  { id: 102, name: 'Easy Fast', slug: 'easy', lat: 3.4550, lng: -76.5350, zone: 'Centenario', logo: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?q=80&w=200&h=200&auto=format&fit=crop' },
  { id: 201, name: 'Solar Pizza', slug: 'pizzeria', lat: 3.4591, lng: -76.5328, zone: 'Granada', logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200&h=200&auto=format&fit=crop' },
]

const BUSINESSES_BY_CAT: Record<string, Business[]> = {
  burgers: ALL_BUSINESSES.filter(b => b.slug === 'burgers' || b.slug === 'easy'),
  pizza: ALL_BUSINESSES.filter(b => b.slug === 'pizzeria'),
}

export default function MobileExplorerPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isSheetExpanded, setIsSheetExpanded] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [isLocating, setIsLocating] = useState(true)
  const [hasCoverage, setHasCoverage] = useState(true)
  const [mapCenter, setMapCenter] = useState<[number, number]>([3.4516, -76.5320])
  const [zoom, setZoom] = useState(13)

  const [isNotifyMode, setIsNotifyMode] = useState(false)
  const [notifySuccess, setNotifySuccess] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [email, setEmail] = useState('')
  
  const hasAttemptedLocate = useRef(false)

  const detectLocation = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    setIsLocating(true)
    setIsNotifyMode(false)
    setNotifySuccess(false)
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation([latitude, longitude])
          setMapCenter([latitude, longitude])
          
          const nearby = ALL_BUSINESSES.some(biz => 
            calculateDistance(latitude, longitude, biz.lat, biz.lng) <= 3
          )
          setHasCoverage(nearby)
          setIsLocating(false)

          if (!nearby) {
            logUncoveredDemand(latitude, longitude)
          }
        },
        (error) => {
          console.error("Error detectando ubicación:", error)
          setIsLocating(false)
          setHasCoverage(true)
        }
      )
    } else {
      setIsLocating(false)
    }
  }, [])

  useEffect(() => {
    if (!hasAttemptedLocate.current) {
      hasAttemptedLocate.current = true
      detectLocation()
    }
  }, [detectLocation])

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email && userLocation) {
      setIsSending(true)
      await new Promise(r => setTimeout(r, 1200))
      await logUncoveredDemand(userLocation[0], userLocation[1], email)
      setIsSending(false)
      setNotifySuccess(true)
      setTimeout(() => {
        setIsNotifyMode(false)
        setNotifySuccess(false)
        setEmail('')
      }, 4000)
    }
  }

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId)
    setIsSheetExpanded(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-orange-500 text-white flex items-center justify-center font-sans lg:p-10 selection:bg-white/20 overflow-hidden">
      
      {/* 🏙️ DESKTOP INFO (Left) */}
      <div className="hidden lg:flex flex-col w-1/4 pr-12 space-y-8 animate-fowy-up">
         <div>
            <h1 className="text-6xl font-black italic uppercase tracking-tighter text-white mb-4 drop-shadow-xl">FOWY.app</h1>
            <p className="text-white/80 font-bold leading-relaxed text-lg italic">Tecnología de descubrimiento local. <br/> <span className="text-white/50">Sintonizando tu ciudad.</span></p>
         </div>
      </div>

      {/* 📱 VIRTUAL IPHONE */}
      <div className="relative w-full h-screen lg:h-auto lg:w-[320px] lg:aspect-[9/19] lg:bg-black lg:rounded-[3rem] lg:border-[8px] lg:border-black lg:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-1000">
         
         {/* Notch */}
         <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-[60] flex items-end justify-center pb-1">
            <div className="w-8 h-1 bg-zinc-800 rounded-full" />
         </div>

         <main className="relative w-full h-full bg-slate-100 overflow-hidden">
            
            {/* Map Background */}
            <div className="absolute inset-0 z-0">
               <MapViewer 
                  center={mapCenter} 
                  zoom={zoom}
                  userLocation={userLocation}
                  businesses={ALL_BUSINESSES}
               />
            </div>

            {/* Glass Overlay */}
            <div className="absolute inset-0 z-[1] bg-gradient-to-b from-white/30 via-transparent to-white/10 pointer-events-none" />

            {/* 🔍 HEADER (Right-aligned Search) */}
            <header className="absolute top-10 left-0 w-full px-6 z-40 flex items-center justify-end gap-3">
               
               {/* Search Button / Bar Wrapper (Moves and expands to the left) */}
               <div className={`flex items-center bg-white/90 backdrop-blur-3xl rounded-full shadow-xl border border-white transition-all duration-700 ease-[cubic-bezier(0.23, 1, 0.32, 1)] overflow-hidden ${
                  isSearchExpanded ? 'flex-1 h-12 px-4' : 'h-12 w-12 justify-center'
               }`}>
                  <button 
                     onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                     className={`flex items-center justify-center transition-colors ${
                        isSearchExpanded ? 'text-red-500' : 'text-slate-400 hover:text-red-500'
                     }`}
                  >
                     <Icons.Search />
                  </button>
                  
                  <input 
                     type="text" 
                     placeholder="¿Qué buscas?" 
                     className={`bg-transparent border-none outline-none text-slate-900 font-black text-[10px] uppercase tracking-widest placeholder:text-slate-300 transition-all duration-700 ${
                        isSearchExpanded ? 'w-full ml-3 opacity-100' : 'w-0 opacity-0'
                     }`} 
                  />

                  {isSearchExpanded && (
                     <button onClick={() => setIsSearchExpanded(false)} className="text-slate-300 ml-2">
                        <Icons.Close />
                     </button>
                  )}
               </div>

               {/* User Circle (Anchor on the right) */}
               <div className="h-12 w-12 bg-white/90 backdrop-blur-3xl rounded-full flex items-center justify-center shadow-xl border border-white text-slate-400 shrink-0">
                  <Icons.User />
               </div>
            </header>

            {/* 🔍 ZOOM CONTROLS (Desktop only) */}
            <div className="hidden lg:flex absolute top-10 left-6 z-40 flex-col gap-2">
               <button 
                  onClick={() => setZoom(prev => Math.min(prev + 1, 18))}
                  className="h-10 w-10 bg-white/90 backdrop-blur-3xl rounded-full flex items-center justify-center shadow-xl border border-white text-slate-900 font-black text-xl hover:text-red-500 transition-colors leading-none pb-1"
               >
                  +
               </button>
               <button 
                  onClick={() => setZoom(prev => Math.max(prev - 1, 10))}
                  className="h-10 w-10 bg-white/90 backdrop-blur-3xl rounded-full flex items-center justify-center shadow-xl border border-white text-slate-900 font-black text-xl hover:text-red-500 transition-colors leading-none pb-1"
               >
                  −
               </button>
            </div>

            {/* FAB Map Pin */}
            <div className="absolute right-6 bottom-[240px] z-[60]">
               <button 
                  onClick={detectLocation}
                  className="h-12 w-12 bg-gradient-to-tr from-red-600 to-orange-500 rounded-full flex items-center justify-center shadow-2xl text-white border-2 border-white"
               >
                  <Icons.MapPin />
               </button>
            </div>

            {/* Dynamic Bottom Sheet */}
            <div 
               className={`absolute bottom-0 left-0 w-full bg-white rounded-t-[2.5rem] px-6 transition-all duration-1000 ease-[cubic-bezier(0.16, 1, 0.3, 1)] z-50 flex flex-col shadow-2xl border-t border-slate-50
                  ${isSheetExpanded ? 'h-[75%]' : 'h-[220px]'}`}
            >
               <div className="w-10 h-1.5 bg-slate-100 rounded-full mx-auto mt-4 mb-6" />

               {!isSheetExpanded ? (
                 <div className="flex flex-col items-center animate-fade-premium w-full overflow-hidden">
                     <span className="text-[9px] font-black uppercase text-red-500 tracking-[0.4em] italic mb-6">Explorar</span>
                     <div className="flex overflow-x-auto fowy-scrollbar gap-6 w-full px-2 pb-4 snap-x snap-mandatory">
                        {CATEGORIES.map(cat => (
                           <button 
                               key={cat.id} 
                               onClick={() => handleCategoryClick(cat.id)}
                               className="flex flex-col items-center gap-3 text-slate-400 min-w-[70px] snap-center group"
                           >
                              <div className="bg-slate-50 h-12 w-12 rounded-full flex items-center justify-center shadow-sm border border-slate-100 group-hover:border-red-500 group-hover:bg-red-50 transition-all duration-500">
                                 <div className="w-3.5 h-3.5 border-2 border-slate-200 rounded-md rotate-45 group-hover:border-red-500 transition-all duration-700" />
                              </div>
                              <span className="text-[8px] font-black uppercase tracking-widest text-center leading-tight text-slate-900 group-hover:text-red-500 transition-colors duration-500">{cat.label}</span>
                           </button>
                        ))}
                     </div>
                  </div>
               ) : (
                 <div className="flex flex-col h-full animate-zoom-premium overflow-hidden pt-1">
                    <header className="flex justify-between items-center mb-6">
                       <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                          {CATEGORIES.find(c => c.id === selectedCategory)?.label || 'Categorías'}
                       </h3>
                       <button onClick={() => setIsSheetExpanded(false)} className="h-8 w-8 flex items-center justify-center bg-slate-100 text-slate-400 rounded-full">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                       </button>
                    </header>
                    <div className="grid grid-cols-2 gap-6 flex-1 overflow-y-auto no-scrollbar pb-10 min-h-0">
                       {(BUSINESSES_BY_CAT[selectedCategory || ''] || []).map((biz, idx) => (
                          <Link href={`/${biz.slug}`} key={biz.id} style={{ animationDelay: `${idx * 0.1}s` }} className="animate-fowy-up flex flex-col items-center group">
                             <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-lg group-hover:scale-105 group-hover:border-red-500 transition-all duration-700">
                                <Image src={biz.logo} alt={biz.name} fill sizes="100px" className="object-cover" />
                             </div>
                             <span className="mt-3 text-[8px] font-black uppercase text-slate-900 tracking-[0.2em] italic text-center">{biz.name}</span>
                          </Link>
                       ))}
                    </div>
                 </div>
               )}
            </div>

            {/* Sintonizando Loader */}
            {isLocating && (
               <div className="absolute inset-0 z-[100] bg-slate-50/95 backdrop-blur-2xl flex flex-col items-center justify-center animate-fade-premium">
                  <div className="w-10 h-10 border-[4px] border-red-500/10 border-t-red-500 rounded-full animate-spin mb-4" />
                  <p className="text-[9px] font-black uppercase text-red-500 tracking-[0.5em] animate-pulse italic">Sintonizando...</p>
               </div>
            )}

            {/* Out of Orbit */}
            {!isLocating && !hasCoverage && (
               <div className="absolute inset-0 z-[110] bg-slate-100 flex flex-col items-center justify-center p-6 text-center animate-fade-premium">
                  {!isNotifyMode ? (
                     <div className="animate-zoom-premium">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 mx-auto border-4 border-white shadow-lg text-red-500">
                           <Icons.MapPin />
                        </div>
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 mb-4 leading-none">Fuera de <span className="text-red-500">Órbita</span></h2>
                        <p className="text-slate-500 font-bold text-[10px] leading-relaxed mb-8 max-w-[200px] mx-auto italic">
                           Aún no aterrizamos en tu zona, pero estamos en camino.
                        </p>
                        <div className="flex flex-col w-full gap-3">
                           <button 
                              onClick={() => setIsNotifyMode(true)}
                              className="w-full h-12 bg-gradient-to-r from-red-600 to-orange-500 rounded-full font-black uppercase text-[9px] tracking-[0.2em] text-white shadow-lg"
                           >
                              Notificarme
                           </button>
                           <button 
                              onClick={() => { setHasCoverage(true); setMapCenter([3.4516, -76.5320]); }}
                              className="w-full h-12 bg-white border border-slate-200 rounded-full font-black uppercase text-[9px] tracking-[0.2em] text-slate-400"
                           >
                              Explorar Cali
                           </button>
                        </div>
                     </div>
                  ) : (
                     <div className="w-full max-w-[240px] animate-zoom-premium">
                        {notifySuccess ? (
                           <div className="flex flex-col items-center text-center py-6">
                              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-lg text-emerald-500">
                                 <Icons.Check />
                              </div>
                              <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">¡Sintonizado!</h3>
                              <p className="text-slate-400 text-[9px] font-bold italic">Te avisaremos pronto.</p>
                           </div>
                        ) : (
                           <div>
                              <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-6 leading-none">Únete a la <span className="text-red-500">Espera</span></h3>
                              <form onSubmit={handleNotifySubmit} className="space-y-3">
                                 <input 
                                    type="email" 
                                    required
                                    disabled={isSending}
                                    placeholder="Tu correo"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-12 bg-white border border-slate-200 rounded-full px-6 text-slate-900 font-bold text-[10px] outline-none focus:border-red-500 transition-all duration-500 placeholder:text-slate-300"
                                 />
                                 <button 
                                    type="submit"
                                    disabled={isSending}
                                    className={`w-full h-12 bg-slate-900 rounded-full font-black uppercase text-[9px] tracking-[0.2em] text-white shadow-lg transition-all duration-500 flex items-center justify-center
                                       ${isSending ? 'opacity-80 scale-95' : 'hover:scale-105 active:scale-95'}`}
                                 >
                                    {isSending ? (
                                       <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : 'Confirmar'}
                                 </button>
                                 <button 
                                    type="button"
                                    onClick={() => setIsNotifyMode(false)}
                                    className="text-[8px] font-black uppercase text-slate-300 tracking-[0.3em] hover:text-slate-900 transition-colors duration-500 pt-3"
                                 >
                                    Cancelar
                                 </button>
                              </form>
                           </div>
                        )}
                     </div>
                  )}
               </div>
            )}
         </main>
      </div>

      {/* 🏙️ DESKTOP INFO (Right) */}
      <div className="hidden lg:flex flex-col w-1/4 pl-12 space-y-8 animate-fowy-up" style={{ animationDelay: '0.2s' }}>
         <div className="bg-white/10 p-8 rounded-[2.5rem] border border-white/20 backdrop-blur-3xl shadow-2xl">
            <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-white mb-6 italic">Smart Discovery</h4>
            <ul className="space-y-4 text-[9px] font-black uppercase tracking-widest text-white/70">
               <li className="flex items-center gap-4"><span className="text-white italic">01</span> Geolocalización</li>
               <li className="flex items-center gap-4"><span className="text-white italic">02</span> Cobertura</li>
               <li className="flex items-center gap-4"><span className="text-white italic">03</span> Acceso Premium</li>
            </ul>
         </div>
      </div>
    </div>
  )
}
