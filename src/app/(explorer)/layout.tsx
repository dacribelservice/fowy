"use client";
import React, { useState } from "react";
import { MobileFrame } from "@/components/explorer/MobileFrame";
import { PageTransition } from "@/components/explorer/PageTransition";
import { Search, User, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExplorerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <MobileFrame>
      <div className="flex flex-col h-full bg-transparent relative overflow-hidden">
        {/* Minimalist Floating Header */}
        <nav className="absolute top-6 left-6 right-6 z-50 flex items-center justify-end gap-3 pointer-events-none">
          {/* Profile Circle */}
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-xl border border-white/40 flex items-center justify-center text-slate-800 shadow-xl pointer-events-auto hover:scale-105 active:scale-95 transition-all flex-shrink-0"
          >
            <User size={22} strokeWidth={2.5} />
          </motion.button>
          
          {/* Expanding Search Engine */}
          <motion.div 
            layout
            initial={false}
            animate={{ 
              width: isSearchOpen ? "calc(100% - 60px)" : "48px",
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


