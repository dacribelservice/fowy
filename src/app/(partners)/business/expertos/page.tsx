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
      <div className="flex p-1 bg-slate-100 rounded-3xl w-fit">
        <button 
          onClick={() => setView('marketplace')}
          className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all ${view === 'marketplace' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Marketplace
        </button>
        <button 
          onClick={() => setView('orders')}
          className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all ${view === 'orders' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
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
    <div className="relative overflow-hidden p-8 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Sparkles size={120} />
      </div>
      <div className="relative z-10 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 text-fowy-secondary font-bold text-sm uppercase tracking-widest mb-4"
        >
          <Zap size={16} fill="currentColor" />
          FOWY Expert Marketplace
        </motion.div>
        <h2 className="text-4xl font-bold tracking-tight mb-4">
          Impulsa tu negocio con <span className="text-fowy-secondary">Expertos Vetted</span>
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          Hemos seleccionado a los mejores profesionales para ayudarte a crecer. 
          Contrata con la tranquilidad de que <strong>FOWY protege tu dinero</strong> hasta que el trabajo esté terminado.
        </p>
      </div>
    </div>
  );
}

function TrustBanner() {
  return (
    <div className="p-10 rounded-[3rem] bg-gradient-to-r from-fowy-blue/5 to-transparent border border-fowy-blue/10 flex flex-col lg:flex-row items-center gap-10">
      <div className="w-20 h-20 rounded-[2rem] bg-fowy-blue flex items-center justify-center text-white shrink-0 shadow-premium rotate-3">
        <ShieldCheck size={40} />
      </div>
      <div className="flex-1 text-center lg:text-left">
        <h4 className="text-2xl font-black text-slate-800 mb-2">Tu inversión está protegida por FOWY 🛡️</h4>
        <p className="text-slate-500 text-lg leading-relaxed max-w-3xl">
          FOWY retiene los fondos en custodia y solo libera el pago al profesional cuando tú marcas el proyecto como completado. 
          Sin riesgos, con soporte técnico incluido.
        </p>
      </div>
      <div className="shrink-0 flex items-center gap-10">
        <div className="text-center">
          <p className="text-4xl font-black text-slate-800">20%</p>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Comisión FOWY</p>
        </div>
        <div className="h-16 w-px bg-slate-200 hidden lg:block" />
        <div className="text-center">
          <p className="text-4xl font-black text-slate-800">100%</p>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Garantía</p>
        </div>
      </div>
    </div>
  );
}
