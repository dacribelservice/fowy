"use client";

import { useCallback } from 'react';
import { OrderTicketData } from '@/components/partners/business/orders/OrderTicket';

export function useOrderPrinter() {
  
  // Opción A: Impresión Nativa Web (CSS Print)
  const printWeb = useCallback((orderId: string) => {
    const originalTitle = document.title;
    document.title = `Pedido_${orderId.slice(0, 8).toUpperCase()}`;
    
    const ticketElement = document.getElementById(`ticket-${orderId}`);
    if (!ticketElement) return;

    // Clonar el ticket en un contenedor especial en la raíz del body
    const printContainer = document.createElement('div');
    printContainer.id = 'print-container';
    printContainer.appendChild(ticketElement.cloneNode(true));
    document.body.appendChild(printContainer);

    // Insertar un tag style temporal para anular la interfaz de Fowy y dejar solo el clon (elimina hojas en blanco)
    const style = document.createElement('style');
    style.id = 'print-ticket-style';
    style.innerHTML = `
      @media print {
        body > *:not(#print-container) {
          display: none !important;
        }
        #print-container {
          display: block !important;
          width: 100%;
        }
        @page { margin: 0; }
        body { margin: 0; padding: 0; }
      }
    `;
    document.head.appendChild(style);
    
    // Disparamos la impresión nativa
    window.print();
    
    // Limpieza post-impresión
    document.body.removeChild(printContainer);
    const styleToRemove = document.getElementById('print-ticket-style');
    if (styleToRemove) {
      document.head.removeChild(styleToRemove);
    }
    document.title = originalTitle;
  }, []);

  // Opción B: Impresión RawBT (Android Intent ESC/POS)
  const printAndroid = useCallback((order: OrderTicketData) => {
    // 1. Formatear el texto plano para comandos ESC/POS (soportado nativamente por RawBT)
    const formatCurrency = (val: number) => 
      `$${new Intl.NumberFormat("es-CO", { minimumFractionDigits: 0 }).format(val)}`;

    const businessName = order.business_name || 'Negocio';
    const businessPhone = order.business_phone ? `Tel: ${order.business_phone}` : '';
    
    let text = "";
    
    // Etiquetas de formato RawBT: [C] Centro, [L] Izquierda, [R] Derecha, <b> Bold
    // Encabezado
    text += `[C]<b>${businessName}</b>\n`;
    if (businessPhone) {
      text += `[C]${businessPhone}\n`;
    }
    text += `[C]--------------------------------\n`;
    
    // Datos Cliente
    text += `[L]Cliente: ${order.customer_name}\n`;
    text += `[L]Celular: ${order.customer_phone}\n`;
    if (order.delivery_address) {
      text += `[L]Direccion: ${order.delivery_address}\n`;
    }
    text += `[L]Orden #: ${order.id.slice(0, 8).toUpperCase()}\n`;
    text += `[C]--------------------------------\n`;
    
    // Items
    text += `[L]Cant Descripcion        Total\n`;
    order.items?.forEach(item => {
      // Ajustar descripción para que no rompa la estructura de columnas (aprox 15 chars)
      const name = item.name.substring(0, 15).padEnd(15, ' ');
      const qty = String(item.quantity).padEnd(4, ' ');
      const total = formatCurrency(item.price * item.quantity);
      text += `[L]${qty} ${name} ${total}\n`;
    });
    
    // Notas
    if (order.notes) {
      text += `[L]\n[L]Notas del pedido:\n[L]${order.notes}\n`;
    }
    text += `[C]--------------------------------\n`;
    
    // Totales
    text += `[L]<b>TOTAL A PAGAR:</b>[R]<b>${formatCurrency(order.total_amount)}</b>\n`;
    
    if (order.payment_method) {
      text += `[L]Metodo de Pago: ${order.payment_method.toUpperCase()}\n`;
    }
    if (order.payment_method === 'efectivo' && order.cash_change) {
      text += `[L]${order.cash_change}\n`;
    }
    
    // Pie de página
    text += `[C]--------------------------------\n`;
    text += `[C]<b>¡Gracias por tu compra!</b>\n`;
    text += `[C]Visita nuestro menu\n`;
    const url = order.business_slug ? `https://www.fowy.pro/${order.business_slug}` : 'https://www.fowy.pro';
    text += `[C]${url}\n`;
    
    // Espacio final para asegurar que la impresora térmica corte bien el papel
    text += `\n\n\n`;

    // 2. Codificar en formato URI para el Intent
    const encodedText = encodeURIComponent(text);

    // 3. Construir y disparar el Intent URI para RawBT según la documentación
    const intentUrl = `intent:${encodedText}#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;end;`;
    
    window.location.href = intentUrl;
  }, []);

  return {
    printWeb,
    printAndroid
  };
}
