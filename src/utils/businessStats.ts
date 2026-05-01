export interface BusinessStats {
  total: number;
  activos: number;
  vencimientos: number;
  diff: number;
}

/**
 * Calcula estadísticas globales de negocios para el panel administrativo.
 * @param businesses Array de negocios con created_at, status y payment_date
 */
export function calculateBusinessStats(businesses: any[]): BusinessStats {
  if (!businesses || businesses.length === 0) {
    return { total: 0, activos: 0, vencimientos: 0, diff: 0 };
  }

  const total = businesses.length;
  
  // Estatus activos (soporta boolean o string)
  const activos = businesses.filter((b: any) => 
    b.status === true || 
    b.status === 'true' || 
    b.status === 'active' || 
    b.status === 'activo'
  ).length;
  
  const hoy = new Date();
  const en7Dias = new Date(hoy);
  en7Dias.setDate(hoy.getDate() + 7);
  
  // Vencimientos en los próximos 7 días
  const vencimientos = businesses.filter((b: any) => {
    if (!b.payment_date) return false;
    const fechaPago = new Date(b.payment_date);
    return fechaPago >= hoy && fechaPago <= en7Dias;
  }).length;

  // Cálculo de crecimiento (Conversión/Crecimiento de registros)
  const inicioMesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const inicioMesPasado = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
  
  const nuevosEsteMes = businesses.filter((b: any) => new Date(b.created_at) >= inicioMesActual).length;
  const nuevosMesPasado = businesses.filter((b: any) => {
    const d = new Date(b.created_at);
    return d >= inicioMesPasado && d < inicioMesActual;
  }).length;

  let diff = 0;
  if (nuevosMesPasado > 0) {
    diff = ((nuevosEsteMes - nuevosMesPasado) / nuevosMesPasado) * 100;
  } else if (nuevosEsteMes > 0) {
    diff = 100;
  }

  return { 
    total, 
    activos, 
    vencimientos, 
    diff: Math.round(diff) 
  };
}
