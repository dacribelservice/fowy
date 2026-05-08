"use client";

import React from "react";
import { 
  Sparkles, 
  ShieldCheck,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ComingSoonOverlay from "@/components/partners/ComingSoonOverlay";

// Components
import { CategoryBar } from "@/components/partners/expertos/CategoryBar";
import { ExpertCard } from "@/components/partners/expertos/ExpertCard";
import { ExpertDetailModal } from "@/components/partners/expertos/ExpertDetailModal";
import { ExpertOrdersList } from "@/components/partners/expertos/ExpertOrdersList";
import { PremiumConfirmModal } from "@/components/partners/expertos/PremiumConfirmModal";

// Hooks
import { useExperts } from "@/modules/expertos/hooks/useExperts";

export default function ExpertosPage() {
  const [confirmModal, setConfirmModal] = React.useState<{ isOpen: boolean; orderId: string | null }>({
    isOpen: false,
    orderId: null
  });

  const {
    selectedExpert,
    setSelectedExpert,
    activeCategory,
    setActiveCategory,
    view,
    setView,
    myOrders,
    loading,
    filteredExpertos,
    handleReleaseFunds,
    handleHire
  } = useExperts();

  return (
    <ComingSoonOverlay
      title="Próximamente te sorprenderemos ✨"
      description="El Marketplace de Expertos FOWY está en fase de preparación final. Conecta con el mejor talento calificado para potenciar y expandir tu negocio sin riesgos."
    >
      <div className="space-y-6 md:space-y-8 pb-10 max-w-full overflow-hidden">
        {/* Header Section */}
        <HeaderSection />

        {/* View Switcher */}
        <div className="flex p-1 bg-white/60 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm w-full md:w-fit">
          <button 
            onClick={() => setView('marketplace')}
            className={`flex-1 md:flex-initial px-4 md:px-8 py-2.5 md:py-3 rounded-xl text-[10px] sm:text-xs md:text-sm font-black tracking-wider md:tracking-widest uppercase transition-all duration-200 active:scale-95 ${
              view === 'marketplace' 
                ? 'bg-gradient-to-b from-[#7B61FF] to-[#5C40FF] text-white shadow-[0_6px_20px_rgba(123,97,255,0.3)] border-t border-t-white/25 border-b border-b-black/15' 
                : 'text-slate-400 hover:text-[#7B61FF] hover:bg-slate-50'
            }`}
          >
            Marketplace
          </button>
          <button 
            onClick={() => setView('orders')}
            className={`flex-1 md:flex-initial px-4 md:px-8 py-2.5 md:py-3 rounded-xl text-[10px] sm:text-xs md:text-sm font-black tracking-wider md:tracking-widest uppercase transition-all duration-200 active:scale-95 ${
              view === 'orders' 
                ? 'bg-gradient-to-b from-[#7B61FF] to-[#5C40FF] text-white shadow-[0_6px_20px_rgba(123,97,255,0.3)] border-t border-t-white/25 border-b border-b-black/15' 
                : 'text-slate-400 hover:text-[#7B61FF] hover:bg-slate-50'
            }`}
          >
            Contrataciones
          </button>
        </div>

        {view === 'marketplace' ? (
          <>
            <CategoryBar 
              activeCategory={activeCategory} 
              onCategoryChange={setActiveCategory} 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10">
              {filteredExpertos.map((expert, index) => (
                <ExpertCard 
                  key={expert.id}
                  expert={expert}
                  index={index}
                  onClick={setSelectedExpert}
                />
              ))}
            </div>

            <TrustBanner />
          </>
        ) : (
          <ExpertOrdersList 
            orders={myOrders}
            loading={loading}
            onReleaseFunds={(id) => setConfirmModal({ isOpen: true, orderId: id })}
            onExplore={() => setView('marketplace')}
          />
        )}

        {/* Modals */}
        <AnimatePresence>
          {selectedExpert && (
            <ExpertDetailModal 
              expert={selectedExpert}
              onClose={() => setSelectedExpert(null)}
              onHire={handleHire}
              loading={loading}
            />
          )}
        </AnimatePresence>

        <PremiumConfirmModal 
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ isOpen: false, orderId: null })}
          onConfirm={() => confirmModal.orderId && handleReleaseFunds(confirmModal.orderId)}
          title="¿Liberar pago al experto?"
          description="Confirma que el trabajo ha sido entregado satisfactoriamente. Una vez liberado, el pago no podrá ser revertido."
          confirmText="Sí, liberar pago"
          cancelText="Aún no"
          type="warning"
        />
      </div>
    </ComingSoonOverlay>
  );
}

function HeaderSection() {
  return (
    <div className="relative overflow-hidden p-5 sm:p-6 md:p-8 rounded-[20px] md:rounded-[32px] glass-morphism border border-white/60 shadow-glass bg-white/70">
      {/* Background ambient glows from diseño.md */}
      <div className="absolute -top-1/3 -right-10 w-40 h-40 sm:w-60 sm:h-60 rounded-full bg-gradient-to-tr from-[#7B61FF]/15 to-[#4D8BFF]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-1/4 -left-10 w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-[#FF5A5F]/5 to-[#FF9A3D]/5 blur-3xl pointer-events-none" />
      
      <div className="absolute top-6 right-6 p-4 opacity-30 text-[#7B61FF] rotate-12 hidden sm:block animate-pulse">
        <Sparkles size={48} />
      </div>

      <div className="relative z-10 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-[#7B61FF]/10 text-[#7B61FF] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] mb-4 rounded-full border border-[#7B61FF]/20"
        >
          <Sparkles size={12} className="animate-spin" style={{ animationDuration: '6s' }} />
          Marketplace de Expertos
        </motion.div>
        
        <h2 className="text-xl sm:text-2xl md:text-4xl font-black tracking-tight mb-3 leading-tight text-slate-800">
          Impulsa tu negocio con <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#7B61FF] to-[#4D8BFF] bg-clip-text text-transparent">
            Talento Certificado
          </span>
        </h2>
        
        <p className="text-slate-500 text-xs sm:text-sm md:text-base leading-relaxed font-medium max-w-xl">
          Seleccionamos a los mejores profesionales para ayudarte a crecer. 
          Contrata con la tranquilidad de que <strong className="text-slate-700 font-bold">FOWY protege tu dinero</strong> hasta que el trabajo sea entregado de forma satisfactoria.
        </p>
      </div>
    </div>
  );
}

function TrustBanner() {
  return (
    <div className="p-5 sm:p-6 md:p-8 rounded-[20px] md:rounded-[32px] glass-morphism border border-white/60 shadow-glass bg-white/70 relative overflow-hidden flex flex-col lg:flex-row items-center gap-6 md:gap-8">
      {/* subtle ambient glow */}
      <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-[#7B61FF]/10 blur-2xl pointer-events-none" />
      
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#7B61FF] to-[#5C40FF] flex items-center justify-center text-white shrink-0 shadow-[0_6px_20px_rgba(123,97,255,0.25)] border-t border-t-white/20 border-b border-b-black/10 rotate-3">
        <ShieldCheck size={28} className="sm:w-8 sm:h-8" />
      </div>
      <div className="flex-1 text-center lg:text-left relative z-10">
        <h4 className="text-base sm:text-lg md:text-xl font-black text-slate-800 mb-1">Tu inversión está protegida por FOWY 🛡️</h4>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-2xl">
          FOWY retiene los fondos en custodia y solo libera el pago al profesional cuando tú marcas el proyecto como completado. 
          Sin riesgos, con soporte técnico incluido.
        </p>
      </div>
      <div className="shrink-0 flex items-center gap-6 relative z-10">
        <div className="text-center bg-[#7B61FF]/5 px-4 py-2 rounded-xl border border-[#7B61FF]/10">
          <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-[#7B61FF] to-[#4D8BFF] bg-clip-text text-transparent">100%</p>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Garantía</p>
        </div>
      </div>
    </div>
  );
}
