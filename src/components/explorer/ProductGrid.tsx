import React from 'react';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: any[];
  categories: any[];
  cart: any[];
  onAdd: (product: any) => void;
  onRemove: (productId: string) => void;
}

export default function ProductGrid({ products, categories, cart, onAdd, onRemove }: ProductGridProps) {
  // Group products by category name
  const groupedProducts = products.reduce((acc: any, product) => {
    const category = product.category_name || "General";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  // Determine the display order based on local categories
  // If no local categories exist, we use the ones found in products
  const categoryOrder = categories.length > 0 
    ? categories.map(c => c.name)
    : Object.keys(groupedProducts).sort();

  // Add any categories that have products but are not in the explicit categories list
  Object.keys(groupedProducts).forEach(cat => {
    if (!categoryOrder.includes(cat)) {
      categoryOrder.push(cat);
    }
  });

  const getQuantity = (productId: string) => {
    const item = cart.find(i => i.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="space-y-16">
      {categoryOrder.map((category) => {
        const items = groupedProducts[category];
        if (!items || items.length === 0) return null;

        return (
          <div key={category} className="space-y-8">
            <div className="flex items-center gap-6 px-2">
              <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-900 whitespace-nowrap bg-white px-4 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                {category}
              </h3>
              <div className="h-[1px] w-full bg-gradient-to-r from-slate-100 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        );
      })}
    </div>
  );
}
