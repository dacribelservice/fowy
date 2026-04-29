"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Star, 
  TrendingUp, 
  ShieldCheck,
  X,
  Briefcase,
  Layers,
  Award,
  Zap,
  Loader2,
  CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const FALLBACK_EXPERTOS = [
  {
    id: "daniela",
    name: "Daniela R.",
    specialty: "CM & Instagram Specialist",
    description: "Experta en posicionamiento de marcas gastronómicas. Me especializo en crear contenido que no solo se ve bien, sino que vende. He ayudado a más de 20 restaurantes a aumentar su facturación mediante estrategias de engagement real.",
    rating: 4.9,
    reviews: 24,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=400",
    portfolio: [
      { image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=200&h=200" },
      { image_url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=200&h=200" },
      { image_url: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=200&h=200" }
    ],
    plans: [
      { name: "Plan Gestión Mensual", price: 150, details: "12 posts + 20 stories + Gestión de comentarios" },
      { name: "Plan Identidad Visual", price: 200, details: "Diseño de feed + Highlights + Bio Optimization" }
    ],
    verified: true,
    category: "Marketing",
    stats: { completions: 45, years: 3 }
  }
];

export default function ExpertosPage() {
  const [expertos, setExpertos] = useState<any[]>([]);
  const [selectedExpert, setSelectedExpert] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [view, setView] = useState<'marketplace' | 'orders'>('marketplace');
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchExpertos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name:full_name,
          specialty,
          description:bio,
          rating,
          image:avatar_url,
          total_jobs,
          years_experience,
          plans:professional_plans(name, price, details),
          portfolio:professional_portfolio(image_url)
        `)
        .eq('role', 'professional');

      if (error) throw error;

      if (data && data.length > 0) {
        setExpertos(data.map(e => ({
          ...e,
          verified: true,
          category: e.specialty?.includes('CM') ? 'Marketing' : 
                    e.specialty?.includes('Fotografía') ? 'Fotografía' : 'Anuncios',
          stats: { completions: e.total_jobs || 0, years: e.years_experience || 0 }
        })));
      } else {
        // Fallback for demo if DB is empty
        setExpertos(FALLBACK_EXPERTOS);
      }
    } catch (error) {
      console.error("Error fetching expertos:", error);
      setExpertos(FALLBACK_EXPERTOS);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('service_orders')
        .select(`
          *,
          professional:profiles!professional_id (
            full_name,
            avatar_url,
            specialty
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyOrders(data || []);
    } catch (error) {
      console.error("Error fetching my orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'marketplace') fetchExpertos();
    else fetchMyOrders();
  }, [view]);

  const filteredExpertos = activeCategory === "Todos" 
    ? expertos 
    : expertos.filter(e => e.category === activeCategory);

  const handleReleaseFunds = async (orderId: string) => {
    if (!confirm("¿Confirmas que el trabajo está terminado? Esto liberará el pago al experto.")) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('service_orders')
        .update({ status: 'funds_released' })
        .eq('id', orderId);

      if (error) throw error;
      toast.success("¡Pago liberado!", { description: "Gracias por confiar en FOWY Experts." });
      fetchMyOrders();
    } catch (error) {
      toast.error("Error al liberar fondos");
    } finally {
      setLoading(false);
    }
  };

  const handleHire = async (expert: any, plan: any) => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Debes iniciar sesión para contratar");
        return;
      }

      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (!business) {
        toast.error("No tienes un negocio registrado para realizar esta operación");
        return;
      }

      // Calculate amounts
      const totalAmount = typeof plan.price === 'string' 
        ? parseFloat(plan.price.replace('$', '')) 
        : plan.price;
      const commission = totalAmount * 0.20;
      const professionalNet = totalAmount - commission;

      const professionalId = expert.id;

      const { error } = await supabase.from('service_orders').insert({
        business_id: business.id,
        professional_id: professionalId,
        plan_name: plan.name,
        amount: totalAmount,
        fowy_commission: commission,
        professional_net: professionalNet,
        status: 'pending_payment',
        notes: `Contratación de ${plan.name} para ${expert.name}`
      });

      if (error) throw error;

      toast.success("¡Orden de contratación creada!", {
        description: "FOWY se pondrá en contacto para procesar el pago en custodia."
      });
      setSelectedExpert(null);
      setView('orders');

    } catch (error: any) {
      console.error("Error hiring:", error);
      toast.error("Error al procesar la contratación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
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
          {/* Categories Bar */}
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
            {['Todos', 'Marketing', 'Fotografía', 'Anuncios', 'Diseño'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap border-2 ${
                  activeCategory === cat 
                    ? 'bg-fowy-secondary border-fowy-secondary text-white shadow-premium' 
                    : 'bg-white border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Experts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {filteredExpertos.map((expert, index) => (
              <motion.div
                key={expert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedExpert(expert)}
                className="glass-morphism p-10 rounded-[3rem] shadow-glass border-b-8 border-b-slate-100 hover:border-b-fowy-secondary cursor-pointer hover:shadow-premium transition-all group relative flex flex-col"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-[2rem] overflow-hidden ring-4 ring-white shadow-xl transition-transform group-hover:scale-110">
                      <img 
                        src={expert.image} 
                        alt={expert.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {expert.verified && (
                      <div className="absolute -bottom-2 -right-2 bg-fowy-blue text-white p-2 rounded-full border-4 border-white shadow-lg">
                        <ShieldCheck size={16} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1.5 bg-green-50 text-green-600 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm ring-2 ring-green-100">
                      <Star size={14} fill="currentColor" />
                      {expert.rating}
                    </div>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                      {expert.stats.completions} Éxitos
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-black text-slate-800 group-hover:text-fowy-secondary transition-colors mb-2">
                    {expert.name}
                  </h3>
                  <p className="text-xs font-black text-fowy-blue uppercase tracking-widest mb-6">
                    {expert.specialty}
                  </p>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-8">
                    {expert.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex -space-x-3">
                    {expert.portfolio?.slice(0, 3).map((item: any, i: number) => (
                      <div key={i} className="w-10 h-10 rounded-xl border-4 border-white overflow-hidden shadow-sm group-hover:translate-y-[-4px] transition-transform" style={{ transitionDelay: `${i * 50}ms` }}>
                        <img src={item.image_url} className="w-full h-full object-cover" alt="prev" />
                      </div>
                    ))}
                    {(expert.portfolio?.length || 0) > 3 && (
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border-4 border-white flex items-center justify-center text-[10px] font-black text-slate-400">
                        +{expert.portfolio.length - 3}
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-black text-fowy-secondary group-hover:translate-x-2 transition-transform flex items-center gap-2">
                    Ver Perfil <Zap size={16} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust Banner */}
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
        </>
      ) : (
        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-fowy-secondary" size={48} />
              <p className="text-slate-400 font-bold animate-pulse">Buscando tus contrataciones...</p>
            </div>
          ) : myOrders.length === 0 ? (
            <div className="p-20 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
              <Briefcase className="mx-auto text-slate-100 mb-6" size={80} />
              <h3 className="text-2xl font-black text-slate-800 mb-2">Sin proyectos activos</h3>
              <p className="text-slate-400 font-bold mb-8">Aún no has contratado a ningún experto para tu negocio.</p>
              <button 
                onClick={() => setView('marketplace')}
                className="px-10 py-4 bg-fowy-secondary text-white rounded-2xl font-black shadow-premium hover:scale-105 transition-all"
              >
                Explorar el Marketplace
              </button>
            </div>
          ) : (
            <div className="grid gap-8">
              {myOrders.map((order) => (
                <div key={order.id} className="glass-morphism p-10 rounded-[3rem] border border-white/40 flex flex-col lg:flex-row items-center gap-10 shadow-glass">
                  <div className="w-24 h-24 rounded-[2rem] overflow-hidden bg-slate-100 shrink-0 shadow-xl ring-4 ring-white">
                    <img src={order.professional?.avatar_url} className="w-full h-full object-cover" alt="expert" />
                  </div>
                  
                  <div className="flex-1 text-center lg:text-left">
                    <h4 className="text-2xl font-black text-slate-800 mb-1">{order.professional?.full_name}</h4>
                    <p className="text-sm font-black text-fowy-blue uppercase tracking-widest mb-6">{order.plan_name}</p>
                    <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                      <span className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-sm ${
                        order.status === 'completed' ? 'bg-green-100 text-green-600 ring-4 ring-green-500/10' : 
                        order.status === 'funds_released' ? 'bg-fowy-secondary text-white shadow-premium' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {order.status === 'pending_payment' ? 'Esperando Pago 💳' : 
                         order.status === 'in_escrow' ? 'En Custodia 🛡️' : 
                         order.status === 'completed' ? 'Trabajo Entregado ✅' : 
                         order.status === 'funds_released' ? 'Finalizado 🏁' : order.status}
                      </span>
                      <span className="px-6 py-2.5 rounded-2xl bg-white border-2 border-slate-100 text-xs font-black text-slate-700 shadow-sm flex items-center gap-2">
                        <CreditCard size={16} /> Total: ${order.amount}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 w-full lg:w-auto min-w-[200px]">
                    {order.delivery_url && (
                      <a 
                        href={order.delivery_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-slate-800 hover:bg-slate-50 transition-all shadow-sm group"
                      >
                        <TrendingUp size={20} className="group-hover:translate-y-[-2px] transition-transform" /> Ver Resultados
                      </a>
                    )}
                    {order.status === 'completed' && (
                      <button 
                        onClick={() => handleReleaseFunds(order.id)}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-fowy-secondary text-white rounded-2xl font-black shadow-premium hover:scale-105 transition-all"
                      >
                        <ShieldCheck size={20} /> Liberar Pago
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}


      {/* Modal / Popup Detail */}
      <AnimatePresence>
        {selectedExpert && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedExpert(null)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-5xl bg-white rounded-[4rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedExpert(null)}
                className="absolute top-8 right-8 p-4 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-20 group"
              >
                <X size={24} className="text-slate-600 group-hover:rotate-90 transition-transform" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
                {/* Modal Sidebar */}
                <div className="lg:col-span-2 bg-slate-50 p-12 flex flex-col items-center text-center border-r border-slate-100">
                  <div className="relative mb-8">
                    <img 
                      src={selectedExpert.image} 
                      alt={selectedExpert.name} 
                      className="w-48 h-48 rounded-[3.5rem] object-cover shadow-2xl ring-8 ring-white"
                    />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-lg flex items-center gap-2 border border-slate-100">
                      <Star size={18} className="text-yellow-400" fill="currentColor" />
                      <span className="font-black text-slate-800 text-lg">{selectedExpert.rating}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">{selectedExpert.name}</h3>
                  <p className="text-fowy-secondary font-black mb-10 uppercase tracking-[0.2em] text-xs">{selectedExpert.specialty}</p>

                  <div className="grid grid-cols-2 gap-6 w-full">
                    <div className="glass-morphism bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                      <p className="text-3xl font-black text-slate-800">{selectedExpert.stats.completions}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Proyectos</p>
                    </div>
                    <div className="glass-morphism bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                      <p className="text-3xl font-black text-slate-800">{selectedExpert.stats.years}+</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Años Exp.</p>
                    </div>
                  </div>

                  <div className="mt-12 w-full space-y-4">
                    <div className="flex items-center gap-5 text-left p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm">
                      <Award className="text-fowy-blue shrink-0" size={32} />
                      <div>
                        <p className="text-sm font-black text-slate-800">Verificado FOWY</p>
                        <p className="text-[11px] text-slate-500 font-medium">Cumple con estándares de calidad</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5 text-left p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm">
                      <ShieldCheck className="text-green-500 shrink-0" size={32} />
                      <div>
                        <p className="text-sm font-black text-slate-800">FOWY Escrow</p>
                        <p className="text-[11px] text-slate-500 font-medium">Pago 100% seguro y garantizado</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="lg:col-span-3 p-12 space-y-12">
                  <section>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                      <Briefcase size={16} /> Perfil Profesional
                    </h4>
                    <p className="text-slate-600 leading-relaxed text-xl font-medium">
                      {selectedExpert.description}
                    </p>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                      <Layers size={16} /> Portafolio de Éxitos
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedExpert.portfolio?.map((item: any, i: number) => (
                        <div key={i} className="aspect-square rounded-[2rem] overflow-hidden shadow-premium group cursor-zoom-in">
                          <img src={item.image_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="work" />
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                      <Zap size={16} /> Planes Disponibles
                    </h4>
                    <div className="grid grid-cols-1 gap-6">
                      {selectedExpert.plans.map((plan: any) => (
                        <div key={plan.name} className="flex flex-col p-8 rounded-[2.5rem] bg-slate-50 border-4 border-transparent hover:border-fowy-secondary transition-all group relative shadow-inner">
                          <div className="flex justify-between items-start mb-3">
                            <span className="font-black text-slate-800 text-xl">{plan.name}</span>
                            <span className="text-3xl font-black text-fowy-secondary">${plan.price}</span>
                          </div>
                          <p className="text-slate-500 mb-8 font-medium">{plan.details}</p>
                          <button 
                            disabled={loading}
                            onClick={() => handleHire(selectedExpert, plan)}
                            className="w-full py-4 bg-white text-slate-800 border-2 border-slate-200 rounded-2xl font-black hover:bg-fowy-secondary hover:text-white hover:border-fowy-secondary transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-sm"
                          >
                            {loading && <Loader2 className="animate-spin" size={20} />}
                            Contratar Plan
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>

                  <div className="pt-10 border-t border-slate-100">
                    <button 
                      disabled={loading}
                      onClick={() => handleHire(selectedExpert, selectedExpert.plans[0])}
                      className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black shadow-premium hover:scale-[1.02] transition-all flex items-center justify-center gap-4 text-xl disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={28} />
                      ) : (
                        <>
                          Reservar a {selectedExpert.name.split(' ')[0]}
                          <Sparkles size={24} className="text-fowy-secondary" />
                        </>
                      )}
                    </button>
                    <p className="text-center text-[11px] text-slate-400 mt-6 font-bold italic tracking-wide">
                      🔒 FOWY es el garante de tu pago. El experto recibe los fondos solo tras tu aprobación final.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
