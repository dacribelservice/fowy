"use client";

import React from "react";
import { 
  Sparkles, 
  ShieldCheck,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <HeaderSection />

      {/* View Switcher */}
      <div className="flex p-1 bg-white/50 backdrop-blur-sm rounded-3xl w-fit border border-slate-200/50">
        <button 
          onClick={() => setView('marketplace')}
          className={`px-8 py-3 rounded-2xl text-sm font-black tracking-widest uppercase transition-all ${view === 'marketplace' ? 'bg-fowy-flow text-white shadow-lg shadow-fowy-blue/20' : 'text-slate-400 hover:text-fowy-blue'}`}
        >
          Marketplace
        </button>
        <button 
          onClick={() => setView('orders')}
          className={`px-8 py-3 rounded-2xl text-sm font-black tracking-widest uppercase transition-all ${view === 'orders' ? 'bg-fowy-flow text-white shadow-lg shadow-fowy-blue/20' : 'text-slate-400 hover:text-fowy-blue'}`}
        >
          Mis Contrataciones
        </button>
      </div>

      {view === 'marketplace' ? (
        <>
          <CategoryBar 
            activeCategory={activeCategory} 
            onCategoryChange={setActiveCategory} 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
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
  );
}

function HeaderSection() {
  return (
    <div className="relative overflow-hidden p-10 rounded-[2.5rem] bg-fowy-flow text-white shadow-xl shadow-fowy-blue/20">
      <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12">
        <Sparkles size={160} />
      </div>
      <div className="relative z-10 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 text-white/90 font-black text-xs uppercase tracking-[0.2em] mb-6"
        >
          <div className="w-8 h-px bg-white/50" />
          Marketplace de Expertos
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
          Impulsa tu negocio con <br />
          <span className="text-white/80">Talento Certificado</span>
        </h2>
        <p className="text-white/90 text-xl leading-relaxed font-medium">
          Seleccionamos a los mejores profesionales para ayudarte a crecer. 
          Contrata con la tranquilidad de que <strong className="text-white">FOWY protege tu dinero</strong> hasta que el trabajo sea entregado.
        </p>
      </div>
    </div>
  );
}

function TrustBanner() {
  return (
    <div className="p-10 rounded-[3rem] bg-white/60 backdrop-blur-xl border border-white shadow-sm flex flex-col lg:flex-row items-center gap-10">
      <div className="w-20 h-20 rounded-[2rem] bg-fowy-flow flex items-center justify-center text-white shrink-0 shadow-lg shadow-fowy-blue/30 rotate-3">
        <ShieldCheck size={40} />
      </div>
      <div className="flex-1 text-center lg:text-left">
        <h4 className="text-2xl font-black text-slate-700 mb-2">Tu inversión está protegida por FOWY 🛡️</h4>
        <p className="text-slate-400 text-lg leading-relaxed max-w-3xl">
          FOWY retiene los fondos en custodia y solo libera el pago al profesional cuando tú marcas el proyecto como completado. 
          Sin riesgos, con soporte técnico incluido.
        </p>
      </div>
      <div className="shrink-0 flex items-center gap-10">
        <div className="text-center">
          <p className="text-4xl font-black text-slate-700">100%</p>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Garantía</p>
        </div>
      </div>
    </div>
  );
}
