"use client";

import React, { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, Filter } from "lucide-react";
import Link from "next/link";

const ExplorerMap = dynamic(() => import("@/components/explorer/ExplorerMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
      <Loader2 className="w-10 h-10 text-fowy-orange animate-spin" />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Cargando mapa interactivo...</p>
    </div>
  )
});

export default function MapaPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchBusinesses = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('businesses')
        .select('*, categories(name)')
        .eq('status', true)
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (error) throw error;
      setBusinesses(data || []);
    } catch (error) {
      console.error("Error fetching map businesses:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  return (
    <div className="fixed inset-0 pt-16 flex flex-col">
      {/* Subheader */}
      <div className="bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <Link 
            href="/explorar"
            className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-fowy-orange transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none">Mapa de Descubrimiento</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {businesses.length} Negocios cerca de ti
            </p>
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest">
          <Filter size={14} />
          Filtros
        </button>
      </div>

      <div className="flex-1 relative">
        <ExplorerMap businesses={businesses.map(b => ({
          ...b,
          category_name: b.categories?.name
        }))} />
      </div>
    </div>
  );
}
