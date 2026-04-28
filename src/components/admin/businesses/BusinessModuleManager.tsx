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
      className={`p-6 rounded-3xl border-2 transition-all cursor-pointer select-none group ${
        active 
          ? 'bg-fowy-orange/5 border-fowy-orange/20 shadow-lg shadow-fowy-orange/5' 
          : 'bg-white border-slate-100 hover:border-slate-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-2xl mb-4 transition-all ${
          active ? 'bg-fowy-primary text-white scale-110 shadow-lg' : 'bg-slate-50 text-slate-400 group-hover:scale-105'
        }`}>
          {icon}
        </div>
        
        {/* Toggle UI */}
        <div className={`w-12 h-6 rounded-full relative transition-colors ${
          active ? 'bg-fowy-orange' : 'bg-slate-200'
        }`}>
          <motion.div 
            animate={{ x: active ? 24 : 4 }}
            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
          />
        </div>
      </div>
      
      <h5 className={`font-black text-sm uppercase tracking-tight mb-1 ${active ? 'text-slate-800' : 'text-slate-500'}`}>
        {title}
      </h5>
      <p className="text-[10px] font-medium text-slate-400 leading-relaxed">
        {description}
      </p>
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
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-4">
        <ShieldCheck className="text-fowy-orange" />
        <div>
          <h4 className="text-lg font-black text-slate-800 tracking-tight">Gestión de Módulos</h4>
          <p className="text-xs text-slate-400 font-medium">Activa servicios individuales para este cliente.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Modulo Standard */}
        <ModuleSwitch 
          title="Paquete Standard"
          description="Menú digital, QR dinámico y perfil básico."
          icon={<Zap size={20} />}
          active={business.modules?.standard || false}
          onToggle={() => handleToggleModule('standard')}
        />

        {/* Modulo Pro */}
        <ModuleSwitch 
          title="Funciones Pro"
          description="Gestión de pedidos en tiempo real y estadísticas."
          icon={<Star size={20} />}
          active={business.modules?.pro || false}
          onToggle={() => handleToggleModule('pro')}
        />

        {/* Modulo Premium */}
        <ModuleSwitch 
          title="Fowy Premium"
          description="Personalización avanzada y multi-sucursal."
          icon={<Zap size={20} className="text-yellow-500" />}
          active={business.modules?.premium || false}
          onToggle={() => handleToggleModule('premium')}
        />

        {/* Inventario */}
        <ModuleSwitch 
          title="Módulo Inventario"
          description="Control de stock y alertas automáticas."
          icon={<Zap size={20} />}
          active={business.modules?.inventory || false}
          onToggle={() => handleToggleModule('inventory')}
        />
      </div>

      <div className="mt-10 p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
        <AlertCircle className="text-amber-500 shrink-0" />
        <p className="text-xs text-amber-800 font-medium leading-relaxed">
          <strong>Nota:</strong> Los cambios realizados en los módulos afectarán inmediatamente la interfaz de usuario del cliente en la aplicación explorer.
        </p>
      </div>
    </div>
  );
}
