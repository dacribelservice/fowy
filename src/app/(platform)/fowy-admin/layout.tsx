'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Minimalist Icons
const Icons = {
  Dashboard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
  ),
  Profile: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  Business: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  ),
  Ratios: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
  ),
  Config: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
  ),
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  Bell: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
  )
}

export default function FowyAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', href: '/fowy-admin', icon: Icons.Dashboard },
    { name: 'Profile', href: '/fowy-admin/profile', icon: Icons.Profile },
    { name: 'Business', href: '/fowy-admin/business', icon: Icons.Business },
    { name: 'Ratios', href: '/fowy-admin/ratios', icon: Icons.Ratios },
    { name: 'Config', href: '/fowy-admin/config', icon: Icons.Config },
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20 font-poppins text-slate-900">
      {/* Sidebar - Glassmorphism */}
      <aside className="w-72 m-6 mr-0 bg-white/40 backdrop-blur-3xl border border-white flex flex-col fixed h-[calc(100vh-3rem)] z-20 rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)]">
        <div className="p-10">
          <Link href="/fowy-admin" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-tr from-red-600 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-base transition-transform group-hover:rotate-12 shadow-lg shadow-red-500/20">F</div>
            <span className="text-xl font-bold tracking-tighter uppercase italic">FOWY <span className="text-red-600 font-medium">PRO</span></span>
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {navItems.map((Item) => {
            const isActive = pathname === Item.href
            return (
              <Link
                key={Item.href}
                href={Item.href}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-xl shadow-red-500/20 scale-[1.02]'
                    : 'text-slate-400 hover:bg-orange-50/50 hover:text-orange-600 hover:translate-x-1'
                }`}
              >
                <Item.icon />
                {Item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-8">
          <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-200 rounded-xl overflow-hidden border border-white shadow-sm">
              <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[10px] font-bold uppercase text-slate-900 truncate">Cristian Admin</p>
              <p className="text-[9px] font-medium uppercase text-slate-400 mt-0.5">Admin Master</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-[21rem] flex flex-col p-6 pr-10">
        {/* Header - Glassmorphism */}
        <header className="h-20 bg-white/30 backdrop-blur-2xl border border-white rounded-[2rem] sticky top-6 z-10 px-8 flex items-center justify-between shadow-sm mb-10">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <h2 className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-400">Core Network Live</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-2">
               <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"><Icons.Search /></button>
               <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors relative">
                <Icons.Bell />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
               </button>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <button className="text-slate-900 px-6 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest border border-slate-900/10 hover:bg-slate-900 hover:text-white transition-all">
              Log Out
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="animate-in fade-in duration-700">
          {children}
        </main>
      </div>
    </div>
  )
}
