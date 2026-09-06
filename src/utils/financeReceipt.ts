import type { ReceiptData } from '@/types/finance';
import { getBogotaDate } from './bogotaTimeUtils';

export interface RelativeDaysResult {
  text: string;
  colorClass: string;
}

/** Formatea número al estándar colombiano: $50.000 COP */
export function formatCOP(amount: number): string {
  const formatted = new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0,
  }).format(amount || 0);
  return `$${formatted} COP`;
}

/**
 * Calcula días relativos respecto a Bogotá y retorna texto y clase Tailwind.
 * Ej: "en 30 días", "quedan 7 días", "hace 3 días - vencido", "vence hoy".
 */
export function getRelativeDaysText(
  dateStr: string | null | undefined,
  status?: string
): RelativeDaysResult {
  if (!dateStr) return { text: 'Sin fecha asignada', colorClass: 'text-slate-400' };

  const [year, month, day] = dateStr.split('T')[0].split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  const bogotaNow = getBogotaDate();
  const today = new Date(bogotaNow.getFullYear(), bogotaNow.getMonth(), bogotaNow.getDate());

  const diffDays = Math.round((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (status === 'suspended') {
    const past = Math.abs(diffDays);
    return {
      text: diffDays < 0 ? `hace ${past} ${past === 1 ? 'día' : 'días'} - suspendido` : 'cuenta suspendida',
      colorClass: 'text-rose-500 font-medium',
    };
  }

  if (diffDays < 0) {
    const past = Math.abs(diffDays);
    return {
      text: `hace ${past} ${past === 1 ? 'día' : 'días'} - vencido`,
      colorClass: 'text-rose-500 font-medium',
    };
  }

  if (diffDays === 0) {
    return { text: 'vence hoy', colorClass: 'text-amber-500 font-medium' };
  }

  if (diffDays <= 7) {
    return {
      text: diffDays === 1 ? 'queda 1 día' : `quedan ${diffDays} días`,
      colorClass: 'text-amber-500 font-medium',
    };
  }

  return { text: `en ${diffDays} días`, colorClass: 'text-slate-400' };
}

/** Redacta la plantilla de recibo digital oficial #REC-XXXX para WhatsApp */
export function buildOfficialReceiptText(data: ReceiptData): string {
  const code = data.receipt_code?.startsWith('#')
    ? data.receipt_code
    : `#${data.receipt_code || `REC-${String(data.receipt_number || 1).padStart(4, '0')}`}`;

  const amountFormatted = formatCOP(data.amount);
  const remainingFormatted = data.remaining_amount ? formatCOP(data.remaining_amount) : '$0 COP';

  let text = `🧾 *COMPROBANTE OFICIAL DE PAGO FOWY* ${code}\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `🏢 *Establecimiento:* ${data.business_name}\n`;
  text += `💰 *Monto Pagado:* ${amountFormatted}\n`;
  text += `💳 *Método de Pago:* ${(data.payment_method || 'Nequi').toUpperCase()}\n`;
  text += `📅 *Cobertura:* ${data.period_start} al ${data.period_end}\n`;

  if (data.is_partial && data.remaining_amount && data.remaining_amount > 0) {
    text += `⚠️ *Abono Parcial:* Saldo restante ${remainingFormatted}\n`;
  }
  if (data.notes && data.notes.trim().length > 0) {
    text += `📝 *Observaciones:* ${data.notes.trim()}\n`;
  }

  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `🌐 Comprobante digital verificado en fowy.pro\n`;
  text += `¡Gracias por impulsar el comercio local con FOWY! 🚀`;

  return text;
}

/** Genera URL segura y codificada https://wa.me/... */
export function buildWhatsAppLink(phone: string, text: string): string {
  let cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 10 && cleanPhone.startsWith('3')) {
    cleanPhone = `57${cleanPhone}`;
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
