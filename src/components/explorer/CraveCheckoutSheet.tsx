"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Plus, 
  ArrowLeft, 
  User, 
  Phone, 
  Banknote, 
  Smartphone, 
  Landmark, 
  Wallet, 
  CreditCard, 
  Trash2, 
  Check 
} from "lucide-react";

export interface CraveCheckoutSheetProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: any[];
  onAddOne: (product: any) => void;
  onRemoveOne: (productId: string) => void;
  accentColor: string;
  businessName: string;
  businessPhone?: string;
  businessId?: string;
}

export function CraveCheckoutSheet({
  isOpen,
  onClose,
  cartItems,
  onAddOne,
  onRemoveOne,
  accentColor,
  businessName,
  businessPhone,
  businessId,
}: CraveCheckoutSheetProps) {
  const supabase = createClient();
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "checkout">("cart");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [gpsLocation, setGpsLocation] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"efectivo" | "nequi" | "bancolombia" | "daviplata" | "otro" | "">("");
  const [cashChange, setCashChange] = useState("");
  const [customPaymentMethod, setCustomPaymentMethod] = useState("");
  const [validationError, setValidationError] = useState("");

  // Reset step and error when sheet is closed
  useEffect(() => {
    if (!isOpen) {
      setCheckoutStep("cart");
      setValidationError("");
    }
  }, [isOpen]);

  // Group items by id to display quantity
  const groupedCart = cartItems.reduce((acc: any[], item: any) => {
    const existing = acc.find((x) => x.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      acc.push({ ...item, quantity: 1 });
    }
    return acc;
  }, []);

  const handleShareLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setValidationError("La geolocalización no está soportada por tu navegador o dispositivo.");
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
        console.error("Error getting location", error);
        setValidationError("No se pudo obtener tu ubicación. Por favor, escríbela manualmente.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

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
      .map((item) => `• ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toLocaleString("es-CO")})`)
      .join("\n");

    const totalText = cartItems.reduce((acc, curr) => acc + curr.price, 0).toLocaleString("es-CO");

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
        const totalAmount = cartItems.reduce((acc, curr) => acc + curr.price, 0);
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay con Blur y Oscurecimiento */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm z-[90]"
          />

          {/* Bottom Sheet con Efecto Vidrio Premium */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 z-[100] rounded-t-[40px] overflow-hidden flex flex-col max-h-[85%]"
            style={{
              // Glassmorphism ultra-premium super marcado, idéntico al del carrito (Magic Pill)
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.3) 100%)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.6)",
              borderTop: "2px solid rgba(255, 255, 255, 0.9)",
              borderBottom: "none",
              boxShadow: "0 -20px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)",
            }}
          >
            {/* Drag Handle & Header */}
            <div className="w-full pt-3 pb-5 px-6 shrink-0 flex flex-col items-center border-b border-white/20">
              <div className="w-12 h-1.5 bg-slate-400/30 rounded-full mb-4" />
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {checkoutStep === "checkout" && (
                    <button 
                      onClick={() => setCheckoutStep("cart")}
                      className="mr-1.5 p-1 rounded-full hover:bg-black/5 active:scale-90 transition-all flex items-center justify-center"
                    >
                      <ArrowLeft className="w-5 h-5 text-slate-700" />
                    </button>
                  )}
                  <h2 className="text-[20px] font-black text-slate-900 tracking-tight">
                    {checkoutStep === "cart" ? "Mi Pedido" : "Datos de Envío"}
                  </h2>
                  {checkoutStep === "cart" && (
                    <span 
                      className="text-[12px] font-bold px-2.5 py-0.5 rounded-full text-white shadow-sm"
                      style={{ 
                        background: `linear-gradient(135deg, ${accentColor}e6 0%, ${accentColor} 100%)`,
                        boxShadow: `0 2px 6px ${accentColor}40`
                      }}
                    >
                      {cartItems.length}
                    </span>
                  )}
                </div>
                <button 
                  onClick={onClose}
                  className="text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-slate-800 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>

            {/* Contenido Dinámico: Carrito o Formulario de Checkout */}
            <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide max-h-[48vh]">
              <AnimatePresence mode="wait">
                {checkoutStep === "cart" ? (
                  <motion.div
                    key="cart-view"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {groupedCart.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between bg-white/40 p-3 rounded-2xl border border-white/30 backdrop-blur-sm shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-white/50">
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 text-[14px] leading-tight line-clamp-2">{item.name}</span>
                            <span className="text-[13px] font-semibold text-slate-500 mt-0.5">${item.price.toLocaleString("es-CO")}</span>
                          </div>
                        </div>

                        {/* Controles de cantidad de alta fidelidad con efectos de profundidad */}
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => onRemoveOne(item.id)}
                            className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition-all duration-200 active:scale-90 border border-slate-100 shadow-md hover:shadow-lg overflow-hidden"
                            style={{
                              boxShadow: "0 4px 10px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
                            }}
                          >
                            <AnimatePresence mode="wait" initial={false}>
                              {item.quantity === 1 ? (
                                <motion.span
                                  key="trash"
                                  initial={{ opacity: 0, scale: 0.6 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.6 }}
                                  transition={{ duration: 0.15 }}
                                  className="flex items-center justify-center text-rose-500"
                                >
                                  <Trash2 className="w-3.5 h-3.5 stroke-[2.2]" />
                                </motion.span>
                              ) : (
                                <motion.span
                                  key="minus"
                                  initial={{ opacity: 0, scale: 0.6 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.6 }}
                                  transition={{ duration: 0.15 }}
                                  className="text-[18px] font-bold leading-none select-none flex items-center justify-center pb-0.5"
                                  style={{ color: accentColor }}
                                >
                                  -
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </button>
                          <span className="text-[14px] font-black text-slate-800 w-6 text-center select-none">{item.quantity}</span>
                          <button
                            onClick={() => onAddOne(item)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-200 active:scale-90 border border-white/10"
                            style={{
                              background: `linear-gradient(135deg, ${accentColor}e6 0%, ${accentColor} 100%)`,
                              boxShadow: `0 4px 10px ${accentColor}50, inset 0 -1px 2px rgba(0,0,0,0.1), inset 0 1px 2px rgba(255,255,255,0.3)`
                            }}
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="checkout-view"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    {/* 6.1 FORMULARIO VISUAL PREMIUM */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-1">Tu Nombre</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <User className="w-4 h-4 text-slate-400" />
                          </div>
                          <input
                            type="text"
                            placeholder="Escribe tu nombre completo"
                            value={customerName}
                            onChange={(e) => {
                              setCustomerName(e.target.value);
                              if (validationError) setValidationError("");
                            }}
                            className={`w-full bg-white/60 border ${validationError && !customerName.trim() ? 'border-red-400 focus:ring-red-300' : 'border-slate-200/80 focus:ring-slate-300'} text-slate-800 text-[14px] font-medium rounded-2xl py-3 pl-11 pr-4 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-1">Celular / WhatsApp</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Phone className="w-4 h-4 text-slate-400" />
                          </div>
                          <input
                            type="tel"
                            placeholder="Ej: 300 123 4567"
                            value={customerPhone}
                            onChange={(e) => {
                              setCustomerPhone(e.target.value);
                              if (validationError) setValidationError("");
                            }}
                            className={`w-full bg-white/60 border ${validationError && !customerPhone.trim() ? 'border-red-400 focus:ring-red-300' : 'border-slate-200/80 focus:ring-slate-300'} text-slate-800 text-[14px] font-medium rounded-2xl py-3 pl-11 pr-4 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-1">Notas del Pedido <span className="text-[10px] font-normal text-slate-400 lowercase">(opcional)</span></label>
                        <textarea
                          placeholder="Ej: Hamburguesa sin cebolla, salsas aparte..."
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                          rows={2}
                          className="w-full bg-white/60 border border-slate-200/80 text-slate-800 text-[14px] font-medium rounded-2xl py-3 px-4 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-1">Dirección de Entrega</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <MapPin className="w-4 h-4 text-slate-400" />
                          </div>
                          <input
                            type="text"
                            placeholder="Escribe tu dirección de entrega"
                            value={customerAddress}
                            onChange={(e) => {
                              setCustomerAddress(e.target.value);
                              if (validationError) setValidationError("");
                            }}
                            className={`w-full bg-white/60 border ${validationError && !customerAddress.trim() && !gpsLocation ? 'border-red-400 focus:ring-red-300' : 'border-slate-200/80 focus:ring-slate-300'} text-slate-800 text-[14px] font-medium rounded-2xl py-3 pl-11 pr-4 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all`}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleShareLocation}
                          disabled={isLocating}
                          className="mt-2.5 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-slate-700 bg-white/30 hover:bg-white/50 border border-white/40 shadow-sm text-xs font-bold transition-all active:scale-[0.98] backdrop-blur-sm cursor-pointer"
                          style={gpsLocation ? { borderColor: '#34C759', backgroundColor: 'rgba(52, 199, 89, 0.08)' } : {}}
                        >
                          {isLocating ? (
                            <>
                              <span className="w-3.5 h-3.5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                              <span>Obteniendo ubicación...</span>
                            </>
                          ) : gpsLocation ? (
                            <>
                              <Check className="w-4 h-4 text-[#34C759] stroke-[3]" />
                              <span className="text-[#2FAD51]">Ubicación GPS capturada</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="w-4 h-4 text-[#34C759] animate-pulse" />
                              <span>Compartir mi ubicación actual</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div>
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Método de Pago</label>
                        <div className="space-y-2.5">
                          {[
                            { id: "efectivo", name: "Efectivo", icon: Banknote },
                            { id: "nequi", name: "Nequi", icon: Smartphone },
                            { id: "bancolombia", name: "Bancolombia", icon: Landmark },
                            { id: "daviplata", name: "Daviplata", icon: Wallet },
                            { id: "otro", name: "Otro", icon: CreditCard }
                          ].map((method) => {
                            const isSelected = paymentMethod === method.id;
                            const IconComponent = method.icon;
                            return (
                              <div key={method.id} className="space-y-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPaymentMethod(method.id as any);
                                    if (validationError) setValidationError("");
                                  }}
                                  className={`w-full flex items-center justify-between backdrop-blur-sm rounded-2xl py-3.5 px-4 shadow-sm transition-all duration-300 text-left ${
                                    isSelected 
                                      ? 'bg-white/75 border-2 shadow-md' 
                                      : 'bg-white/40 border border-white/30 hover:bg-white/60'
                                  }`}
                                  style={{
                                    borderColor: isSelected ? accentColor : 'transparent',
                                  }}
                                >
                                  <div className="flex items-center gap-3">
                                    <IconComponent 
                                      className="w-5 h-5 transition-colors duration-300"
                                      style={{ color: isSelected ? accentColor : '#64748B' }}
                                    />
                                    <span className="text-[14px] font-bold text-slate-800">{method.name}</span>
                                  </div>
                                  <div 
                                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                                    style={{
                                      borderColor: isSelected ? accentColor : 'rgba(15, 23, 42, 0.15)',
                                      backgroundColor: isSelected ? `${accentColor}10` : 'transparent',
                                    }}
                                  >
                                    {isSelected && (
                                      <motion.div 
                                        layoutId="activePaymentCircle"
                                        className="w-2.5 h-2.5 rounded-full"
                                        style={{ backgroundColor: accentColor }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                      />
                                    )}
                                  </div>
                                </button>

                                <AnimatePresence>
                                  {method.id === "efectivo" && isSelected && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                      animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden px-1"
                                    >
                                      <div className="relative">
                                        <input
                                          type="text"
                                          placeholder="¿Con cuánto vas a pagar? (Ej: 50.000)"
                                          value={cashChange}
                                          onChange={(e) => setCashChange(e.target.value)}
                                          className="w-full bg-white/70 border border-slate-200/80 focus:ring-slate-300 text-slate-800 text-[13px] font-semibold rounded-2xl py-3 pl-4 pr-24 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-500 uppercase tracking-widest pointer-events-none">
                                          Devuelta de
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}

                                  {method.id === "otro" && isSelected && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                      animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden px-1"
                                    >
                                      <input
                                        type="text"
                                        placeholder="Escribe tu método de pago..."
                                        value={customPaymentMethod}
                                        onChange={(e) => {
                                          setCustomPaymentMethod(e.target.value);
                                          if (validationError) setValidationError("");
                                        }}
                                        className={`w-full bg-white/70 border ${validationError && !customPaymentMethod.trim() ? 'border-red-400 focus:ring-red-300' : 'border-slate-200/80 focus:ring-slate-300'} text-slate-800 text-[13px] font-semibold rounded-2xl py-3 px-4 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all`}
                                      />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* 6.2 RESUMEN DE ORDEN */}
                    <div className="bg-white/40 border border-white/40 rounded-2xl p-4 backdrop-blur-md shadow-sm space-y-3">
                      <div className="flex items-center justify-between border-b border-black/5 pb-2">
                        <span className="text-[12px] font-black text-slate-500 uppercase tracking-widest">Resumen de Orden</span>
                        <span className="text-[12px] font-bold text-slate-500">{cartItems.length} {cartItems.length === 1 ? "ítem" : "ítems"}</span>
                      </div>
                      <div className="max-h-[120px] overflow-y-auto space-y-2.5 scrollbar-hide">
                        {groupedCart.map((item: any) => (
                          <div key={item.id} className="flex justify-between items-start text-[14px]">
                            <div className="flex items-start gap-2 min-w-0">
                              <span className="font-bold text-slate-900 bg-slate-200/50 rounded px-1.5 py-0.5 text-[11px] leading-none mt-0.5">{item.quantity}x</span>
                              <span className="font-semibold text-slate-800 truncate leading-tight">{item.name}</span>
                            </div>
                            <span className="font-bold text-slate-950 shrink-0">${(item.price * item.quantity).toLocaleString("es-CO")}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center border-t border-black/5 pt-2 mt-1">
                        <span className="text-[13px] font-bold text-slate-800">Total:</span>
                        <span className="text-[18px] font-black text-slate-950">${cartItems.reduce((acc, curr) => acc + curr.price, 0).toLocaleString("es-CO")}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer with Total and Stepper Action Button */}
            <div className="p-6 bg-white/20 backdrop-blur-md border-t border-white/20 shrink-0 space-y-4 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
              {checkoutStep === "cart" ? (
                <>
                  <div className="flex items-center justify-between px-1">
                    <span className="text-slate-500 font-bold text-[14px] uppercase tracking-wider">Total del Pedido</span>
                    <span className="text-[24px] font-black text-slate-900 tracking-tight">
                      ${cartItems.reduce((acc, curr) => acc + curr.price, 0).toLocaleString("es-CO")}
                    </span>
                  </div>

                  {/* Botón Finalizar */}
                  <button
                    onClick={() => setCheckoutStep("checkout")}
                    className="w-full py-4 rounded-full text-white font-bold text-[16px] tracking-wide transition-all duration-300 active:scale-95 shadow-lg relative overflow-hidden group border border-white/10"
                    style={{
                      background: `linear-gradient(135deg, ${accentColor}e6 0%, ${accentColor} 100%)`,
                      boxShadow: `0 10px 25px ${accentColor}66, inset 0 -2px 4px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.4)`
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Finalizar Pedido
                    </span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </>
              ) : (
                <>
                  {validationError && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 text-red-500 text-xs font-bold px-4 py-2.5 rounded-xl border border-red-100 text-center"
                    >
                      {validationError}
                    </motion.div>
                  )}

                  {/* 6.3 CTA PRINCIPAL SEGURO (WhatsApp en Verde oficial con logotipo) */}
                  <button
                    onClick={handleSendWhatsApp}
                    className="w-full py-4 rounded-full text-white font-bold text-[16px] tracking-wide transition-all duration-300 active:scale-95 shadow-lg relative overflow-hidden group border border-white/10"
                    style={{
                      background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                      boxShadow: "0 10px 25px rgba(37, 211, 102, 0.4), inset 0 -2px 4px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.4)"
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.431 2.522 1.226 3.51l-.85 3.1 3.173-.833a5.71 5.71 0 0 0 2.219.49h.003c3.18 0 5.768-2.586 5.768-5.767 0-3.18-2.587-5.766-5.771-5.766zm3.385 8.192c-.146.411-.741.802-1.018.852-.271.05-.595.076-.983-.049-.241-.077-.541-.18-.916-.341-1.583-.681-2.593-2.291-2.671-2.399-.079-.107-.638-.846-.638-1.613 0-.766.402-1.144.545-1.292.144-.148.315-.185.421-.185h.295c.086 0 .201.003.29.213.098.232.336.818.365.877.029.058.048.127.01.205-.039.078-.059.127-.118.195-.059.068-.122.152-.176.205-.063.063-.129.131-.055.258.073.127.327.538.701.871.482.43 0.887.562 1.014.629.127.068.201.058.276-.029.074-.088.315-.366.399-.488.083-.122.167-.102.282-.059.115.044.733.346.858.409.127.064.21.093.24.147.03.054.03.312-.116.723zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                      </svg>
                      Enviar pedido por WhatsApp
                    </span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
