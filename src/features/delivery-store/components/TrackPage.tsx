import { memo, useCallback } from "react"
import { FiSearch } from "react-icons/fi"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { trackOrderSchema, type TrackOrderValues, type Order } from "../schemas"
import { STATUS, PAYMENT, formatCurrency } from "../data/constants"

interface TrackPageProps {
  orders: Order[]
  trackedOrder: Order | null
  onSearch: (orderId: string) => void
  onSelectOrder: (order: Order) => void
  advanceStatus?: (orderId: string) => void
}

const STEPS = ["pending", "preparing", "delivery", "delivered"] as const

export const TrackPage = memo(function TrackPage({
  orders,
  trackedOrder,
  onSearch,
  onSelectOrder,
  advanceStatus,
}: TrackPageProps) {
  const form = useForm<TrackOrderValues>({
    resolver: zodResolver(trackOrderSchema),
    defaultValues: { orderId: "" },
  })

  const handleSubmit = useCallback(
    (data: TrackOrderValues) => {
      onSearch(data.orderId.toUpperCase())
    },
    [onSearch]
  )

  const currIdx = trackedOrder
    ? STEPS.indexOf(trackedOrder.status as (typeof STEPS)[number])
    : -1
  const pct = currIdx >= 0 ? (currIdx / (STEPS.length - 1)) * 100 : 0

  return (
    <div className="space-y-5 p-5">
      <div>
        <h1 className="font-serif text-xl font-extrabold text-foreground">
          Meu Pedido
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Acompanhe o status em tempo real
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex gap-2"
        >
          <FormField
            control={form.control}
            name="orderId"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="Código do pedido (ex: PED7K2X)"
                    className="uppercase"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="icon" className="shrink-0">
            <FiSearch className="size-4" />
          </Button>
        </form>
      </Form>

      {trackedOrder ? (
        <Card>
          <div
            className="rounded-t-xl p-7 text-center"
            style={{ background: STATUS[trackedOrder.status as keyof typeof STATUS]?.bg }}
          >
            <span
              className="mb-3 block text-5xl animate-pulse"
              style={{
                color: STATUS[trackedOrder.status as keyof typeof STATUS]?.color,
              }}
            >
              {STATUS[trackedOrder.status as keyof typeof STATUS]?.icon === "clock" && "⏳"}
              {STATUS[trackedOrder.status as keyof typeof STATUS]?.icon === "chef" && "👨‍🍳"}
              {STATUS[trackedOrder.status as keyof typeof STATUS]?.icon === "delivery" && "🛵"}
              {STATUS[trackedOrder.status as keyof typeof STATUS]?.icon === "check" && "✅"}
            </span>
            <div
              className="font-serif text-lg font-bold"
              style={{
                color: STATUS[trackedOrder.status as keyof typeof STATUS]?.color,
              }}
            >
              {STATUS[trackedOrder.status as keyof typeof STATUS]?.label}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Pedido #{trackedOrder.id} · {trackedOrder.time}
            </div>
          </div>

          <div className="relative px-5 pb-6">
            <div className="absolute top-7 left-9 right-9 h-0.5 bg-border" />
            <div
              className="absolute top-7 left-9 h-0.5 bg-amber-400 transition-all duration-500"
              style={{ width: `${pct * 0.72}%` }}
            />
            <div className="relative flex justify-between pt-14">
              {STEPS.map((s, i) => {
                const st = STATUS[s as keyof typeof STATUS]
                const done = i <= currIdx
                return (
                  <div key={s} className="flex flex-col items-center gap-1.5">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs transition-all ${
                        done ? "border-amber-400 bg-amber-400 text-white" : "border-border bg-muted"
                      }`}
                    >
                      {st?.icon === "clock" && "⏳"}
                      {st?.icon === "chef" && "👨‍🍳"}
                      {st?.icon === "delivery" && "🛵"}
                      {st?.icon === "check" && "✅"}
                    </div>
                    <span
                      className={`max-w-[60px] text-center text-[10px] font-bold ${
                        done ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {st?.short}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {trackedOrder.status === "delivery" && (
            <div className="mx-5 mb-4 rounded-lg bg-violet-50 p-3 text-sm font-semibold text-violet-700">
              🛵 O motoboy já saiu! Prepare-se para receber seu pedido.
            </div>
          )}

          <div className="border-t px-5 py-4">
            <div className="mb-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Itens do pedido
            </div>
            {trackedOrder.items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between text-sm text-muted-foreground"
              >
                <span>
                  {item.qty}x {item.name}
                </span>
                <span>{formatCurrency(item.totalPrice * item.qty)}</span>
              </div>
            ))}
            <div className="mt-2 flex justify-between text-sm text-muted-foreground">
              <span>Taxa de entrega</span>
              <span>{formatCurrency(trackedOrder.deliveryFee)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-border pt-2 font-serif font-bold text-primary">
              <span>Total</span>
              <span>{formatCurrency(trackedOrder.total)}</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              {PAYMENT.find((p) => p.id === trackedOrder.payment)?.icon === "phone" && "📱"}
              {PAYMENT.find((p) => p.id === trackedOrder.payment)?.label}
              {trackedOrder.change && ` · Troco para ${trackedOrder.change}`}
            </div>
          </div>

          <div className="px-5 pb-5 text-xs text-muted-foreground">
            📍 {trackedOrder.address}
          </div>

          {advanceStatus &&
            STATUS[trackedOrder.status as keyof typeof STATUS]?.next && (
              <div className="border-t px-5 py-4">
                <Button
                  className="w-full font-semibold"
                  style={{
                    background:
                      STATUS[
                        STATUS[trackedOrder.status as keyof typeof STATUS]
                          ?.next as keyof typeof STATUS
                      ]?.color,
                  }}
                  onClick={() => advanceStatus?.(trackedOrder.id)}
                >
                  🎬 [DEMO] Avançar:{" "}
                  {STATUS[
                    STATUS[trackedOrder.status as keyof typeof STATUS]
                      ?.next as keyof typeof STATUS
                  ]?.short ?? ""}
                </Button>
              </div>
            )}
        </Card>
      ) : (
        <div className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
          <FiSearch className="size-12" />
          <p className="font-semibold">Digite o código do seu pedido acima</p>
        </div>
      )}

      {orders.length > 0 && (
        <div>
          <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Histórico
          </h3>
          <div className="space-y-2">
            {orders.map((o) => (
              <Button
                key={o.id}
                type="button"
                variant="outline"
                onClick={() => onSelectOrder(o)}
                className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-3 h-auto transition-colors hover:bg-muted/50"
              >
                <div className="text-left">
                  <div className="font-semibold text-sm">{o.id}</div>
                  <div className="text-xs text-muted-foreground">
                    {o.time} · {formatCurrency(o.total)}
                  </div>
                </div>
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-bold"
                  style={{
                    background:
                      STATUS[o.status as keyof typeof STATUS]?.bg,
                    color: STATUS[o.status as keyof typeof STATUS]?.color,
                  }}
                >
                  {STATUS[o.status as keyof typeof STATUS]?.short}
                </span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
})
