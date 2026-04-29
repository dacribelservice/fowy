"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  image_url: string;
}

interface ExplorerCategoryBarProps {
  categories: Category[];
  selectedCategoryId?: string | null;
  onSelectCategory: (id: string | null) => void;
}

export default function ExplorerCategoryBar({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: ExplorerCategoryBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [indicatorWidth, setIndicatorWidth] = useState(30);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      
      if (maxScroll <= 0) {
        setScrollProgress(0);
        setIndicatorWidth(100);
        return;
      }

      const progress = (scrollLeft / maxScroll) * 100;
      setScrollProgress(progress);

      // Calculate thumb width based on visible ratio (min 20%, max 80%)
      const width = Math.min(Math.max((clientWidth / scrollWidth) * 100, 20), 80);
      setIndicatorWidth(width);
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; 
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
      // Ejecutar una vez al inicio para verificar si hay scroll inicial
      handleScroll();
      
      // Observar cambios en el tamaño (por si se cargan más categorías)
      const resizeObserver = new ResizeObserver(() => handleScroll());
      resizeObserver.observe(el);
      
      return () => {
        el.removeEventListener("scroll", handleScroll);
        resizeObserver.disconnect();
      };
    }
  }, [categories]);

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -150 : 150;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Decidir si mostrar la barra (solo si hay contenido scrolleable)
  const showScrollbar = scrollRef.current ? scrollRef.current.scrollWidth > scrollRef.current.clientWidth : false;

  return (
    <div className="relative pt-6 pb-4">
      {/* Scrollable Container */}
      <div 
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseUp}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        className="flex items-center gap-4 overflow-x-auto px-6 no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing select-none"
      >
        {categories.map((cat, index) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex-shrink-0 flex flex-col items-center gap-2 group transition-all ${
                isSelected ? "opacity-100" : "opacity-60 hover:opacity-100"
              }`}
            >
              <div className={`w-14 h-14 rounded-full p-[2px] transition-all overflow-hidden relative border-2 ${
                isSelected 
                  ? "border-fowy-orange shadow-lg shadow-fowy-orange/20 scale-110" 
                  : "border-transparent bg-white group-hover:border-slate-100"
              }`}>
                <img
                  src={cat.image_url || "/placeholder-category.png"}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest max-w-[70px] truncate text-center ${
                isSelected ? "text-fowy-orange" : "text-slate-500"
              }`}>
                {cat.name}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Custom Scroll Indicator con Flechas Clásicas */}
      <AnimatePresence>
        {showScrollbar && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center justify-center mt-2 px-6"
          >
            <div className="flex items-center bg-white/80 backdrop-blur-sm border border-orange-100 rounded-full h-10 px-3 shadow-lg shadow-orange-500/5">
              <button 
                onClick={() => scrollByAmount('left')}
                className="p-1.5 text-fowy-orange hover:bg-orange-50 rounded-full transition-colors active:scale-90"
                title="Scroll Izquierda"
              >
                <ArrowLeft size={18} strokeWidth={2.5} />
              </button>

              <div 
                className="w-32 h-[6px] bg-slate-100 mx-3 rounded-full relative cursor-pointer overflow-hidden border border-slate-50"
                onClick={(e) => {
                  if (scrollRef.current) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickPos = (e.clientX - rect.left) / rect.width;
                    const scrollTarget = (scrollRef.current.scrollWidth - scrollRef.current.clientWidth) * clickPos;
                    scrollRef.current.scrollTo({ left: scrollTarget, behavior: 'smooth' });
                  }
                }}
              >
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-fowy-orange to-orange-400 rounded-full shadow-[0_0_8px_rgba(255,92,0,0.3)]"
                  style={{ width: `${indicatorWidth}%` }}
                  animate={{ x: `${(scrollProgress * (100 - indicatorWidth)) / 100}%` }}
                  transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.5 }}
                />
              </div>

              <button 
                onClick={() => scrollByAmount('right')}
                className="p-1.5 text-fowy-orange hover:bg-orange-50 rounded-full transition-colors active:scale-90"
                title="Scroll Derecha"
              >
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
