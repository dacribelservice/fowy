"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export interface BusinessProximityItem {
  businessId: string;
  businessName: string;
  businessLogoUrl: string | null;
  distanceMeters: number | null;
}

interface ReelsProximityBarProps {
  businesses: BusinessProximityItem[];
  selectedBusinessId: string | null;
  onSelectBusiness: (businessId: string | null) => void;
}

function formatDistance(meters: number | null): string {
  if (meters === null || meters === undefined) return "Destacado";
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

export function ReelsProximityBar({
  businesses,
  selectedBusinessId,
  onSelectBusiness,
}: ReelsProximityBarProps) {
  return (
    <div className="w-full relative px-2">
      <div className="flex items-center gap-3.5 overflow-x-auto scroll-smooth px-2 pb-2 scrollbar-none">
        {/* Botón Todos */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectBusiness(null)}
          className="flex-shrink-0 flex flex-col items-center gap-1.5 outline-none"
        >
          <div
            className={`w-[48px] h-[48px] rounded-full flex items-center justify-center transition-all ${
              selectedBusinessId === null
                ? "bg-gradient-to-tr from-[#FF5A5F] to-[#FF9A3D] text-white shadow-md shadow-orange-500/20 ring-2 ring-[#FF5A5F] ring-offset-2"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            <Sparkles size={20} />
          </div>
          <span className="text-[10px] font-bold text-slate-700 tracking-tight">
            Todos
          </span>
        </motion.button>

        {/* Burbujas de Negocios */}
        {businesses.map((biz) => {
          const isSelected = selectedBusinessId === biz.businessId;
          return (
            <motion.button
              key={biz.businessId}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                onSelectBusiness(isSelected ? null : biz.businessId)
              }
              className="flex-shrink-0 flex flex-col items-center gap-1 outline-none max-w-[62px]"
            >
              <div
                className={`w-[48px] h-[48px] rounded-full overflow-hidden p-0.5 transition-all ${
                  isSelected
                    ? "bg-gradient-to-tr from-[#FF5A5F] to-[#FF9A3D] shadow-md shadow-orange-500/20 ring-2 ring-[#FF5A5F] ring-offset-2"
                    : "bg-slate-200/80 hover:bg-slate-300/80"
                }`}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                  <img
                    src={biz.businessLogoUrl || "/placeholder-logo.png"}
                    alt={biz.businessName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="text-[9.5px] font-bold text-slate-700 truncate w-full text-center leading-tight">
                {biz.businessName}
              </span>
              <span className="text-[8.5px] font-semibold text-slate-400 -mt-0.5">
                {formatDistance(biz.distanceMeters)}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
