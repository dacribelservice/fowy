import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Star, AlertCircle } from "lucide-react";
import { BusinessData } from "@/app/admin/negocios/[id]/page";

interface ModuleSwitchProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  active: boolean;
  onToggle: () => void;
}

function ModuleSwitch({ title, description, icon, active, onToggle }: ModuleSwitchProps) {
  return (
    <div 
      onClick={onToggle}
      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer select-none group flex items-center justify-between gap-4 ${
        active 
          ? 'bg-fowy-orange/5 border-fowy-orange/20 shadow-md shadow-fowy-orange/5' 
          : 'bg-white border-slate-100 hover:border-slate-200'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className={`p-2 rounded-xl shrink-0 transition-all ${
          active 
            ? 'bg-fowy-primary text-white scale-105 shadow-sm' 
            : 'bg-slate-50 text-slate-400 group-hover:scale-105'
        }`}>
          {icon}
        </div>
        
        <div className="min-w-0">
          <h5 className={`font-black text-xs uppercase tracking-tight mb-0.5 truncate ${
            active ? 'text-slate-800' : 'text-slate-500'
          }`}>
            {title}
          </h5>
          <p className="text-[10px] font-medium text-slate-400 leading-tight truncate">
            {description}
          </p>
        </div>
      </div>
      
      {/* Toggle UI */}
      <div className={`w-9 h-5 rounded-full relative transition-colors shrink-0 ${
        active ? 'bg-green-500' : 'bg-slate-200'
      }`}>
        <motion.div 
          animate={{ x: active ? 18 : 3 }}
          className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
    </div>
  );
}

interface BusinessModuleManagerProps {
  business: BusinessData;
  onChange: (updates: Partial<BusinessData>) => void;
}

export function BusinessModuleManager({ business, onChange }: BusinessModuleManagerProps) {
  const handleToggleModule = (moduleKey: keyof BusinessData["modules"]) => {
    const currentModules = business.modules || { standard: false, pro: false, premium: false };
    onChange({
      modules: {
        ...currentModules,
        [moduleKey]: !currentModules[moduleKey]
      } as BusinessData["modules"]
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <ShieldCheck className="text-fowy-orange" size={20} />
        <div>
          <h4 className="text-sm font-black text-slate-800 tracking-tight">Gestión de Módulos</h4>
          <p className="text-[11px] text-slate-400 font-medium">Activa servicios individuales para este cliente.</p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {/* Modulo Standard */}
        <ModuleSwitch 
          title="Paquete Standard"
          description="Menú digital, QR dinámico y perfil básico."
          icon={<Zap size={16} />}
          active={business.modules?.standard || false}
          onToggle={() => handleToggleModule('standard')}
        />

        {/* Modulo Pro */}
        <ModuleSwitch 
          title="Funciones Pro"
          description="Gestión de pedidos en tiempo real y estadísticas."
          icon={<Star size={16} />}
          active={business.modules?.pro || false}
          onToggle={() => handleToggleModule('pro')}
        />

        {/* Modulo Premium */}
        <ModuleSwitch 
          title="Fowy Premium"
          description="Personalización avanzada y multi-sucursal."
          icon={<Zap size={16} className="text-yellow-500" />}
          active={business.modules?.premium || false}
          onToggle={() => handleToggleModule('premium')}
        />

        {/* Inventario */}
        <ModuleSwitch 
          title="Módulo Inventario"
          description="Control de stock y alertas automáticas."
          icon={<Zap size={16} />}
          active={business.modules?.inventory || false}
          onToggle={() => handleToggleModule('inventory')}
        />
      </div>

      <div className="mt-6 p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50 flex gap-3">
        <AlertCircle className="text-amber-500 shrink-0" size={16} />
        <p className="text-[10px] text-amber-800 font-medium leading-relaxed">
          <strong>Nota:</strong> Los cambios realizados en los módulos afectarán inmediatamente la interfaz de usuario del cliente en la aplicación explorer.
        </p>
      </div>
    </div>
  );
}

