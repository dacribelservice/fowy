'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

// Minimalist 2D Stroke Icons
const TabIcons = {
  Identidad: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  Cartera: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
  ),
  Operacion: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  Modulos: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
  ),
  Pedidos: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.41 8.41 0 0 1 5.3 1.9L22 3l-1.5 5.5Z"/></svg>
  ),
  Soporte: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
  )
}

export default function EditBusinessPage() {
  const { id } = useParams()
  const router = useRouter()
  
  // State for Navigation
  const [activeTab, setActiveTab] = useState('identidad')
  
  // State for form fields (Identidad)
  const [name, setName] = useState('Burger Master HQ')
  const [slug, setSlug] = useState('burger-master')
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [brandColor, setBrandColor] = useState('#dc2626')
  const [logoUrl, setLogoUrl] = useState('')
  const [bannerUrl, setBannerUrl] = useState('')
  
  // State for form fields (Cartera)
  const [cutDate, setCutDate] = useState('1')
  const [graceDays, setGraceDays] = useState('3')
  
  const [isSaving, setIsSaving] = useState(false)

  // Slug Validation
  useEffect(() => {
    if (!slug) {
      setSlugStatus('idle')
      return
    }
    setSlugStatus('checking')
    const timer = setTimeout(() => {
      if (slug.toLowerCase().includes('fowy')) {
        setSlugStatus('taken')
      } else {
        setSlugStatus('available')
      }
    }, 800)
    return () => clearTimeout(timer)
  }, [slug])

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      router.push('/fowy-admin?view=negocios')
    }, 1500)
  }

  const tabs = [
    { id: 'identidad', label: 'Identidad', icon: TabIcons.Identidad, color: 'bg-red-50 text-red-600 border-red-100' },
    { id: 'cartera', label: 'Cartera', icon: TabIcons.Cartera, color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { id: 'operacion', label: 'Operación', icon: TabIcons.Operacion, color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { id: 'modulos', label: 'Módulos', icon: TabIcons.Modulos, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { id: 'pedidos', label: 'Pedidos', icon: TabIcons.Pedidos, color: 'bg-purple-50 text-purple-600 border-purple-100' },
    { id: 'soporte', label: 'Soporte', icon: TabIcons.Soporte, color: 'bg-slate-50 text-slate-600 border-slate-100' },
  ]

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 lg:p-12 animate-fade-premium font-poppins">
      <div className="max-w-5xl mx-auto space-y-8">
               {/* Header Minimalista (Compacto) */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <Link href="/fowy-admin?view=negocios" className="w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center text-[10px] text-slate-400 hover:text-slate-900 transition-all shadow-sm">
              ←
            </Link>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold tracking-tight uppercase italic text-slate-900 leading-none">
                Editor <span className="text-orange-500/80 font-medium tracking-tighter">Negocio</span>
              </h1>
              <p className="text-[7px] font-black text-slate-300 uppercase tracking-[0.4em] mt-1">Bunker Master &bull; ID: {id}</p>
            </div>
          </div>
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border shadow-sm active:scale-95 flex items-center gap-3 ${
              isSaving ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-wait' : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
            }`}
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </header>

        {/* 🏰 MENÚ DE PESTAÑAS (Pill-shape) */}
        <nav className="flex flex-wrap gap-2 border-b border-slate-50 pb-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2 rounded-full text-[8px] font-bold uppercase tracking-widest transition-all border whitespace-nowrap ${
                  isActive 
                    ? `${tab.color} border-current shadow-sm scale-105 z-10` 
                    : 'bg-transparent text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                <tab.icon />
                {tab.label}
              </button>
            )
          })}
        </nav>

        <div className="flex flex-col gap-6 pb-20">
          
          {/* Contenido Principal (Tabs) */}
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            
            {/* 🍎 TAB: IDENTIDAD (Diseño Cápsula Horizontal) */}
            {activeTab === 'identidad' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <h2 className="text-xl font-bold text-slate-900 ml-4">Identidad y marca</h2>
                
                <section className="bg-white p-4 lg:p-6 rounded-full border border-slate-100 shadow-sm">
                  <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 px-6">
                    
                    {/* Nombre de Marca */}
                    <div className="flex-1 w-full lg:w-auto space-y-2">
                      <label className="text-sm font-medium text-slate-900 ml-2">Nombre de marca</label>
                      <input 
                        type="text" 
                        value={name}
                        placeholder="Ejemplo de negocio"
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-100/70 border-none px-6 py-2.5 rounded-full text-xs font-medium text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
                      />
                    </div>

                    {/* Slug de URL */}
                    <div className="flex-1 w-full lg:w-auto space-y-2">
                      <div className="flex justify-between items-center ml-2">
                        <label className="text-sm font-medium text-slate-900">Slug de URL</label>
                        {slugStatus === 'available' && <span className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">DISPONIBLE</span>}
                      </div>
                      <input 
                        type="text" 
                        value={slug}
                        placeholder="ejemplo-negocio"
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                        className="w-full bg-slate-100/70 border-none px-6 py-2.5 rounded-full text-xs font-medium text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
                      />
                    </div>

                    {/* Color de Identidad */}
                    <div className="flex-1 w-full lg:w-auto space-y-2">
                      <label className="text-sm font-medium text-slate-900 ml-2">Color de identidad</label>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 relative">
                          <input 
                            type="text" 
                            value={brandColor}
                            readOnly
                            className="w-full bg-slate-100/70 border-none px-6 py-2.5 rounded-full text-xs font-medium text-slate-500 focus:outline-none"
                          />
                        </div>
                        
                        {/* Selector Circular */}
                        <div className="relative flex-shrink-0">
                          <input 
                            type="color" 
                            value={brandColor} 
                            onChange={(e) => setBrandColor(e.target.value)} 
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" 
                          />
                          <div 
                            className="w-12 h-12 rounded-full border-4 border-white shadow-lg transition-transform hover:scale-110" 
                            style={{ backgroundColor: brandColor }}
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </section>
              </div>
            )}

            {/* 💰 TAB: CARTERA (Diseño Cápsula Horizontal) */}
            {activeTab === 'cartera' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <h2 className="text-xl font-bold text-slate-900 ml-4">Blindaje financiero</h2>
                
                <section className="bg-white p-4 lg:p-6 rounded-full border border-slate-100 shadow-sm">
                  <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 px-6">
                    
                    {/* Día de Corte */}
                    <div className="flex-1 w-full lg:w-auto space-y-2">
                      <label className="text-sm font-medium text-slate-900 ml-2">Día de corte mensual</label>
                      <select 
                        value={cutDate}
                        onChange={(e) => setCutDate(e.target.value)}
                        className="w-full bg-slate-100/70 border-none px-6 py-2.5 rounded-full text-xs font-medium text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all appearance-none"
                      >
                        {[1, 5, 10, 15, 20, 25].map(d => <option key={d} value={d}>Día {d} de cada mes</option>)}
                      </select>
                    </div>

                    {/* Días de Gracia */}
                    <div className="flex-1 w-full lg:w-auto space-y-2">
                      <label className="text-sm font-medium text-slate-900 ml-2">Días de gracia (Bloqueo)</label>
                      <input 
                        type="number" 
                        value={graceDays}
                        onChange={(e) => setGraceDays(e.target.value)}
                        className="w-full bg-slate-100/70 border-none px-6 py-2.5 rounded-full text-xs font-medium text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
                      />
                    </div>

                    {/* Estado de Protección */}
                    <div className="flex-1 w-full lg:w-auto flex items-center gap-4 bg-emerald-50/50 border border-emerald-100/50 p-4 rounded-full">
                       <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs">🛡️</div>
                       <div className="space-y-0.5">
                          <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-tight">Protección Activa</p>
                          <p className="text-[9px] text-emerald-600 font-medium">Bloqueo automático habilitado</p>
                       </div>
                    </div>

                  </div>
                </section>
              </div>
            )}

            {/* 🚧 OTROS TABS: PLACEHOLDER */}
            {['operacion', 'modulos', 'pedidos', 'soporte'].includes(activeTab) && (
              <div className="bg-white p-12 lg:p-24 rounded-[4rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-14 h-14 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center border border-slate-100 animate-pulse">
                  {activeTab === 'operacion' && <TabIcons.Operacion />}
                  {activeTab === 'modulos' && <TabIcons.Modulos />}
                  {activeTab === 'pedidos' && <TabIcons.Pedidos />}
                  {activeTab === 'soporte' && <TabIcons.Soporte />}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold uppercase tracking-tight text-slate-900 italic">Módulo en Desarrollo</h3>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest max-w-xs mx-auto leading-relaxed">Este sistema está siendo blindado por ingeniería de Fowy.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="pt-20 text-center opacity-20">
          <p className="text-[9px] font-black text-slate-900 uppercase tracking-[0.8em]">FOWY BUNKER SYSTEM &bull; MONOLITH v1.0</p>
        </footer>
      </div>
    </div>
  )
}
