'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  // Datos simulados para los KPIs
  const weeklyStats = [
    { day: 'Lun', sales: 450000 },
    { day: 'Mar', sales: 620000 },
    { day: 'Mie', sales: 580000 },
    { day: 'Jue', sales: 890000 },
    { day: 'Vie', sales: 1250000 },
    { day: 'Sab', sales: 1540000 },
    { day: 'Dom', sales: 980000 }
  ]

  const maxSales = Math.max(...weeklyStats.map(s => s.sales))

  // --- DATOS PARA FASE 4.3 (INTELIGENCIA) ---
  const hours = Array.from({ length: 12 }, (_, i) => `${i + 12}h`)
  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
  
  // Matriz de calor simulada (intensidad de 0 a 1)
  const heatmapData = [
    [0.1, 0.2, 0.1, 0.3, 0.5, 0.8, 0.4], // 12h
    [0.2, 0.1, 0.3, 0.4, 0.6, 0.9, 0.5], // 13h
    [0.1, 0.1, 0.2, 0.3, 0.4, 0.7, 0.3], // 14h
    [0.0, 0.1, 0.1, 0.2, 0.3, 0.4, 0.2], // 15h
    [0.1, 0.2, 0.2, 0.3, 0.5, 0.6, 0.3], // 16h
    [0.3, 0.4, 0.5, 0.6, 0.8, 0.9, 0.7], // 17h
    [0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 0.8], // 18h (Hora Pico)
    [0.6, 0.7, 0.8, 0.9, 1.0, 1.0, 0.9], // 19h
    [0.7, 0.8, 0.9, 1.0, 1.0, 1.0, 1.0], // 20h
    [0.5, 0.6, 0.7, 0.8, 0.9, 0.9, 0.8], // 21h
    [0.3, 0.4, 0.4, 0.5, 0.6, 0.7, 0.5], // 22h
    [0.1, 0.2, 0.1, 0.2, 0.3, 0.4, 0.2], // 23h
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-inter p-8 pb-20">
      {/* Header */}
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic text-white flex items-center gap-4">
            Intel <span className="text-red-600">Engine</span>
          </h1>
          <p className="text-slate-500 text-sm font-black uppercase tracking-[0.3em] mt-2">Inteligencia de Mercado &bull; Analytics</p>
        </div>
        <div className="flex gap-4">
           <Link href="/admin/inventory" className="bg-red-600 hover:bg-white hover:text-black px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-red-500/10">
              Inventario
           </Link>
           <button className="bg-white/5 border border-white/10 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
              Exportar Reporte
           </button>
        </div>
      </header>

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] backdrop-blur-xl">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Tasa de Conversión</p>
           <div className="flex items-end gap-3">
              <h2 className="text-5xl font-black tracking-tighter">12.4%</h2>
              <span className="text-xs font-black text-red-600 mb-2">PRO</span>
           </div>
           <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-red-600 w-[12.4%]" />
           </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] backdrop-blur-xl">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Visitas Hoy</p>
           <h2 className="text-5xl font-black tracking-tighter">1,248</h2>
           <p className="text-[10px] font-bold text-green-500 uppercase mt-2">+20% vs ayer</p>
        </div>

        <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] backdrop-blur-xl">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Ticket Promedio</p>
           <h2 className="text-5xl font-black tracking-tighter">$38.5k</h2>
           <p className="text-[10px] font-bold text-slate-500 uppercase mt-2">Estable</p>
        </div>

        <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] backdrop-blur-xl border-red-600/20">
           <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2">Tiempo de Sesión</p>
           <h2 className="text-5xl font-black tracking-tighter">4:12</h2>
           <p className="text-[10px] font-bold text-slate-500 uppercase mt-2">Minutos avg.</p>
        </div>
      </section>

      {/* Heatmap & Weekly Chart Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Heatmap Pro */}
        <div className="bg-white/5 border border-white/10 p-10 rounded-[4rem] backdrop-blur-3xl">
           <div className="mb-8">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">Mapa de Calor</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Intensidad de Pedidos por Hora/Día</p>
           </div>
           
           <div className="flex flex-col gap-2">
              <div className="flex gap-2 mb-2">
                 <div className="w-8" />
                 {days.map(d => <div key={d} className="flex-1 text-center text-[10px] font-black text-slate-600">{d}</div>)}
              </div>
              {heatmapData.map((row, i) => (
                <div key={i} className="flex gap-2 h-6 items-center">
                   <div className="w-8 text-right text-[9px] font-black text-slate-500 leading-none">{hours[i]}</div>
                   {row.map((val, idx) => (
                     <div 
                        key={idx} 
                        className="flex-1 h-full rounded-md transition-all duration-500 hover:scale-110 cursor-pointer"
                        style={{ 
                          backgroundColor: `rgba(220, 38, 38, ${val})`,
                          boxShadow: val > 0.8 ? '0 0 15px rgba(220, 38, 38, 0.4)' : 'none'
                        }}
                     />
                   ))}
                </div>
              ))}
           </div>
           
           <div className="mt-8 flex justify-between items-center bg-white/5 p-4 rounded-2xl">
              <span className="text-[10px] font-black uppercase text-slate-400">Insight:</span>
              <span className="text-[10px] font-black uppercase text-red-600">🚀 Hora Pico Detectada: Viernes 8:00 PM</span>
           </div>
        </div>

        {/* Weekly Progress Bar Chart */}
        <div className="bg-white/5 border border-white/10 p-10 rounded-[4rem] backdrop-blur-3xl flex flex-col justify-between">
           <div className="mb-8">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">Crecimiento Semanal</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Inyección de capital acumulada</p>
           </div>

           <div className="space-y-4">
              {weeklyStats.map(stat => (
                <div key={stat.day} className="space-y-1">
                   <div className="flex justify-between items-end px-2">
                      <span className="text-[10px] font-black uppercase text-slate-400">{stat.day}</span>
                      <span className="text-xs font-black text-white">${(stat.sales / 1000).toFixed(0)}k</span>
                   </div>
                   <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-gradient-to-r from-red-900 to-red-600 rounded-full transition-all duration-1000"
                        style={{ width: `${(stat.sales / maxSales) * 100}%` }}
                      />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Intelligence Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-red-600/10 border border-red-600/20 p-8 rounded-[3rem] flex items-start gap-4">
            <span className="text-2xl">💡</span>
            <div>
               <p className="text-xs font-black uppercase italic mb-1 text-red-600 tracking-tighter">Oportunidad</p>
               <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Tus "Pizzas" tienen una conversión mayor al 18%. Considera subirlas al inicio del menú.</p>
            </div>
         </div>
         <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] flex items-start gap-4">
            <span className="text-2xl">🔔</span>
            <div>
               <p className="text-xs font-black uppercase italic mb-1 text-white tracking-tighter">Retención</p>
               <p className="text-[10px] text-slate-400 font-medium leading-relaxed">El 60% de tus clientes regresan después de su primera compra exitosa por FOWY.</p>
            </div>
         </div>
         <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] flex items-start gap-4">
            <span className="text-2xl">⚡</span>
            <div>
               <p className="text-xs font-black uppercase italic mb-1 text-white tracking-tighter">Velocidad</p>
               <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Tu flujo de checkout está en el top 5% de la plataforma en Cali.</p>
            </div>
         </div>
      </section>

      {/* Footer Branding */}
      <footer className="mt-16 text-center">
         <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.5em]">FOWY AI Intelligence Engine &copy; 2026</p>
      </footer>
    </div>
  )
}
