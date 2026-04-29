import React from 'react';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: any[];
  cart: any[];
  onAdd: (product: any) => void;
  onRemove: (productId: string) => void;
}

export default function ProductGrid({ products, cart, onAdd, onRemove }: ProductGridProps) {
  // Group products by category
  const groupedProducts = products.reduce((acc: any, product) => {
    const category = product.category_name || "General";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  const getQuantity = (productId: string) => {
    const item = cart.find(i => i.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="space-y-12">
      {Object.entries(groupedProducts).map(([category, items]: [string, any]) => (
        <div key={category} className="space-y-6">
          <div className="flex items-center gap-4 px-2">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">
              {category}
            </h3>
            <div className="h-[1px] w-full bg-slate-100" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {items.map((product: any) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAdd={onAdd} 
                onRemove={onRemove}
                quantity={getQuantity(product.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
