/**
 * Calcula si un negocio está abierto en este preciso instante según sus horarios configurados.
 * Soporta horarios regulares y nocturnos que cruzan la medianoche (ej: 18:00 a 02:00).
 */
export function isBusinessOpen(schedules: any): boolean {
  if (!schedules || Object.keys(schedules).length === 0) {
    return true; // Si no tiene horarios configurados, por defecto se muestra abierto
  }

  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const now = new Date();
  
  // Obtener el día de la semana actual en español
  const currentDay = daysOfWeek[now.getDay()];
  const daySchedule = schedules[currentDay];

  // Si el día no está activo o no tiene información de horario, está cerrado
  if (!daySchedule || daySchedule.active === false) {
    return false;
  }

  const { open, close } = daySchedule;
  if (!open || !close) return true;

  // Formato de hora actual: "HH:MM" (en base 24h)
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  if (close > open) {
    // Horario regular del mismo día (ej. 09:00 a 22:00)
    return currentTime >= open && currentTime <= close;
  } else {
    // Horario nocturno que cruza la medianoche (ej. 18:00 a 02:00)
    return currentTime >= open || currentTime <= close;
  }
}
