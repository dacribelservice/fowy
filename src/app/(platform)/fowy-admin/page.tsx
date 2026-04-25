'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

// --- COMPONENTE INTERNO QUE USA SEARCH PARAMS ---
function AdminContent() {
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('view') || 'dashboard'
  
  const [activeUsers, setActiveUsers] = useState(18245)
  const [trafficData, setTrafficData] = useState([40, 70, 50, 90, 60, 100, 80, 75, 85, 95, 70, 60])
  
  // Categorías Globales
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

  // Simulación de tráfico
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

          {/* 2. DIRECTORIO MAESTRO (Compact & Premium) */}
          {(activeTab === 'dashboard' || activeTab === 'negocios') && (
            <section className="bg-white p-6 lg:p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
               <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-800 uppercase italic">Directorio <span className="text-emerald-500/80 font-medium">Maestro</span></h2>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button 
                      onClick={() => {
                        const params = new URLSearchParams(window.location.search)
                        params.set('view', 'categorias')
                        window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`)
                        window.dispatchEvent(new Event('popstate'))
                      }}
                      className="text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-900 transition-all mr-4 border-b border-transparent hover:border-slate-900 pb-0.5"
                    >
                      Categorías
                    </button>
                    <input 
                       type="text" placeholder="Buscar..."
                       className="flex-1 sm:w-48 bg-slate-50/80 border border-slate-100 px-5 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all"
                    />
                    <button className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all">
                      + Nuevo
                    </button>
                  </div>
               </header>

               {/* Table Container */}
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="text-[8px] font-black text-slate-400 uppercase tracking-[0.25em] border-b border-slate-50">
                           <th className="pb-4 px-4 font-black">Negocio</th>
                           <th className="pb-4 px-4">Ciudad</th>
                           <th className="pb-4 px-4 text-center">Activo</th>
                           <th className="pb-4 px-4 text-right">Acciones</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {businesses.map((biz) => (
                           <tr key={biz.id} className="group transition-colors hover:bg-slate-50/50">
                              <td className="py-4 px-4">
                                 <div className="flex flex-col">
                                   <span className="text-[11px] font-bold text-slate-900 uppercase italic tracking-tight">{biz.name}</span>
                                   <span className="text-[7px] text-slate-400 font-black uppercase tracking-widest">{biz.plan} Plan</span>
                                 </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{biz.city}</span>
                              </td>
                              <td className="py-4 px-4">
                                 <div className="flex justify-center">
                                   <button 
                                      onClick={() => toggleBusinessStatus(biz.id)} 
                                      className={`w-8 h-4 rounded-full relative transition-all duration-500 ${biz.isLive ? 'bg-emerald-500 shadow-sm shadow-emerald-500/20' : 'bg-slate-200'}`}
                                   >
                                      <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-500 ${biz.isLive ? 'right-0.5' : 'left-0.5'}`} />
                                   </button>
                                 </div>
                              </td>
                              <td className="py-4 px-4">
                                 <div className="flex items-center justify-end gap-4">
                                   <Link 
                                      href={`/fowy-admin/negocios/${biz.id}`}
                                      className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors"
                                   >
                                      Editar
                                   </Link>
                                   <button 
                                      className="text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-red-500 transition-colors"
                                   >
                                      Eliminar
                                   </button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </section>
          )}

         {/* 3. CATEGORÍAS GLOBALES */}
         {(activeTab === 'dashboard' || activeTab === 'categorias') && (
            <section className="bg-white p-6 lg:p-10 rounded-[2.5rem] lg:rounded-[4rem] border border-white shadow-sm">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                   <div className="flex items-center gap-4">
                     <button 
                       onClick={() => {
                        const params = new URLSearchParams(window.location.search)
                        params.set('view', 'negocios')
                        window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`)
                        window.dispatchEvent(new Event('popstate'))
                       }}
                       className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-slate-100 transition-all"
                     >
                       ←
                     </button>
                     <h2 className="text-2xl lg:text-4xl font-black italic uppercase tracking-tighter text-slate-900">Categorías <span className="text-orange-500">Globales</span></h2>
                   </div>
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

         {/* 5. VISTAS EN DESARROLLO */}
         {(['vendedores', 'profesionales', 'finanzas', 'auditoria'].includes(activeTab)) && (
            <section className="bg-white p-12 lg:p-24 rounded-[2.5rem] lg:rounded-[4rem] border border-white shadow-sm flex flex-col items-center justify-center text-center space-y-6">
               <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-3xl animate-bounce">🚧</div>
               <div className="space-y-2">
                  <h2 className="text-2xl lg:text-4xl font-black italic uppercase tracking-tighter text-slate-900">Módulo en <span className="text-orange-500">Desarrollo</span></h2>
                  <p className="text-[10px] lg:text-[12px] text-slate-400 font-bold uppercase tracking-[0.2em]">Estamos construyendo la próxima gran funcionalidad del ecosistema Fowy.</p>
               </div>
               <Link 
                  href="/fowy-admin?view=negocios"
                  className="bg-slate-900 text-white px-10 py-4 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95"
               >
                  Volver a Negocios
               </Link>
            </section>
         )}
      </div>
    </div>
  )
}

// --- COMPONENTE PRINCIPAL CON SUSPENSE ---
export default function FowyAdminDashboard() {
  return (
    <Suspense fallback={<div className="p-20 text-center animate-pulse font-black text-slate-300 uppercase tracking-widest text-[10px]">Cargando Panel de Control...</div>}>
      <AdminContent />
    </Suspense>
  )
}
