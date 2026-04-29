import React from "react";
import { Compass, ShoppingBag, Map as MapIcon, User } from "lucide-react";
import Link from "next/link";

export default function ExplorerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 glass-morphism border-b border-slate-100/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/explorar" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-fowy-energy rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xl">F</span>
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tighter">FOWY</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/explorar" className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Compass size={18} />
              Descubrir
            </Link>
            <Link href="/explorar/mapa" className="text-sm font-bold text-slate-400 hover:text-fowy-orange transition-colors flex items-center gap-2">
              <MapIcon size={18} />
              Mapa
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-white/50 border border-white/20 flex items-center justify-center text-slate-400 hover:text-fowy-orange transition-colors backdrop-blur-sm shadow-sm">
              <User size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {children}
      </main>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-morphism border-t border-slate-100/50 px-6 py-3 flex items-center justify-between">
        <Link href="/explorar" className="flex flex-col items-center gap-1 text-fowy-orange">
          <Compass size={22} />
          <span className="text-[10px] font-bold">Explorar</span>
        </Link>
        <Link href="/explorar/mapa" className="flex flex-col items-center gap-1 text-slate-400">
          <MapIcon size={22} />
          <span className="text-[10px] font-bold">Mapa</span>
        </Link>
        <Link href="/explorar/pedidos" className="flex flex-col items-center gap-1 text-slate-400">
          <ShoppingBag size={22} />
          <span className="text-[10px] font-bold">Mis Pedidos</span>
        </Link>
        <Link href="/explorar/perfil" className="flex flex-col items-center gap-1 text-slate-400">
          <User size={22} />
          <span className="text-[10px] font-bold">Perfil</span>
        </Link>
      </div>
    </div>
  );
}
