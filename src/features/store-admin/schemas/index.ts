import { z } from "zod"

/** Schema para categoria */
export const categorySchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Nome obrigatório"),
  icon: z.string().default("hamburger"),
})

/** Schema para variação de produto */
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

/** Schema de produto */
export const productSchema = z.object({
  id: z.number(),
  categoryId: z.number(),
  name: z.string().min(1, "Nome obrigatório"),
  description: z.string(),
  price: z.number().min(0, "Preço inválido"),
  image: z.string().url().optional().nullable(),
  available: z.boolean().default(true),
  badge: z.string().optional().nullable(),
  variations: z.array(productVariationSchema).optional().default([]),
  extras: z.array(productExtraSchema).optional().default([]),
})

/** Schema do formulário de nova categoria */
export const newCategorySchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  icon: z.string().default("hamburger"),
})

/** Schema do formulário de novo produto */
export const newProductSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  description: z.string().min(5, "Descrição obrigatória"),
  price: z.number().min(0, "Preço inválido"),
  categoryId: z.number(),
  image: z
    .union([
      z.literal(""),
      z.string().url(),
      z.string().refine((s) => s.startsWith("data:image/"), "Imagem inválida"),
    ])
    .optional()
    .transform((v) => (v === "" || v == null ? undefined : v)),
  available: z.boolean().default(true),
  badge: z.string().optional(),
  variations: z.array(productVariationSchema).optional().default([]),
  extras: z.array(productExtraSchema).optional().default([]),
})

/** Horário de um dia */
const dayScheduleSchema = z
  .object({ open: z.string(), close: z.string() })
  .nullable()

/** Schema das configurações da loja (PIX, horários, identidade, etc.) */
export const storeConfigSchema = z.object({
  pixKey: z.string().optional(),
  pixKeyType: z.enum(["cpf", "cnpj", "email", "phone", "random"]).optional(),
  operatingHours: z
    .record(z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]), dayScheduleSchema)
    .optional(),
  orderCutoffTime: z.string().optional(),
  banner: z.string().optional(),
  avatar: z.string().optional(),
  deliveryFee: z.number().min(0).optional(),
  minOrder: z.number().min(0).optional(),
  deliveryTime: z.string().optional(),
  acceptedPaymentMethods: z
    .object({
      pix: z.boolean().optional(),
      card: z.boolean().optional(),
      cash: z.boolean().optional(),
    })
    .optional(),
  storeName: z.string().optional(),
  storeDescription: z.string().optional(),
  storeAddress: z.string().optional(),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
})

export type DayKey = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"
export type DaySchedule = { open: string; close: string } | null

export type Category = z.infer<typeof categorySchema>
export type Product = z.infer<typeof productSchema>
export type NewCategoryValues = z.infer<typeof newCategorySchema>
export type NewProductValues = z.infer<typeof newProductSchema>
export type StoreConfig = z.infer<typeof storeConfigSchema>
