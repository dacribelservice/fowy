import { ServiceOrder } from "@/hooks/useServiceOrderManager";

export interface FinanceStats {
  totalVolume: number;
  totalCommissions: number;
  totalNetToProfessionals: number;
  pendingEscrow: number;
  releasedFunds: number;
  availableBalance?: number; // For professional
  pendingBalance?: number;   // For professional
  withdrawalHistory?: any[]; // Placeholder for now
}

/**
 * Calculates financial metrics from a list of service orders.
 * This ensures precision by centralizing the math logic.
 */
export const calculateFinanceStats = (orders: ServiceOrder[], role: 'admin' | 'professional' = 'admin'): FinanceStats => {
  const stats: FinanceStats = {
    totalVolume: 0,
    totalCommissions: 0,
    totalNetToProfessionals: 0,
    pendingEscrow: 0,
    releasedFunds: 0,
  };

  orders.forEach(order => {
    const amount = Number(order.amount) || 0;
    const commission = Number(order.fowy_commission) || 0;
    const net = Number(order.professional_net) || 0;

    stats.totalVolume += amount;
    stats.totalCommissions += commission;
    stats.totalNetToProfessionals += net;

    // Logic for escrow vs released
    if (order.status === 'in_escrow' || order.status === 'completed' || order.status === 'in_progress') {
      stats.pendingEscrow += net;
    } else if (order.status === 'funds_released') {
      stats.releasedFunds += net;
    }
  });

  if (role === 'professional') {
    stats.availableBalance = stats.releasedFunds;
    stats.pendingBalance = stats.pendingEscrow;
  }

  return stats;
};

/**
 * Groups earnings by date for charts
 */
export const groupFinanceByDate = (orders: ServiceOrder[], days: number = 7) => {
  const lastDays = Array.from({ length: days }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const dailyVolume = lastDays.map(day => {
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);
    
    return orders
      .filter(o => {
        const d = new Date(o.created_at);
        return d >= day && d < nextDay;
      })
      .reduce((acc, o) => acc + (Number(o.amount) || 0), 0);
  });

  return {
    labels: lastDays.map(d => d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })),
    data: dailyVolume
  };
};
