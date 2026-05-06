"use client";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { MOCK_BUSINESS } from "@/data/mock-crave";
import { MapPin, Star, Search, Plus, Heart, ShoppingCart, ArrowLeft, User, Phone, Banknote, Smartphone, Landmark, Wallet, CreditCard, Trash2 } from "lucide-react";

/**
 * CraveVisionSandbox: El "Lienzo en Blanco" para el Re-Diseño Premium.
 * Esta página vive dentro del MobileFrame del layout, por lo que hereda el marco del celular.
 */
export default function CraveVisionSandbox() {
  const { slug } = useParams();
  const router = useRouter();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "checkout">("cart");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"efectivo" | "nequi" | "bancolombia" | "daviplata" | "otro" | "">("");
  const [cashChange, setCashChange] = useState("");
  const [customPaymentMethod, setCustomPaymentMethod] = useState("");
  const [validationError, setValidationError] = useState("");
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<any | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleSendWhatsApp = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      setValidationError("Por favor, ingresa tu nombre y celular para enviar el pedido.");
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

    const message = `🍔 ¡Nuevo pedido para *${MOCK_BUSINESS.name}*!

👤 *Cliente:* ${customerName.trim()}
📞 *Celular:* ${customerPhone.trim()}

🛒 *Detalle del Pedido:*
${itemsText}

📝 *Notas:* ${orderNotes.trim() ? orderNotes.trim() : "Ninguna"}
💳 *Método de Pago:* ${paymentDetail}

💰 *Total a Pagar:* $${totalText}

*¡Gracias por tu compra!*`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=573000000000&text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleAddToCart = (product: any) => {
    setCartItems((prev) => [...prev, product]);
  };

  const handleRemoveOne = (productId: string) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((item) => item.id === productId);
      if (idx > -1) {
        const next = [...prev];
        next.splice(idx, 1);
        return next;
      }
      return prev;
    });
  };

  const handleAddOne = (product: any) => {
    setCartItems((prev) => [...prev, product]);
  };

  const groupedCart = cartItems.reduce((acc: any[], item: any) => {
    const existing = acc.find((x) => x.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      acc.push({ ...item, quantity: 1 });
    }
    return acc;
  }, []);

  // Auto-slide para el banner
  useEffect(() => {
    if (!MOCK_BUSINESS.banners || MOCK_BUSINESS.banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % MOCK_BUSINESS.banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Cerrar bottom sheet automáticamente si el carrito queda vacío
  useEffect(() => {
    if (cartItems.length === 0) {
      setIsCartOpen(false);
    }
  }, [cartItems]);

  useEffect(() => {
    if (!isCartOpen) {
      setCheckoutStep("cart");
      setValidationError("");
    }
  }, [isCartOpen]);

  return (
    <div 
      className="absolute inset-0 bg-white overflow-hidden flex flex-col"
      style={{
        "--accent-color": MOCK_BUSINESS.accent_color,
        "--accent-color-90": `${MOCK_BUSINESS.accent_color}e6`,
        "--accent-color-40": `${MOCK_BUSINESS.accent_color}66`,
        "--accent-color-10": `${MOCK_BUSINESS.accent_color}1a`,
      } as React.CSSProperties}
    >
      {/* Botón de Atrás (Efecto Vidrio Premium) - Fijo sobre el scroll */}
      <motion.button
        onClick={() => router.back()}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-6 left-6 z-40 w-11 h-11 bg-white/20 hover:bg-white/30 border border-white/35 rounded-full flex items-center justify-center backdrop-blur-md text-white shadow-lg shadow-black/10 transition-colors duration-200 cursor-pointer"
        title="Regresar al mapa"
      >
        <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
      </motion.button>

      {/* Header Compacto Colapsable (Efecto Vidrio Premium) - Se desliza tras el scroll */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute top-0 left-0 right-0 h-[72px] bg-white/80 backdrop-blur-md border-b border-slate-100/80 shadow-sm z-30 flex items-center justify-between px-6 pl-20"
          >
            {/* Logo y Nombre del Negocio */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200/50 shadow-inner bg-slate-100 flex-shrink-0">
                <img 
                  src={MOCK_BUSINESS.logo_url} 
                  alt={MOCK_BUSINESS.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800 leading-tight">
                  {MOCK_BUSINESS.name}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  {/* Abierto en Verde Premium (#34C759) */}
                  <span 
                    className="text-[10px] font-bold flex items-center gap-1.5"
                    style={{ color: MOCK_BUSINESS.is_open ? "#34C759" : "#EF4444" }}
                  >
                    <span 
                      className="w-1.5 h-1.5 rounded-full animate-pulse" 
                      style={{ backgroundColor: MOCK_BUSINESS.is_open ? "#34C759" : "#EF4444" }}
                    />
                    {MOCK_BUSINESS.is_open ? "Abierto" : "Cerrado"}
                  </span>
                  
                  <span className="text-[10px] text-slate-300">•</span>
                  
                  {/* Ranking en Amarillo Premium (#FFCC00) */}
                  <div className="flex items-center gap-1 font-bold text-[10px]">
                    <Star 
                      className="w-3 h-3" 
                      style={{ fill: "#FFCC00", stroke: "#FFCC00" }} 
                    />
                    <span className="text-slate-600">{MOCK_BUSINESS.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        onScroll={(e) => {
          const scrollTop = e.currentTarget.scrollTop;
          setIsScrolled(scrollTop > 120);
        }}
        className="flex-1 overflow-y-auto pb-20 relative"
      >
      {/* BLOQUE 2: HEADER Y BRANDING V3 */}
      
      {/* 2.3 SLIDER DE BANNERS */}
      <div className="relative w-full h-[280px] bg-slate-900 rounded-b-[40px] overflow-hidden shadow-sm">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentBannerIndex}
            src={MOCK_BUSINESS.banners[currentBannerIndex]?.image_url || MOCK_BUSINESS.banner_url}
            alt="Banner"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </AnimatePresence>

        {/* Gradiente sutil inferior para legibilidad de los puntos */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>


        {/* Indicadores (Dots) animados */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
          {MOCK_BUSINESS.banners.map((_, idx) => (
            <motion.div
              key={idx}
              className={`h-2.5 rounded-full bg-white transition-all duration-500 ease-in-out ${
                idx === currentBannerIndex ? "w-8 opacity-100" : "w-2.5 opacity-50"
              }`}
              layout
            />
          ))}
        </div>
      </div>

      {/* 2.1 & 2.2 IDENTITY BAR (Logo-Left / Text-Right) */}
      <div className="relative px-6 -mt-14 z-20 flex items-start gap-5">
        {/* Logo Circular */}
        <div className="w-28 h-28 rounded-full border-[5px] border-white overflow-hidden shadow-sm bg-white shrink-0">
          <img 
            src={MOCK_BUSINESS.logo_url} 
            alt={MOCK_BUSINESS.name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Detalles del Negocio */}
        <div className="pt-16 flex-1 min-w-0">
          <h1 className="text-[22px] font-semibold text-slate-900 tracking-tight leading-none truncate">
            {MOCK_BUSINESS.name}
          </h1>
          
          {/* 2.2 Meta-datos Premium */}
          <div className="mt-2 flex items-center gap-3">
            {/* Estado: Abierto / Cerrado */}
            <div className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-full ${MOCK_BUSINESS.is_open ? 'bg-[#34C759]' : 'bg-red-500'}`}></span>
              <span className={`text-[14px] font-bold tracking-wide ${MOCK_BUSINESS.is_open ? 'text-[#34C759]' : 'text-red-600'}`}>
                {MOCK_BUSINESS.is_open ? 'ABIERTO' : 'CERRADO'}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-[18px] h-[18px] fill-[#FFCC00] text-[#FFCC00]" />
              <span className="text-[14px] font-bold text-slate-900">{MOCK_BUSINESS.rating}</span>
            </div>
          </div>

          <div className="mt-1 flex items-center gap-1 text-slate-500">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              DISTANCIA {MOCK_BUSINESS.distance}
            </span>
          </div>
        </div>
      </div>

      {/* BLOQUE 3: BÚSQUEDA Y NAVEGACIÓN */}
      <div className="px-6 mt-8 space-y-6">
        
        {/* 3.1 Buscador Flotante Glassmorphism */}
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100/80 backdrop-blur-md border border-slate-200 text-slate-800 text-[15px] font-medium rounded-full py-3.5 pl-12 pr-4 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all"
          />
        </div>

        {/* 3.2 Carrusel de Categorías V3 */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-[10px] py-[5px] rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 active:scale-90 border ${
              selectedCategory === "all"
                ? "border-transparent text-white"
                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
            }`}
            style={
              selectedCategory === "all"
                ? {
                    background: `linear-gradient(135deg, ${MOCK_BUSINESS.accent_color}e6 0%, ${MOCK_BUSINESS.accent_color} 100%)`,
                    boxShadow: `0 4px 10px ${MOCK_BUSINESS.accent_color}66, inset 0 -2px 4px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.3)`,
                  }
                : {}
            }
          >
            Todos
          </button>
          
          {MOCK_BUSINESS.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-[10px] py-[5px] rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 active:scale-90 border flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? "border-transparent text-white"
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
              }`}
              style={
                selectedCategory === cat.id
                  ? {
                      background: `linear-gradient(135deg, ${MOCK_BUSINESS.accent_color}e6 0%, ${MOCK_BUSINESS.accent_color} 100%)`,
                      boxShadow: `0 4px 10px ${MOCK_BUSINESS.accent_color}66, inset 0 -2px 4px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.3)`,
                    }
                  : {}
              }
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* BLOQUE 4: LA JOYA DE LA CORONA - PRODUCT CARD V3 */}
      <div className="px-4 pb-24 mt-4">
        <div className="grid grid-cols-2 gap-4">
          {MOCK_BUSINESS.products
            .filter((product) => {
              const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesCategory = selectedCategory === "all" || product.category_id === selectedCategory;
              return matchesSearch && matchesCategory;
            })
            .map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col relative group"
              >
                {/* Product Image */}
                <div 
                  onClick={() => setSelectedDetailProduct(product)}
                  className="h-32 w-full relative overflow-hidden bg-slate-50 cursor-pointer"
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.is_promo && (
                    <div 
                      className="absolute top-2 left-2 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm z-10"
                      style={{
                        background: `linear-gradient(135deg, ${MOCK_BUSINESS.accent_color}e6 0%, ${MOCK_BUSINESS.accent_color} 100%)`,
                        boxShadow: `0 2px 6px ${MOCK_BUSINESS.accent_color}40`,
                      }}
                    >
                      Promo
                    </div>
                  )}
                  {/* Ícono de Favoritos (Corazón) - Premium Glassmorphism */}
                  <button className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-sm transition-all active:scale-90 hover:bg-white/30 z-10">
                    <Heart className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-3 flex-1 flex flex-col">
                  <div 
                    onClick={() => setSelectedDetailProduct(product)}
                    className="cursor-pointer flex-1 flex flex-col"
                  >
                    <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-slate-500 text-[11px] mt-1 line-clamp-2 flex-1 leading-snug">
                      {product.description}
                    </p>
                  </div>

                  {/* Price and Action Button */}
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-slate-900 text-[15px]">
                      ${product.price.toLocaleString("es-CO")}
                    </span>

                    {/* Floating Action Button Premium */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-200 active:scale-90 hover:brightness-110 border border-white/20"
                      style={{
                        background: `linear-gradient(135deg, ${MOCK_BUSINESS.accent_color}e6 0%, ${MOCK_BUSINESS.accent_color} 100%)`,
                        boxShadow: `0 4px 10px ${MOCK_BUSINESS.accent_color}66, inset 0 -2px 4px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.3)`
                      }}
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      </div>

      {/* BLOQUE 5: LA EXPERIENCIA DEL CARRITO (MAGIC PILL & BOTTOM SHEET) */}
      <AnimatePresence>
        {cartItems.length > 0 && !isCartOpen && (
          <motion.div
            onClick={() => setIsCartOpen(true)}
            initial={{ 
              width: "64px", 
              height: "64px", 
              borderRadius: "32px", 
              opacity: 0, 
              y: 60, 
              x: "-50%",
              scale: 0.5 
            }}
            animate={{ 
              width: "92%", 
              height: "72px", 
              borderRadius: "36px", 
              opacity: 1, 
              y: 0, 
              x: "-50%",
              scale: 1 
            }}
            exit={{ 
              opacity: 0, 
              y: 60, 
              scale: 0.8, 
              x: "-50%",
              width: "64px"
            }}
            transition={{ 
              type: "spring", 
              stiffness: 90, 
              damping: 14,
              mass: 1.1
            }}
            className="absolute bottom-10 left-1/2 z-50 overflow-hidden cursor-pointer flex items-center justify-between"
            style={{
              // Glassmorphism ultra-premium super marcado
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.3) 100%)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.6)",
              borderTop: "1px solid rgba(255, 255, 255, 0.9)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(255,255,255,0.1)",
            }}
          >
            <motion.div 
              className="flex items-center justify-between w-full h-full px-5"
              initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.35, duration: 0.45, ease: "easeOut" }}
            >
              <div className="flex flex-col whitespace-nowrap">
                <span className="text-[12px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">
                  Ver Pedido
                </span>
                <span className="text-[22px] font-black text-slate-900 leading-none tracking-tight">
                  ${cartItems.reduce((acc, curr) => acc + curr.price, 0).toLocaleString("es-CO")}
                </span>
              </div>
              
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0 relative"
                style={{
                   background: `linear-gradient(135deg, ${MOCK_BUSINESS.accent_color}e6 0%, ${MOCK_BUSINESS.accent_color} 100%)`,
                   boxShadow: `0 8px 20px ${MOCK_BUSINESS.accent_color}80, inset 0 -2px 4px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.4)`
                }}
              >
                <ShoppingCart className="w-[20px] h-[20px] stroke-[2.5]" />
                <AnimatePresence mode="popLayout">
                  <motion.div 
                    key={cartItems.length}
                    initial={{ scale: 0, y: 10, rotate: -45 }}
                    animate={{ scale: 1, y: 0, rotate: 0 }}
                    exit={{ scale: 0, y: -10, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[12px] w-[24px] h-[24px] flex items-center justify-center rounded-full font-bold border-[2.5px] border-white shadow-md"
                  >
                    {cartItems.length}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop Overlay con Blur y Oscurecimiento */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
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
                          background: `linear-gradient(135deg, ${MOCK_BUSINESS.accent_color}e6 0%, ${MOCK_BUSINESS.accent_color} 100%)`,
                          boxShadow: `0 2px 6px ${MOCK_BUSINESS.accent_color}40`
                        }}
                      >
                        {cartItems.length}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => setIsCartOpen(false)}
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
                              onClick={() => handleRemoveOne(item.id)}
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
                                    style={{ color: MOCK_BUSINESS.accent_color }}
                                  >
                                    -
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </button>
                            <span className="text-[14px] font-black text-slate-800 w-6 text-center select-none">{item.quantity}</span>
                            <button
                              onClick={() => handleAddOne(item)}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-200 active:scale-90 border border-white/10"
                              style={{
                                background: `linear-gradient(135deg, ${MOCK_BUSINESS.accent_color}e6 0%, ${MOCK_BUSINESS.accent_color} 100%)`,
                                boxShadow: `0 4px 10px ${MOCK_BUSINESS.accent_color}50, inset 0 -1px 2px rgba(0,0,0,0.1), inset 0 1px 2px rgba(255,255,255,0.3)`
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
                                      borderColor: isSelected ? MOCK_BUSINESS.accent_color : 'transparent',
                                    }}
                                  >
                                    <div className="flex items-center gap-3">
                                      <IconComponent 
                                        className="w-5 h-5 transition-colors duration-300"
                                        style={{ color: isSelected ? MOCK_BUSINESS.accent_color : '#64748B' }}
                                      />
                                      <span className="text-[14px] font-bold text-slate-800">{method.name}</span>
                                    </div>
                                    <div 
                                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                                      style={{
                                        borderColor: isSelected ? MOCK_BUSINESS.accent_color : 'rgba(15, 23, 42, 0.15)',
                                        backgroundColor: isSelected ? `${MOCK_BUSINESS.accent_color}10` : 'transparent',
                                      }}
                                    >
                                      {isSelected && (
                                        <motion.div 
                                          layoutId="activePaymentCircle"
                                          className="w-2.5 h-2.5 rounded-full"
                                          style={{ backgroundColor: MOCK_BUSINESS.accent_color }}
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
                        background: `linear-gradient(135deg, ${MOCK_BUSINESS.accent_color}e6 0%, ${MOCK_BUSINESS.accent_color} 100%)`,
                        boxShadow: `0 10px 25px ${MOCK_BUSINESS.accent_color}66, inset 0 -2px 4px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.4)`
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

      {/* DETALLES DE PRODUCTO - POPUP ULTRA PREMIUM */}
      <AnimatePresence>
        {selectedDetailProduct && (
          <>
            {/* Backdrop Blur Oscuro */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDetailProduct(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md z-[110]"
            />

            {/* Modal Container */}
            <div className="absolute inset-x-0 bottom-0 top-0 flex items-center justify-center p-6 z-[120] pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className="bg-white/90 backdrop-blur-xl rounded-[32px] overflow-hidden shadow-2xl border border-white/60 flex flex-col w-full max-w-[340px] pointer-events-auto relative"
                style={{
                  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.8)"
                }}
              >
                {/* Botón Cerrar Flotante */}
                <button
                  onClick={() => setSelectedDetailProduct(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/15 backdrop-blur-md flex items-center justify-center border border-white/20 text-white hover:bg-black/30 active:scale-90 transition-all z-20 shadow-md"
                >
                  <svg className="w-5 h-5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Imagen del Producto en Alta Resolución */}
                <div className="h-56 w-full relative overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={selectedDetailProduct.image_url}
                    alt={selectedDetailProduct.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedDetailProduct.is_promo && (
                    <div 
                      className="absolute top-4 left-4 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm z-10"
                      style={{
                        background: `linear-gradient(135deg, ${MOCK_BUSINESS.accent_color}e6 0%, ${MOCK_BUSINESS.accent_color} 100%)`,
                      }}
                    >
                      Promo
                    </div>
                  )}
                </div>

                {/* Información y Texto */}
                <div className="p-6 flex-1 overflow-y-auto">
                  <h2 className="text-xl font-black text-slate-900 leading-tight">
                    {selectedDetailProduct.name}
                  </h2>
                  <p className="text-slate-500 text-[13px] mt-2.5 leading-relaxed">
                    {selectedDetailProduct.description}
                  </p>
                </div>

                {/* Footer con Precio y Botón Agregar */}
                <div className="p-6 bg-white/40 border-t border-white/20 shrink-0 flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Precio</span>
                    <span className="text-[20px] font-black text-slate-900 leading-none">
                      ${selectedDetailProduct.price.toLocaleString("es-CO")}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      handleAddToCart(selectedDetailProduct);
                      setSelectedDetailProduct(null);
                    }}
                    className="flex-1 py-3.5 rounded-full text-white font-bold text-[14px] tracking-wide transition-all duration-300 active:scale-95 shadow-md flex items-center justify-center gap-2"
                    style={{
                      background: `linear-gradient(135deg, ${MOCK_BUSINESS.accent_color}e6 0%, ${MOCK_BUSINESS.accent_color} 100%)`,
                      boxShadow: `0 8px 20px ${MOCK_BUSINESS.accent_color}40, inset 0 -2px 4px rgba(0,0,0,0.1), inset 0 1px 2px rgba(255,255,255,0.3)`
                    }}
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    Agregar
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
