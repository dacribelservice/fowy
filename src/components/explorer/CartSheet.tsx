"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Send, MapPin, User, Phone, MessageSquare } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  businessName: string;
  businessPhone: string;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onCheckout?: (formData: any) => void;
  accentColor?: string;
}

export default function CartSheet({
  isOpen,
  onClose,
  items,
  total,
  businessName,
  businessPhone,
  onUpdateQuantity,
  onCheckout,
  accentColor = "#FF5A5F"
}: CartSheetProps) {
  const [step, setStep] = useState<"items" | "checkout">("items");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateWhatsAppLink = () => {
    const header = `*NUEVO PEDIDO - FOWY* \uD83D\uDE80\n\n`;
    const clientInfo = `*Cliente:* ${formData.name}\n*Tel:* ${formData.phone}\n*Entrega:* ${formData.address}\n${formData.notes ? `*Notas:* ${formData.notes}\n` : ""}\n`;
    const productsHeader = `*PRODUCTOS:*\n`;
    const productsList = items
      .map((item) => `- ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toLocaleString()})`)
      .join("\n");
    const footer = `\n\n*TOTAL: $${total.toLocaleString()}*`;

    const fullMessage = `${header}${clientInfo}${productsHeader}${productsList}${footer}`;
    const encodedMessage = encodeURIComponent(fullMessage);
    
    // Format phone: remove spaces, dashes, etc. and ensure it starts with country code if needed
    // For now, assume businessPhone is ready or clean it
    const cleanPhone = businessPhone.replace(/\D/g, "");
    
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  };

  const handleCheckout = () => {
    if (step === "items") {
      setStep("checkout");
    } else {
      // Validate form
      if (!formData.name || !formData.phone || !formData.address) {
        alert("Por favor completa los campos obligatorios");
        return;
      }
      
      // Call onCheckout for analytics/tracking
      if (onCheckout) {
        onCheckout(formData);
      }
      
      const link = generateWhatsAppLink();
      window.open(link, "_blank");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200]"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[45px] z-[201] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Handle */}
            <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto my-4 flex-shrink-0" />

            {/* Header */}
            <div className="px-8 pb-6 flex items-center justify-between">
              <div className="flex flex-col">
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">
                  {step === "items" ? "Mi Orden" : "Finalizar Pedido"}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {businessName}
                </p>
              </div>
              <button
                onClick={step === "checkout" ? () => setStep("items") : onClose}
                className="w-12 h-12 rounded-[20px] bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 pb-40">
              {step === "items" ? (
                <div className="space-y-6">
                  {items.length > 0 ? (
                    items.map((item) => (
                      <div key={item.id} className="flex items-center gap-5 group">
                        <div className="w-20 h-20 rounded-[25px] overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100 shadow-sm transition-transform group-hover:scale-105">
                          <img
                            src={item.image_url || "/placeholder-product.png"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-black text-slate-800 text-sm mb-1 leading-tight">{item.name}</h4>
                          <p className="text-xs font-bold text-slate-400 tracking-tight">
                            ${item.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-[20px] border border-slate-100 shadow-inner">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-9 h-9 rounded-[14px] bg-white flex items-center justify-center shadow-sm text-slate-400 hover:text-red-500 transition-colors active:scale-90"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-6 text-center font-black text-sm">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-9 h-9 rounded-[14px] bg-white flex items-center justify-center shadow-sm text-slate-400 hover:text-slate-900 transition-colors active:scale-90"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-[30px] flex items-center justify-center mx-auto mb-6 text-slate-200">
                        <ShoppingBag size={40} />
                      </div>
                      <h4 className="text-lg font-black text-slate-800 mb-2">Tu carrito está vacío</h4>
                      <p className="text-sm text-slate-500 max-w-[200px] mx-auto">
                        Agrega algunos productos para comenzar tu pedido.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Progress Indicator */}
                  <div className="flex gap-2 mb-8">
                    <div className="h-1.5 flex-1 bg-slate-900 rounded-full" />
                    <div className="h-1.5 flex-1 bg-slate-900 rounded-full" />
                  </div>

                  <div className="space-y-4">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Tu Nombre</label>
                      <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="¿A nombre de quién?"
                          className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[25px] outline-none focus:ring-4 focus:ring-slate-900/5 focus:bg-white transition-all font-bold text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">WhatsApp</label>
                      <div className="relative">
                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Tu número de contacto"
                          className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[25px] outline-none focus:ring-4 focus:ring-slate-900/5 focus:bg-white transition-all font-bold text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Address / Location */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Dirección / Mesa</label>
                      <div className="relative">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="¿Dónde entregamos?"
                          className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[25px] outline-none focus:ring-4 focus:ring-slate-900/5 focus:bg-white transition-all font-bold text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Notas Especiales</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-5 top-5 text-slate-300" size={18} />
                        <textarea
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder="Sin cebolla, extra salsa, etc..."
                          rows={3}
                          className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[25px] outline-none focus:ring-4 focus:ring-slate-900/5 focus:bg-white transition-all font-bold text-slate-800 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Button */}
            <div className="p-8 pt-0 absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-50">
              <div className="flex flex-col gap-4">
                {step === "items" && items.length > 0 && (
                   <div className="flex items-center justify-between px-2">
                      <span className="text-slate-400 font-bold text-sm">Resumen parcial</span>
                      <span className="text-slate-900 font-black text-lg">${total.toLocaleString()}</span>
                   </div>
                )}
                
                <button
                  disabled={items.length === 0}
                  onClick={handleCheckout}
                  style={{ background: step === "checkout" ? "#25D366" : `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)` }}
                  className={`w-full h-18 py-5 rounded-[30px] flex items-center justify-center gap-3 text-white shadow-2xl transition-all active:scale-95 disabled:opacity-50 disabled:grayscale`}
                >
                  {step === "items" ? (
                    <>
                      <span className="font-black uppercase text-xs tracking-widest">Ir a pagar</span>
                      <div className="w-1 h-1 bg-white/30 rounded-full" />
                      <span className="font-black text-sm">${total.toLocaleString()}</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span className="font-black uppercase text-xs tracking-widest">Enviar Pedido WhatsApp</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
