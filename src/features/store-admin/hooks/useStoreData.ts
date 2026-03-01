import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  loadCategories,
  loadProducts,
  loadConfig,
  saveCategories,
  saveProducts,
  saveConfig,
  type StoreConfigData,
} from "../data/storeData"
import type { Category } from "../schemas"
import type { Product } from "@/features/delivery-store/schemas"

const KEYS = {
  categories: ["store-admin", "categories"] as const,
  products: ["store-admin", "products"] as const,
  config: ["store-admin", "config"] as const,
}

export function useStoreCategories() {
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: KEYS.categories,
    queryFn: loadCategories,
    initialData: loadCategories(),
  })

  const create = useMutation({
    mutationFn: async (cat: Omit<Category, "id">) => {
      const list = loadCategories()
      const id = Math.max(0, ...list.map((c) => c.id)) + 1
      const newCat: Category = { ...cat, id }
      const next = [...list, newCat]
      saveCategories(next)
      return next
    },
    onSuccess: (data) => qc.setQueryData(KEYS.categories, data),
  })

  const update = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Category> & { id: number }) => {
      const list = loadCategories()
      const next = list.map((c) => (c.id === id ? { ...c, ...updates } : c))
      saveCategories(next)
      return next
    },
    onSuccess: (data) => qc.setQueryData(KEYS.categories, data),
  })

  const remove = useMutation({
    mutationFn: async (id: number) => {
      const list = loadCategories().filter((c) => c.id !== id)
      saveCategories(list)
      return list
    },
    onSuccess: (data) => qc.setQueryData(KEYS.categories, data),
  })

  return {
    categories: query.data ?? [],
    create: create.mutate,
    update: (id: number, updates: Partial<Category>) =>
      update.mutate({ id, ...updates }),
    remove: remove.mutate,
    isLoading: create.isPending || update.isPending || remove.isPending,
  }
}

export function useStoreProducts() {
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: KEYS.products,
    queryFn: loadProducts,
    initialData: loadProducts(),
  })

  const create = useMutation({
    mutationFn: async (prod: Omit<Product, "id">) => {
      const list = loadProducts()
      const id = Math.max(0, ...list.map((p) => p.id)) + 1
      const newProd: Product = { ...prod, id, variations: prod.variations ?? [], extras: prod.extras ?? [] }
      const next = [...list, newProd]
      saveProducts(next)
      return next
    },
    onSuccess: (data) => qc.setQueryData(KEYS.products, data),
  })

  const update = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Product> & { id: number }) => {
      const list = loadProducts()
      const next = list.map((p) => (p.id === id ? { ...p, ...updates } : p))
      saveProducts(next)
      return next
    },
    onSuccess: (data) => qc.setQueryData(KEYS.products, data),
  })

  const remove = useMutation({
    mutationFn: async (id: number) => {
      const list = loadProducts().filter((p) => p.id !== id)
      saveProducts(list)
      return list
    },
    onSuccess: (data) => qc.setQueryData(KEYS.products, data),
  })

  return {
    products: query.data ?? [],
    create: create.mutate,
    update: (id: number, updates: Partial<Product>) =>
      update.mutate({ id, ...updates }),
    remove: remove.mutate,
    isLoading: create.isPending || update.isPending || remove.isPending,
  }
}

export function useStoreConfig() {
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: KEYS.config,
    queryFn: loadConfig,
    initialData: loadConfig(),
  })

  const update = useMutation({
    mutationFn: async (data: Partial<StoreConfigData>) => {
      const next = saveConfig(data)
      return next
    },
    onSuccess: (data) => qc.setQueryData(KEYS.config, data),
  })

  return {
    config: query.data ?? loadConfig(),
    update: update.mutate,
  }
}
