'use client'

import { useState } from 'react'

export default function FowyAdminDashboard() {
  const [selectedKpi, setSelectedKpi] = useState<string | null>('revenue')

  const kpis = [
    { id: 'revenue', label: 'Total Revenue', value: '$42,850', trend: '+12.5%', icon: '💰' },
    { id: 'users', label: 'Active Users', value: '18,245', trend: '+5.2%', icon: '👥' },
    { id: 'nodes', label: 'Network Nodes', value: '56', trend: '+2', icon: '🌐' },
  ]

  return (
    <div className="space-y-12 pb-20">
      {/* Welcome Section */}
      <section className="relative">
        <h1 className="text-6xl font-bold tracking-tighter uppercase italic text-slate-900 leading-none">
          Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 font-semibold">Intelligence</span>
        </h1>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] mt-6 ml-1 flex items-center gap-3">
          <span className="w-6 h-[1px] bg-slate-200"></span>
          Master Control Environment
        </p>
      </section>

      {/* Selectable KPIs Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi) => (
          <div 
            key={kpi.id}
            onClick={() => setSelectedKpi(kpi.id)}
            className={`p-8 rounded-[2.5rem] border transition-all duration-500 cursor-pointer relative overflow-hidden group ${
              selectedKpi === kpi.id 
                ? 'bg-gradient-to-r from-red-600 to-orange-500 border-transparent text-white shadow-2xl shadow-red-500/30 scale-[1.02]' 
                : 'bg-white/60 backdrop-blur-xl border-white text-slate-900 hover:bg-orange-50/50 hover:shadow-xl hover:shadow-orange-200/40 hover:-translate-y-1'
            }`}
          >
            {/* Minimalist Background Icon for hover */}
            <div className={`absolute -right-4 -bottom-4 text-6xl opacity-5 transition-transform duration-700 group-hover:scale-150 group-hover:-rotate-12 ${
              selectedKpi === kpi.id ? 'text-white' : 'text-slate-900'
            }`}>
              {kpi.icon}
            </div>

            <div className="relative z-10">
              <p className={`text-[9px] font-bold uppercase tracking-widest mb-4 ${
                selectedKpi === kpi.id ? 'text-white/70' : 'text-slate-400'
              }`}>{kpi.label}</p>
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-3xl font-bold tracking-tighter mb-1">{kpi.value}</h3>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${
                    selectedKpi === kpi.id ? 'text-white/80' : 'text-green-500'
                  }`}>{kpi.trend}</p>
                </div>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-inner ${
                  selectedKpi === kpi.id ? 'bg-white/20' : 'bg-slate-50 text-slate-400'
                }`}>
                  {/* Replace with SVG for actual production */}
                  <span className="opacity-80">
                    {kpi.id === 'revenue' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
                    {kpi.id === 'users' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
                    {kpi.id === 'nodes' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {/* Progress Ring Card */}
        <div className="bg-white/60 backdrop-blur-xl p-10 rounded-[3rem] border border-white shadow-sm relative group hover:shadow-2xl hover:shadow-orange-200/50 hover:bg-orange-50/50 cursor-pointer transition-all duration-500">
          <div className="flex justify-between items-start mb-10">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-orange-600 transition-colors">Network Growth</p>
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-orange-100 group-hover:border-orange-200 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-orange-600"><path d="m12 14 4-4-4-4"/><path d="M3 3.4c3 3 9 9 12 12"/><path d="M15 15.4c.5.5.5 1.1 0 1.6l-2 2c-.5.5-1.1.5-1.6 0l-1-1"/></svg>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-50 group-hover:stroke-orange-100 transition-colors" />
                <circle 
                  cx="48" cy="48" r="42" fill="none" stroke="url(#statsGradient)" strokeWidth="8" 
                  strokeDasharray="264" strokeDashoffset="66" strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="statsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#dc2626" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute text-xl font-bold text-slate-900 tracking-tighter group-hover:text-orange-700 transition-colors">75%</span>
            </div>
            <div>
              <h2 className="text-4xl font-bold tracking-tighter text-slate-900 leading-none group-hover:text-orange-900 transition-colors">124</h2>
              <p className="text-[9px] font-bold text-green-500 uppercase mt-2 tracking-widest">+15% week</p>
            </div>
          </div>
        </div>

        {/* Gradient Bar Chart Card */}
        <div className="bg-white/60 backdrop-blur-xl p-10 rounded-[3rem] border border-white shadow-sm group hover:shadow-2xl hover:shadow-orange-200/50 hover:bg-orange-50/50 cursor-pointer transition-all duration-500">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-10 group-hover:text-orange-600 transition-colors">Order Volume</p>
          <div className="flex items-end gap-2.5 h-24 mb-8">
            {[0.4, 0.7, 0.5, 0.9, 0.6, 1.0, 0.8].map((val, i) => (
              <div key={i} className="flex-1 bg-slate-50 rounded-full relative overflow-hidden group/bar group-hover:bg-orange-100 transition-colors">
                <div 
                  className="absolute bottom-0 w-full bg-gradient-to-t from-red-600 to-orange-500 rounded-full transition-all duration-1000"
                  style={{ height: `${val * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold tracking-tighter text-slate-900 group-hover:text-orange-900 transition-colors">8,432</h2>
            <div className="bg-slate-900/5 text-slate-900 px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest group-hover:bg-orange-600 group-hover:text-white transition-all">Real-time</div>
          </div>
        </div>
      </div>

      {/* Featured Card Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2">
            <section className="bg-white/20 backdrop-blur-3xl border border-white p-10 rounded-[4rem] flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm h-full">
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 bg-gradient-to-tr from-red-600 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-red-500/20">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold uppercase italic tracking-tighter text-slate-900 leading-none mb-2">System Integrity</h3>
                  <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Nodes are operating at 99.9% uptime.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="bg-white text-slate-400 px-8 py-4 rounded-full text-[9px] font-bold uppercase tracking-widest border border-slate-100 hover:text-slate-900 transition-all">Logs</button>
                <button className="bg-slate-900 text-white px-8 py-4 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-red-600 transition-all">Settings</button>
              </div>
            </section>
         </div>

         {/* Featured Card - Minimalist Dark */}
         <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl shadow-slate-900/20 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-red-600/20 to-orange-500/20 rounded-full blur-[60px] -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-4">Strategic Node</p>
            <h2 className="text-3xl font-bold tracking-tighter text-white leading-tight uppercase italic mb-8">
              Cali <span className="text-orange-500 font-semibold">Peak</span> Performance
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500 font-bold uppercase tracking-widest">Efficiency</span>
                <span className="text-white font-bold tracking-tighter">85%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-600 to-orange-500 w-[85%]" />
              </div>
            </div>
            <button className="mt-10 w-full bg-white text-slate-900 py-4 rounded-2xl text-[9px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-all">
              Analysis Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
