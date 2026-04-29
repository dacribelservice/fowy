"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

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

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
      setScrollProgress(isNaN(progress) ? 0 : progress);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div className="relative pt-6 pb-4">
      {/* Scrollable Container */}
      <div 
        ref={scrollRef}
        className="flex items-center gap-4 overflow-x-auto px-4 no-scrollbar scroll-smooth"
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

      {/* Custom Scroll Indicator (Interactivo y Funcional) */}
      <div className="flex justify-center mt-4">
        <div 
          className="w-32 h-[4px] bg-slate-100 rounded-full relative cursor-pointer overflow-hidden group"
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
            className="absolute inset-y-0 left-0 bg-fowy-orange rounded-full"
            style={{ width: "35%" }}
            animate={{ x: `${(scrollProgress * (100 - 35)) / 100}%` }}
            transition={{ type: "spring", damping: 25, stiffness: 150, mass: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}
