"use client";
import React from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import ExplorerCategoryBar from "@/components/explorer/ExplorerCategoryBar";
import { Loader2, Navigation, Plus } from "lucide-react";
import LocationPermissionModal from "@/components/explorer/LocationPermissionModal";
import BusinessListSheet from "@/components/explorer/BusinessListSheet";
import BusinessDetailSheet from "@/components/explorer/BusinessDetailSheet";
import { useExplorerManager } from "@/hooks/useExplorerManager";

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
  const {
    categories,
    businesses,
    loading,
    selectedCategoryId,
    isSheetOpen,
    setIsSheetOpen,
    userLocation,
    selectedBusiness,
    setSelectedBusiness,
    isLocationModalOpen,
    setIsLocationModalOpen,
    handleSelectCategory,
    handleCenterUser,
    handleSelectBusiness
  } = useExplorerManager();

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
