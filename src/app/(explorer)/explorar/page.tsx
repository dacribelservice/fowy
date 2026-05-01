"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import ExplorerCategoryBar from "@/components/explorer/ExplorerCategoryBar";
import { Loader2, Navigation, Plus } from "lucide-react";
import LocationPermissionModal from "@/components/explorer/LocationPermissionModal";
import BusinessListSheet from "@/components/explorer/BusinessListSheet";
import BusinessDetailSheet from "@/components/explorer/BusinessDetailSheet";
import { getDistance } from "@/utils/geo";

// Singleton supabase client (outside component to guarantee single instance)
const supabase = createClient();

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
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Refs to hold latest state values (avoids stale closures in callbacks)
  const categoriesRef = useRef<any[]>([]);
  const selectedCategoryIdRef = useRef<string | null>(null);
  const userLocationRef = useRef<[number, number] | null>(null);

  // Keep refs in sync with state
  useEffect(() => { categoriesRef.current = categories; }, [categories]);
  useEffect(() => { selectedCategoryIdRef.current = selectedCategoryId; }, [selectedCategoryId]);
  useEffect(() => { userLocationRef.current = userLocation; }, [userLocation]);

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


  // Fetch categories ONCE on mount
  useEffect(() => {
    const fetchCats = async () => {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      if (data) setCategories(data);
    };
    fetchCats();
  }, []);

  // Core fetch function — reads from refs, no stale closures
  const fetchBusinesses = useCallback(async () => {
    try {
      setLoading(true);
      
      const currentCategories = categoriesRef.current;
      const currentCategoryId = selectedCategoryIdRef.current;
      const currentLocation = userLocationRef.current;

      // Fetch Businesses
      let query = supabase
        .from('businesses')
        .select('*, categories(name)')
        .eq('status', true);

      if (currentCategoryId && currentCategories.length > 0) {
        const selectedCategory = currentCategories.find((c: any) => c.id === currentCategoryId);
        if (selectedCategory) {
          query = query.contains('tags', [selectedCategory.name]);
        }
      }

      const { data: busData, error } = await query;

      if (error) {
        console.error("Supabase query error:", error);
        throw error;
      }
      
      let sortedBus = busData || [];
      
      // Sort by proximity if user location is available
      if (currentLocation && sortedBus.length > 0) {
        sortedBus = [...sortedBus].sort((a, b) => {
          const latA = Number(a.latitude);
          const lonA = Number(a.longitude);
          const latB = Number(b.latitude);
          const lonB = Number(b.longitude);
          
          const distA = getDistance(currentLocation[0], currentLocation[1], latA, lonA);
          const distB = getDistance(currentLocation[0], currentLocation[1], latB, lonB);
          return distA - distB;
        });
      } else {
        sortedBus = sortedBus.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }

      setBusinesses(sortedBus);

    } catch (error) {
      console.error("Error fetching explorer data:", error);
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies — reads from refs

  // Store fetchBusinesses in a ref so realtime callback always has latest version
  const fetchRef = useRef(fetchBusinesses);
  useEffect(() => { fetchRef.current = fetchBusinesses; }, [fetchBusinesses]);

  // Fetch on mount and when category/location changes
  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses, selectedCategoryId, userLocation, categories]);

  // Realtime Subscription — stable, never re-subscribes
  useEffect(() => {
    const channel = supabase
      .channel('explorer-businesses-rt')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'businesses'
        },
        (payload) => {
          console.log('Realtime change detected:', payload.eventType);
          // Always call the latest fetch function via ref
          fetchRef.current();

          if (payload.new && (payload.new as any).id) {
            setSelectedBusiness((prev: any) => {
              if (prev && prev.id === (payload.new as any).id) {
                return { ...prev, ...(payload.new as any) };
              }
              return prev;
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // Empty — runs once, never re-subscribes

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
            setIsLocationModalOpen(true);
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
                  <BusinessDetailSheet 
                    business={selectedBusiness}
                    onBack={() => setSelectedBusiness(null)}
                    userLocation={userLocation}
                  />
                ) : (
                  <BusinessListSheet 
                    businesses={businesses}
                    loading={loading}
                    categoryName={categories.find(c => c.id === selectedCategoryId)?.name || "Negocios Cercanos"}
                    onSelectBusiness={handleSelectBusiness}
                    userLocation={userLocation}
                  />
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Location Permission Modal */}
      <LocationPermissionModal 
        isOpen={isLocationModalOpen} 
        onClose={() => setIsLocationModalOpen(false)} 
      />
    </div>
  );
}
