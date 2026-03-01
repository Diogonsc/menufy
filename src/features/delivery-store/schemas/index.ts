import { z } from "zod"

/** Schema para variação de produto (ex: tamanho, ponto da carne) */
export const productVariationOptionSchema = z.object({
  label: z.string(),
  price: z.number().min(0),
})

export const productVariationSchema = z.object({
  name: z.string(),
  required: z.boolean().default(false),
  options: z.array(productVariationOptionSchema),
})

/** Schema para adicional de produto */
export const productExtraSchema = z.object({
  label: z.string(),
  price: z.number().min(0),
})

/** Schema de produto do cardápio */
export const productSchema = z.object({
  id: z.number(),
  categoryId: z.number(),
  name: z.string().min(1),
  description: z.string(),
  price: z.number().min(0),
  image: z.string().url().optional().nullable(),
  available: z.boolean().default(true),
  badge: z.string().optional().nullable(),
  variations: z.array(productVariationSchema).optional(),
  extras: z.array(productExtraSchema).optional().default([]),
})

/** Schema para item do carrinho */
export const cartItemSchema = z.object({
  cartId: z.string(),
  id: z.number(),
  name: z.string(),
  price: z.number(),
  totalPrice: z.number(),
  qty: z.number().min(1),
  image: z.string().optional().nullable(),
  mods: z.string().optional(),
  obs: z.string().optional(),
})

/** Schema do formulário de checkout */
export const checkoutFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  phone: z.string().min(10, "Telefone inválido"),
  cep: z.string().optional(),
  address: z.string().min(5, "Endereço obrigatório"),
  number: z.string().min(1, "Número obrigatório"),
  complement: z.string().optional(),
  payment: z.enum(["pix", "card", "cash"]),
  change: z.string().optional(),
})

/** Schema para busca de pedido */
export const trackOrderSchema = z.object({
  orderId: z.string().min(3, "Digite o código do pedido"),
})

/** Schema de pedido */
export const orderSchema = z.object({
  id: z.string(),
  status: z.enum(["pending", "preparing", "delivery", "delivered"]),
  customer: z.string(),
  phone: z.string(),
  address: z.string(),
  payment: z.string(),
  change: z.string().optional(),
  items: z.array(cartItemSchema),
  subtotal: z.number(),
  deliveryFee: z.number(),
  total: z.number(),
  time: z.string(),
})

export type ProductVariation = z.infer<typeof productVariationSchema>
export type ProductVariationOption = z.infer<typeof productVariationOptionSchema>
export type ProductExtra = z.infer<typeof productExtraSchema>
export type Product = z.infer<typeof productSchema>
export type CartItem = z.infer<typeof cartItemSchema>
export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>
export type TrackOrderValues = z.infer<typeof trackOrderSchema>
export type Order = z.infer<typeof orderSchema>
