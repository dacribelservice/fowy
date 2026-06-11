"use client";

import React from "react";
import { motion } from "framer-motion";
import { Eye, MessageCircle, Trophy, Medal, Award, Store } from "lucide-react";

interface DashboardRankingsListProps {
  rankings: any;
  activeMetric: "visitas" | "whatsapp";
}

export function DashboardRankingsList({ rankings, activeMetric }: DashboardRankingsListProps) {
  const isVisits = activeMetric === "visitas";
  
  // Extraer arreglos
  const visitsData = rankings?.top_visits || [];
  const clicksData = rankings?.top_clicks || [];

  const data = isVisits ? visitsData : clicksData;

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-slate-500 gap-3">
        <Store className="w-8 h-8 opacity-50" />
        <p className="text-sm font-medium">No hay datos suficientes para el ranking</p>
      </div>
    );
  }

  // Estilos de medalla para los 3 primeros
  const getMedalColor = (index: number) => {
    switch(index) {
      case 0: return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"; // Oro
      case 1: return "text-slate-300 bg-slate-300/10 border-slate-300/20"; // Plata
      case 2: return "text-amber-600 bg-amber-600/10 border-amber-600/20"; // Bronce
      default: return "text-slate-500 bg-slate-800/50 border-white/5";
    }
  };

  const getMedalIcon = (index: number) => {
    switch(index) {
      case 0: return <Trophy className="w-4 h-4" />;
      case 1: return <Medal className="w-4 h-4" />;
      case 2: return <Award className="w-4 h-4" />;
      default: return <span className="text-xs font-bold w-4 text-center">{index + 1}</span>;
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Encabezado del Ranking */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            {isVisits ? <Eye className="w-5 h-5 text-fowy-purple" /> : <MessageCircle className="w-5 h-5 text-green-400" />}
            Top 10 {isVisits ? "Más Visitados" : "Más Contactados"}
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            {isVisits ? "Negocios con mayor tráfico total" : "Negocios con más clics en WhatsApp"}
          </p>
        </div>
      </div>

      {isVisits ? (
        // LEADERBOARD (Visitas)
        <div className="flex flex-col gap-3">
          {data.slice(0, 10).map((item: any, index: number) => (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              key={item.id || index}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all hover:bg-white/10 ${index < 3 ? getMedalColor(index) : 'bg-white/5 border-white/5'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index < 3 ? '' : 'bg-white/5'}`}>
                  {getMedalIcon(index)}
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-semibold ${index < 3 ? 'text-slate-800' : 'text-slate-700'}`}>
                    {item.name || "Negocio Desconocido"}
                  </span>
                  <span className="text-xs text-slate-400 truncate max-w-[150px]">
                    ID: {String(item.id).substring(0,6)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white bg-black/20 px-3 py-1 rounded-full text-sm">
                  {item.count || 0}
                </span>
                <Eye className="w-4 h-4 opacity-50" />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        // GRÁFICA DE BARRAS VERTICALES (WhatsApp)
        <div className="w-full h-[300px] flex items-end justify-between gap-2 mt-4 pt-4 border-t border-white/5">
          {data.slice(0, 8).map((item: any, index: number) => {
            const maxValue = Math.max(...data.map((d:any) => d.count || 0), 1);
            const heightPercent = ((item.count || 0) / maxValue) * 100;
            
            return (
              <div key={item.id || index} className="relative flex flex-col items-center flex-1 h-full justify-end group">
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs px-2 py-1 rounded-md pointer-events-none z-10 whitespace-nowrap shadow-lg">
                  {item.name} <br/>
                  <span className="text-green-400 font-bold">{item.count || 0} clics</span>
                </div>
                
                {/* Valor numérico */}
                <span className="text-xs font-bold text-slate-300 mb-2 transition-transform group-hover:-translate-y-1">
                  {item.count || 0}
                </span>
                
                {/* Barra vertical */}
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={`w-full max-w-[40px] rounded-t-lg relative overflow-hidden transition-all group-hover:brightness-125 ${
                    index === 0 ? 'bg-gradient-to-t from-green-600 to-green-400 shadow-[0_0_15px_rgba(74,222,128,0.2)]' :
                    index === 1 ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 opacity-90' :
                    index === 2 ? 'bg-gradient-to-t from-teal-600 to-teal-400 opacity-80' :
                    'bg-slate-700 opacity-70'
                  }`}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
                
                {/* Nombre de negocio debajo */}
                <span className="text-[10px] text-slate-400 mt-2 truncate w-full text-center px-1 font-medium">
                  {item.name ? item.name.substring(0,8) : "N/A"}
                </span>
                
                {/* Icono de medalla para los primeros 3 puestos */}
                {index < 3 && (
                  <div className={`mt-1 ${getMedalColor(index).split(' ')[0]}`}>
                    {getMedalIcon(index)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
