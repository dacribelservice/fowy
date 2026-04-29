"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  CreditCard, 
  Upload, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface PaymentProof {
  id: string;
  amount: number;
  proof_url: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function FinancePage() {
  const [proofs, setProofs] = useState<PaymentProof[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchProofs = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (business) {
        const { data } = await supabase
          .from('payment_proofs')
          .select('*')
          .eq('business_id', business.id)
          .order('created_at', { ascending: false });
        
        if (data) setProofs(data);
      }
      setLoading(false);
    };

    fetchProofs();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user");

      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (!business) throw new Error("No business");

      const fileExt = file.name.split('.').pop();
      const fileName = `${business.id}/${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from('payment_proofs')
        .insert({
          business_id: business.id,
          amount: 29.99, // Standard plan cost
          proof_url: publicUrl,
          status: 'pending'
        });

      if (insertError) throw insertError;

      toast.success("Comprobante enviado. El administrador lo revisará pronto.");
      
      // Refresh list
      const { data } = await supabase
        .from('payment_proofs')
        .select('*')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });
      if (data) setProofs(data);

    } catch (error: any) {
      console.error("Error uploading proof:", error);
      toast.error("Error al subir el comprobante");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
          Finanzas y Membresía 💳
        </h2>
        <p className="text-slate-500 mt-2">
          Gestiona tus pagos, descarga facturas y mantén tu cuenta activa.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Plan Status Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 glass-morphism p-8 rounded-fowy shadow-glass border-t-4 border-t-fowy-secondary flex flex-col"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-fowy-secondary/10 text-fowy-secondary rounded-xl flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Plan Actual</p>
              <h3 className="text-xl font-bold text-slate-800">FOWY PRO</h3>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Estado</span>
              <span className="font-bold text-green-500">Activo</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Próximo Pago</span>
              <span className="font-bold text-slate-800">15 Mayo, 2026</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Costo Mensual</span>
              <span className="font-bold text-slate-800">$29.99</span>
            </div>
          </div>

          <input 
            type="file" 
            id="proof-upload" 
            className="hidden" 
            accept="image/*,.pdf"
            onChange={handleUpload}
            disabled={uploading}
          />
          <button 
            onClick={() => document.getElementById('proof-upload')?.click()}
            disabled={uploading}
            className="w-full py-4 bg-fowy-secondary text-white rounded-2xl font-bold shadow-premium hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {uploading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Upload size={20} />
                Subir Comprobante
              </>
            )}
          </button>
        </motion.div>

        {/* Payment History */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-morphism p-8 rounded-fowy shadow-glass"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Clock size={20} className="text-fowy-secondary" />
              Historial de Pagos
            </h3>

            {loading ? (
               <div className="space-y-4">
                 {[1, 2].map(i => <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />)}
               </div>
            ) : (
              <div className="space-y-4">
                {proofs.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <FileText size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No tienes pagos registrados aún.</p>
                  </div>
                ) : (
                  proofs.map((proof) => (
                    <div key={proof.id} className="flex items-center justify-between p-4 bg-white/50 border border-slate-100 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          proof.status === 'approved' ? 'bg-green-100 text-green-600' :
                          proof.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {proof.status === 'approved' ? <CheckCircle2 size={20} /> :
                           proof.status === 'pending' ? <Clock size={20} /> : <AlertCircle size={20} />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">Pago de Membresía</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Calendar size={12} />
                            {new Date(proof.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-800">${proof.amount}</p>
                        <p className={`text-[10px] font-bold uppercase ${
                          proof.status === 'approved' ? 'text-green-500' :
                          proof.status === 'pending' ? 'text-orange-500' : 'text-red-500'
                        }`}>
                          {proof.status === 'approved' ? 'Aprobado' :
                           proof.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </motion.div>

          {/* Help Box */}
          <div className="p-6 rounded-fowy bg-orange-50 border border-orange-100 flex gap-4">
            <AlertCircle size={24} className="text-orange-500 shrink-0" />
            <div>
              <p className="text-sm font-bold text-orange-800">¿Necesitas ayuda con tu pago?</p>
              <p className="text-xs text-orange-700 leading-relaxed mt-1">
                Si tienes problemas para subir tu comprobante o tu cuenta sigue inactiva después de 24 horas, contáctanos a soporte@fowy.com.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
