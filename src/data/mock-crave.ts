export const MOCK_BUSINESS = {
  name: "Neon Burger & Co",
  slug: "neon-burger",
  logo_url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=200&h=200",
  banner_url: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=1000",
  rating: 4.9,
  reviews_count: 124,
  distance: "1.2 km",
  delivery_time: "20-30 min",
  is_open: true,
  accent_color: "#FF4D4D",
  description: "Las mejores hamburguesas artesanales con un toque neón y sabor inigualable.",
  banners: [
    { id: 1, image_url: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=1000", title: "2x1 en Classic Burgers" },
    { id: 2, image_url: "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&q=80&w=1000", title: "Combo Familiar Fest" },
    { id: 3, image_url: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=1000", title: "Nuevas Papas Trufadas" }
  ],
  categories: [
    { id: "burgers", name: "Hamburguesas", icon: "🍔" },
    { id: "sides", name: "Acompañantes", icon: "🍟" },
    { id: "drinks", name: "Bebidas", icon: "🥤" },
    { id: "desserts", name: "Postres", icon: "🍦" }
  ],
  products: [
    {
      id: "p1",
      name: "Neon Supreme",
      description: "Doble carne premium, queso cheddar fundido, tocino crocante y salsa secreta Neon.",
      price: 32900,
      image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800",
      category_id: "burgers",
      is_promo: true,
      rating: 4.8
    },
    {
      id: "p2",
      name: "Smokey BBQ",
      description: "Carne angus, aros de cebolla, salsa BBQ ahumada y doble queso monterey jack.",
      price: 28500,
      image_url: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=800",
      category_id: "burgers",
      is_promo: false,
      rating: 4.7
    },
    {
      id: "p3",
      name: "Truffle Fries",
      description: "Papas corte fino con aceite de trufa blanca, parmesano y perejil fresco.",
      price: 15900,
      image_url: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=800",
      category_id: "sides",
      is_promo: false,
      rating: 4.9
    },
    {
      id: "p4",
      name: "Onion Rings",
      description: "Aros de cebolla tempurizados con panko y dip de miel mostaza.",
      price: 12500,
      image_url: "https://images.unsplash.com/photo-1639024471283-035188835118?auto=format&fit=crop&q=80&w=800",
      category_id: "sides",
      is_promo: false,
      rating: 4.5
    },
    {
      id: "p5",
      name: "Milkshake Oreo",
      description: "Helado de vainilla, trozos de galleta Oreo y crema batida.",
      price: 14900,
      image_url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800",
      category_id: "desserts",
      is_promo: true,
      rating: 4.9
    }
  ]
};
