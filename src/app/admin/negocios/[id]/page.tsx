"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import SuccessToast from "@/components/admin/shared/SuccessToast";
import { BusinessTopBar, BusinessProfileCard, BusinessBasicSettings } from "@/components/admin/businesses/BusinessProfileHeader";
import { BusinessLocationManager } from "@/components/admin/businesses/BusinessLocationManager";
import { BusinessModuleManager } from "@/components/admin/businesses/BusinessModuleManager";
import { BusinessPaymentViewer } from "@/components/admin/businesses/BusinessPaymentViewer";
import { BusinessPlanPill } from "@/components/admin/businesses/BusinessPlanPill";
import { BusinessMetricsList } from "@/components/admin/businesses/BusinessMetricsList";
import { FowySalesChart } from "@/components/admin/businesses/FowySalesChart";


export interface BusinessData {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  city: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  plan: string;
  status: boolean;
  phone: string;
  payment_date: string;
  payment_proof_url?: string | null;
  payment_proof_id?: string | null;
  membership_price?: number | null;
  modules: {
    standard: boolean;
    pro: boolean;
    premium: boolean;
    inventory?: boolean;
    reports?: boolean;
    marketing?: boolean;
  };
}

export default function BusinessDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("modules");
  const [toast, setToast] = useState({ show: false, message: "" });

  const fetchBusiness = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;

      // Obtener el comprobante de pago PENDIENTE más reciente desde 'payment_proofs'
      const { data: proofData, error: proofError } = await supabase
        .from('payment_proofs')
        .select('id, proof_url')
        .eq('business_id', id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1);

      if (!proofError && proofData && proofData.length > 0) {
        data.payment_proof_url = proofData[0].proof_url;
        data.payment_proof_id = proofData[0].id;
      } else {
        data.payment_proof_url = null;
        data.payment_proof_id = null;
      }

      setBusiness(data);
    } catch (error) {
      console.error("Error fetching business:", error);
    } finally {
      setLoading(false);
    }
  }, [id, supabase]);

  useEffect(() => {
    fetchBusiness();
  }, [fetchBusiness]);
  const handleUpdate = async () => {
    if (!business) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('businesses')
        .update({
          status: business.status,
          plan: business.plan,
          modules: business.modules,
          city: business.city,
          country: business.country,
          latitude: business.latitude,
          longitude: business.longitude,
          phone: business.phone,
          payment_date: business.payment_date,
          membership_price: business.membership_price
        })
        .eq('id', id);

      if (error) throw error;
      setToast({ show: true, message: "Configuración actualizada con éxito" });
    } catch (error) {
      console.error("Error updating business:", error);
      alert("Error al actualizar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-fowy-primary/10 border-t-fowy-primary rounded-full animate-spin" />
      <p className="text-slate-400 font-bold animate-pulse text-xs uppercase tracking-widest">Sincronizando Establecimiento...</p>
    </div>
  );

  if (!business) return <div>No se encontró el negocio.</div>;

  return (
    <div className="max-w-2xl mx-auto pb-20 px-4">
      {/* Header Navegación */}
      <BusinessTopBar onBack={() => router.back()} onSave={handleUpdate} saving={saving} />

      <div className="flex flex-col gap-6 mt-4">
        {/* Capa 1: Plan Píldora (Cilíndrico Ultra-Compacto) */}
        <div className="flex justify-center w-full">
          <BusinessPlanPill plan={business.plan} paymentDate={business.payment_date} />
        </div>

        {/* Capa 2: Lista de Métricas Minimalistas de Rendimiento */}
        <div className="bg-white rounded-3xl p-6 shadow-md shadow-slate-100/50 border border-slate-100">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Métricas de Rendimiento</h3>
          <BusinessMetricsList businessId={business.id} />
        </div>

        {/* Capa 2.5: Tendencia de Ventas (Gráfica Interactiva) */}
        <div className="bg-white rounded-3xl p-6 shadow-md shadow-slate-100/50 border border-slate-100">
          <FowySalesChart businessId={business.id} />
        </div>

        {/* Capa 3: Tarjeta de Negocio Compacta */}
        <BusinessProfileCard business={business} />

        {/* Capa 4: Módulos & Configuración */}
        <div className="bg-white rounded-3xl shadow-md shadow-slate-100/50 border border-slate-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-100 bg-slate-50/50">
            {['modules', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.15em] transition-all relative ${
                  activeTab === tab ? 'text-fowy-orange' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab === 'modules' ? 'Módulos Activos' : 'Configuración General'}
                {activeTab === tab && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-[3px] bg-fowy-orange" />
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'modules' ? (
              <BusinessModuleManager 
                business={business} 
                onChange={(updates) => setBusiness({ ...business, ...updates } as BusinessData)} 
              />
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <BusinessBasicSettings 
                    business={business} 
                    onChange={(updates) => setBusiness({ ...business, ...updates } as BusinessData)} 
                  />

                  <BusinessPaymentViewer 
                    business={business} 
                    onRefresh={fetchBusiness} 
                    onChange={(updates) => setBusiness({ ...business, ...updates } as BusinessData)}
                  />

                  <div className="md:col-span-2">
                    <BusinessLocationManager 
                      business={business} 
                      onChange={(updates) => setBusiness({ ...business, ...updates } as BusinessData)} 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <SuccessToast 
        show={toast.show} 
        message={toast.message} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
    </div>
  );
}

