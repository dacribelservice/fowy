"use client";

import React, { useState, useEffect } from "react";
import { Globe, MapPin, Store } from "lucide-react";
import Autocomplete from "@/components/admin/shared/Autocomplete";
import cities from "../../../../public/colombia.json";

interface BannerScopeSelectorProps {
  targetCity: string | null;
  onChangeTargetCity: (city: string | null) => void;
  targetBusinessId: string | null;
  onChangeTargetBusinessId: (id: string | null) => void;
  onSearchBusinesses: (query: string) => Promise<{ id: string; name: string }[]>;
  initialBusinessName?: string;
}

export default function BannerScopeSelector({
  targetCity,
  onChangeTargetCity,
  targetBusinessId,
  onChangeTargetBusinessId,
  onSearchBusinesses,
  initialBusinessName = ""
}: BannerScopeSelectorProps) {
  // Helper to determine the active tab based on values
  const getInitialTab = () => {
    if (targetBusinessId) return "business";
    if (targetCity) return "city";
    return "global";
  };

  const [activeTab, setActiveTab] = useState<"global" | "city" | "business">(getInitialTab());
  const [selectedBusinessName, setSelectedBusinessName] = useState(initialBusinessName);

  // Sync state if activeTab changes
  const handleTabChange = (tab: "global" | "city" | "business") => {
    setActiveTab(tab);
    if (tab === "global") {
      onChangeTargetCity(null);
      onChangeTargetBusinessId(null);
      setSelectedBusinessName("");
    } else if (tab === "city") {
      onChangeTargetCity(targetCity || "");
      onChangeTargetBusinessId(null);
      setSelectedBusinessName("");
    } else if (tab === "business") {
      onChangeTargetCity(null);
      onChangeTargetBusinessId(targetBusinessId || "");
    }
  };

  // Convert business list to string array format for Autocomplete
  const handleAsyncSearch = async (query: string): Promise<string[]> => {
    try {
      const results = await onSearchBusinesses(query);
      return results.map(b => `${b.name} [ID: ${b.id}]`);
    } catch (e) {
      console.error("Error in BannerScopeSelector async search:", e);
      return [];
    }
  };

  // Parse business selection
  const handleBusinessSelect = (selectedOption: string) => {
    if (!selectedOption) {
      onChangeTargetBusinessId(null);
      setSelectedBusinessName("");
      return;
    }
    
    const match = selectedOption.match(/(.+) \[ID: (.+)\]/);
    if (match && match[2]) {
      const name = match[1];
      const id = match[2];
      onChangeTargetBusinessId(id);
      setSelectedBusinessName(name);
    } else {
      onChangeTargetBusinessId(null);
      setSelectedBusinessName("");
    }
  };

  // Synchronize initial business name prop when values change
  useEffect(() => {
    if (targetBusinessId) {
      setSelectedBusinessName(initialBusinessName);
    } else {
      setSelectedBusinessName("");
    }
  }, [initialBusinessName, targetBusinessId]);

  return (
    <div className="space-y-4">
      <label className="text-xs font-black text-slate-550 uppercase tracking-widest block">
        Alcance del Banner (Segmentación)
      </label>

      {/* Segmented Tabs Control */}
      <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
        <button
          type="button"
          onClick={() => handleTabChange("global")}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-3 rounded-xl font-bold text-xs transition-all ${
            activeTab === "global"
              ? "bg-white text-fowy-primary shadow-sm border border-slate-150"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Globe size={14} />
          <span>Global</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("city")}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-3 rounded-xl font-bold text-xs transition-all ${
            activeTab === "city"
              ? "bg-white text-fowy-primary shadow-sm border border-slate-150"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <MapPin size={14} />
          <span>Por Ciudad</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("business")}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-3 rounded-xl font-bold text-xs transition-all ${
            activeTab === "business"
              ? "bg-white text-fowy-primary shadow-sm border border-slate-150"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Store size={14} />
          <span>Por Negocio</span>
        </button>
      </div>

      {/* Scope Inputs */}
      {activeTab === "global" && (
        <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 text-center">
          <p className="text-xs font-semibold text-slate-400 leading-relaxed">
            Este banner se mostrará de forma <span className="font-bold text-slate-600">Nacional / Global</span> en todos los menús de la plataforma.
          </p>
        </div>
      )}

      {activeTab === "city" && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <Autocomplete
            value={targetCity || ""}
            onChange={(val) => onChangeTargetCity(val || null)}
            options={cities}
            placeholder="Buscar ciudad... (Ej: Cali)"
          />
          <p className="text-[10px] font-semibold text-slate-400 ml-1">
            El banner solo aparecerá a usuarios que visiten negocios en la ciudad seleccionada.
          </p>
        </div>
      )}

      {activeTab === "business" && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <Autocomplete
            value={targetBusinessId ? `${selectedBusinessName} [ID: ${targetBusinessId}]` : ""}
            onChange={handleBusinessSelect}
            onAsyncSearch={handleAsyncSearch}
            placeholder="Buscar negocio... (Ej: Terraza Mana)"
          />
          <p className="text-[10px] font-semibold text-slate-400 ml-1">
            El banner se inyectará de forma exclusiva dentro del menú del negocio seleccionado.
          </p>
        </div>
      )}
    </div>
  );
}
