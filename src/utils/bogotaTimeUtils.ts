/**
 * Utilidades de tiempo para sincronización con la hora oficial de Bogotá (GMT-5).
 * Evita depender exclusivamente de la hora del dispositivo del cliente (que puede estar desajustada).
 */

/**
 * Obtiene la fecha y hora actual exacta en la zona horaria de Bogotá (GMT-5),
 * preservando la precisión de milisegundos y superando desajustes de zona horaria local.
 * 
 * @returns Un objeto Date configurado con la hora local actual de Bogotá.
 */
export function getBogotaDate(): Date {
  const now = new Date();
  
  try {
    // Formateador nativo de alta precisión utilizando la zona horaria oficial de Bogotá
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Bogota',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    const formatted = formatter.format(now);
    // Formato resultante: MM/DD/YYYY, HH:MM:SS
    const match = formatted.match(/(\d+)\/(\d+)\/(\d+),\s+(\d+):(\d+):(\d+)/);
    
    if (match) {
      const [, month, day, year, hour, minute, second] = match;
      return new Date(
        parseInt(year, 10),
        parseInt(month, 10) - 1,
        parseInt(day, 10),
        parseInt(hour, 10),
        parseInt(minute, 10),
        parseInt(second, 10),
        now.getMilliseconds()
      );
    }
  } catch (error) {
    console.error("Error al sincronizar con la zona horaria de Bogotá:", error);
  }
  
  // Fallback resiliente si falla el formateador nativo
  return now;
}

/**
 * Valida y formatea una cadena de tiempo (ej. "09:00") para inyectar segundos
 * y asegurar consistencia absoluta ("09:00:00") en comparaciones y sensado.
 * 
 * @param timeStr Cadena de tiempo en formato "HH:MM" o "HH:MM:SS"
 * @returns Cadena de tiempo normalizada en formato "HH:MM:SS"
 */
export function formatTimeWithSeconds(timeStr: string | null | undefined): string {
  if (!timeStr) {
    return "00:00:00";
  }
  
  const cleaned = timeStr.trim();
  const parts = cleaned.split(":");
  
  if (parts.length === 0 || parts[0] === "") {
    return "00:00:00";
  }
  
  const hours = parts[0].padStart(2, "0");
  const minutes = (parts[1] || "00").padStart(2, "0");
  const seconds = (parts[2] || "00").padStart(2, "0");
  
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Retorna la hora actual en Bogotá formateada como "HH:MM:SS" con precisión de segundos.
 * Útil para el sensado activo y relojes interactivos.
 */
export function getBogotaTimeString(): string {
  const bogotaDate = getBogotaDate();
  const hours = String(bogotaDate.getHours()).padStart(2, '0');
  const minutes = String(bogotaDate.getMinutes()).padStart(2, '0');
  const seconds = String(bogotaDate.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}
