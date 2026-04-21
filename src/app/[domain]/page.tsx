import { notFound } from 'next/navigation'
import Image from 'next/image'

interface BusinessPageProps {
  params: Promise<{ domain: string }>
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { domain } = await params

  // TODO: En el futuro, consultaríamos Supabase aquí para obtener los datos reales del negocio
  // const business = await getBusinessByDomain(domain)
  
  // Datos de prueba para simular el "Solar Flare" style
  const business = {
    name: domain.charAt(0).toUpperCase() + domain.slice(1),
    description: "La mejor experiencia gastronómica en tu barrio.",
    primaryColor: "#ff0000",
    coverImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop"
  }

  return (
    <main className="min-h-screen bg-white font-inter">
      {/* Hero Section */}
      <section className="relative h-[250px] w-full">
        <Image 
          src={business.coverImage}
          alt={business.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-4xl font-bold tracking-tight">{business.name}</h1>
          <p className="text-sm opacity-90">{business.description}</p>
        </div>
      </section>

      {/* Categories Horizontal Scroll */}
      <section className="py-6 px-4">
        <h2 className="text-xl font-bold mb-4 text-slate-900 px-2 uppercase tracking-widest text-[10px]">Categorías</h2>
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          {['🍕 Pizza', '🍔 Burger', '🥗 Saludable', '🍰 Postres', '🥤 Bebidas'].map((cat) => (
            <button 
              key={cat}
              className="flex-shrink-0 px-6 py-3 rounded-full bg-slate-50 border border-slate-100 text-slate-800 text-sm font-semibold hover:border-red-500 transition-colors duration-300"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4 pb-24">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">Lo más pedido</h2>
          <span className="text-red-600 text-sm font-bold cursor-pointer">Ver todo</span>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="group relative bg-white rounded-[2rem] p-4 shadow-sm border border-slate-50 hover:shadow-xl hover:border-orange-50 transition-all duration-500 overflow-hidden">
              <div className="flex gap-4">
                <div className="relative w-28 h-28 rounded-[1.5rem] overflow-hidden flex-shrink-0">
                  <Image 
                    src={`https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=500&auto=format&fit=crop`}
                    alt="Producto"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="flex flex-col justify-center flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-slate-900">Combo Especial {i}</h3>
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full">POPULAR</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">Delicioso producto premium preparado con ingredientes seleccionados de la mejor calidad.</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xl font-bold text-slate-900 font-inter">$24.900</span>
                    <button className="bg-red-600 hover:bg-red-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-lg shadow-red-200">
                      <span className="text-xl">+</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOWY Connect Floating Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] h-16 bg-black/90 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl flex items-center justify-around px-6 z-50">
        <button className="text-white opacity-100 scale-110 transition-all">🏠</button>
        <button className="text-white opacity-40 hover:opacity-100 transition-all">❤️</button>
        <button className="relative">
           <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full text-[8px] flex items-center justify-center font-bold text-white">2</div>
           <span className="text-white opacity-40 hover:opacity-100 transition-all">🛒</span>
        </button>
        <button className="text-white opacity-40 hover:opacity-100 transition-all">👤</button>
      </div>
    </main>
  )
}
