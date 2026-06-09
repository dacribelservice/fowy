import React from 'react';
import { Order } from '@/hooks/useOrderManager';

// Definición estricta de un ítem para reemplazar el `any` de la base
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string | null;
}

// Interfaz que extiende el Order base sin modificar el código heredado
export interface OrderTicketData extends Omit<Order, 'items'> {
  items: OrderItem[];
  delivery_address?: string | null;
  notes?: string | null;
  payment_method?: string | null;
  cash_change?: string | null;
  // Campos extraídos de la tabla de negocios (orquestador los inyectará)
  business_name?: string;
  business_phone?: string;
  business_slug?: string;
}

interface OrderTicketProps {
  order: OrderTicketData | null;
}

const formatCurrency = (val: number) => 
  `$${new Intl.NumberFormat("es-CO", { minimumFractionDigits: 0 }).format(val)}`;

export default function OrderTicket({ order }: OrderTicketProps) {
  if (!order) return null;

  return (
    <div 
      className="hidden print:block print:w-[80mm] print:mx-auto print:bg-white print:text-black print:text-sm font-mono p-4"
      id={`ticket-${order.id}`}
    >
      {/* A. Encabezado */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold uppercase">{order.business_name || 'Negocio'}</h1>
        {order.business_phone && <p className="text-sm">Tel: {order.business_phone}</p>}
      </div>

      <div className="border-b border-black border-dashed mb-4" />

      {/* B. Datos del Cliente y Envío */}
      <div className="mb-4 text-sm">
        <p><span className="font-bold">Cliente:</span> {order.customer_name}</p>
        <p><span className="font-bold">Celular:</span> {order.customer_phone}</p>
        {order.delivery_address && (
          <p><span className="font-bold">Dirección:</span> {order.delivery_address}</p>
        )}
        <p className="mt-1"><span className="font-bold">Orden #:</span> {order.id.slice(0, 8).toUpperCase()}</p>
      </div>

      <div className="border-b border-black border-dashed mb-4" />

      {/* C. Cuerpo (Ítems y Notas) */}
      <div className="mb-4">
        <table className="w-full text-sm mb-4">
          <thead>
            <tr className="border-b border-black">
              <th className="text-left py-1">Cant</th>
              <th className="text-left py-1">Descripción</th>
              <th className="text-right py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item, index) => (
              <tr key={index} className="align-top">
                <td className="py-1">{item.quantity}</td>
                <td className="py-1 pr-2">{item.name}</td>
                <td className="py-1 text-right">{formatCurrency(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {order.notes && (
          <div className="mt-4 p-2 border border-black rounded-sm">
            <p className="font-bold uppercase text-xs mb-1">Notas del pedido:</p>
            <p className="text-sm">{order.notes}</p>
          </div>
        )}
      </div>

      <div className="border-b border-black border-dashed mb-4" />

      {/* D. Totales y Pago */}
      <div className="mb-6">
        <div className="flex justify-between font-bold text-lg mb-2">
          <span>TOTAL A PAGAR:</span>
          <span>{formatCurrency(order.total_amount)}</span>
        </div>
        
        {order.payment_method && (
          <p className="text-sm">
            <span className="font-bold">Método de Pago:</span> {order.payment_method.toUpperCase()}
          </p>
        )}
        
        {order.payment_method === 'efectivo' && order.cash_change && (
          <p className="text-sm mt-1 font-bold">
            {order.cash_change}
          </p>
        )}
      </div>

      {/* E. Pie de Página */}
      <div className="text-center mt-8 text-sm">
        <p className="mb-1 font-bold">¡Gracias por tu compra!</p>
        <p>Visita nuestro menú</p>
        <p className="mt-1 break-all">
          {order.business_slug ? `https://www.fowy.pro/${order.business_slug}` : 'https://www.fowy.pro'}
        </p>
      </div>
    </div>
  );
}
