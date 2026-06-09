// useCheckoutLogic.ts
// Hook que centraliza toda la lógica del checkout:
// estados del formulario, geolocalización GPS, inserción en Supabase y envío por WhatsApp.
// Extraído de CraveCheckoutSheet.tsx como parte de la modularización (solucion.md).

"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export interface UseCheckoutLogicParams {
  cartItems: any[];
  businessId?: string;
  businessPhone?: string;
  businessName: string;
  isOpen: boolean;
}

export function useCheckoutLogic({
  cartItems,
  businessId,
  businessPhone,
  businessName,
  isOpen,
}: UseCheckoutLogicParams) {
  const supabase = createClient();

  // ── Estados del formulario ──────────────────────────────────────────────────
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "checkout">("cart");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [gpsLocation, setGpsLocation] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "efectivo" | "nequi" | "bancolombia" | "daviplata" | "otro" | ""
  >("");
  const [cashChange, setCashChange] = useState("");
  const [customPaymentMethod, setCustomPaymentMethod] = useState("");
  const [validationError, setValidationError] = useState("");

  // ── Agrupación del carrito por id ───────────────────────────────────────
  const groupedCart = cartItems.reduce((acc: any[], item: any) => {
    const existing = acc.find((x: any) => x.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      acc.push({ ...item, quantity: 1 });
    }
    return acc;
  }, []);

  // ── GPS: Geolocalización ──────────────────────────────────────────
  const handleShareLocation = () => {
    const isGeolocationAvailable = typeof window !== "undefined" && navigator && "geolocation" in navigator && !!navigator.geolocation;
    if (!isGeolocationAvailable) {
      setValidationError("La geolocalización no está soportada o está bloqueada por tu navegador/dispositivo.");
      return;
    }
    setIsLocating(true);
    setValidationError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setGpsLocation(mapsUrl);
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        console.error("Error getting location:", error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setValidationError("Permiso denegado. Por favor, autoriza el acceso al GPS en la configuración de tu iPhone/navegador o escribe tu dirección.");
            break;
          case error.POSITION_UNAVAILABLE:
            setValidationError("Ubicación no disponible. Asegúrate de tener buena señal GPS/Internet y que la conexión sea HTTPS segura.");
            break;
          case error.TIMEOUT:
            setValidationError("La solicitud de GPS expiró. Por favor, vuelve a intentarlo o escribe tu dirección.");
            break;
          default:
            setValidationError("No se pudo obtener tu ubicación. Por favor, escríbela manualmente.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // ── WhatsApp + Supabase ────────────────────────────────────────
  const handleSendWhatsApp = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      setValidationError("Por favor, ingresa tu nombre y celular para enviar el pedido.");
      return;
    }

    if (!customerAddress.trim() && !gpsLocation) {
      setValidationError("Por favor, ingresa tu dirección de entrega o comparte tu ubicación.");
      return;
    }

    if (!paymentMethod) {
      setValidationError("Por favor, selecciona un método de pago.");
      return;
    }

    if (paymentMethod === "otro" && !customPaymentMethod.trim()) {
      setValidationError("Por favor, escribe tu método de pago personalizado.");
      return;
    }

    const itemsText = groupedCart
      .map((item: any) => `• ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toLocaleString("es-CO")})`)
      .join("\n");

    const totalText = cartItems.reduce((acc: number, curr: any) => acc + curr.price, 0).toLocaleString("es-CO");

    let paymentDetail = "";
    if (paymentMethod === "efectivo") {
      paymentDetail = `💵 Efectivo${cashChange.trim() ? ` (Lleva cambio de: $${cashChange.trim()})` : " (Paga con el valor exacto)"}`;
    } else if (paymentMethod === "nequi") {
      paymentDetail = "📱 Nequi";
    } else if (paymentMethod === "bancolombia") {
      paymentDetail = "🏦 Bancolombia";
    } else if (paymentMethod === "daviplata") {
      paymentDetail = "📱 Daviplata";
    } else if (paymentMethod === "otro") {
      paymentDetail = `💳 Otro: ${customPaymentMethod.trim()}`;
    }

    let locationText = "";
    if (customerAddress.trim() && gpsLocation) {
      locationText = `${customerAddress.trim()}\n📍 *Ubicación GPS:* ${gpsLocation}`;
    } else if (customerAddress.trim()) {
      locationText = customerAddress.trim();
    } else if (gpsLocation) {
      locationText = `📍 *Ubicación GPS (Ver Mapa):* ${gpsLocation}`;
    }

    const message = `🍔 ¡Nuevo pedido para *${businessName}*!

👤 *Cliente:* ${customerName.trim()}
📞 *Celular:* ${customerPhone.trim()}
📍 *Dirección de Entrega:* ${locationText}

🛒 *Detalle del Pedido:*
${itemsText}

📝 *Notas:* ${orderNotes.trim() ? orderNotes.trim() : "Ninguna"}
💳 *Método de Pago:* ${paymentDetail}

💰 *Total a Pagar:* $${totalText}

*¡Gracias por tu compra!*`;

    // Guardar el pedido en Supabase
    if (businessId) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const totalAmount = cartItems.reduce((acc: number, curr: any) => acc + curr.price, 0);
        const itemsPayload = groupedCart.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image_url: item.image_url ?? null,
        }));

        const { error: insertError } = await supabase.from("orders").insert({
          business_id: businessId,
          customer_id: user?.id ?? null,
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim(),
          delivery_address: customerAddress.trim() || null,
          notes: orderNotes.trim() || null,
          payment_method: paymentMethod || null,
          cash_change: cashChange.trim() || null,
          items: itemsPayload,
          total_amount: totalAmount,
          status: "pending",
        });

        if (insertError) {
          console.error("[FOWY] Error al guardar pedido en Supabase:", insertError.message, insertError.details, insertError.hint);
        } else {
          // Notificar a UserOrdersSheet para que recargue los pedidos del usuario
          window.dispatchEvent(new CustomEvent("fowy:order-created"));
        }
      } catch (err) {
        console.error("[FOWY] Error inesperado guardando el pedido:", err);
        // No bloqueamos el flujo: igual se envía por WhatsApp
      }
    }

    const rawPhone = businessPhone || "3000000000";
    let normalizedPhone = rawPhone.replace(/\D/g, "");
    if (normalizedPhone.length === 10) {
      normalizedPhone = "57" + normalizedPhone;
    } else if (!normalizedPhone.startsWith("57")) {
      normalizedPhone = "57" + normalizedPhone;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${normalizedPhone}&text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  // ── Reset al cerrar el sheet ─────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) {
      setCheckoutStep("cart");
      setValidationError("");
    }
  }, [isOpen]);

  return {
    // Carrito
    groupedCart,
    // Funciones
    handleShareLocation,
    handleSendWhatsApp,
    // Estados del formulario
    checkoutStep,
    setCheckoutStep,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    customerAddress,
    setCustomerAddress,
    gpsLocation,
    isLocating,
    orderNotes,
    setOrderNotes,
    paymentMethod,
    setPaymentMethod,
    cashChange,
    setCashChange,
    customPaymentMethod,
    setCustomPaymentMethod,
    validationError,
    setValidationError,
  };
}

