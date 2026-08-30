"use client";
import React, { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import ExplorerCategoryBar from "@/components/explorer/ExplorerCategoryBar";
import { Loader2, Navigation, AlertCircle, X } from "lucide-react";
import LocationPermissionModal from "@/components/explorer/LocationPermissionModal";
import BusinessListSheet from "@/components/explorer/BusinessListSheet";
import BusinessDetailSheet from "@/components/explorer/BusinessDetailSheet";
import { ReelsFeedButton } from "@/components/explorer/reels/ReelsFeedButton";
import { ReelDeepLinkHandler } from "@/components/explorer/reels/ReelDeepLinkHandler";
import { createClient } from "@/utils/supabase/client";
import { useExplorerManager } from "@/hooks/useExplorerManager";

// Dynamic Import for Reels Feed Modal (SSR: false)
const ReelsFeedModal = dynamic(
  () => import("@/components/explorer/reels/ReelsFeedModal").then((mod) => mod.ReelsFeedModal),
  { ssr: false }
);

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
    locationError,
    setLocationError,
    handleSelectCategory,
    handleCenterUser,
    centerTrigger,
    handleSelectBusiness,
    setMapBounds
  } = useExplorerManager();

  const [showWarningBanner, setShowWarningBanner] = useState(true);
  const [isReelsOpen, setIsReelsOpen] = useState(false);
  const [deepLinkReelId, setDeepLinkReelId] = useState<string | null>(null);

  useEffect(() => {
    if (locationError) {
      setShowWarningBanner(true);
    }
  }, [locationError]);

  return (
    <div className="h-full w-full relative overflow-hidden bg-transparent">
      {/* Map Layer con Error Boundary (Protección) */}
      <div className="absolute inset-0 z-0">
        <ErrorBoundary fallbackMessage="El mapa no pudo cargar por un error de conexión, pero puedes seguir usando la aplicación sin problema.">
          <ExplorerMap 
            businesses={businesses} 
            center={userLocation || undefined} 
            centerTrigger={centerTrigger}
            onSelectBusiness={handleSelectBusiness}
            setMapBounds={setMapBounds}
          />
        </ErrorBoundary>
      </div>

      {/* Geolocation Explanation / Warning Banner */}
      <AnimatePresence>
        {locationError && showWarningBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-4 left-4 right-4 z-30 max-w-[420px] mx-auto"
          >
            <div className="bg-white/95 backdrop-blur-xl border border-amber-200/60 rounded-[24px] shadow-[0_15px_30px_rgba(0,0,0,0.08)] p-4 pr-10 flex gap-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-400 to-orange-500" />
              
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 flex-shrink-0">
                <AlertCircle size={20} />
              </div>
              
              <div className="flex-1">
                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-[1.5px] mb-1 flex items-center gap-1.5">
                  Ubicación de Respaldo Activa
                </h4>
                <p className="text-[11px] font-semibold text-slate-500 leading-normal">
                  {locationError === "permission_denied" ? (
                    <span>
                      📍 <strong>Permisos desactivados:</strong> FOWY te muestra el centro de Bogotá por defecto. Para ver tiendas cerca de ti, haz clic en el candado junto a la URL en tu iPhone y activa los permisos de ubicación.
                    </span>
                  ) : (
                    <span>
                      🔒 <strong>Servicio GPS o conexión inactiva:</strong> Mostrando centro de Bogotá. Asegúrate de navegar mediante <strong>HTTPS seguro</strong>, de activar el GPS de tu iPhone y de estar fuera de WebViews restrictivos (como en Instagram o WhatsApp).
                    </span>
                  )}
                </p>
              </div>
              
              <button
                onClick={() => setShowWarningBanner(false)}
                className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100/50 transition-colors"
                title="Cerrar aviso"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
        <ReelsFeedButton onClick={() => setIsReelsOpen(true)} />

        <button 
          onClick={handleCenterUser}
          className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-full shadow-2xl flex items-center justify-center text-white active:scale-90 transition-all border border-white/20"
          title="Mi ubicación"
        >
          <Navigation size={24} className="fill-white" />
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

      {/* Reels Feed Modal con AnimatePresence y Carga Diferida */}
      <AnimatePresence>
        {isReelsOpen && (
          <ReelsFeedModal
            isOpen={isReelsOpen}
            onClose={() => {
              setIsReelsOpen(false);
              setDeepLinkReelId(null);
              if (typeof window !== "undefined" && window.location.search.includes("reel=")) {
                window.history.replaceState(null, "", window.location.pathname);
              }
            }}
            categories={categories}
            userLocation={userLocation}
            onViewOnMap={async (businessId) => {
              setIsReelsOpen(false);
              setDeepLinkReelId(null);
              if (typeof window !== "undefined" && window.location.search.includes("reel=")) {
                window.history.replaceState(null, "", window.location.pathname);
              }
              const found = businesses.find((b) => b.id === businessId);
              if (found) return handleSelectBusiness(found);
              const supabase = createClient();
              const { data } = await supabase
                .from("businesses")
                .select("id, name, slug, city, logo_url, latitude, longitude, rating, category_id, status, color_identity, schedules, tags, created_at, categories(name)")
                .eq("id", businessId)
                .single();
              if (data) {
                handleSelectBusiness({ ...data, category_name: (data as any).categories?.name || "Comercio" });
              }
            }}
            initialReelId={deepLinkReelId}
          />
        )}
      </AnimatePresence>

      {/* Deep-link URL param handler */}
      <Suspense fallback={null}>
        <ReelDeepLinkHandler
          onOpenReelId={(reelId) => {
            setDeepLinkReelId(reelId);
            setIsReelsOpen(true);
          }}
        />
      </Suspense>

      {/* Location Permission Modal */}
      <LocationPermissionModal 
        isOpen={isLocationModalOpen} 
        onClose={() => setIsLocationModalOpen(false)} 
      />
    </div>
  );
}
