import type { Product } from "../schemas"

/** Slug da loja na URL (ex: /boi-burguer, /boi-burguer/paineladmin) */
export const DEFAULT_STORE_SLUG = "boi-burguer"

export const STORE = {
  name: "Boi Burguer",
  tagline: "Hambúrgueres artesanais quentinhos na sua porta",
  address: "Rua das Flores, 123 - Centro, São Paulo - SP",
  banner: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=1200&h=400&fit=crop",
  avatar: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop",
  whatsapp: "(11) 99999-0000",
  deliveryTime: "30–45 min",
  deliveryFee: 5.9,
  minOrder: 25,
  rating: 4.8,
  reviews: 312,
  theme: { primary: "#1a1a2e", accent: "#e8a838" },
} as const

export const CATEGORIES = [
  { id: 1, name: "Hambúrgueres", icon: "hamburger" },
  { id: 2, name: "Acompanhamentos", icon: "fries" },
  { id: 3, name: "Bebidas", icon: "beverage" },
  { id: 4, name: "Combos", icon: "combo" },
] as const

export const PRODUCTS: Product[] = [
  {
    id: 1,
    categoryId: 1,
    name: "Boi Clássico",
    description: "Blend 180g, queijo cheddar, alface, tomate, cebola caramelizada e molho especial da casa",
    price: 29.9,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    available: true,
    badge: "🔥 Mais Pedido",
    variations: [
      {
        name: "Tamanho",
        required: true,
        options: [
          { label: "Individual (180g)", price: 0 },
          { label: "Grande (250g)", price: 8 },
        ],
      },
      {
        name: "Ponto da Carne",
        required: true,
        options: [
          { label: "Ao Ponto", price: 0 },
          { label: "Bem Passado", price: 0 },
          { label: "Mal Passado", price: 0 },
        ],
      },
    ],
    extras: [
      { label: "Bacon extra", price: 4 },
      { label: "Ovo frito", price: 3 },
      { label: "Queijo extra", price: 3 },
    ],
  },
  {
    id: 2,
    categoryId: 1,
    name: "Boi Smash",
    description: "Dois smash burgers 80g cada, queijo americano duplo, picles, mostarda e ketchup artesanal",
    price: 34.9,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop",
    available: true,
    badge: "⭐ Novo",
    variations: [
      {
        name: "Ponto da Carne",
        required: true,
        options: [
          { label: "Ao Ponto", price: 0 },
          { label: "Bem Passado", price: 0 },
        ],
      },
    ],
    extras: [
      { label: "Bacon extra", price: 4 },
      { label: "Picles extra", price: 2 },
    ],
  },
  {
    id: 3,
    categoryId: 1,
    name: "Boi Bacon Supreme",
    description: "Blend 200g, bacon crocante, queijo gouda, cebola crispy e molho BBQ defumado",
    price: 39.9,
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop",
    available: true,
    variations: [
      {
        name: "Tamanho",
        required: true,
        options: [
          { label: "Individual (200g)", price: 0 },
          { label: "Grande (280g)", price: 10 },
        ],
      },
    ],
    extras: [
      { label: "Bacon extra", price: 4 },
      { label: "Ovo frito", price: 3 },
    ],
  },
  {
    id: 4,
    categoryId: 2,
    name: "Batata Frita",
    description: "Porção 300g de batatas fritas crocantes com tempero especial da casa",
    price: 14.9,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop",
    available: true,
    variations: [
      {
        name: "Tamanho",
        required: true,
        options: [
          { label: "Média (300g)", price: 0 },
          { label: "Grande (500g)", price: 8 },
        ],
      },
    ],
    extras: [
      { label: "Cheddar", price: 4 },
      { label: "Bacon bits", price: 3 },
    ],
  },
  {
    id: 5,
    categoryId: 2,
    name: "Onion Rings",
    description: "Anéis de cebola empanados na cerveja, crocantes e dourados",
    price: 16.9,
    image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop",
    available: true,
    variations: [],
    extras: [],
  },
  {
    id: 6,
    categoryId: 3,
    name: "Refrigerante Lata",
    description: "Coca-Cola, Guaraná, Sprite ou Fanta (350ml)",
    price: 6.9,
    image: "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400&h=300&fit=crop",
    available: true,
    variations: [
      {
        name: "Sabor",
        required: true,
        options: [
          { label: "Coca-Cola", price: 0 },
          { label: "Guaraná", price: 0 },
          { label: "Sprite", price: 0 },
          { label: "Fanta Laranja", price: 0 },
        ],
      },
    ],
    extras: [],
  },
  {
    id: 7,
    categoryId: 3,
    name: "Milk Shake",
    description: "Shake cremoso 400ml feito na hora",
    price: 18.9,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop",
    available: true,
    badge: "❤️ Favorito",
    variations: [
      {
        name: "Sabor",
        required: true,
        options: [
          { label: "Chocolate", price: 0 },
          { label: "Morango", price: 0 },
          { label: "Baunilha", price: 0 },
          { label: "Doce de Leite", price: 0 },
          { label: "Ovomaltine", price: 3 },
        ],
      },
    ],
    extras: [],
  },
  {
    id: 8,
    categoryId: 4,
    name: "Combo Solo",
    description: "Boi Clássico + Batata Frita Média + Refrigerante Lata — economize R$ 7,80",
    price: 44.9,
    image: "https://images.unsplash.com/photo-1603064752734-4c48eff3f5e1?w=400&h=300&fit=crop",
    available: true,
    badge: "💰 Economia",
    variations: [],
    extras: [],
  },
  {
    id: 9,
    categoryId: 4,
    name: "Combo Duplo",
    description: "2 Boi Clássico + 2 Batatas Fritas + 2 Refrigerantes — economize R$ 15,60",
    price: 79.9,
    image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=300&fit=crop",
    available: true,
    badge: "💰 Melhor Valor",
    variations: [],
    extras: [],
  },
]

export const STATUS = {
  pending: {
    label: "Aguardando confirmação",
    short: "Aguardando",
    color: "#f59e0b",
    bg: "#fffbeb",
    icon: "clock",
    next: "preparing",
    nextLabel: "Confirmar",
  },
  preparing: {
    label: "Preparando seu pedido",
    short: "Preparando",
    color: "#3b82f6",
    bg: "#eff6ff",
    icon: "chef",
    next: "delivery",
    nextLabel: "Saiu p/ entrega",
  },
  delivery: {
    label: "Saiu para entrega! 🛵",
    short: "Na entrega",
    color: "#7c3aed",
    bg: "#f5f3ff",
    icon: "delivery",
    next: "delivered",
    nextLabel: "Entregue",
  },
  delivered: {
    label: "Pedido entregue! 🎉",
    short: "Entregue",
    color: "#059669",
    bg: "#ecfdf5",
    icon: "check",
    next: null,
    nextLabel: null,
  },
} as const

export const PAYMENT = [
  { id: "pix", label: "PIX", icon: "phone", desc: "Aprovação instantânea" },
  { id: "card", label: "Cartão na entrega", icon: "card", desc: "Débito ou crédito" },
  { id: "cash", label: "Dinheiro", icon: "cash", desc: "Troco se necessário" },
] as const

export const formatCurrency = (value: number) =>
  Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

export const generateOrderId = () =>
  "PED" + Math.random().toString(36).substring(2, 7).toUpperCase()
