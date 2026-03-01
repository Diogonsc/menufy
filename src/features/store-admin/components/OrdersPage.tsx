import { memo } from "react"
import { FiClock, FiCheck } from "react-icons/fi"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useOrdersForAdmin } from "../hooks/useOrdersForAdmin"
import { formatCurrency } from "@/features/delivery-store/data/constants"
import { STATUS } from "@/features/delivery-store/data/constants"

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending: { bg: "#fffbeb", color: "#b45309" },
  preparing: { bg: "#eff6ff", color: "#1d4ed8" },
  delivery: { bg: "#f5f3ff", color: "#6d28d9" },
  delivered: { bg: "#ecfdf5", color: "#059669" },
}

export const OrdersPage = memo(function OrdersPage() {
  const { orders, advanceStatus } = useOrdersForAdmin()

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-extrabold text-foreground">
        Pedidos
      </h1>
      <p className="mb-8 text-muted-foreground">
        Gerencie os pedidos da sua loja
      </p>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <FiClock className="mx-auto mb-4 size-12" />
            <p className="font-semibold">Nenhum pedido ainda</p>
            <p className="mt-1 text-sm">
              Os pedidos aparecerão aqui quando os clientes fizerem checkout
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const st = STATUS[o.status as keyof typeof STATUS]
            const colors = STATUS_COLORS[o.status] ?? {
              bg: "#f3f4f6",
              color: "#6b7280",
            }
            const hasNext = st?.next

            return (
              <Card key={o.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-primary">
                          {o.id}
                        </span>
                        <span
                          className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                          style={{
                            background: colors.bg,
                            color: colors.color,
                          }}
                        >
                          {st?.short ?? o.status}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        {o.customer} · {o.phone}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {o.address}
                      </div>
                      <div className="mt-3 text-sm">
                        {o.items.map((i, idx) => (
                          <span key={idx}>
                            {i.qty}x {i.name}
                            {idx < o.items.length - 1 && ", "}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 font-semibold text-primary">
                        {formatCurrency(o.total)}
                      </div>
                    </div>
                    {hasNext && (
                      <Button
                        className="shrink-0"
                        onClick={() => advanceStatus(o.id)}
                        style={{ background: colors.color }}
                      >
                        <FiCheck className="mr-2 size-4" />
                        {st?.nextLabel ?? "Avançar"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
})
