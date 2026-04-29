"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import ExplorerHero from "@/components/explorer/ExplorerHero";
import ExplorerCategoryBar from "@/components/explorer/ExplorerCategoryBar";
import ExplorerBusinessCard from "@/components/explorer/ExplorerBusinessCard";
import { Map as MapIcon, Loader2, SearchX } from "lucide-react";
import Link from "next/link";

export default function ExplorarPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch Categories
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      setCategories(catData || []);

      // Fetch Businesses
      let query = supabase
        .from('businesses')
        .select('*, categories(name)')
        .eq('status', true);

      if (selectedCategoryId) {
        query = query.eq('category_id', selectedCategoryId);
      }

      const { data: busData, error } = await query
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBusinesses(busData || []);

    } catch (error) {
      console.error("Error fetching explorer data:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase, selectedCategoryId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="pb-32 bg-white min-h-screen">
      <ExplorerHero />

      <div className="max-w-7xl mx-auto">
        {/* Categories Section */}
        <section className="mb-8">
          <ExplorerCategoryBar 
            categories={categories} 
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />
        </section>

        {/* Business Grid */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              {selectedCategoryId 
                ? `Negocios en ${categories.find(c => c.id === selectedCategoryId)?.name}`
                : "Todos los Negocios"}
            </h2>
            <Link 
              href="/explorar/mapa"
              className="flex items-center gap-2 text-fowy-orange font-bold text-sm hover:underline"
            >
              <MapIcon size={18} />
              Ver en Mapa
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-fowy-orange animate-spin" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Cargando el centro comercial...</p>
            </div>
          ) : businesses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business, index) => (
                <ExplorerBusinessCard 
                  key={business.id} 
                  business={{
                    ...business,
                    category_name: business.categories?.name
                  }} 
                  index={index} 
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
                <SearchX size={32} />
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-1">No hay negocios aquí</h3>
              <p className="text-sm text-slate-400 font-medium">Intenta con otra categoría o busca algo más.</p>
              <button 
                onClick={() => setSelectedCategoryId(null)}
                className="mt-6 px-6 py-3 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-widest"
              >
                Ver todos los negocios
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
