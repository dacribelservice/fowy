'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function FowyAdminDashboard() {
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('view') || 'dashboard'
  
  const [activeUsers, setActiveUsers] = useState(18245)
  const [trafficData, setTrafficData] = useState([40, 70, 50, 90, 60, 100, 80, 75, 85, 95, 70, 60])
  
  // Categoras Globales
  const [categories] = useState([
    { id: '1', name: 'Hamburguesas', icon: '🍔', color: 'bg-emerald-50', count: 45 },
    { id: '2', name: 'Pizza', icon: '🍕', color: 'bg-amber-50', count: 32 },
    { id: '3', name: 'Pollo', icon: '🍗', color: 'bg-orange-50', count: 28 },
    { id: '4', name: 'Salchipapas', icon: '🍟', color: 'bg-yellow-50', count: 18 },
    { id: '5', name: 'Sushi', icon: '🍣', color: 'bg-red-50', count: 12 },
    { id: '6', name: 'Postres', icon: '🍰', color: 'bg-pink-50', count: 9 },
  ])

  // Log de Actividad
  const [activityLog] = useState([
    { id: '1', action: 'Negocio Activado', target: 'Burger Master HQ', admin: 'Cristian', time: 'hace 2 min', type: 'success' },
    { id: '2', action: 'Categoría Editada', target: 'Sushi', admin: 'Sistema', time: 'hace 15 min', type: 'info' },
    { id: '3', action: 'Negocio Desactivado', target: 'Hot Dog King', admin: 'Cristian', time: 'hace 1 hora', type: 'warning' },
    { id: '4', action: 'Nueva Categoría', target: 'Postres', admin: 'Cristian', time: 'hace 3 horas', type: 'success' },
  ])

  // Data de negocios
  const [businesses, setBusinesses] = useState([
    { id: '1', name: 'Burger Master HQ', city: 'Cali', plan: 'Premium', status: 'Activo', revenue: '$4.2M', isLive: true },
    { id: '2', name: 'Pizza Planet', city: 'Palmira', plan: 'Basic', status: 'Pendiente', revenue: '$1.8M', isLive: false },
    { id: '3', name: 'Chicken Run', city: 'Jamundí', plan: 'Premium', status: 'Activo', revenue: '$3.5M', isLive: true },
    { id: '4', name: 'Hot Dog King', city: 'Cali', plan: 'Basic', status: 'Inactivo', revenue: '$0.5M', isLive: false },
  ])

  const toggleBusinessStatus = (id: string) => {
    setBusinesses(prev => prev.map(biz => 
      biz.id === id ? { ...biz, isLive: !biz.isLive, status: !biz.isLive ? 'Activo' : 'Inactivo' } : biz
    ))
  }

  // Simulacin de trfico
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 10) - 4)
      setTrafficData(prev => [...prev.slice(1), Math.floor(Math.random() * 40) + 60])
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full animate-fade-premium">
      
      {/* 🚀 MAIN CONTENT AREA (State driven by URL) */}
      <div className="space-y-6 lg:space-y-12">
         
         {/* 1. WELCOME & STATS SECTION (Universal for Dashboard) */}
         {(activeTab === 'dashboard') && (
            <section className="bg-white p-6 lg:p-10 rounded-[2.5rem] lg:rounded-[4rem] border border-white shadow-sm">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                  <div>
                     <p className="text-slate-400 text-[8px] lg:text-[10px] font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                        <span className="w-6 h-[1px] bg-slate-200"></span>
                        Admin Control Center
                     </p>
                     <h1 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase italic text-slate-900 leading-none">
                        Vista <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 font-semibold">General</span>
                     </h1>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                     <div className="flex-1 md:flex-none bg-slate-50 px-6 py-4 rounded-[1.5rem] lg:rounded-[2rem] border border-slate-100 flex flex-col items-center">
                        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">Activos</p>
                        <p className="text-xl lg:text-2xl font-black text-slate-900 italic leading-none">{activeUsers.toLocaleString()}</p>
                     </div>
                     <div className="flex-1 md:flex-none bg-emerald-50/50 px-6 py-4 rounded-[1.5rem] lg:rounded-[2rem] border border-emerald-100 flex flex-col items-center">
                        <p className="text-[7px] font-black text-emerald-600 uppercase tracking-widest mb-1 text-center">Network</p>
                        <p className="text-xl lg:text-2xl font-black text-emerald-500 italic leading-none">UP</p>
                     </div>
                  </div>
               </div>
            </section>
         )}

         {/* 2. DIRECTORIO MAESTRO */}
         {(activeTab === 'dashboard' || activeTab === 'negocios') && (
            <section className="bg-white p-6 lg:p-10 rounded-[2.5rem] lg:rounded-[4rem] border border-white shadow-sm relative overflow-hidden">
               <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                  <h2 className="text-2xl lg:text-4xl font-black italic uppercase tracking-tighter text-slate-900">Directorio <span className="text-emerald-500">Maestro</span></h2>
                  <input 
                     type="text" placeholder="Filtrar negocios..."
                     className="w-full sm:w-64 bg-slate-50 border border-slate-100 px-6 py-3.5 rounded-full text-[9px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
               </header>

               {/* Desktop Table View */}
               <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left border-separate border-spacing-y-4">
                     <thead>
                        <tr className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-8">
                           <th className="pb-4 pl-10">Negocio</th>
                           <th className="pb-4">Ciudad</th>
                           <th className="pb-4 text-center">Switch</th>
                           <th className="pb-4 text-right pr-10">Acción</th>
                        </tr>
                     </thead>
                     <tbody>
                        {businesses.map((biz) => (
                           <tr key={biz.id} className={`group/row transition-all duration-300 ${!biz.isLive ? 'opacity-50 grayscale' : ''}`}>
                              <td className="bg-slate-50/50 py-6 pl-10 rounded-l-[2rem] border-y border-l border-slate-100">
                                 <span className="text-sm font-black text-slate-900 italic uppercase">{biz.name}</span>
                              </td>
                              <td className="bg-slate-50/50 py-6 border-y border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest">{biz.city}</td>
                              <td className="bg-slate-50/50 py-6 border-y border-slate-100 text-center">
                                 <div onClick={() => toggleBusinessStatus(biz.id)} className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${biz.isLive ? 'bg-emerald-500 shadow-md' : 'bg-slate-200'}`}>
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${biz.isLive ? 'right-1' : 'left-1'}`} />
                                 </div>
                              </td>
                              <td className="bg-slate-50/50 py-6 pr-10 rounded-r-[2rem] border-y border-r border-slate-100 text-right">
                                 <button className="text-[8px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900">Editar</button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               {/* Mobile Card View */}
               <div className="lg:hidden space-y-4">
                  {businesses.map((biz) => (
                     <div key={biz.id} className={`p-6 rounded-[2rem] border transition-all ${biz.isLive ? 'bg-slate-50/50 border-slate-100' : 'bg-slate-100/50 border-slate-200 opacity-60'}`}>
                        <div className="flex justify-between items-start">
                           <div>
                              <h4 className="text-sm font-black text-slate-900 uppercase italic leading-none">{biz.name}</h4>
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">{biz.city} &bull; {biz.plan}</p>
                           </div>
                           <div onClick={() => toggleBusinessStatus(biz.id)} className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${biz.isLive ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${biz.isLive ? 'right-1' : 'left-1'}`} />
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </section>
         )}

         {/* 3. CATEGORÍAS GLOBALES */}
         {(activeTab === 'dashboard' || activeTab === 'categorias') && (
            <section className="bg-white p-6 lg:p-10 rounded-[2.5rem] lg:rounded-[4rem] border border-white shadow-sm">
               <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                  <h2 className="text-2xl lg:text-4xl font-black italic uppercase tracking-tighter text-slate-900">Categorías <span className="text-orange-500">Globales</span></h2>
                  <button className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
                     + Crear Nueva
                  </button>
               </header>
               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
                  {categories.map((cat) => (
                     <div key={cat.id} className={`${cat.color} p-6 lg:p-8 rounded-[2rem] lg:rounded-[3rem] border border-white flex flex-col items-center justify-center gap-4 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm`}>
                        <div className="text-3xl lg:text-5xl">{cat.icon}</div>
                        <div className="text-center">
                           <p className="text-[9px] lg:text-[11px] font-black text-slate-900 uppercase italic tracking-tighter">{cat.name}</p>
                           <p className="text-[7px] lg:text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">{cat.count} Locales</p>
                        </div>
                     </div>
                  ))}
               </div>
            </section>
         )}

         {/* 4. AUDITORÍA & TRÁFICO */}
         {(activeTab === 'dashboard' || activeTab === 'auditoria') && (
            <div className="grid grid-cols-1 gap-6 lg:gap-10">
               <section className="bg-white p-6 lg:p-10 rounded-[2.5rem] lg:rounded-[4rem] border border-white shadow-sm overflow-hidden">
                  <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                     <h2 className="text-2xl lg:text-4xl font-black italic uppercase tracking-tighter text-slate-900">Radar de <span className="text-emerald-500">Tráfico</span></h2>
                  </header>
                  <div className="relative h-32 lg:h-48 w-full flex items-end gap-1.5 lg:gap-2 px-2">
                     {trafficData.map((val, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-emerald-50 to-emerald-400/30 rounded-t-xl lg:rounded-t-3xl transition-all duration-1000" style={{ height: `${val}%` }} />
                     ))}
                  </div>
               </section>

               <section className="bg-white p-6 lg:p-10 rounded-[2.5rem] lg:rounded-[4rem] border border-white shadow-sm">
                  <header className="mb-8 lg:mb-10 text-center lg:text-left">
                     <h2 className="text-2xl lg:text-4xl font-black italic uppercase tracking-tighter text-slate-900">Auditoría <span className="text-red-500">Reciente</span></h2>
                  </header>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
                     {activityLog.map((log) => (
                        <div key={log.id} className="p-5 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] bg-slate-50/50 border border-slate-100 flex items-center gap-4 lg:gap-6 hover:bg-white transition-all group">
                           <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center text-lg lg:text-xl shadow-sm ${
                              log.type === 'success' ? 'bg-emerald-50 text-emerald-600' : log.type === 'info' ? 'bg-blue-50 text-blue-500' : 'bg-red-50 text-red-500'
                           }`}>
                              {log.type === 'success' ? '✓' : log.type === 'info' ? 'ℹ' : '⚠'}
                           </div>
                           <div className="flex-1 overflow-hidden">
                              <div className="flex items-center justify-between mb-1">
                                 <h4 className="text-[9px] lg:text-[11px] font-black text-slate-900 uppercase italic tracking-tighter truncate">{log.action}</h4>
                                 <span className="text-[7px] lg:text-[8px] font-bold text-slate-300 uppercase tracking-widest">{log.time}</span>
                              </div>
                              <p className="text-[8px] lg:text-[10px] text-slate-500 font-medium uppercase tracking-tighter truncate">
                                 {log.admin} &bull; {log.target}
                              </p>
                           </div>
                        </div>
                     ))}
                  </div>
               </section>
            </div>
         )}
      </div>
    </div>
  )
}
