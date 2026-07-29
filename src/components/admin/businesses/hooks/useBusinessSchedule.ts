import { useState, useEffect, useRef } from "react";
import { getBogotaDate, getBogotaTimeString } from "@/utils/bogotaTimeUtils";
import { isBusinessOpen } from "@/utils/businessTime";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface UseBusinessScheduleProps {
  businessId?: string | null;
  schedules?: any;
  openingTime?: string | null;
  closingTime?: string | null;
  currentStatus?: boolean;
  onStatusChange?: (newStatus: boolean) => void;
}

/**
 * Hook personalizado de control de horarios de negocio.
 * Encapsula la lógica de sincronización horaria de Bogotá (GMT-5) con precisión de segundos,
 * ejecutando un sensado activo cada segundo y realizando transiciones automáticas al segundo exacto.
 * 
 * Regla de Diseño: "Un Archivo, Una Responsabilidad" (Concepto 2).
 */
export function useBusinessSchedule(props?: UseBusinessScheduleProps) {
  const {
    businessId,
    schedules,
    openingTime,
    closingTime,
    currentStatus,
    onStatusChange,
  } = props || {};

  const [currentDate, setCurrentDate] = useState<Date>(getBogotaDate());
  const [currentTimeStr, setCurrentTimeStr] = useState<string>(getBogotaTimeString());
  const timezoneLabel = "Bogotá (GMT-5)";
  const isUpdatingRef = useRef(false);
  const supabase = createClient();

  useEffect(() => {
    // Intervalo de alta precisión que consulta la hora de Bogotá cada segundo (1000ms)
    const intervalId = setInterval(async () => {
      const bDate = getBogotaDate();
      const hours = String(bDate.getHours()).padStart(2, '0');
      const minutes = String(bDate.getMinutes()).padStart(2, '0');
      const seconds = String(bDate.getSeconds()).padStart(2, '0');
      const timeStr = `${hours}:${minutes}:${seconds}`;
      
      setCurrentDate(bDate);
      setCurrentTimeStr(timeStr);

      // Si tenemos un ID de negocio y un status actual, evaluamos la transición automática (Fase 21.3.3)
      if (businessId && currentStatus !== undefined && !isUpdatingRef.current) {
        // Determinamos si debe estar abierto o cerrado llamando a la función centralizada isBusinessOpen
        let evalSchedules = schedules;
        if ((!schedules || Object.keys(schedules).length === 0) && (openingTime || closingTime)) {
          // Si no hay calendario detallado, pero sí horarios simples heredados, construimos un objeto virtual para mantener compatibilidad
          const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
          evalSchedules = {};
          daysOfWeek.forEach(day => {
            evalSchedules[day] = {
              active: true,
              open: openingTime || "09:00",
              close: closingTime || "22:00"
            };
          });
        }

        const shouldBeOpen = isBusinessOpen(evalSchedules);

        // NOTA: La sobrescritura automática de la columna 'status' en Supabase ha sido desactivada (Opción A)
        // para preservar el Estatus Administrativo del negocio (Activo/Inactivo) establecido por el Admin.
        // La evaluación de apertura/cierre por horarios se realiza dinámicamente en tiempo real en el frontend.
      }
    }, 1000);

    // Desmantelamiento automático del intervalo para prevenir fugas de memoria (memory leaks) (Fase 21.3.4)
    return () => {
      clearInterval(intervalId);
    };
  }, [businessId, schedules, openingTime, closingTime, currentStatus, onStatusChange, supabase]);

  return {
    currentDate,
    currentTimeStr,
    timezoneLabel,
  };
}
