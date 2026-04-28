"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, AlertCircle } from "lucide-react";

interface PremiumImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackType?: "logo" | "category" | "generic";
}

export default function PremiumImage({ src, alt, className = "", fallbackType = "generic" }: PremiumImageProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const [displaySrc, setDisplaySrc] = useState(src);

  useEffect(() => {
    setStatus("loading");
    setDisplaySrc(src);
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-slate-50 flex items-center justify-center ${className}`}>
      {/* Loading Skeleton */}
      <AnimatePresence>
        {status === "loading" && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center"
          >
            <ImageIcon className="text-slate-200" size={24} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error / Placeholder State */}
      <AnimatePresence>
        {status === "error" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center p-2 text-center"
          >
            {fallbackType === "logo" ? (
              <div className="w-full h-full flex items-center justify-center bg-fowy-orange/5 text-fowy-orange/30">
                <span className="font-black text-[10px] uppercase tracking-tighter">{alt.slice(0, 2)}</span>
              </div>
            ) : (
              <AlertCircle className="text-slate-300" size={20} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actual Image */}
      <img
        src={displaySrc}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-500 ${
          status === "loaded" ? "opacity-100 scale-100" : "opacity-0 scale-105"
        }`}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
      />
    </div>
  );
}
