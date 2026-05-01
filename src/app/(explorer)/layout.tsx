"use client";
import React, { useState, useEffect } from "react";
import { MobileFrame } from "@/components/explorer/MobileFrame";
import { PageTransition } from "@/components/explorer/PageTransition";
import { Search, User, X, LogIn, Heart, FileText, LogOut, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function ExplorerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <MobileFrame>
      <div className="flex flex-col h-full bg-transparent relative overflow-hidden">
        {/* Minimalist Floating Header */}
        <nav className="absolute top-6 left-6 right-6 z-50 flex items-center justify-end gap-3 pointer-events-none">


          <div className="flex items-center gap-3">
            {/* Expanding Search Engine */}
            <motion.div 
              layout
              initial={false}
              animate={{ 
                width: isSearchOpen ? "calc(100% - 132px)" : "48px",
              }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              className="h-12 bg-white/80 backdrop-blur-xl border border-white/40 rounded-full shadow-xl pointer-events-auto flex items-center overflow-hidden"
            >
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="w-12 h-12 flex items-center justify-center text-slate-800 flex-shrink-0 hover:bg-white/10 transition-colors"
              >
                {isSearchOpen ? <X size={20} strokeWidth={2.5} /> : <Search size={22} strokeWidth={2.5} />}
              </button>
              
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.input
                    autoFocus
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    type="text"
                    placeholder="¿Qué buscas hoy?"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-sm font-bold text-slate-800 placeholder:text-slate-400 pr-4"
                  />
                )}
              </AnimatePresence>
            </motion.div>

            {/* Profile / Login Button with Loading Shield */}
            {isLoading ? (
              <div className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-xl border border-white/20 animate-pulse flex-shrink-0" />
            ) : user ? (
              <div className="relative pointer-events-auto">
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`w-12 h-12 rounded-full backdrop-blur-xl border flex items-center justify-center text-slate-800 shadow-xl transition-all flex-shrink-0 ${
                    isMenuOpen ? 'bg-slate-800 text-white border-slate-700' : 'bg-white/80 border-white/40 hover:scale-105'
                  }`}
                >
                  {isMenuOpen ? <X size={20} strokeWidth={2.5} /> : <User size={22} strokeWidth={2.5} />}
                </motion.button>

                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-16 right-0 w-64 bg-white/90 backdrop-blur-2xl border border-white/40 rounded-[24px] shadow-2xl overflow-hidden p-2"
                    >
                      <div className="flex flex-col gap-1">
                        {/* User Header */}
                        <div className="px-4 py-3 mb-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Sesión iniciada</p>
                          <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
                        </div>

                        {/* Menu Options */}
                        {[
                          { icon: User, label: "Perfil", disabled: true },
                          { icon: Heart, label: "Favoritos", disabled: true },
                          { icon: FileText, label: "Términos y condiciones", disabled: true },
                        ].map((item, idx) => (
                          <button
                            key={idx}
                            disabled={item.disabled}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-[16px] text-slate-600 hover:bg-slate-50 transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <item.icon size={18} strokeWidth={2} className="text-slate-400 group-hover:text-slate-800 transition-colors" />
                              <span className="text-sm font-bold">{item.label}</span>
                            </div>
                            <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-800 transition-colors" />
                          </button>
                        ))}

                        <div className="h-px bg-slate-100 my-1 mx-2" />

                        {/* Logout Button */}
                        <button
                          onClick={async () => {
                            await supabase.auth.signOut();
                            setIsMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-4 rounded-[16px] text-red-500 hover:bg-red-50 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all">
                            <LogOut size={16} strokeWidth={2.5} />
                          </div>
                          <span className="text-sm font-black uppercase tracking-wider">Cerrar sesión</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className="pointer-events-auto">
                <motion.button 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-[14px] py-[5px] rounded-full bg-gradient-to-r from-[#FF5A5F] to-[#FF9A3D] text-white text-[10px] font-black uppercase tracking-[2px] shadow-lg shadow-orange-500/20 flex items-center gap-2 group border border-white/20 transition-all"
                >
                  <LogIn size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  <span>Iniciar</span>
                </motion.button>
              </Link>
            )}
          </div>
        </nav>

        {/* Content Area (Full Map Background) */}
        <main className="flex-1 relative">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </MobileFrame>
  );
}


