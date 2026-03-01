import { memo, useMemo } from "react"
import { FiDollarSign, FiShoppingCart, FiPackage, FiClock } from "react-icons/fi"
import { Card, CardContent } from "@/components/ui/card"
import { useStoreProducts } from "../hooks/useStoreData"
import { useOrdersForAdmin } from "../hooks/useOrdersForAdmin"
import { formatCurrency } from "@/features/delivery-store/data/constants"

export const DashboardPage = memo(function DashboardPage() {
  const { products } = useStoreProducts()
  const { orders } = useOrdersForAdmin()

  const stats = useMemo(() => {
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((s, o) => s + o.total, 0)
    const pending = orders.filter((o) => o.status === "pending").length
    const todayOrders = orders.filter((o) => o.time?.includes(":"))
    const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0)

    return {
      totalOrders,
      totalRevenue,
      pending,
      todayOrders: todayOrders.length,
      todayRevenue,
      productsCount: products.length,
    }
  }, [orders, products])

  const KPIS = [
    {
      icon: FiDollarSign,
      label: "Faturamento total",
      value: formatCurrency(stats.totalRevenue),
    },
    {
      icon: FiShoppingCart,
      label: "Total de pedidos",
      value: stats.totalOrders.toString(),
    },
    {
      icon: FiClock,
      label: "Pedidos pendentes",
      value: stats.pending.toString(),
    },
    {
      icon: FiPackage,
      label: "Produtos cadastrados",
      value: stats.productsCount.toString(),
    },
  ]

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-extrabold text-foreground">
        Dashboard
      </h1>
      <p className="mb-8 text-muted-foreground">
        Visão geral da sua loja
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {KPIS.map(({ icon: Icon, label, value }) => (
          <Card key={label}>
            <CardContent className="p-6">
              <Icon className="mb-3 size-8 text-primary" />
              <div className="font-serif text-2xl font-extrabold text-foreground">
                {value}
              </div>
              <div className="mt-1 text-sm font-medium text-muted-foreground">
                {label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="mb-4 font-semibold text-foreground">
          Pedidos recentes
        </h2>
        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Nenhum pedido ainda
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {orders.slice(0, 5).map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between px-6 py-4"
                  >
                    <div>
                      <div className="font-semibold">{o.id}</div>
                      <div className="text-sm text-muted-foreground">
                        {o.customer} · {o.time}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">
                        {formatCurrency(o.total)}
                      </div>
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-semibold"
                        style={{
                          background:
                            o.status === "pending"
                              ? "#fffbeb"
                              : o.status === "delivered"
                                ? "#ecfdf5"
                                : "#eff6ff",
                          color:
                            o.status === "pending"
                              ? "#b45309"
                              : o.status === "delivered"
                                ? "#059669"
                                : "#1d4ed8",
                        }}
                      >
                        {o.status === "pending"
                          ? "Aguardando"
                          : o.status === "delivered"
                            ? "Entregue"
                            : o.status === "preparing"
                              ? "Preparando"
                              : "Na entrega"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
})
