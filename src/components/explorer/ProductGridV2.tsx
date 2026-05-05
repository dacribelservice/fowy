import React from 'react';
import { ProductCardV2 } from './ProductCardV2';

interface ProductGridV2Props {
  products: any[];
  categories: any[];
  cart: any[];
  onAdd: (product: any) => void;
  onRemove: (productId: string) => void;
  accentColor?: string;
}

export function ProductGridV2({ products, categories, cart, onAdd, onRemove, accentColor = "#FF5A5F" }: ProductGridV2Props) {
  // Agrupar productos por nombre de categoría
  const groupedProducts = products.reduce((acc: any, product) => {
    const category = product.category_name || "General";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  // Determinar orden de categorías a mostrar
  const categoryOrder = categories.length > 0 
    ? categories.map(c => c.name)
    : Object.keys(groupedProducts).sort();

  // Asegurar que si hay productos sin categoría local mapeada, también se muestren
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
    <div className="space-y-12">
      {categoryOrder.map((category) => {
        const items = groupedProducts[category];
        if (!items || items.length === 0) return null;

        return (
          <div key={category} className="space-y-6">
            {/* Título de la Categoría */}
            <div className="flex items-center gap-4">
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                {category}
              </h3>
              <div className="flex-1 h-[2px] bg-slate-100 rounded-full" />
            </div>

            {/* 4.1 Grid Dinámico grid-cols-2 */}
            <div className="grid grid-cols-2 gap-4">
              {items.map((product: any) => (
                <ProductCardV2 
                  key={product.id} 
                  product={product} 
                  onAdd={onAdd} 
                  onRemove={onRemove}
                  quantity={getQuantity(product.id)}
                  accentColor={accentColor}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
