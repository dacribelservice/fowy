'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// Datos iniciales de prueba para el Dashboard
const INITIAL_PRODUCTS = [
  { id: 1, name: 'Pizza Solar Pepperoni', price: 28900, category: 'Pizzas', status: 'Activo', stock: 15, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=200&auto=format&fit=crop' },
  { id: 2, name: 'Bunker Burger Doble', price: 32500, category: 'Burgers', status: 'Activo', stock: 8, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop' },
  { id: 3, name: 'Malteada Amber', price: 14500, category: 'Bebidas', status: 'Agotado', stock: 0, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=200&auto=format&fit=crop' },
]

export default function InventoryPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Estados para el formulario
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'Pizzas',
    status: 'Activo',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop'
  })

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    const productToAdd = {
      ...newProduct,
      id: products.length + 1,
      price: Number(newProduct.price),
      stock: 10
    }
    setProducts([...products, productToAdd])
    setIsModalOpen(false)
    setNewProduct({ name: '', price: '', category: 'Pizzas', status: 'Activo', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop' })
  }

  const deleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-inter p-8 pb-32 selection:bg-red-500 selection:text-white">
      {/* Header del Dashboard */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 animate-fade-premium">
        <div>
          <Link href="/negocio" className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] mb-2 block hover:translate-x-1 transition-transform">← Volver al Panel</Link>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic text-slate-900">Gestión de <span className="text-red-600">Inventario</span></h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Menú Digital &bull; Business Control</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 hover:bg-red-600 text-white transition-all duration-500 px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-slate-200 active:scale-95"
        >
          + Nuevo Producto
        </button>
      </header>

      {/* Métricas Rápidas */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white border border-slate-100 p-8 rounded-[3rem] shadow-sm hover:shadow-xl transition-all duration-500 group">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 group-hover:text-red-600 transition-colors">Total Productos</p>
          <p className="text-5xl font-black tracking-tighter text-slate-900">{products.length}</p>
        </div>
        <div className="bg-white border border-slate-100 p-8 rounded-[3rem] shadow-sm hover:shadow-xl transition-all duration-500">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Categorías</p>
          <p className="text-5xl font-black tracking-tighter text-slate-900">4</p>
        </div>
        <div className="bg-red-50 border border-red-100 p-8 rounded-[3rem] shadow-sm hover:shadow-xl transition-all duration-500">
          <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-2">Pedidos Hoy</p>
          <p className="text-5xl font-black tracking-tighter text-red-600">24</p>
        </div>
      </section>

      {/* Tabla de Productos Style Pro */}
      <section className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Producto</th>
                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Categoría</th>
                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Precio</th>
                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Estado</th>
                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="relative w-16 h-16 rounded-[1.5rem] overflow-hidden bg-slate-100 border border-slate-100 shadow-sm transition-transform group-hover:scale-110 duration-500">
                        <Image src={p.image} alt={p.name} fill className="object-cover" />
                      </div>
                      <span className="font-black text-sm uppercase italic tracking-tighter text-slate-900 group-hover:text-red-600 transition-colors">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.category}</span>
                  </td>
                  <td className="px-10 py-8">
                    <span className="font-black text-xl tracking-tighter text-slate-900">${p.price.toLocaleString()}</span>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest leading-none shadow-sm
                      ${p.status === 'Activo' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                      <button className="h-12 w-12 bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:shadow-lg rounded-full flex items-center justify-center transition-all">✎</button>
                      <button onClick={() => deleteProduct(p.id)} className="h-12 w-12 bg-white border border-slate-100 text-red-400 hover:bg-red-600 hover:text-white hover:shadow-lg rounded-full flex items-center justify-center transition-all">×</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal Añadir Producto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setIsModalOpen(false)} />
          <form 
            onSubmit={handleAddProduct}
            className="relative w-full max-w-lg bg-white border border-slate-100 rounded-[4rem] p-12 shadow-2xl animate-in zoom-in-95 duration-500"
          >
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 mb-10 text-center">Nuevo <span className="text-red-600">Ítem</span></h2>
            
            <div className="space-y-8">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-6">Nombre del Producto</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Pizza Galáctica"
                  className="w-full bg-slate-50 border border-slate-100 h-16 rounded-full px-8 text-sm font-bold focus:outline-none focus:border-red-600 focus:bg-white transition-all shadow-inner"
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-6">Precio (COP)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="25000"
                    className="w-full bg-slate-50 border border-slate-100 h-16 rounded-full px-8 text-sm font-bold focus:outline-none focus:border-red-600 focus:bg-white transition-all shadow-inner"
                    value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-6">Categoría</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-100 h-16 rounded-full px-8 text-sm font-bold focus:outline-none focus:border-red-600 focus:bg-white transition-all shadow-inner appearance-none"
                    value={newProduct.category}
                    onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                  >
                    <option value="Pizzas">Pizzas</option>
                    <option value="Burgers">Burgers</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Combos">Combos</option>
                  </select>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  className="w-full h-20 bg-slate-900 hover:bg-red-600 text-white rounded-full font-black uppercase tracking-[0.2em] text-[11px] transition-all shadow-2xl shadow-slate-200 active:scale-95"
                >
                  Guardar en el Menú
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="mt-20 text-center">
         <div className="w-12 h-1 bg-slate-100 rounded-full mx-auto mb-6" />
         <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">FOWY Inventory Engine &copy; 2026</p>
      </footer>
    </div>
  )
}
