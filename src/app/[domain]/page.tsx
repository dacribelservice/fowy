'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import Link from 'next/link'

// --- ESTILOS EXTRA ---
const extraStyles = `
  @keyframes cart-expand {
    0% { width: 64px; opacity: 0; transform: translateY(20px); }
    30% { width: 64px; opacity: 1; transform: translateY(0); }
    100% { width: 280px; }
  }
  .animate-cart-expand {
    animation: cart-expand 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
  @keyframes modal-pop {
    0% { opacity: 0; transform: scale(0.9) translateY(20px); filter: blur(10px); }
    100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
  }
  .animate-modal-pop {
    animation: modal-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`

// --- DATOS DE PRUEBA ---
const MENU_DATA = {
  'Todo': [
    { id: 1, name: 'Hamburges Express', description: 'Si estás buscando una buena hamburguesa en Cali, la oferta es enorme y variada, desde las tradicionales', price: 39900, promoPrice: 39900, isPromo: true, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop' },
    { id: 2, name: 'Hamburges Express', description: 'Si estás buscando una buena hamburguesa en Cali, la oferta es enorme y variada, desde las tradicionales', price: 59900, promoPrice: null, isPromo: false, category: 'Burgers', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop' },
    { id: 3, name: 'Pizza Solar Pepperoni', description: 'Masa artesanal, peperoni premium y mucho queso seleccionado para ti.', price: 28900, promoPrice: 24900, isPromo: true, category: 'Pizzas', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=800&auto=format&fit=crop' },
    { id: 4, name: 'Tacos Al Pastor', description: '4 tacos con piña, cilantro y cebolla con el mejor sabor mexicano.', price: 21900, promoPrice: null, isPromo: false, category: 'Tacos', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=800&auto=format&fit=crop' },
  ],
  'Pizzas': [
    { id: 3, name: 'Pizza Solar Pepperoni', description: 'Masa artesanal, peperoni premium y mucho queso seleccionado para ti.', price: 28900, promoPrice: 24900, isPromo: true, category: 'Pizzas', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=800&auto=format&fit=crop' },
  ],
  'Burgers': [
    { id: 1, name: 'Hamburges Express', description: 'Si estás buscando una buena hamburguesa en Cali, la oferta es enorme y variada, desde las tradicionales', price: 39900, promoPrice: 39900, isPromo: true, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop' },
    { id: 2, name: 'Hamburges Express', description: 'Si estás buscando una buena hamburguesa en Cali, la oferta es enorme y variada, desde las tradicionales', price: 59900, promoPrice: null, isPromo: false, category: 'Burgers', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop' },
  ]
}

const BANNERS = [
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop'
]

const Icons = {
  Cart: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.56-7.43H5.05" /></svg>
  ),
  Trash: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
  ),
  ArrowLeft: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
  ),
  WhatsApp: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
  ),
  Heart: ({ filled }: { filled?: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "#ff0000" : "none"} stroke={filled ? "#ff0000" : "white"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
  ),
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
  )
}

export default function BusinessPage() {
  const params = useParams()
  const domain = params?.domain as string

  // --- ESTADOS ---
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<'MENU' | 'CHECKOUT'>('MENU')
  const [activeCategory, setActiveCategory] = useState('Todo')
  const [cart, setCart] = useState<any[]>([])
  const [showCartSheet, setShowCartSheet] = useState(false)
  const [currentBanner, setCurrentBanner] = useState(0)
  const [favorites, setFavorites] = useState<number[]>([1]) // El primer item como favorito por defecto
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    location: null as [number, number] | null,
    notes: ''
  })

  const businessName = domain ? domain.charAt(0).toUpperCase() + domain.slice(1) : 'Establecimiento'

  // --- EFECTOS ---
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setFormData(prev => ({ ...prev, location: [pos.coords.latitude, pos.coords.longitude] }))
      })
    }
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (currentView === 'MENU') {
      const interval = setInterval(() => {
        setCurrentBanner(prev => (prev + 1) % BANNERS.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [currentView])

  // --- LÓGICA ---
  const products = useMemo(() => MENU_DATA[activeCategory as keyof typeof MENU_DATA] || [], [activeCategory])

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id)
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      const finalPrice = product.isPromo ? product.promoPrice : product.price
      setCart([...cart, { ...product, finalPrice, quantity: 1 }])
    }
  }

  const toggleFavorite = (id: number) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id])
  }

  const updateQuantity = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQty }
      }
      return item
    }))
  }

  const removeItem = (id: number) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleSendOrder = () => {
    const messageHeader = `*🍱 NUEVO PEDIDO - ${businessName.toUpperCase()}*\n--------------------------\n`
    const clientInfo = `👤 *Cliente:* ${formData.name}\n📞 *Tel:* ${formData.phone}\n📍 *Dir:* ${formData.address}\n📝 *Notas:* ${formData.notes || 'Ninguna'}\n`
    const locationInfo = formData.location ? `🗺️ *Ubicación:* https://www.google.com/maps?q=${formData.location[0]},${formData.location[1]}\n` : ''
    const messageItems = cart.map(item => `• ${item.quantity}x ${item.name} ($${(item.finalPrice * item.quantity).toLocaleString()})`).join('\n')
    const messageFooter = `\n--------------------------\n*TOTAL: $${cartTotal.toLocaleString()}*\n\n_Powered by FOWY_`

    const fullMessage = encodeURIComponent(messageHeader + clientInfo + locationInfo + "\n*PEDIDO:*\n" + messageItems + messageFooter)
    window.open(`https://wa.me/573000000000?text=${fullMessage}`, '_blank')
  }

  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Cargando Menú...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center font-sans overflow-hidden">
      <style>{extraStyles}</style>

      {/* --- FRAME IPHONE VIRTUAL --- */}
      <div className="relative w-full h-screen lg:h-auto lg:w-[320px] lg:aspect-[9/19] lg:bg-black lg:rounded-[3rem] lg:border-[8px] lg:border-black lg:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-1000">

        <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-[100] flex items-end justify-center pb-1">
          <div className="w-8 h-1 bg-zinc-800 rounded-full" />
        </div>

        <main className="relative w-full h-full bg-[#fafafa] overflow-hidden flex flex-col min-h-0">

          {currentView === 'MENU' ? (
            <>
              {/* 1. BANNER SLIDER */}
              <div className="relative h-56 w-full flex-shrink-0 overflow-hidden">
                <div className="flex h-full transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentBanner * 100}%)` }}>
                  {BANNERS.map((src, i) => (
                    <div key={i} className="relative w-full h-full flex-shrink-0">
                      <Image src={src} alt="Banner" fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  ))}
                </div>

                {/* Botón de Volver Premium */}
                <Link 
                  href="/"
                  className="absolute top-6 left-6 z-50 h-10 w-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 shadow-lg active:scale-90 transition-all"
                >
                  <Icons.ArrowLeft />
                </Link>

                <div className="absolute bottom-6 left-0 w-full flex justify-center gap-2">
                  {BANNERS.map((_, i) => (
                    <div key={i} className={`h-2 w-2 rounded-full transition-all duration-500 ${currentBanner === i ? 'bg-white w-4 animate-water-drop' : 'bg-white/30'}`} />
                  ))}
                </div>
                <div className="absolute bottom-6 left-6">
                  <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">{businessName}</h1>
                </div>
              </div>

              {/* 2. CATEGORÍAS */}
              <div className="bg-white border-b border-slate-100 flex-shrink-0">
                <div className="flex gap-6 overflow-x-auto px-6 py-4 no-scrollbar">
                  {Object.keys(MENU_DATA).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all relative py-2 ${activeCategory === cat ? 'text-red-600' : 'text-slate-300'}`}
                    >
                      {cat}
                      {activeCategory === cat && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 rounded-full animate-in fade-in" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. GRILLA DE PRODUCTOS (2 Columnas - NUEVO DISEÑO) */}
              <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-6 pb-24">
                <div className="grid grid-cols-2 gap-x-3 gap-y-6">
                  {products.map((p, idx) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProduct(p)}
                      className="bg-white rounded-[1.5rem] shadow-[0_10px_20px_-10px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden h-[228px] animate-in fade-in slide-in-from-bottom duration-500 cursor-zoom-in active:scale-95 transition-all"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      {/* Image Section */}
                      <div className="relative h-[100px] w-full flex-shrink-0">
                        <Image src={p.image} alt={p.name} fill className="object-cover" />

                        {/* Heart Icon */}
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleFavorite(p.id); }}
                          className="absolute top-2 right-2 z-10 transition-transform active:scale-125"
                        >
                          <Icons.Heart filled={favorites.includes(p.id)} />
                        </button>

                        {/* Promo Badge */}
                        {p.isPromo && (
                          <div className="absolute top-2 left-2 bg-[#f4b62d] px-2 py-0.5 rounded-md shadow-sm">
                            <span className="text-[7px] font-black text-slate-900 uppercase">PROMO</span>
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="flex flex-col flex-1 p-3 bg-white relative">
                        <div className="border-b border-slate-100 pb-1">
                          <h3 className="text-[10px] font-black uppercase text-slate-900 leading-tight line-clamp-1">{p.name}</h3>
                        </div>

                        <div className="border-b border-slate-100 pb-1 mt-1">
                          <p className="text-[8px] text-slate-400 font-medium line-clamp-3 leading-tight h-[30px]">{p.description}</p>
                        </div>

                        <div className="flex flex-col pt-1.5">
                          {p.isPromo && <span className="text-[7px] text-slate-300 line-through font-bold leading-none mb-0.5">${p.price.toLocaleString()}</span>}
                          <span className={`font-black text-slate-900 tracking-tighter leading-none ${p.price > 99999 ? "text-xs" : "text-sm"}`}>
                            $ {(p.isPromo && p.promoPrice ? p.promoPrice : p.price).toLocaleString()}
                          </span>
                        </div>

                        {/* Notch & Button Container */}
                        <div className="absolute bottom-0 right-0 w-11 h-11 bg-[#fafafa] rounded-tl-[1.2rem] flex items-center justify-center">
                          <button
                            onClick={() => addToCart(p)}
                            className="h-8 w-8 bg-[#f4b62d] hover:bg-black hover:text-white text-slate-900 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-md"
                          >
                            <Icons.Plus />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. FLOATING CART BAR (ANIMATED EXPANSION & GLASSMORPHISM) */}
              {cartCount > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] flex justify-center w-full px-4">
                  <button 
                    onClick={() => setShowCartSheet(true)}
                    className="h-16 bg-white/30 backdrop-blur-xl rounded-full flex items-center px-2 gap-4 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] border border-white/40 active:scale-95 transition-all overflow-hidden animate-cart-expand"
                    style={{ width: 'auto', minWidth: '64px' }}
                  >
                    <div className="flex-1 pl-4 flex flex-col items-start animate-in fade-in slide-in-from-left duration-700 delay-300">
                      <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] leading-none mb-1">Total</p>
                      <p className="text-base font-black text-slate-900 tracking-tighter leading-none">$ {cartTotal.toLocaleString()}</p>
                    </div>

                    <div className="relative h-12 w-12 bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-100">
                      <Icons.Cart />
                      <div className="absolute -top-1 -left-1 bg-slate-900 text-white text-[9px] font-black h-5 w-5 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                        {cartCount}
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {/* --- MODAL DE IMAGEN AMPLIADA (PREMIUM) --- */}
              {selectedProduct && (
                <div 
                  className="absolute inset-0 z-[200] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 animate-in fade-in duration-500"
                  onClick={() => setSelectedProduct(null)}
                >
                  <button className="absolute top-10 right-10 text-white/40 hover:text-white transition-all scale-110 active:scale-90">✕</button>
                  
                  <div className="relative w-full aspect-square rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)] border border-white/10 animate-modal-pop">
                    <Image src={selectedProduct.image} alt={selectedProduct.name} fill className="object-cover" />
                  </div>

                  <div className="mt-10 text-center space-y-3 animate-in slide-in-from-bottom duration-700 delay-100">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase text-emerald-400 tracking-[0.4em]">Detalle del producto</p>
                      <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-tight">{selectedProduct.name}</h2>
                    </div>
                    <p className="text-slate-400 text-xs max-w-[260px] mx-auto leading-relaxed font-medium">{selectedProduct.description}</p>
                    <div className="pt-6">
                      <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-8 py-3 rounded-2xl shadow-xl">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Precio</span>
                        <span className="text-xl font-black text-white">
                          $ {selectedProduct.finalPrice?.toLocaleString() || selectedProduct.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="absolute bottom-12 text-white/20 text-[8px] font-black uppercase tracking-[0.4em] animate-pulse">Toca para regresar</p>
                </div>
              )}
            </>
          ) : (
            /* --- PANTALLA CHECKOUT --- */
            <div className="flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-right duration-500">
              <div className="p-6 bg-white border-b border-slate-100 flex items-center gap-4">
                <button onClick={() => setCurrentView('MENU')} className="text-slate-900"><Icons.ArrowLeft /></button>
                <h2 className="text-xl font-black uppercase italic tracking-tighter">Finalizar Pedido</h2>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8 min-h-0">
                <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Tu Resumen</p>
                  <div className="space-y-2">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between text-[11px] font-bold">
                        <span className="text-slate-500">{item.quantity}x {item.name}</span>
                        <span className="text-slate-900">${(item.finalPrice * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-slate-400">Total</span>
                    <span className="text-xl font-black text-red-600">${cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-2">Nombre Completo</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-14 bg-white border border-slate-100 rounded-2xl px-5 text-sm font-bold text-slate-900 focus:border-[#25D366] outline-none transition-all placeholder:text-slate-300"
                      placeholder="Ej. Juan Perez"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-2">Teléfono / WhatsApp</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full h-14 bg-white border border-slate-100 rounded-2xl px-5 text-sm font-bold text-slate-900 focus:border-[#25D366] outline-none transition-all placeholder:text-slate-300"
                      placeholder="300 000 0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-2">Dirección de Entrega</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full h-14 bg-white border border-slate-100 rounded-2xl px-5 text-sm font-bold text-slate-900 focus:border-[#25D366] outline-none transition-all placeholder:text-slate-300"
                      placeholder="Calle 00 # 00 - 00"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-2">Notas del Pedido</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full h-28 bg-white border border-slate-100 rounded-2xl p-5 text-sm font-bold text-slate-900 focus:border-[#25D366] outline-none transition-all resize-none placeholder:text-slate-300"
                      placeholder="Instrucciones especiales..."
                    />
                  </div>
                  {formData.location && (
                    <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-[10px] font-black flex items-center gap-3">
                      <span className="text-xl">📍</span>
                      UBICACIÓN REGISTRADA PARA EL DOMICILIARIO
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 bg-white border-t border-slate-100">
                <button
                  onClick={handleSendOrder}
                  disabled={!formData.name || !formData.phone || !formData.address}
                  className="w-full h-16 bg-[#25D366] text-white rounded-2xl font-black uppercase tracking-[0.1em] text-[11px] flex items-center justify-center gap-3 shadow-2xl shadow-emerald-100 active:scale-95 disabled:opacity-30 transition-all"
                >
                  <Icons.WhatsApp />
                  Hacer pedido por WhatsApp
                </button>
              </div>
            </div>
          )}

          {/* --- BOTTOM SHEET CARRITO (REDESIGN PREMIUM) --- */}
          {showCartSheet && (
            <div className="absolute inset-0 z-[150] flex items-end">
              <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" 
                onClick={() => setShowCartSheet(false)} 
              />
              <div className="relative w-full bg-white rounded-t-[2.5rem] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-500 max-h-[85%]">
                
                {/* Header Estilo Apple/Clean */}
                <div className="p-6 pb-2 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">Tu pedido</h3>
                  <button 
                    onClick={() => setShowCartSheet(false)}
                    className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar p-6 pt-2 space-y-2.5">
                  {cart.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-slate-400 font-medium">Tu bolsa está vacía</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="bg-white border border-slate-100 rounded-2xl p-2 flex items-center gap-3 animate-in fade-in duration-300">
                        {/* Image (Super Small) */}
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 shadow-sm opacity-80">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>

                        {/* Info & Quantity (Priority) */}
                        <div className="flex-1 flex flex-col gap-1.5">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-[10px] font-bold text-slate-900 leading-tight line-clamp-1">{item.name}</p>
                              <p className="text-[10px] font-black text-slate-900">$ {item.finalPrice.toLocaleString()}</p>
                            </div>
                            <button onClick={() => removeItem(item.id)} className="text-slate-200 hover:text-red-600 transition-colors p-1">
                               <Icons.Trash />
                            </button>
                          </div>

                          <div className="flex justify-between items-center">
                            {/* Quantity Pill (LARGER & PRIORITY) */}
                            <div className="flex items-center gap-4 bg-slate-100 rounded-full px-2 py-1 border border-slate-200">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)} 
                                className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md text-xs font-black hover:bg-slate-200 transition-all active:scale-90"
                              >
                                —
                              </button>
                              <span className="text-[12px] font-black w-3 text-center text-slate-900">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)} 
                                className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md text-xs font-black hover:bg-slate-200 transition-all active:scale-90"
                              >
                                +
                              </button>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">Subtotal</p>
                              <p className="text-[10px] font-black text-slate-400">$ {(item.finalPrice * item.quantity).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer Total & Action */}
                <div className="p-6 bg-white border-t border-slate-50 space-y-3 pb-8">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Total</span>
                    <span className="text-xl font-black text-slate-900 tracking-tighter">$ {cartTotal.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => { setShowCartSheet(false); setCurrentView('CHECKOUT'); }}
                    disabled={cart.length === 0}
                    className="w-full h-12 bg-[#25D366] text-white rounded-xl font-black uppercase tracking-tight text-[11px] shadow-xl shadow-emerald-100 active:scale-95 transition-all disabled:opacity-20"
                  >
                    Finalizar Pedido
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
