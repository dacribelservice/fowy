import React from 'react';
import { CheckCircle2, XCircle, Printer, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Order } from '@/hooks/useOrderManager';
import { useOrderPrinter } from '@/hooks/useOrderPrinter';
import { OrderTicketData } from './OrderTicket';

interface OrderActionButtonsProps {
  order: Order;
  onUpdateStatus: (id: string, status: Order['status']) => void;
  businessInfo: { name: string; phone: string; slug: string } | null;
}

export default function OrderActionButtons({ order, onUpdateStatus, businessInfo }: OrderActionButtonsProps) {
  const { printWeb, printAndroid } = useOrderPrinter();

  const handlePrintWeb = () => {
    try {
      printWeb(order.id);
    } catch (error) {
      toast.error('Error al iniciar la impresión web');
    }
  };

  const handlePrintAndroid = () => {
    try {
      if (!businessInfo) {
        toast.error('Falta información del negocio para imprimir');
        return;
      }
      
      const ticketData = {
        ...order,
        business_name: businessInfo.name,
        business_phone: businessInfo.phone,
        business_slug: businessInfo.slug
      } as OrderTicketData;

      printAndroid(ticketData);
    } catch (error) {
      toast.error('Error al enviar la impresión a RawBT');
    }
  };

  return (
    <AnimatePresence mode="wait">
      {order.status === 'pending' && (
        <motion.div 
          key="pending-buttons"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="flex flex-wrap items-center gap-3 w-full md:w-auto"
        >
          <button 
            onClick={() => onUpdateStatus(order.id, 'completed')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-fowy-secondary text-white rounded-xl font-bold shadow-premium hover:opacity-90 transition-all"
          >
            <CheckCircle2 size={18} />
            Completar
          </button>
          <button 
            onClick={() => onUpdateStatus(order.id, 'cancelled')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-red-500 border border-red-100 rounded-xl font-bold hover:bg-red-50 transition-all"
          >
            <XCircle size={18} />
            Cancelar
          </button>
        </motion.div>
      )}

      {order.status === 'completed' && (
        <motion.div 
          key="completed-buttons"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-wrap items-center gap-3 w-full md:w-auto"
        >
          <button 
            onClick={handlePrintWeb}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            <Printer size={18} className="text-slate-500" />
            Imprimir PC
          </button>
          <button 
            onClick={handlePrintAndroid}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold shadow-sm hover:bg-emerald-100 transition-all"
          >
            <Smartphone size={18} className="text-emerald-500" />
            Imprimir Android
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
