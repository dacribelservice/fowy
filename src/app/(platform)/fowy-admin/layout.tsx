'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

// Minimalist Icons
const Icons = {
  Dashboard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
  ),
  Business: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  ),
  Categories: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
  ),
  Audit: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  Menu: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
  ),
  Plus: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
  )
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentView = searchParams.get('view') || 'dashboard'
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isFabOpen, setIsFabOpen] = useState(false)

  const adminViews = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard },
    { id: 'negocios', label: 'Negocios', icon: Icons.Business },
    { id: 'categorias', label: 'Categorías', icon: Icons.Categories },
    { id: 'auditoria', label: 'Auditoría', icon: Icons.Audit },
  ]

  const setView = (viewId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('view', viewId)
    router.push(`${pathname}?${params.toString()}`)
    setIsSidebarOpen(false)
    setIsFabOpen(false)
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-poppins text-slate-900 overflow-x-hidden relative">
      
      {/* ⬅️ SIDEBAR */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-[100] h-screen lg:h-[calc(100vh-3rem)] 
        transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)
        ${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0 w-72'}
        m-0 lg:m-6 bg-white/90 lg:bg-white/40 backdrop-blur-3xl border-r lg:border border-white flex flex-col rounded-none lg:rounded-[2.5rem] shadow-2xl lg:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)]
      `}>
        <div className="p-10 flex justify-between items-center">
          <Link href="/fowy-admin" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-tr from-red-600 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-lg shadow-red-500/20">F</div>
            <span className="text-xl font-bold tracking-tighter uppercase italic">FOWY <span className="text-red-600 font-medium">PRO</span></span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 p-2 hover:text-slate-900">&times;</button>
        </div>

        <nav className="flex-1 px-6 space-y-3 overflow-y-auto pt-4">
          <p className="px-6 text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Master Control</p>
          {adminViews.map((item) => {
            const isActive = currentView === item.id
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-500 ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-xl shadow-red-500/20 scale-[1.02]'
                    : 'text-slate-400 hover:bg-orange-50/50 hover:text-orange-600 hover:translate-x-1'
                }`}
              >
                <item.icon />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="p-8">
          <div className="bg-white/50 p-5 rounded-[2rem] border border-slate-100 flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl border border-white shadow-sm" />
            <div className="flex-1 overflow-hidden text-left">
              <p className="text-[10px] font-bold uppercase text-slate-900 truncate">Cristian Admin</p>
              <p className="text-[9px] font-medium uppercase text-slate-400 mt-0.5">Admin Master</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 🔘 FLOATING ACTION BUTTON */}
      <div className="lg:hidden fixed bottom-8 right-8 z-[110]">
         <div className={`flex flex-col gap-4 mb-4 transition-all duration-500 ease-out ${
            isFabOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
         }`}>
            {adminViews.map((item, i) => (
               <button 
                  key={item.id}
                  onClick={() => setView(item.id)}
                  style={{ transitionDelay: `${i * 50}ms` }}
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border border-white backdrop-blur-3xl transition-transform active:scale-90 ${
                     currentView === item.id ? 'bg-slate-900 text-white' : 'bg-white/90 text-slate-400'
                  }`}
               >
                  <item.icon />
               </button>
            ))}
         </div>

         <button 
            onClick={() => setIsFabOpen(!isFabOpen)}
            className={`w-16 h-16 rounded-full bg-gradient-to-tr from-red-600 to-orange-500 text-white flex items-center justify-center shadow-[0_15px_40px_-10px_rgba(239,68,68,0.5)] transition-all duration-500 hover:scale-110 active:scale-95 ${
               isFabOpen ? 'rotate-[135deg]' : ''
            }`}
         >
            <Icons.Plus />
         </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/70 backdrop-blur-2xl border border-white rounded-none lg:rounded-[2rem] sticky top-0 lg:top-6 z-40 px-4 lg:px-8 flex items-center justify-between shadow-sm lg:mx-6 lg:mb-6 transition-all">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <Icons.Menu />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <h2 className="text-[8px] lg:text-[9px] font-bold uppercase tracking-[0.2em] lg:tracking-[0.4em] text-slate-400">Core Network Live</h2>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-900 px-6 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest border border-slate-900/10 hover:bg-slate-900 hover:text-white transition-all whitespace-nowrap">
              Log Out
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-6 lg:pr-10 animate-in fade-in duration-700 w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function FowyAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center font-black text-slate-300 uppercase tracking-widest text-[10px]">Cargando Sistema...</div>}>
      <AdminLayoutContent>
        {children}
      </AdminLayoutContent>
    </Suspense>
  )
}
