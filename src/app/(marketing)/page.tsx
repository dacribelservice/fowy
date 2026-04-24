'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { calculateDistance } from '@/lib/geo'
import { logUncoveredDemand } from '@/lib/supabase'

// Carga perezosa del mapa para evitar errores de SSR en Next.js
const MapViewer = dynamic(() => import('@/components/features/MapViewer'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">Cargando Mapa Fowy...</div>
})

// --- SVGS PREMIUM REFINADOS (FASE 6.5) ---
const Icons = {
  Burger: () => (
    <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10.5c0-1.8 1.5-3.3 3.3-3.3h9.4c1.8 0 3.3 1.5 3.3 3.3V11H4v-.5z"/><path d="M4 11h16v1.5c0 1.2-1 2.2-2.2 2.2H6.2C5 14.7 4 13.7 4 12.5V11z"/><path d="M7 14.7v1.8c0 1.2 1 2.2 2.2 2.2h5.6c1.2 0 2.2-1 2.2-2.2v-1.8"/><path d="M3 11h18"/></svg>
  ),
  Pizza: () => (
    <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M15 11h.01"/><path d="M11 15h.01"/><path d="M16 16h.01"/><path d="m2 16 20 6-6-20A20 20 0 0 0 2 16z"/><path d="M6.27 10.37A10.75 10.75 0 0 1 13.63 17.73"/></svg>
  ),
  Search: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  User: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  MapPin: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  Check: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  )
}

const CATEGORIES = [
  { id: 'burgers', label: 'Hamburguesas' },
  { id: 'pizza', label: 'Pizza' },
  { id: 'pollo', label: 'Pollo' },
  { id: 'hotdogs', label: 'Perros calientes' },
  { id: 'salchipapas', label: 'Salchipapas' },
  { id: 'fastfood', label: 'Rápida variada' },
  { id: 'streetfood', label: 'Callejera' },
  { id: 'mexican', label: 'Mexicana' },
  { id: 'arepas', label: 'Arepas' },
  { id: 'sandwiches', label: 'Sandwiches' },
  { id: 'wings', label: 'Alitas' },
  { id: 'grill', label: 'Parrilla' },
  { id: 'healthy', label: 'Saludable' },
  { id: 'desserts', label: 'Postres' },
  { id: 'drinks', label: 'Bebidas' },
]

const ALL_BUSINESSES = [
  { id: 101, name: 'Bunker Burger', slug: 'burgers', lat: 3.4475, lng: -76.5413, zone: 'San Antonio', logo: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=200&h=200&auto=format&fit=crop' },
  { id: 102, name: 'Easy Fast', slug: 'easy', lat: 3.4550, lng: -76.5350, zone: 'Centenario', logo: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?q=80&w=200&h=200&auto=format&fit=crop' },
  { id: 201, name: 'Solar Pizza', slug: 'pizzeria', lat: 3.4591, lng: -76.5328, zone: 'Granada', logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200&h=200&auto=format&fit=crop' },
]

const BUSINESSES_BY_CAT = {
  burgers: ALL_BUSINESSES.filter(b => b.slug === 'burgers' || b.slug === 'easy'),
  pizza: ALL_BUSINESSES.filter(b => b.slug === 'pizzeria'),
}

export default function MobileExplorerPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isSheetExpanded, setIsSheetExpanded] = useState(false)
  
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [isLocating, setIsLocating] = useState(true)
  const [hasCoverage, setHasCoverage] = useState(true)
  const [mapCenter, setMapCenter] = useState<[number, number]>([3.4516, -76.5320])

  const [isNotifyMode, setIsNotifyMode] = useState(false)
  const [notifySuccess, setNotifySuccess] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [email, setEmail] = useState('')

  const detectLocation = useCallback(() => {
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
    detectLocation()
  }, [detectLocation])

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email && userLocation) {
      setIsSending(true)
      // Simulamos una latencia "premium" para la animación
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
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center font-inter lg:p-10 selection:bg-red-500/30">
      
      {/* 🏙️ DESKTOP ONLY: LEFT INFO */}
      <div className="hidden lg:flex flex-col w-1/4 pr-12 space-y-8 animate-fowy-up">
         <div>
            <h1 className="text-6xl font-black italic uppercase tracking-tighter text-red-600 mb-4 drop-shadow-[0_0_30px_rgba(220,38,38,0.3)]">FOWY.app</h1>
            <p className="text-slate-400 font-bold leading-relaxed text-lg">Tecnología de descubrimiento local. <br/> <span className="text-white/40">Sintonizando tu ciudad.</span></p>
         </div>
      </div>

      {/* 📱 APP CONTAINER */}
      <div className="relative w-full h-screen lg:h-auto lg:max-w-[430px] lg:aspect-[9/19.5] lg:bg-black lg:rounded-[4.5rem] lg:border-[14px] lg:border-zinc-900 lg:shadow-[0_0_120px_rgba(0,0,0,0.9)] overflow-hidden transition-all duration-700">
         
         <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-zinc-900 rounded-b-3xl z-[60] flex items-end justify-center pb-1">
            <div className="w-12 h-1 bg-zinc-800 rounded-full" />
         </div>

         <main className="relative w-full h-full bg-white overflow-hidden">
            
            <div className="absolute inset-0 z-0 scale-105">
               <MapViewer 
                  center={mapCenter} 
                  userLocation={userLocation}
                  businesses={ALL_BUSINESSES}
               />
            </div>

            <div className="absolute inset-0 z-[1] bg-gradient-to-b from-white/20 via-transparent to-white/40 pointer-events-none" />

            <header className="absolute top-12 left-0 w-full px-6 z-40 flex gap-4">
               <div className="flex-1 h-14 bg-white/90 backdrop-blur-3xl rounded-full flex items-center px-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.2)] border border-white/50 group focus-within:border-red-600 transition-all duration-500">
                  <span className="text-red-600 mr-4 group-focus-within:scale-110 transition-transform duration-500"><Icons.Search /></span>
                  <input 
                     type="text" 
                     placeholder="¿Qué quieres probar hoy?" 
                     className="bg-transparent border-none outline-none text-zinc-950 font-bold text-sm w-full placeholder:text-zinc-400" 
                  />
               </div>
               <div className="h-14 w-14 bg-zinc-950 rounded-full flex items-center justify-center shadow-2xl border-2 border-white hover:scale-105 active:scale-95 transition-all duration-500 text-white">
                  <Icons.User />
               </div>
            </header>

            <div className="absolute right-6 bottom-[300px] lg:bottom-[240px] z-[60]">
               <button 
                  onClick={detectLocation}
                  className="h-16 w-16 bg-red-600 rounded-full flex items-center justify-center shadow-[0_20px_40px_-5px_rgba(220,38,38,0.5)] hover:scale-110 active:scale-95 transition-all duration-500 text-white border-4 border-white animate-solar-glow"
               >
                  <Icons.MapPin />
               </button>
            </div>

            <div 
               className={`absolute bottom-0 left-0 w-full bg-white rounded-t-[3.5rem] px-8 transition-all duration-1000 ease-[cubic-bezier(0.16, 1, 0.3, 1)] z-50 flex flex-col shadow-[0_-30px_60px_rgba(0,0,0,0.2)] border-t border-zinc-100
                  ${isSheetExpanded ? 'h-[80%]' : 'h-[280px]'}`}
            >
               <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto mt-6 mb-8" />

               {!isSheetExpanded ? (
                 <div className="flex flex-col items-center animate-fade-premium w-full overflow-hidden">
                     <span className="text-[10px] font-black uppercase text-red-600 tracking-[0.5em] italic mb-8 opacity-70">Elige tu categoría</span>
                     <div className="flex overflow-x-auto no-scrollbar gap-8 w-full px-2 pb-6 snap-x snap-mandatory">
                        {CATEGORIES.map(cat => (
                           <button 
                               key={cat.id} 
                               onClick={() => handleCategoryClick(cat.id)}
                               className="flex flex-col items-center gap-4 text-zinc-400 min-w-[90px] transition-all duration-500 active:scale-90 snap-center group"
                           >
                              <div className="bg-zinc-50 h-16 w-16 rounded-full flex items-center justify-center shadow-sm border border-zinc-100 group-hover:border-red-600 group-hover:bg-red-50 transition-all duration-500 overflow-hidden">
                                 <div className="w-6 h-6 border-2 border-zinc-200 rounded-md rotate-45 group-hover:border-red-600 group-hover:rotate-90 transition-all duration-700" />
                              </div>
                              <span className="text-[9px] font-black uppercase tracking-widest text-center leading-tight text-zinc-950 group-hover:text-red-600 transition-colors duration-500">{cat.label}</span>
                           </button>
                        ))}
                     </div>
                  </div>
               ) : (
                 <div className="flex flex-col h-full animate-zoom-premium overflow-hidden pt-2">
                    <header className="flex justify-between items-center mb-10">
                       <h3 className="text-3xl font-black text-zinc-950 uppercase italic tracking-tighter leading-none">
                          {CATEGORIES.find(c => c.id === selectedCategory)?.label || 'Categorías'}
                       </h3>
                       <button onClick={() => setIsSheetExpanded(false)} className="h-12 w-12 flex items-center justify-center bg-zinc-100 text-zinc-500 rounded-full font-black text-xs hover:bg-red-600 hover:text-white transition-all duration-500">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                       </button>
                    </header>
                    <div className="grid grid-cols-2 gap-10 flex-1 overflow-y-auto no-scrollbar pb-16 min-h-0">
                       {(BUSINESSES_BY_CAT[selectedCategory as keyof typeof BUSINESSES_BY_CAT] || []).map((biz, idx) => (
                          <Link href={`/${biz.slug}`} key={biz.id} style={{ animationDelay: `${idx * 0.1}s` }} className="animate-fowy-up flex flex-col items-center group">
                             <div className="relative w-36 h-36 rounded-full overflow-hidden border-[8px] border-white shadow-2xl group-hover:scale-105 group-hover:border-red-600 transition-all duration-700">
                                <Image src={biz.logo} alt={biz.name} fill className="object-cover" />
                             </div>
                             <span className="mt-6 text-[11px] font-black uppercase text-zinc-950 tracking-[0.2em]">{biz.name}</span>
                          </Link>
                       ))}
                    </div>
                 </div>
               )}
            </div>

            {isLocating && (
               <div className="absolute inset-0 z-[100] bg-white/90 backdrop-blur-2xl flex flex-col items-center justify-center animate-fade-premium">
                  <div className="w-16 h-16 border-[5px] border-red-600/10 border-t-red-600 rounded-full animate-spin mb-8" />
                  <p className="text-[11px] font-black uppercase text-red-600 tracking-[0.6em] animate-pulse">Sintonizando...</p>
               </div>
            )}

            {!isLocating && !hasCoverage && (
               <div className="absolute inset-0 z-[110] bg-[#020617] flex flex-col items-center justify-center p-10 text-center animate-fade-premium">
                  {!isNotifyMode ? (
                     <div className="animate-zoom-premium">
                        <div className="w-24 h-24 bg-red-600/10 rounded-full flex items-center justify-center mb-10 mx-auto border-2 border-red-600/20 text-red-600">
                           <Icons.MapPin />
                        </div>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-6 leading-none drop-shadow-2xl">Fuera de Órbita</h2>
                        <p className="text-slate-400 font-bold text-sm leading-relaxed mb-14 max-w-[280px] mx-auto opacity-80">
                           Aún no aterrizamos en tu zona, pero estamos en camino. <br/> ¿Quieres ser el primero en saber?
                        </p>
                        <div className="flex flex-col w-full gap-5 px-4">
                           <button 
                              onClick={() => setIsNotifyMode(true)}
                              className="w-full h-16 bg-red-600 rounded-full font-black uppercase text-[11px] tracking-[0.2em] hover:scale-105 active:scale-95 transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(220,38,38,0.4)]"
                           >
                              Notificarme
                           </button>
                           <button 
                              onClick={() => { setHasCoverage(true); setMapCenter([3.4516, -76.5320]); }}
                              className="w-full h-16 bg-white/5 border border-white/10 rounded-full font-black uppercase text-[11px] tracking-[0.2em] hover:bg-white/10 transition-all duration-500 text-slate-400"
                           >
                              Explorar Cali HUB
                           </button>
                        </div>
                     </div>
                  ) : (
                     <div className="w-full max-w-[320px] animate-zoom-premium">
                        {notifySuccess ? (
                           <div className="flex flex-col items-center text-center py-10">
                              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-8 border-2 border-green-500/30 text-green-500 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                                 <Icons.Check />
                              </div>
                              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">¡Sintonizado!</h3>
                              <p className="text-slate-400 text-sm font-bold opacity-70">Te avisaremos apenas aterricemos aquí.</p>
                           </div>
                        ) : (
                           <div className="px-2">
                              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-10 leading-none">Únete a la espera</h3>
                              <form onSubmit={handleNotifySubmit} className="space-y-6">
                                 <div className="relative group">
                                    <input 
                                       type="email" 
                                       required
                                       disabled={isSending}
                                       placeholder="Tu correo electrónico"
                                       value={email}
                                       onChange={(e) => setEmail(e.target.value)}
                                       className="w-full h-16 bg-white/5 border border-white/10 rounded-full px-10 text-white font-bold text-sm outline-none focus:border-red-600 focus:bg-white/10 transition-all duration-500 placeholder:text-slate-600 disabled:opacity-50"
                                    />
                                 </div>
                                 <button 
                                    type="submit"
                                    disabled={isSending}
                                    className={`w-full h-16 bg-gradient-to-r from-red-600 to-orange-500 rounded-full font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-red-600/30 transition-all duration-500 flex items-center justify-center
                                       ${isSending ? 'opacity-80 scale-95 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                                 >
                                    {isSending ? (
                                       <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : 'Confirmar Registro'}
                                 </button>
                                 <button 
                                    type="button"
                                    onClick={() => setIsNotifyMode(false)}
                                    className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] hover:text-white transition-colors duration-500 pt-6"
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

      {/* 🏙️ DESKTOP ONLY: RIGHT INFO */}
      <div className="hidden lg:flex flex-col w-1/4 pl-12 space-y-8 animate-fowy-up" style={{ animationDelay: '0.2s' }}>
         <div className="bg-white/5 p-12 rounded-[4rem] border border-white/10 backdrop-blur-2xl shadow-2xl">
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-red-600 mb-10">Smart Discovery</h4>
            <ul className="space-y-8 text-sm font-bold text-slate-400 leading-relaxed">
               <li className="flex items-center gap-4 hover:text-white transition-colors duration-500"><span className="text-red-600">01</span> Geolocalización activa.</li>
               <li className="flex items-center gap-4 hover:text-white transition-colors duration-500"><span className="text-red-600">02</span> Cobertura inteligente.</li>
               <li className="flex items-center gap-4 hover:text-white transition-colors duration-500"><span className="text-red-600">03</span> Acceso premium.</li>
            </ul>
         </div>
      </div>
    </div>
  )
}
