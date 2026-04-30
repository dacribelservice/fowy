"use client";
import React, { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import ExplorerCategoryBar from "@/components/explorer/ExplorerCategoryBar";
import { Loader2, Star, ChevronRight, Navigation, Plus } from "lucide-react";
import Link from "next/link";

// Dynamic Import for Map (SSR: false)
const ExplorerMap = dynamic(() => import("@/components/explorer/ExplorerMap"), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
    </div>
  )
});

export default function ExplorarPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<any | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Request Geolocation on Startup
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error("Geolocation error:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Calculate distance between two coordinates
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) return 0;
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

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

      const { data: busData, error } = await query;

      if (error) throw error;
      
      let sortedBus = busData || [];
      
      // Sort by proximity if user location is available
      if (userLocation && sortedBus.length > 0) {
        sortedBus = [...sortedBus].sort((a, b) => {
          const distA = getDistance(userLocation[0], userLocation[1], Number(a.latitude), Number(a.longitude));
          const distB = getDistance(userLocation[0], userLocation[1], Number(b.latitude), Number(b.longitude));
          return distA - distB;
        });
      } else {
        // Fallback sorting
        sortedBus = sortedBus.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }

      setBusinesses(sortedBus);

    } catch (error) {
      console.error("Error fetching explorer data:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase, selectedCategoryId, userLocation]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelectCategory = (id: string | null) => {
    setSelectedCategoryId(id);
    setSelectedBusiness(null);
    if (id) {
      setIsSheetOpen(true);
    } else {
      setIsSheetOpen(false);
    }
  };

  const handleCenterUser = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          if (error.code === 1) {
            alert("Por favor, habilita los permisos de ubicación en tu navegador para centrar el mapa.");
          } else {
            console.warn("Error de ubicación:", error.message);
          }
        },
        { enableHighAccuracy: true }
      );
    }
  };

  const handleSelectBusiness = (biz: any) => {
    setSelectedBusiness(biz);
    setIsSheetOpen(true);
  };

  return (
    <div className="h-full w-full relative overflow-hidden bg-transparent">

      {/* Map Layer */}
      <div className="absolute inset-0 z-0">
        <ExplorerMap 
          businesses={businesses} 
          center={userLocation || undefined} 
          onSelectBusiness={handleSelectBusiness}
        />
      </div>

      {/* Categories Layer (Floating Bottom) */}
      <div className="absolute bottom-4 left-0 right-0 z-20">
        <div className="max-w-[400px] mx-auto px-4">
          <div className="bg-zinc-100/95 backdrop-blur-xl border border-white/40 rounded-[30px] shadow-2xl overflow-hidden">
            <ExplorerCategoryBar 
              categories={categories} 
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={handleSelectCategory}
            />
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div 
        className="absolute right-4 bottom-[180px] z-[25] flex flex-col gap-3"
      >
        <button 
          onClick={handleCenterUser}
          className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-full shadow-2xl flex items-center justify-center text-white active:scale-90 transition-all border border-white/20"
          title="Mi ubicación"
        >
          <Navigation size={24} className="fill-white" />
        </button>
        <button 
          className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-full shadow-2xl flex items-center justify-center text-white active:scale-90 transition-all border border-white/20"
          title="Agregar"
        >
          <Plus size={28} />
        </button>
      </div>

      {/* Bottom Sheet for Businesses */}
      <AnimatePresence>
        {isSheetOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSheetOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm z-30"
            />
            
            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 h-[70%] bg-white/95 backdrop-blur-2xl rounded-t-[40px] z-40 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] border-t border-white/40 flex flex-col"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-4 flex-shrink-0" />
              
              <div className="flex-1 overflow-y-auto px-6 pb-20">
                {selectedBusiness ? (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-6">
                      <button 
                        onClick={() => setSelectedBusiness(null)}
                        className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-3 py-1 rounded-full hover:bg-slate-200 transition-colors"
                      >
                        ← Volver
                      </button>
                    </div>

                    <div className="flex gap-4 mb-8">
                      <div className="w-24 h-24 rounded-[30px] overflow-hidden bg-slate-50 border border-slate-100 shadow-inner flex-shrink-0">
                        <img src={selectedBusiness.logo_url || "/placeholder-business.png"} alt={selectedBusiness.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 pt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black uppercase text-fowy-red tracking-widest bg-fowy-red/10 px-2 py-0.5 rounded-lg">
                            {selectedBusiness.categories?.name}
                          </span>
                          <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg">
                            <Star size={10} className="fill-amber-400 text-amber-400" />
                            <span className="text-[10px] font-black text-amber-600">4.9</span>
                          </div>
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 leading-tight mb-2">{selectedBusiness.name}</h2>
                        <p className="text-sm font-medium text-slate-500 leading-relaxed line-clamp-2">
                          {selectedBusiness.description || "Explora el menú y haz tu pedido directamente por WhatsApp."}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100/50">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1 block">Distancia</span>
                        <p className="text-sm font-black text-slate-800">
                          {userLocation ? `${getDistance(userLocation[0], userLocation[1], Number(selectedBusiness.latitude), Number(selectedBusiness.longitude)).toFixed(1)} km` : "-- km"}
                        </p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100/50">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1 block">Envío</span>
                        <p className="text-sm font-black text-slate-800">15-25 min</p>
                      </div>
                    </div>

                    <Link 
                      href={`/${selectedBusiness.slug}`}
                      className="w-full py-5 bg-slate-900 text-white rounded-[25px] font-black text-sm uppercase tracking-[2px] flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 active:scale-95 transition-all"
                    >
                      Ver Menú Digital
                      <ChevronRight size={20} />
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-black text-slate-800 tracking-tight">
                        {categories.find(c => c.id === selectedCategoryId)?.name || "Negocios Cercanos"}
                      </h2>
                      <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                        {businesses.length} Resultados
                      </span>
                    </div>

                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-10 gap-4">
                        <Loader2 className="w-8 h-8 text-fowy-red animate-spin" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        {businesses.map((biz) => (
                          <motion.div 
                            key={biz.id} 
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSelectBusiness(biz)}
                            className="bg-zinc-100/50 rounded-[20px] p-3 border border-white/40 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                          >
                            <div className="w-full aspect-square rounded-2xl bg-slate-50 overflow-hidden mb-3 relative">
                              <img src={biz.logo_url || "/placeholder-business.png"} alt={biz.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                              {userLocation && (
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[8px] font-black shadow-sm">
                                  {getDistance(userLocation[0], userLocation[1], Number(biz.latitude), Number(biz.longitude)).toFixed(1)} km
                                </div>
                              )}
                            </div>
                            <h3 className="text-xs font-black text-slate-800 leading-tight mb-1 truncate">{biz.name}</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{biz.categories?.name}</p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

