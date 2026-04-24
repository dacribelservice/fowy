'use client'

import { useState } from 'react'
import Image from 'next/image'

// Datos iniciales de prueba para el Dashboard
const INITIAL_PRODUCTS = [
  { id: 1, name: 'Pizza Solar Pepperoni', price: 28900, category: 'Pizzas', status: 'Activo', stock: 15, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=200&auto=format&fit=crop' },
  { id: 2, name: 'Bunker Burger Doble', price: 32500, category: 'Burgers', status: 'Activo', stock: 8, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop' },
  { id: 3, name: 'Malteada Amber', price: 14500, category: 'Bebidas', status: 'Agotado', stock: 0, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=200&auto=format&fit=crop' },
]

export default function InventoryPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)

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
    <div className="min-h-screen bg-[#0a0a0a] text-white font-inter p-8">
      {/* Header del Dashboard */}
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-red-600">Gestión de Inventario</h1>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mt-1">Panel de Control &bull; Business</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 hover:bg-white hover:text-black transition-all duration-300 px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs shadow-2xl shadow-red-500/20"
        >
          + Nuevo Producto
        </button>
      </header>

      {/* Métricas Rápidas */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-xl">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Total Productos</p>
          <p className="text-4xl font-black tracking-tighter">{products.length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-xl">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Categorías</p>
          <p className="text-4xl font-black tracking-tighter">4</p>
        </div>
        <div className="bg-red-600/10 border border-red-600/20 p-6 rounded-[2.5rem] backdrop-blur-xl">
          <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-2">Pedidos Hoy</p>
          <p className="text-4xl font-black tracking-tighter text-red-600">24</p>
        </div>
      </section>

      {/* Tabla de Productos Style Pro */}
      <section className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Producto</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoría</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Precio</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-slate-800 border border-white/10">
                      <Image src={p.image} alt={p.name} fill className="object-cover" />
                    </div>
                    <span className="font-bold text-sm uppercase tracking-tight">{p.name}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{p.category}</span>
                </td>
                <td className="px-8 py-6">
                  <span className="font-black text-lg tracking-tighter">${p.price.toLocaleString()}</span>
                </td>
                <td className="px-8 py-6">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest leading-none
                    ${p.status === 'Activo' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button className="h-10 w-10 bg-white/10 hover:bg-white hover:text-black rounded-full flex items-center justify-center transition-all">✎</button>
                    <button onClick={() => deleteProduct(p.id)} className="h-10 w-10 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white rounded-full flex items-center justify-center transition-all">×</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Modal Añadir Producto (CRUD Placeholder) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
          <form 
            onSubmit={handleAddProduct}
            className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300"
          >
            <h2 className="text-3xl font-black uppercase italic italic tracking-tighter text-red-600 mb-8 text-center underline decoration-red-600/30 underline-offset-8">Nuevo Ítem</h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block ml-4">Nombre del Producto</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Pizza Galáctica"
                  className="w-full bg-white/5 border border-white/10 h-16 rounded-full px-6 text-sm font-bold focus:outline-none focus:border-red-600 transition-all"
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block ml-4">Precio (COP)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="25000"
                    className="w-full bg-white/5 border border-white/10 h-16 rounded-full px-6 text-sm font-bold focus:outline-none focus:border-red-600 transition-all"
                    value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block ml-4">Categoría</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 h-16 rounded-full px-6 text-sm font-bold focus:outline-none focus:border-red-600 transition-all appearance-none"
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
                  className="w-full h-16 bg-red-600 hover:bg-white hover:text-black text-white rounded-full font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-red-500/20"
                >
                  Guardar en el Menú
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
