import { memo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { newTenantFormSchema, type NewTenantFormValues } from "../schemas"
import { PLANS } from "../data/constants"
import type { Tenant } from "../schemas"

interface NewTenantModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: Tenant) => void
}

const defaultValues: NewTenantFormValues = {
  name: "",
  owner: "",
  email: "",
  phone: "",
  plan: "starter",
  theme: { primary: "#1a1a2e", accent: "#e8a838" },
}

export const NewTenantModal = memo(function NewTenantModal({
  open,
  onClose,
  onSave,
}: NewTenantModalProps) {
  const form = useForm<NewTenantFormValues>({
    resolver: zodResolver(newTenantFormSchema),
    defaultValues,
  })

  const handleSubmit = (data: NewTenantFormValues) => {
    const slug = data.name
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "")
    const tenantData: Tenant = {
      ...data,
      url: `${slug}.deliveryhub.com.br`,
      status: "trial",
      since: "Agora",
      revenue: 0,
      orders: 0,
      mrr: 0,
      id: `tenant-${Date.now()}`,
    }
    onSave(tenantData)
    form.reset(defaultValues)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg font-bold">
            🏪 Nova Loja
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Loja *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Boi Burguer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp</FormLabel>
                    <FormControl>
                      <Input placeholder="(11) 99999-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@restaurante.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plano</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-3 gap-2">
                      {PLANS.map((p) => (
                        <Button
                          key={p.id}
                          type="button"
                          variant="outline"
                          onClick={() => field.onChange(p.id)}
                          className={`h-auto flex-col gap-1 rounded-xl p-3 ${
                            field.value === p.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <span className="font-semibold text-sm">{p.name}</span>
                          <span className="text-xs text-muted-foreground font-normal">
                            R$ {p.price}/mês
                          </span>
                        </Button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="theme.primary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cor Primária</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={field.value}
                          onChange={field.onChange}
                          className="h-9 w-10 shrink-0 cursor-pointer rounded-lg border border-border p-1"
                        />
                        <Input
                          value={field.value}
                          onChange={field.onChange}
                          className="font-mono text-sm"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="theme.accent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cor de Destaque</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={field.value}
                          onChange={field.onChange}
                          className="h-9 w-10 shrink-0 cursor-pointer rounded-lg border border-border p-1"
                        />
                        <Input
                          value={field.value}
                          onChange={field.onChange}
                          className="font-mono text-sm"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isValid}
              >
                Criar Loja →
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
})
