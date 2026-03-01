import { memo, useCallback, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FiCreditCard, FiDollarSign, FiLoader, FiSmartphone } from "react-icons/fi"
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
import { checkoutFormSchema, type CheckoutFormValues } from "../schemas"
import { PAYMENT, formatCurrency } from "../data/constants"
import { useStoreConfig } from "@/features/store-admin/hooks/useStoreData"
import { useViaCep } from "../hooks/useViaCep"
import { sanitizeCep } from "../services/viaCep"
import type { CartItem } from "../schemas"

/** Formata CEP para exibição: 00000-000 */
function formatCepDisplay(cep: string): string {
  const digits = sanitizeCep(cep)
  if (digits.length <= 5) return digits
  return digits.replace(/(\d{5})(\d{0,3})/, "$1-$2")
}

const ICON_MAP = {
  pix: FiSmartphone,
  card: FiCreditCard,
  cash: FiDollarSign,
} as const

interface CheckoutFormProps {
  cartItems: CartItem[]
  cartTotal: number
  deliveryFee: number
  onSubmit: (data: CheckoutFormValues) => void
}

const defaultValues: Partial<CheckoutFormValues> = {
  name: "",
  phone: "",
  cep: "",
  address: "",
  number: "",
  complement: "",
  payment: "pix",
  change: "",
}

export const CheckoutForm = memo(function CheckoutForm({
  cartItems,
  cartTotal,
  deliveryFee,
  onSubmit,
}: CheckoutFormProps) {
  const { config } = useStoreConfig()
  const accepted = config?.acceptedPaymentMethods ?? { pix: true, card: true, cash: true }
  const paymentOptions = useMemo(
    () => PAYMENT.filter((p) => accepted[p.id as keyof typeof accepted]),
    [accepted]
  )
  const defaultPayment = paymentOptions[0]?.id ?? "pix"

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: { ...defaultValues, payment: defaultPayment as "pix" | "card" | "cash" },
  })

  const { fetchByCep, isLoading: cepLoading, error: cepError, clearError } = useViaCep()

  const handleCepBlur = useCallback(() => {
    const cep = form.getValues("cep") ?? ""
    if (sanitizeCep(cep).length !== 8) return
    clearError()
    fetchByCep(cep).then((data) => {
      if (data) {
        form.setValue("address", data.logradouro)
      }
    })
  }, [form, fetchByCep, clearError])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 p-5"
      >
        <div>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Seus dados
          </h3>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mb-2">
                <FormLabel>Nome completo *</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="mb-2">
                <FormLabel>WhatsApp *</FormLabel>
                <FormControl>
                  <Input placeholder="(11) 99999-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Endereço de entrega
          </h3>
          <FormField
            control={form.control}
            name="cep"
            render={({ field }) => (
              <FormItem className="mb-2">
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="00000-000"
                      maxLength={9}
                      disabled={cepLoading}
                      value={formatCepDisplay(field.value ?? "")}
                      onChange={(e) => {
                        const raw = sanitizeCep(e.target.value)
                        field.onChange(raw.slice(0, 8))
                        clearError()
                      }}
                      onBlur={() => {
                        field.onBlur()
                        handleCepBlur()
                      }}
                    />
                    {cepLoading && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <FiLoader className="size-4 animate-spin" />
                      </span>
                    )}
                  </div>
                </FormControl>
                {cepError && (
                  <p className="text-sm font-medium text-destructive">{cepError}</p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="mb-2">
                <FormLabel>Rua / Avenida *</FormLabel>
                <FormControl>
                  <Input placeholder="Endereço completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nº" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="complement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complemento</FormLabel>
                  <FormControl>
                    <Input placeholder="Apto, bloco..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Forma de pagamento
          </h3>
          <FormField
            control={form.control}
            name="payment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-2">
                    {paymentOptions.map((p) => {
                      const Icon = ICON_MAP[p.id as keyof typeof ICON_MAP] ?? FiSmartphone
                      const isSelected = field.value === p.id
                      return (
                        <Button
                          key={p.id}
                          type="button"
                          variant="outline"
                          onClick={() => field.onChange(p.id)}
                          className={`flex w-full items-center gap-3 rounded-xl border p-3.5 transition-colors justify-start h-auto ${
                            isSelected ? "border-primary bg-primary/5" : "border-border"
                          }`}
                        >
                          <Icon className="size-5 shrink-0" />
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-sm">{p.label}</div>
                            <div className="text-xs text-muted-foreground font-normal">{p.desc}</div>
                          </div>
                          <span
                            className={`h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? "border-primary bg-primary" : "border-border"
                            }`}
                          >
                            {isSelected && (
                              <span className="h-2 w-2 rounded-full bg-white" />
                            )}
                          </span>
                        </Button>
                      )
                    })}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("payment") === "cash" && (
            <FormField
              control={form.control}
              name="change"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel>Troco para quanto?</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: R$ 50,00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Resumo
          </h3>
          {cartItems.map((i) => (
            <div
              key={i.cartId}
              className="flex justify-between text-sm text-muted-foreground"
            >
              <span>
                {i.qty}x {i.name}
              </span>
              <span>{formatCurrency(i.totalPrice * i.qty)}</span>
            </div>
          ))}
          <div className="mt-2 flex justify-between text-sm text-muted-foreground">
            <span>Taxa de entrega</span>
            <span>{formatCurrency(deliveryFee)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-border pt-2 font-serif text-base font-bold text-primary">
            <span>Total</span>
            <span>{formatCurrency(cartTotal)}</span>
          </div>
        </div>

        <Button type="submit" className="w-full font-semibold">
          🚀 Fazer Pedido · {formatCurrency(cartTotal)}
        </Button>
      </form>
    </Form>
  )
})
