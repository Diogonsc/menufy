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
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { editTenantFormSchema, type EditTenantFormValues } from "../schemas"
import { PLANS, formatCurrency } from "../data/constants"
import type { Tenant } from "../schemas"

interface TenantDetailModalProps {
  open: boolean
  tenant: Tenant | null
  onClose: () => void
  onSave: (data: EditTenantFormValues) => void
}

export const TenantDetailModal = memo(function TenantDetailModal({
  open,
  tenant,
  onClose,
  onSave,
}: TenantDetailModalProps) {
  const form = useForm<EditTenantFormValues>({
    resolver: zodResolver(editTenantFormSchema),
    values: tenant
      ? { plan: tenant.plan, status: tenant.status }
      : undefined,
    defaultValues: { plan: "starter", status: "active" },
  })

  const handleSubmit = (data: EditTenantFormValues) => {
    onSave(data)
    onClose()
  }

  if (!tenant) return null

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[540px]">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            {tenant.avatar && (
              <img
                src={tenant.avatar}
                alt=""
                className="h-9 w-9 rounded-lg object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}
            <DialogTitle className="font-serif text-lg font-bold">
              {tenant.name}
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-muted/30 p-3.5">
              <div className="font-serif text-lg font-bold text-foreground">
                {formatCurrency(tenant.revenue)}
              </div>
              <div className="text-xs font-semibold text-muted-foreground">
                Faturamento total
              </div>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-3.5">
              <div className="font-serif text-lg font-bold text-foreground">
                {tenant.orders}
              </div>
              <div className="text-xs font-semibold text-muted-foreground">
                Pedidos
              </div>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-3.5">
              <div className="font-serif text-lg font-bold text-foreground">
                {formatCurrency(tenant.mrr)}
              </div>
              <div className="text-xs font-semibold text-muted-foreground">
                MRR
              </div>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-3.5">
              <div className="font-serif text-lg font-bold text-foreground">
                {tenant.since}
              </div>
              <div className="text-xs font-semibold text-muted-foreground">
                Cliente desde
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-3.5 text-sm">
            <div className="space-y-1.5">
              <div className="flex gap-2">
                <span className="w-20 shrink-0 text-muted-foreground">E-mail</span>
                <span className="font-semibold">{tenant.email}</span>
              </div>
              <div className="flex gap-2">
                <span className="w-20 shrink-0 text-muted-foreground">WhatsApp</span>
                <span className="font-semibold">{tenant.phone}</span>
              </div>
              <div className="flex gap-2">
                <span className="w-20 shrink-0 text-muted-foreground">URL</span>
                <span className="font-semibold text-primary">{tenant.url}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-20 shrink-0 text-muted-foreground">Cores</span>
                <div className="flex gap-2">
                  <div
                    className="h-9 w-9 rounded-lg border-2 border-border"
                    style={{ background: tenant.theme?.primary }}
                    title="Primária"
                  />
                  <div
                    className="h-9 w-9 rounded-lg border-2 border-border"
                    style={{ background: tenant.theme?.accent }}
                    title="Destaque"
                  />
                </div>
              </div>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="plan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plano</FormLabel>
                      <Select value={field.value} onValueChange={(v) => field.onChange(v as EditTenantFormValues["plan"])}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o plano" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PLANS.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name} — R$ {p.price}/mês
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select value={field.value} onValueChange={(v) => field.onChange(v as EditTenantFormValues["status"])}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Ativa</SelectItem>
                          <SelectItem value="trial">Trial</SelectItem>
                          <SelectItem value="inactive">Inativa</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Fechar
                </Button>
                <Button type="submit">Salvar alterações</Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
})
