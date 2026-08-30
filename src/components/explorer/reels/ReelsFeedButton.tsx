"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clapperboard } from "lucide-react";

interface ReelsFeedButtonProps {
  onClick: () => void;
}

export function ReelsFeedButton({ onClick }: ReelsFeedButtonProps) {
  const handlePrefetch = () => {
    void import("@/components/explorer/reels/ReelsFeedModal");
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      onMouseEnter={handlePrefetch}
      onTouchStart={handlePrefetch}
      className="w-14 h-14 bg-gradient-to-tr from-[#FF5A5F] via-[#FF7A45] to-[#FF9A3D] rounded-full shadow-2xl flex items-center justify-center text-white border border-white/30 relative group shadow-orange-500/30"
      title="Ver Fowy Reels"
    >
      <Clapperboard size={24} className="group-hover:rotate-6 transition-transform" />

      {/* Indicador de pulso activo */}
      <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-orange-500 border-2 border-white" />
      </span>
    </motion.button>
  );
}
