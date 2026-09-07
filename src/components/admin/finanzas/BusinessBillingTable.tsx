"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Store } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { BusinessBillingRowDTO } from "@/types/finance";
import { BusinessBillingRow, BusinessBillingCard } from "./BusinessBillingRow";

interface BusinessBillingTableProps {
  rows?: BusinessBillingRowDTO[];
  totalCount?: number;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  isLoading?: boolean;
  onOpenPaymentModal?: (row: BusinessBillingRowDTO) => void;
}

const TABS = [
  { key: "all", label: "Todos" },
  { key: "active", label: "Al Día" },
  { key: "trial", label: "En Prueba" },
  { key: "grace_period", label: "Por Cobrar" },
  { key: "suspended", label: "En Mora" },
];

export const BusinessBillingTable: React.FC<BusinessBillingTableProps> = ({
  rows = [],
  totalCount = 0,
  statusFilter,
  onStatusFilterChange,
  searchTerm,
  onSearchTermChange,
  isLoading = false,
  onOpenPaymentModal,
}) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchTerm) onSearchTermChange(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, searchTerm, onSearchTermChange]);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 68,
    overscan: 5,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
  const paddingBottom = virtualItems.length > 0
    ? rowVirtualizer.getTotalSize() - virtualItems[virtualItems.length - 1].end
    : 0;

  return (
    <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm shadow-sm space-y-3">
      {/* Barra de Filtros y Buscador */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Pestañas de Filtro Rápido */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {TABS.map((tab) => {
            const active = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onStatusFilterChange(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  active
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Buscador Trigram GIN con Debounce */}
        <div className="relative min-w-[220px] max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" strokeWidth={1.75} />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Buscar restaurante..."
            className="w-full pl-8 pr-8 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 transition"
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => { setLocalSearch(""); onSearchTermChange(""); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Vista Desktop / PC: Tabla Virtualizada 60 FPS */}
      <div
        ref={parentRef}
        className="hidden md:block overflow-auto max-h-[520px] rounded-xl border border-slate-200/70 dark:border-slate-800/70 scrollbar-thin"
      >
        <table className="w-full text-left border-collapse min-w-[620px]">
          <thead className="sticky top-0 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm z-10 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800/80">
            <tr>
              <th className="py-2.5 px-3">Negocio & Plan</th>
              <th className="py-2.5 px-3">Estado & Variación</th>
              <th className="py-2.5 px-3">Tarifa / Vence</th>
              <th className="py-2.5 px-3">Entregables</th>
              <th className="py-2.5 px-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-xs text-slate-400">
                  Cargando directorio de cobro...
                </td>
              </tr>
            )}

            {!isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400 dark:text-slate-500">
                  <Store className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" strokeWidth={1.5} />
                  <p className="text-xs font-medium">No se encontraron negocios con este filtro</p>
                  <p className="text-[10px] text-slate-400">Prueba con otra búsqueda o selecciona "Todos"</p>
                </td>
              </tr>
            )}

            {!isLoading && rows.length > 0 && (
              <>
                {paddingTop > 0 && (
                  <tr>
                    <td colSpan={5} style={{ height: `${paddingTop}px` }} />
                  </tr>
                )}
                {virtualItems.map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  return (
                    <BusinessBillingRow
                      key={row.id}
                      row={row}
                      onOpenPaymentModal={onOpenPaymentModal}
                    />
                  );
                })}
                {paddingBottom > 0 && (
                  <tr>
                    <td colSpan={5} style={{ height: `${paddingBottom}px` }} />
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Vista Celular / Mobile: Lista de Tarjeticas Elegantes */}
      <div className="block md:hidden overflow-auto max-h-[560px] space-y-3 p-0.5 scrollbar-thin">
        {isLoading && (
          <div className="py-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80">
            Cargando directorio de cobro...
          </div>
        )}

        {!isLoading && rows.length === 0 && (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 p-6">
            <Store className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" strokeWidth={1.5} />
            <p className="text-xs font-medium">No se encontraron negocios con este filtro</p>
            <p className="text-[10px] text-slate-400">Prueba con otra búsqueda o selecciona "Todos"</p>
          </div>
        )}

        {!isLoading && rows.length > 0 && rows.map((row) => (
          <BusinessBillingCard
            key={row.id}
            row={row}
            onOpenPaymentModal={onOpenPaymentModal}
          />
        ))}
      </div>

      {/* Pie de tabla con total */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
        <span>Mostrando {rows.length} de {totalCount} negocios registrados</span>
        <span className="text-[10px] text-slate-400">Virtualización activa a 60 FPS</span>
      </div>
    </div>
  );
};

export default BusinessBillingTable;
