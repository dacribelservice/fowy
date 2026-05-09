import { getBogotaDate } from "./bogotaTimeUtils";

/**
 * Calcula si un negocio está abierto en este preciso instante según sus horarios configurados.
 * Soporta horarios regulares y nocturnos que cruzan la medianoche (ej: 18:00 a 02:00).
 */
export function isBusinessOpen(schedules: any): boolean {
  if (!schedules || Object.keys(schedules).length === 0) {
    return true; // Si no tiene horarios configurados, por defecto se muestra abierto
  }

  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const now = getBogotaDate();
  
  const currentDayIndex = now.getDay();
  const currentDay = daysOfWeek[currentDayIndex];
  
  // Obtener el día de ayer para verificar si su horario nocturno sigue activo hoy
  const yesterdayDayIndex = (currentDayIndex - 1 + 7) % 7;
  const yesterdayDay = daysOfWeek[yesterdayDayIndex];

  const currentDaySchedule = schedules[currentDay];
  const yesterdaySchedule = schedules[yesterdayDay];

  // Formato de hora actual: "HH:MM" (en base 24h)
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  // 1. Evaluar si está abierto por el horario de HOY
  let openToday = false;
  if (currentDaySchedule && currentDaySchedule.active !== false) {
    const open = currentDaySchedule.open || "09:00";
    const close = currentDaySchedule.close || "22:00";

    if (close > open) {
      // Horario regular del mismo día (ej. 09:00 a 22:00)
      openToday = currentTime >= open && currentTime <= close;
    } else if (close < open) {
      // Horario nocturno que cruza la medianoche (ej. 18:00 a 02:00)
      openToday = currentTime >= open || currentTime <= close;
    } else {
      // Si apertura y cierre coinciden (ej. "00:00" a "00:00"), se considera abierto 24h
      openToday = true;
    }
  }

  // 2. Evaluar si está abierto por el horario nocturno de AYER (Midnight Crossover)
  let openFromYesterday = false;
  if (yesterdaySchedule && yesterdaySchedule.active !== false) {
    const yestOpen = yesterdaySchedule.open || "09:00";
    const yestClose = yesterdaySchedule.close || "22:00";

    // Si el horario de ayer cruzó la medianoche (ej. Abrió a las 18:00 de ayer y cierra a las 02:00 de hoy)
    if (yestClose < yestOpen) {
      // Estamos dentro de las primeras horas de hoy (antes del cierre de ayer)
      openFromYesterday = currentTime <= yestClose;
    }
  }

  // El negocio está abierto si se cumple el horario de hoy O el que se extendió desde ayer
  return openToday || openFromYesterday;
}
