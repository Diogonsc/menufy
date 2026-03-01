import type { Category } from "../schemas"
import type { Product } from "@/features/delivery-store/schemas"

const STORAGE_KEYS = {
  categories: "menufy-store-categories",
  products: "menufy-store-products",
  config: "menufy-store-config",
} as const

export const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: "Hambúrgueres", icon: "hamburger" },
  { id: 2, name: "Acompanhamentos", icon: "fries" },
  { id: 3, name: "Bebidas", icon: "beverage" },
  { id: 4, name: "Combos", icon: "combo" },
]

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    categoryId: 1,
    name: "Boi Clássico",
    description: "Blend 180g, queijo cheddar, alface, tomate, cebola caramelizada",
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
    ],
    extras: [
      { label: "Bacon extra", price: 4 },
      { label: "Ovo frito", price: 3 },
    ],
  },
  {
    id: 2,
    categoryId: 1,
    name: "Boi Smash",
    description: "Dois smash burgers 80g cada, queijo americano duplo",
    price: 34.9,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop",
    available: true,
    badge: "⭐ Novo",
    variations: [],
    extras: [],
  },
  {
    id: 3,
    categoryId: 2,
    name: "Batata Frita",
    description: "Porção 300g de batatas fritas crocantes",
    price: 14.9,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop",
    available: true,
    variations: [],
    extras: [],
  },
  {
    id: 4,
    categoryId: 3,
    name: "Refrigerante Lata",
    description: "Coca-Cola, Guaraná, Sprite ou Fanta (350ml)",
    price: 6.9,
    image: "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400&h=300&fit=crop",
    available: true,
    variations: [],
    extras: [],
  },
]

const DEFAULT_DAY = { open: "11:00", close: "22:00" } as const

const DEFAULT_BANNER = "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=1200&h=400&fit=crop"
const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop"

export const INITIAL_CONFIG = {
  pixKey: "",
  pixKeyType: "email" as "cpf" | "cnpj" | "email" | "phone" | "random",
  operatingHours: {
    monday: DEFAULT_DAY,
    tuesday: DEFAULT_DAY,
    wednesday: DEFAULT_DAY,
    thursday: DEFAULT_DAY,
    friday: DEFAULT_DAY,
    saturday: DEFAULT_DAY,
    sunday: null as { open: string; close: string } | null,
  },
  orderCutoffTime: "21:00",
  banner: DEFAULT_BANNER,
  avatar: DEFAULT_AVATAR,
  deliveryFee: 5.9,
  minOrder: 25,
  deliveryTime: "30–45 min",
  acceptedPaymentMethods: { pix: true, card: true, cash: true },
}

export type StoreConfigData = typeof INITIAL_CONFIG

export function loadCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.categories)
    return raw ? JSON.parse(raw) : INITIAL_CATEGORIES
  } catch {
    return INITIAL_CATEGORIES
  }
}

export function saveCategories(data: Category[]) {
  localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(data))
}

export function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.products)
    return raw ? JSON.parse(raw) : INITIAL_PRODUCTS
  } catch {
    return INITIAL_PRODUCTS
  }
}

export function saveProducts(data: Product[]) {
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(data))
}

export function loadConfig(): StoreConfigData {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.config)
    const parsed = raw ? JSON.parse(raw) : null
    if (!parsed) return INITIAL_CONFIG
    return {
      pixKey: parsed.pixKey ?? INITIAL_CONFIG.pixKey,
      pixKeyType: parsed.pixKeyType ?? INITIAL_CONFIG.pixKeyType,
      operatingHours: parsed.operatingHours ?? INITIAL_CONFIG.operatingHours,
      orderCutoffTime: parsed.orderCutoffTime ?? INITIAL_CONFIG.orderCutoffTime,
      banner: parsed.banner ?? INITIAL_CONFIG.banner,
      avatar: parsed.avatar ?? INITIAL_CONFIG.avatar,
      deliveryFee: Number(parsed.deliveryFee) || INITIAL_CONFIG.deliveryFee,
      minOrder: Number(parsed.minOrder) || INITIAL_CONFIG.minOrder,
      deliveryTime: parsed.deliveryTime ?? INITIAL_CONFIG.deliveryTime,
      acceptedPaymentMethods: parsed.acceptedPaymentMethods ?? INITIAL_CONFIG.acceptedPaymentMethods,
    }
  } catch {
    return INITIAL_CONFIG
  }
}

export function saveConfig(data: Partial<StoreConfigData>) {
  const current = loadConfig()
  const merged = { ...current, ...data }
  localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(merged))
  return merged
}
