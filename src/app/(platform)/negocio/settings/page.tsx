'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function settingsPage() {
  const [formData, setFormData] = useState({
    name: 'Pizzería Solar',
    whatsapp: '573000000000',
    primaryColor: '#dc2626',
    slogan: 'El sabor que viaja a la velocidad de la luz',
    bannerImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000'
  })

  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      alert("¡Identidad de Marca actualizada con éxito! ✨")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-inter p-8 pb-32 selection:bg-red-500 selection:text-white">
      {/* Header */}
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 animate-fade-premium">
        <div>
           <Link href="/negocio" className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] mb-2 block hover:translate-x-1 transition-transform">← Volver al Panel</Link>
           <h1 className="text-5xl font-black tracking-tighter uppercase italic text-slate-900">Configuración de <span className="text-red-600">Marca</span></h1>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className={`px-10 py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl 
            ${saving ? 'bg-slate-100 text-slate-400 scale-95' : 'bg-slate-900 text-white hover:bg-red-600 shadow-slate-200 active:scale-95'}`}
        >
          {saving ? 'Guardando...' : 'Publicar Cambios'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Formulario de Ajustes */}
        <section className="lg:col-span-7 space-y-8">
           {/* Perfil General */}
           <div className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-sm">
              <h3 className="text-xl font-black uppercase italic tracking-tighter mb-8 border-b border-slate-50 pb-4">Información Core</h3>
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-4">Nombre del Negocio</label>
                    <input 
                       type="text" 
                       value={formData.name}
                       onChange={e => setFormData({...formData, name: e.target.value})}
                       className="w-full bg-slate-50 border border-slate-100 h-16 rounded-full px-8 text-sm font-bold focus:border-red-600 focus:bg-white outline-none transition-all"
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-4">Enlace de WhatsApp (3.4 Order Engine)</label>
                    <input 
                       type="text" 
                       value={formData.whatsapp}
                       onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                       className="w-full bg-slate-50 border border-slate-100 h-16 rounded-full px-8 text-sm font-bold focus:border-red-600 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                       placeholder="Ej: 57300..."
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-4">Eslogan de Marca</label>
                    <input 
                       type="text" 
                       value={formData.slogan}
                       onChange={e => setFormData({...formData, slogan: e.target.value})}
                       className="w-full bg-slate-50 border border-slate-100 h-16 rounded-full px-8 text-sm font-bold focus:border-red-600 focus:bg-white outline-none transition-all"
                    />
                 </div>
              </div>
           </div>

           {/* Identidad Visual */}
           <div className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-sm">
              <h3 className="text-xl font-black uppercase italic tracking-tighter mb-8 border-b border-slate-50 pb-4">Vibe Visual</h3>
              <div className="grid grid-cols-2 gap-8">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-4">Color de Acento</label>
                    <div className="flex gap-3">
                       {['#dc2626', '#d97706', '#059669', '#2563eb', '#7c3aed'].map(color => (
                         <button 
                            key={color}
                            onClick={() => setFormData({...formData, primaryColor: color})}
                            className={`w-10 h-10 rounded-full border-2 transition-all ${formData.primaryColor === color ? 'border-slate-900 scale-110 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'}`}
                            style={{ backgroundColor: color }}
                         />
                       ))}
                    </div>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-4">Logo (.PNG)</label>
                    <button className="w-full h-12 bg-slate-50 border border-slate-100 border-dashed rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all text-slate-400">Subir Archivo</button>
                 </div>
              </div>
           </div>
        </section>

        {/* Live Preview Section */}
        <section className="lg:col-span-5 h-fit sticky top-8">
           <div className="bg-white border border-slate-100 p-4 rounded-[4.5rem] shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-0" />
              
              <div className="text-center py-6 relative z-10">
                 <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mb-4 block">Vista en Vivo del Menú</span>
              </div>
              
              {/* Menú Preview Mockup */}
              <div className="bg-white rounded-[3.5rem] overflow-hidden min-h-[520px] border border-slate-100 shadow-inner relative z-10">
                 <div className="relative h-48 w-full group">
                    <Image src={formData.bannerImage} alt="Banner" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-8 left-8">
                       <h4 className="text-white text-3xl font-black italic uppercase tracking-tighter leading-none">{formData.name}</h4>
                       <div className="flex items-center gap-2 mt-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-[9px] text-white/70 font-black uppercase tracking-widest">Menú Digital Activo</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="p-8 space-y-6">
                    <div className="flex gap-3 overflow-hidden">
                       {['Todos', 'Combos', 'Pizzas'].map(c => (
                         <div key={c} className={`h-8 px-5 rounded-full flex items-center justify-center text-[8px] font-black uppercase tracking-widest transition-all
                           ${c === 'Todos' ? 'text-white shadow-lg' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}
                           style={{ backgroundColor: c === 'Todos' ? formData.primaryColor : undefined }}
                         >{c}</div>
                       ))}
                    </div>
                    
                    <div className="space-y-4">
                       {[1,2].map(i => (
                         <div key={i} className="flex gap-4 items-center bg-slate-50/50 p-4 rounded-[2rem] border border-slate-100">
                            <div className="w-14 h-14 bg-slate-100 rounded-[1.2rem] border border-slate-200 shadow-inner" />
                            <div className="flex-1">
                               <div className="h-3 w-20 bg-slate-200 rounded-full mb-2" />
                               <div className="h-2 w-10 bg-slate-100 rounded-full" />
                            </div>
                            <div className="w-8 h-8 rounded-full shadow-lg" style={{ backgroundColor: formData.primaryColor }} />
                         </div>
                       ))}
                    </div>
                    
                    <div className="pt-8 text-center">
                       <p className="text-slate-400 text-[10px] italic font-medium leading-tight">"{formData.slogan}"</p>
                    </div>
                 </div>
              </div>
              
              <div className="flex justify-center gap-3 py-6">
                 <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center text-xs shadow-sm">📱</div>
                 <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center text-xs shadow-sm">💻</div>
                 <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center text-xs shadow-sm">🔗</div>
              </div>
           </div>
        </section>
      </div>

      {/* Footer Branding */}
      <footer className="mt-20 text-center">
         <div className="w-12 h-1 bg-slate-100 rounded-full mx-auto mb-6" />
         <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">FOWY Design System Engine &copy; 2026</p>
      </footer>
    </div>
  )
}
