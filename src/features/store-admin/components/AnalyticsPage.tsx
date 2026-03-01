import { memo, useMemo } from "react"
import { FiTrendingUp, FiPackage, FiDollarSign } from "react-icons/fi"
import { Card, CardContent } from "@/components/ui/card"
import { useStoreProducts } from "../hooks/useStoreData"
import { useOrdersForAdmin } from "../hooks/useOrdersForAdmin"
import { formatCurrency } from "@/features/delivery-store/data/constants"

interface ProductSales {
  id: number
  name: string
  categoryId: number
  totalQty: number
  totalRevenue: number
}

export const AnalyticsPage = memo(function AnalyticsPage() {
  const { products } = useStoreProducts()
  const { orders } = useOrdersForAdmin()

  const { topProducts, revenueByCategory } = useMemo(() => {
    const salesMap = new Map<number, { qty: number; revenue: number }>()
    const catRevenue = new Map<number, number>()

    orders.forEach((o) => {
      o.items.forEach((item) => {
        const curr = salesMap.get(item.id) ?? { qty: 0, revenue: 0 }
        const qty = item.qty
        const revenue = item.totalPrice * qty
        salesMap.set(item.id, {
          qty: curr.qty + qty,
          revenue: curr.revenue + revenue,
        })

        const prod = products.find((p) => p.id === item.id)
        if (prod) {
          catRevenue.set(
            prod.categoryId,
            (catRevenue.get(prod.categoryId) ?? 0) + revenue
          )
        }
      })
    })

    const topProducts: ProductSales[] = Array.from(salesMap.entries())
      .map(([id, { qty, revenue }]) => {
        const prod = products.find((p) => p.id === id)
        return {
          id,
          name: prod?.name ?? `Produto #${id}`,
          categoryId: prod?.categoryId ?? 0,
          totalQty: qty,
          totalRevenue: revenue,
        }
      })
      .sort((a, b) => b.totalQty - a.totalQty)
      .slice(0, 10)

    return {
      topProducts,
      revenueByCategory: catRevenue,
    }
  }, [orders, products])

  const totalRevenue = useMemo(
    () => orders.reduce((s, o) => s + o.total, 0),
    [orders]
  )
  const totalItemsSold = useMemo(
    () =>
      orders.reduce(
        (s, o) => s + o.items.reduce((sum, i) => sum + i.qty, 0),
        0
      ),
    [orders]
  )

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-extrabold text-foreground">
        Analytics
      </h1>
      <p className="mb-8 text-muted-foreground">
        Produtos mais vendidos e métricas da loja
      </p>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <FiDollarSign className="mb-3 size-8 text-primary" />
            <div className="font-serif text-2xl font-extrabold text-foreground">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="mt-1 text-sm font-medium text-muted-foreground">
              Faturamento total
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <FiPackage className="mb-3 size-8 text-primary" />
            <div className="font-serif text-2xl font-extrabold text-foreground">
              {totalItemsSold}
            </div>
            <div className="mt-1 text-sm font-medium text-muted-foreground">
              Itens vendidos
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <FiTrendingUp className="mb-3 size-8 text-primary" />
            <div className="font-serif text-2xl font-extrabold text-foreground">
              {orders.length}
            </div>
            <div className="mt-1 text-sm font-medium text-muted-foreground">
              Total de pedidos
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 font-semibold text-foreground">
              Produtos com mais saída
            </h2>
            {topProducts.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                Nenhuma venda ainda
              </p>
            ) : (
              <div className="space-y-4">
                {topProducts.map((p, i) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between border-b border-border pb-3 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                        {i + 1}
                      </span>
                      <span className="font-medium">{p.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">
                        {formatCurrency(p.totalRevenue)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {p.totalQty} un. vendidas
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 font-semibold text-foreground">
              Faturamento por categoria
            </h2>
            {revenueByCategory.size === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                Nenhum dado ainda
              </p>
            ) : (
              <div className="space-y-3">
                {Array.from(revenueByCategory.entries()).map(
                  ([catId, revenue]) => {
                    const cat = products.find((p) => p.categoryId === catId)
                    const catName =
                      cat?.categoryId === catId
                        ? products.find((p) => p.categoryId === catId)
                          ? "Categoria #" + catId
                          : "Categoria #" + catId
                        : "Categoria #" + catId
                    const categories = [
                      { id: 1, name: "Hambúrgueres" },
                      { id: 2, name: "Acompanhamentos" },
                      { id: 3, name: "Bebidas" },
                      { id: 4, name: "Combos" },
                    ]
                    const name =
                      categories.find((c) => c.id === catId)?.name ?? catName
                    const pct =
                      totalRevenue > 0
                        ? ((revenue / totalRevenue) * 100).toFixed(0)
                        : "0"
                    return (
                      <div key={catId}>
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="font-medium">{name}</span>
                          <span className="text-muted-foreground">
                            {formatCurrency(revenue)} ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{
                              width: `${pct}%`,
                            }}
                          />
                        </div>
                      </div>
                    )
                  }
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
})
