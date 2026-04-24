'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import Link from 'next/link'

// --- DATOS DE PRUEBA ---
const MENU_DATA = {
  'Todo': [
    { id: 1, name: 'Pizza Solar Pepperoni', price: 28900, category: 'Pizzas', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=800&auto=format&fit=crop' },
    { id: 2, name: 'Bunker Burger Doble', price: 32500, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop' },
    { id: 3, name: 'Ensalada Teal Mix', price: 21900, category: 'Saludable', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop' },
    { id: 4, name: 'Malteada Amber', price: 14500, category: 'Bebidas', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800&auto=format&fit=crop' },
  ],
  'Pizzas': [
    { id: 1, name: 'Pizza Solar Pepperoni', price: 28900, category: 'Pizzas', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=800&auto=format&fit=crop' },
    { id: 5, name: 'Pizza Margarita Premium', price: 26500, category: 'Pizzas', image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?q=80&w=800&auto=format&fit=crop' },
  ],
  'Burgers': [
    { id: 2, name: 'Bunker Burger Doble', price: 32500, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop' },
    { id: 6, name: 'Burger Crispy Chicken', price: 29900, category: 'Burgers', image: 'https://images.unsplash.com/photo-1610440042657-6dd2c4b53e37?q=80&w=800&auto=format&fit=crop' },
  ]
}

export default function BusinessPage() {
  const params = useParams()
  const domain = params?.domain as string
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('Todo')
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [cart, setCart] = useState<any[]>([])
  const [showCart, setShowCart] = useState(false)

  const business = {
    name: domain ? domain.charAt(0).toUpperCase() + domain.slice(1) : 'Local Fowy',
    whatsapp: '573000000000',
    rating: 4.9,
    coverImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop"
  }

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const products = useMemo(() => MENU_DATA[activeCategory as keyof typeof MENU_DATA] || [], [activeCategory])

  const addToCart = () => {
    const existing = cart.find(item => item.id === selectedProduct.id)
    if (existing) {
      setCart(cart.map(item => item.id === selectedProduct.id ? { ...item, quantity: item.quantity + quantity } : item))
    } else {
      setCart([...cart, { ...selectedProduct, quantity }])
    }
    setSelectedProduct(null)
    setQuantity(1)
  }

  const updateCartQuantity = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQty }
      }
      return item
    }))
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const sendWhatsAppOrder = () => {
    const messageHeader = `*🍔 NUEVO PEDIDO - FOWY*\n--------------------------\nHola *${business.name}*! Quiero hacer un pedido:\n\n`
    const messageItems = cart.map(item => `• ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toLocaleString()})`).join('\n')
    const messageFooter = `\n\n--------------------------\n*TOTAL: $${cartTotal.toLocaleString()}*\n\n_Pedido enviado desde FOWY App_`
    const fullMessage = encodeURIComponent(messageHeader + messageItems + messageFooter)
    window.open(`https://wa.me/${business.whatsapp}?text=${fullMessage}`, '_blank')
  }

  if (loading) return <div className="min-h-screen bg-white" />

  return (
    <main className="min-h-screen bg-[#fafafa] font-inter pb-40">
      {/* Hero Header */}
      <section className="relative h-64 w-full overflow-hidden rounded-b-[4rem] shadow-2xl">
        <Image src={business.coverImage} alt="Cover" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute bottom-10 left-10 text-white">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic drop-shadow-lg">{business.name}</h1>
          <div className="flex items-center gap-3 mt-2">
             <span className="text-[10px] font-black bg-red-600 px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">Abierto</span>
             <p className="text-[10px] font-bold text-white/70 tracking-widest uppercase">Cali, Valle del Cauca</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 sticky top-0 bg-[#fafafa]/80 backdrop-blur-xl z-40">
        <div className="flex gap-4 overflow-x-auto px-8 no-scrollbar">
          {Object.keys(MENU_DATA).map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300
                ${activeCategory === cat ? 'bg-black text-white scale-105 shadow-xl shadow-black/10' : 'bg-white border border-slate-100 text-slate-400 hover:bg-slate-50'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-8 space-y-6">
        {products.map((p, index) => (
          <div 
            key={p.id} 
            onClick={() => { setSelectedProduct(p); setQuantity(1); }} 
            style={{ animationDelay: `${index * 0.1}s` }}
            className="animate-fowy-up bg-white rounded-[2.5rem] p-5 shadow-sm border border-slate-50 flex gap-6 cursor-pointer hover:shadow-xl transition-all duration-500 group relative active:scale-95"
          >
            <div className="relative w-28 h-28 rounded-[2rem] overflow-hidden flex-shrink-0 bg-slate-100 shadow-inner group-hover:scale-105 transition-transform duration-500">
              <Image src={p.image} alt={p.name} fill className="object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-between py-2">
              <div>
                <h3 className="font-black text-lg uppercase italic text-slate-900 leading-tight group-hover:text-red-600 transition-colors">{p.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{p.category}</p>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-black text-slate-900 tracking-tighter">${p.price.toLocaleString()}</span>
                <div className="h-10 w-10 bg-slate-100 text-slate-900 group-hover:bg-red-600 group-hover:text-white rounded-full flex items-center justify-center font-black transition-all duration-300 shadow-sm group-hover:scale-110">+</div>
              </div>
            </div>
            <div className="absolute top-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-[8px] font-black text-red-600 bg-red-50 px-2 py-1 rounded-full uppercase animate-pulse">Destacado</span>
            </div>
          </div>
        ))}
      </section>

      {/* MODAL DETALLE */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setSelectedProduct(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-t-[4rem] p-10 shadow-2xl animate-in slide-in-from-bottom duration-500">
            <div className="relative w-full aspect-square rounded-[3rem] overflow-hidden mb-8 shadow-2xl border-8 border-white">
              <Image src={selectedProduct.image} alt={selectedProduct.name} fill className="object-cover" />
            </div>
            <div className="mb-8">
               <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2">{selectedProduct.name}</h3>
               <span className="text-[10px] font-black text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full inline-block">{selectedProduct.category}</span>
            </div>
            <p className="text-sm text-slate-500 font-medium mb-10 leading-relaxed">Experimenta el sabor galáctico de FOWY. Ingredientes frescos, locales y seleccionados a mano para garantizar una explosión de sabor en cada mordisco.</p>
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center bg-slate-50 rounded-full p-1.5 h-16 w-44 border border-slate-100">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 rounded-full bg-white font-black text-slate-900 shadow-lg hover:bg-slate-50 transition-all">-</button>
                <span className="flex-1 text-center font-black text-xl">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 rounded-full bg-red-600 text-white font-black shadow-lg hover:bg-red-700 transition-all">+</button>
              </div>
              <span className="text-3xl font-black text-black tracking-tighter">${(selectedProduct.price * quantity).toLocaleString()}</span>
            </div>
            <button onClick={addToCart} className="w-full h-20 bg-black text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-black/20 hover:bg-red-600 transition-all transform active:scale-95">
              Confirmar & Añadir
            </button>
          </div>
        </div>
      )}

      {/* MODAL CARRITO */}
      {showCart && (
        <div className="fixed inset-0 z-[210] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-2xl" onClick={() => setShowCart(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-t-[4.5rem] p-12 h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-500">
            <div className="w-16 h-1.5 bg-slate-100 rounded-full mx-auto mb-10 flex-shrink-0" />
            
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-4xl font-black uppercase italic tracking-tighter">Mi Bolsa</h3>
              <button onClick={() => setShowCart(false)} className="h-12 w-12 flex items-center justify-center bg-slate-50 text-slate-400 rounded-full font-bold hover:bg-red-50 hover:text-red-600 transition-all">✕</button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-8 no-scrollbar pb-10 px-2">
              {cart.length === 0 ? (
                <div className="py-24 text-center space-y-6">
                  <span className="text-8xl block animate-bounce">🧧</span>
                  <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Aún no has elegido nada</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-6 items-center">
                    <div className="relative w-24 h-24 rounded-[2rem] overflow-hidden flex-shrink-0 shadow-xl border-4 border-slate-50">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-black uppercase italic leading-tight text-slate-900">{item.name}</p>
                      <p className="text-sm font-black text-red-600 mt-1">${item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 rounded-full p-1 h-12 border border-slate-100">
                       <button onClick={() => updateCartQuantity(item.id, -1)} className="w-9 h-9 rounded-full bg-white font-black text-xs shadow-md">-</button>
                       <span className="text-sm font-black w-5 text-center">{item.quantity}</span>
                       <button onClick={() => updateCartQuantity(item.id, 1)} className="w-9 h-9 rounded-full bg-red-600 text-white font-black text-xs shadow-md">+</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-10 border-t border-slate-100 space-y-10 bg-white">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                   <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1">Total a Pagar</span>
                   <span className="text-5xl font-black text-slate-900 tracking-tighter leading-none">${cartTotal.toLocaleString()}</span>
                </div>
              </div>
              
              <button 
                onClick={sendWhatsAppOrder}
                disabled={cart.length === 0} 
                className="w-full h-24 bg-green-500 hover:bg-green-600 text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-green-100 flex items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-30"
              >
                <span className="text-xl">🚀</span>
                <span>Enviar Pedido a WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- FOWY CONNECT BAR (FASE 5.1 - INTEGRACIÓN GLOBAL) --- */}
      <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-[440px] h-24 bg-white/80 backdrop-blur-2xl shadow-2xl shadow-black/10 rounded-full border border-white/50 flex items-center justify-around px-6 z-[150] transition-all hover:scale-105 duration-500">
        <Link href="/" className="h-16 w-16 rounded-full flex flex-col items-center justify-center text-slate-400 hover:text-red-600 transition-colors group">
           <span className="text-2xl group-hover:scale-125 transition-transform">🏘️</span>
           <span className="text-[7px] font-black uppercase tracking-tighter mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Explorer</span>
        </Link>
        <button 
          onClick={() => setShowCart(true)}
          className={`h-18 w-18 rounded-full flex flex-col items-center justify-center relative transition-all duration-700
            ${cartCount > 0 ? 'bg-red-600 text-white shadow-2xl shadow-red-200 -translate-y-4 scale-110' : 'bg-slate-50 text-slate-400'}`}
        >
          {cartCount > 0 && (
            <div className="absolute -top-1 -right-1 w-7 h-7 bg-black rounded-full text-[10px] flex items-center justify-center font-black text-white border-4 border-white animate-bounce">
              {cartCount}
            </div>
          )}
          <span className="text-2xl">🛍️</span>
          {cartCount === 0 && <span className="text-[7px] font-black uppercase tracking-tighter mt-1">Bolsa</span>}
        </button>
        <Link href="/negocio" className="h-16 w-16 rounded-full flex flex-col items-center justify-center text-slate-400 hover:text-red-600 transition-colors group">
           <span className="text-2xl group-hover:scale-125 transition-transform">⚙️</span>
           <span className="text-[7px] font-black uppercase tracking-tighter mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Admin</span>
        </Link>
      </nav>
    </main>
  )
}
