import { memo, useMemo } from "react"
import {
  FiDollarSign,
  FiTrendingUp,
  FiPackage,
  FiAward,
  FiShoppingBag,
  FiRefreshCw,
} from "react-icons/fi"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "../data/constants"
import { PLANS } from "../data/constants"
import type { Tenant } from "../schemas"

interface AnalyticsPageProps {
  tenants: Tenant[]
  totalMRR: number
  totalRevenue: number
  totalOrders: number
}

const KPI_ITEMS = [
  { key: "mrr", icon: FiDollarSign, label: "MRR total", up: true },
  { key: "revenue", icon: FiTrendingUp, label: "Volume de vendas gerado", up: true },
  { key: "orders", icon: FiPackage, label: "Pedidos processados", up: true },
  { key: "ticket", icon: FiAward, label: "Ticket médio por pedido", up: true },
  { key: "active", icon: FiShoppingBag, label: "Lojas ativas pagando", up: true },
  { key: "conversion", icon: FiRefreshCw, label: "Taxa de conversão trial→pago", up: true },
] as const

export const AnalyticsPage = memo(function AnalyticsPage({
  tenants,
  totalMRR,
  totalRevenue,
  totalOrders,
}: AnalyticsPageProps) {
  const byPlan = useMemo(() => {
    const map: Record<string, number> = { starter: 0, pro: 0, agency: 0 }
    tenants
      .filter((t) => t.status === "active")
      .forEach((t) => {
        map[t.plan] = (map[t.plan] ?? 0) + 1
      })
    return map
  }, [tenants])

  const ticket = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const activeCount = tenants.filter((t) => t.status === "active").length
  const trialCount = tenants.filter((t) => t.status === "trial").length
  const conversion =
    tenants.length > 0
      ? ((activeCount / tenants.length) * 100).toFixed(0)
      : "0"

  const values = {
    mrr: formatCurrency(totalMRR),
    revenue: formatCurrency(totalRevenue),
    orders: totalOrders.toLocaleString(),
    ticket: formatCurrency(ticket),
    active: activeCount,
    conversion: `${conversion}%`,
  }

  const deltas = {
    mrr: "↑ +R$ 144 vs mês anterior",
    revenue: "↑ pelas suas lojas parceiras",
    orders: "↑ +289 esta semana",
    ticket: "Acima da média do setor",
    active: `+${trialCount} em trial para converter`,
    conversion: "Boa retenção",
  }

  const topByRevenue = useMemo(
    () =>
      [...tenants]
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5),
    [tenants]
  )

  return (
    <div className="mx-auto max-w-[1200px] p-6">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-extrabold text-foreground">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Visão consolidada de todas as lojas
        </p>
      </div>
      <div className="mb-7 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {KPI_ITEMS.map(({ key, icon: Icon, label }) => (
          <Card key={key}>
            <CardContent className="p-5">
              <Icon className="mb-2 size-6 text-muted-foreground" />
              <div className="font-serif text-xl font-extrabold text-foreground">
                {values[key]}
              </div>
              <div className="mt-1 text-xs font-semibold text-muted-foreground">
                {label}
              </div>
              <div className="mt-1 text-xs font-bold text-emerald-600">
                {deltas[key]}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <h3 className="mb-4 font-semibold text-foreground">
              Distribuição por Plano
            </h3>
            {PLANS.map((p) => {
              const count = byPlan[p.id] ?? 0
              const pct =
                tenants.length > 0
                  ? Math.round((count / tenants.length) * 100)
                  : 0
              return (
                <div key={p.id} className="mb-3.5">
                  <div className="mb-1 flex justify-between text-sm font-semibold">
                    <span>{p.name}</span>
                    <span className="text-muted-foreground">
                      {count} loja(s) · {pct}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded bg-muted">
                    <div
                      className="h-full rounded transition-all duration-400"
                      style={{
                        width: `${pct}%`,
                        background: p.color,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <h3 className="mb-4 font-semibold text-foreground">
              Top Lojas por Faturamento
            </h3>
            <div className="space-y-2">
              {topByRevenue.map((t, i) => (
                <div
                  key={t.id}
                  className="flex items-center gap-2.5 border-b border-border py-2 last:border-0"
                >
                  <span className="w-5 font-serif text-sm font-extrabold text-muted-foreground">
                    {i + 1}
                  </span>
                  {t.avatar && (
                    <img
                      src={t.avatar}
                      alt=""
                      className="h-7 w-7 rounded-md object-cover"
                      onError={(e) =>
                        (e.currentTarget.style.display = "none")
                      }
                    />
                  )}
                  <span className="flex-1 font-semibold text-sm">{t.name}</span>
                  <span className="font-serif font-bold text-emerald-600">
                    {formatCurrency(t.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
})
