"use client";

import React from "react";
import { 
  Puzzle, 
  CheckCircle2, 
  XCircle,
  ShoppingBag,
  Calendar,
  Zap,
  MessageCircle,
  Truck
} from "lucide-react";
import { motion } from "framer-motion";

const modulos = [
  {
    id: "delivery",
    name: "Módulo Delivery",
    description: "Gestión de pedidos para entrega a domicilio con WhatsApp.",
    icon: Truck,
    status: "active",
    color: "text-green-500",
    bgColor: "bg-green-50"
  },
  {
    id: "menu_digital",
    name: "Menú Digital QR",
    description: "Catálogo interactivo con branding personalizado.",
    icon: Zap,
    status: "active",
    color: "text-blue-500",
    bgColor: "bg-blue-50"
  },
  {
    id: "reservas",
    name: "Reservas de Mesa",
    description: "Permite a tus clientes agendar visitas desde el perfil.",
    icon: Calendar,
    status: "inactive",
    color: "text-slate-400",
    bgColor: "bg-slate-50"
  },
  {
    id: "marketing",
    name: "Marketing & Promo",
    description: "Herramientas para campañas y cupones de descuento.",
    icon: ShoppingBag,
    status: "inactive",
    color: "text-slate-400",
    bgColor: "bg-slate-50"
  },
  {
    id: "fowy_chat",
    name: "FOWY AI Chat",
    description: "Asistente inteligente para atención al cliente 24/7.",
    icon: MessageCircle,
    status: "inactive",
    color: "text-slate-400",
    bgColor: "bg-slate-50"
  }
];

export default function ModulosPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
          Mis Módulos 🧩
        </h2>
        <p className="text-slate-500 mt-2">
          Herramientas y funcionalidades habilitadas para tu negocio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {modulos.map((modulo, index) => {
          const Icon = modulo.icon;
          const isActive = modulo.status === "active";

          return (
            <motion.div
              key={modulo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-morphism p-6 rounded-fowy shadow-glass border-l-4 ${isActive ? 'border-l-fowy-secondary' : 'border-l-slate-200'} flex flex-col`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl ${modulo.bgColor} ${modulo.color}`}>
                  <Icon size={24} />
                </div>
                {isActive ? (
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    Habilitado
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <XCircle size={12} />
                    Bloqueado
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-2">{modulo.name}</h3>
              <p className="text-sm text-slate-500 leading-relaxed flex-1">
                {modulo.description}
              </p>

              {!isActive && (
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <p className="text-[10px] text-slate-400 italic">
                    Contacta a FOWY para activar este módulo.
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Info Banner */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="p-6 rounded-fowy bg-fowy-secondary/5 border border-fowy-secondary/10 flex items-center gap-6"
      >
        <div className="w-12 h-12 rounded-2xl bg-fowy-secondary flex items-center justify-center text-white shrink-0 shadow-premium">
          <Puzzle size={24} />
        </div>
        <div>
          <h4 className="font-bold text-slate-800">¿Necesitas más herramientas?</h4>
          <p className="text-sm text-slate-500 mt-1">
            Los módulos son configurados por el equipo de FOWY según tu plan actual. Si deseas escalar tu negocio, solicita una actualización de plan.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
