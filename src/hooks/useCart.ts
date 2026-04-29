import { useState, useEffect, useCallback, useMemo } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  business_id: string;
  business_name?: string;
}

export function useCart(businessId?: string) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('fowy_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('fowy_cart', JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.id !== id);
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems(prev => {
      if (quantity <= 0) {
        return prev.filter(i => i.id !== id);
      }
      return prev.map(i => i.id === id ? { ...i, quantity } : i);
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const clearBusinessCart = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.business_id !== id));
  }, []);

  const cartTotal = useMemo(() => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [items]);

  const cartCount = useMemo(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  // If businessId is provided, filter items for that business
  const businessItems = useMemo(() => {
    if (!businessId) return items;
    return items.filter(i => i.business_id === businessId);
  }, [items, businessId]);

  const businessTotal = useMemo(() => {
    return businessItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [businessItems]);

  const businessCount = useMemo(() => {
    return businessItems.reduce((count, item) => count + item.quantity, 0);
  }, [businessItems]);

  return {
    items,
    businessItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    clearBusinessCart,
    cartTotal,
    cartCount,
    businessTotal,
    businessCount
  };
}
