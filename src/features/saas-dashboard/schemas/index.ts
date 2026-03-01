import { z } from "zod"

/** Schema para tema da loja */
export const storeThemeSchema = z.object({
  primary: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida"),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida"),
})

/** Schema do formulário de nova loja */
export const newTenantFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  owner: z.string().min(2, "Responsável obrigatório"),
  email: z.string().email("E-mail inválido"),
  phone: z.string(),
  plan: z.enum(["starter", "pro", "agency"]),
  theme: storeThemeSchema,
  url: z.string().optional(),
  avatar: z.string().url().optional().nullable(),
  banner: z.string().url().optional().nullable(),
})

/** Schema para edição de loja (plano/status) */
export const editTenantFormSchema = z.object({
  plan: z.enum(["starter", "pro", "agency"]),
  status: z.enum(["active", "trial", "inactive"]),
})

/** Schema de loja/tenant */
export const tenantSchema = z.object({
  id: z.string(),
  name: z.string(),
  owner: z.string(),
  email: z.string(),
  phone: z.string(),
  plan: z.enum(["starter", "pro", "agency"]),
  status: z.enum(["active", "trial", "inactive"]),
  url: z.string(),
  since: z.string(),
  revenue: z.number(),
  orders: z.number(),
  mrr: z.number(),
  avatar: z.string().optional().nullable(),
  theme: storeThemeSchema.optional(),
})

export type StoreTheme = z.infer<typeof storeThemeSchema>
export type NewTenantFormValues = z.infer<typeof newTenantFormSchema>
export type EditTenantFormValues = z.infer<typeof editTenantFormSchema>
export type Tenant = z.infer<typeof tenantSchema>
