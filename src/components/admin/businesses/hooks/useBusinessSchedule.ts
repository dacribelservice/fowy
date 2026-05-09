import { useState, useEffect, useRef } from "react";
import { getBogotaDate, getBogotaTimeString, formatTimeWithSeconds } from "@/utils/bogotaTimeUtils";
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
        // Determinamos si debe estar abierto o cerrado en base a la hora de Bogotá y horarios
        let openTime = "09:00:00";
        let closeTime = "22:00:00";
        let isDayActive = true;

        if (schedules && Object.keys(schedules).length > 0) {
          const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
          const currentDay = daysOfWeek[bDate.getDay()];
          const daySchedule = schedules[currentDay];

          if (daySchedule) {
            isDayActive = daySchedule.active !== false;
            openTime = formatTimeWithSeconds(daySchedule.open || "09:00");
            closeTime = formatTimeWithSeconds(daySchedule.close || "22:00");
          } else {
            isDayActive = false; // Sin horario activo hoy
          }
        } else if (openingTime || closingTime) {
          openTime = formatTimeWithSeconds(openingTime);
          closeTime = formatTimeWithSeconds(closingTime);
        }

        // Si el día está inactivo en el calendario de horarios, debe estar cerrado
        let shouldBeOpen = false;
        if (isDayActive) {
          if (closeTime > openTime) {
            // Horario regular del mismo día (ej. 09:00:00 a 22:00:00)
            shouldBeOpen = timeStr >= openTime && timeStr <= closeTime;
          } else {
            // Horario nocturno que cruza la medianoche (ej. 18:00:00 a 02:00:00)
            shouldBeOpen = timeStr >= openTime || timeStr <= closeTime;
          }
        }

        // Si el estado evaluado difiere del estado actual, ejecutamos la transición instantánea
        if (shouldBeOpen !== currentStatus) {
          isUpdatingRef.current = true;
          try {
            const { error } = await supabase
              .from('businesses')
              .update({ status: shouldBeOpen })
              .eq('id', businessId);

            if (!error) {
              // Notificación de alta gama mediante Toast Premium de FOWY
              toast.success(`⏰ Horario Automatizado`, {
                description: `Tu establecimiento se ha ${shouldBeOpen ? 'Abierto' : 'Cerrado'} automáticamente según tu configuración de Bogotá (GMT-5).`,
                duration: 5000,
              });

              // Informar al componente padre de la actualización de estado
              if (onStatusChange) {
                onStatusChange(shouldBeOpen);
              }
            } else {
              console.error("Error al actualizar estado automático del negocio:", error);
            }
          } catch (err) {
            console.error("Excepción en transición automática de horarios:", err);
          } finally {
            isUpdatingRef.current = false;
          }
        }
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
