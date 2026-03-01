import { memo } from "react"
import {
  FiDollarSign,
  FiPackage,
  FiShoppingBag,
  FiExternalLink,
  FiInfo,
} from "react-icons/fi"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "../data/constants"
import type { Tenant } from "../schemas"

interface TenantsPageProps {
  tenants: Tenant[]
  search: string
  onSearchChange: (value: string) => void
  totalMRR: number
  totalOrders: number
  totalRevenue: number
  activeCount: number
  trialCount: number
  onDetail: (tenant: Tenant) => void
  onNewStore: () => void
}

export const TenantsPage = memo(function TenantsPage({
  tenants,
  search,
  onSearchChange,
  totalMRR,
  totalOrders,
  totalRevenue,
  activeCount,
  trialCount,
  onDetail,
  onNewStore,
}: TenantsPageProps) {
  return (
    <div className="mx-auto max-w-[1200px] p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl font-extrabold text-foreground">
            Suas Lojas
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeCount} ativas · {trialCount} em trial
          </p>
        </div>
        <Button size="sm" onClick={onNewStore}>
          + Nova Loja
        </Button>
      </div>

      <div className="mb-7 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <FiDollarSign className="mb-2 size-6 text-muted-foreground" />
            <div className="font-serif text-xl font-extrabold text-foreground">
              {formatCurrency(totalMRR)}
            </div>
            <div className="mt-1 text-xs font-semibold text-muted-foreground">
              MRR (recorrência)
            </div>
            <div className="mt-1 text-xs font-bold text-emerald-600">
              ↑ +2 lojas este mês
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <FiShoppingBag className="mb-2 size-6 text-muted-foreground" />
            <div className="font-serif text-xl font-extrabold text-foreground">
              {tenants.length + activeCount}
            </div>
            <div className="mt-1 text-xs font-semibold text-muted-foreground">
              Total de Lojas
            </div>
            <div className="mt-1 text-xs font-bold text-emerald-600">
              ↑ crescendo
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <FiPackage className="mb-2 size-6 text-muted-foreground" />
            <div className="font-serif text-xl font-extrabold text-foreground">
              {totalOrders.toLocaleString()}
            </div>
            <div className="mt-1 text-xs font-semibold text-muted-foreground">
              Pedidos Processados
            </div>
            <div className="mt-1 text-xs font-bold text-emerald-600">
              ↑ este mês
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <FiDollarSign className="mb-2 size-6 text-muted-foreground" />
            <div className="font-serif text-xl font-extrabold text-foreground">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="mt-1 text-xs font-semibold text-muted-foreground">
              Volume de Vendas
            </div>
            <div className="mt-1 text-xs font-bold text-emerald-600">
              ↑ das lojas parceiras
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b px-5 py-4">
          <span className="font-semibold text-foreground">Todas as Lojas</span>
          <Input
            placeholder="🔍 Buscar loja..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 w-[200px]"
          />
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="bg-muted/50 px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Loja
                  </th>
                  <th className="bg-muted/50 px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    URL
                  </th>
                  <th className="bg-muted/50 px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Plano
                  </th>
                  <th className="bg-muted/50 px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="bg-muted/50 px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Pedidos
                  </th>
                  <th className="bg-muted/50 px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Faturamento
                  </th>
                  <th className="bg-muted/50 px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    MRR
                  </th>
                  <th className="bg-muted/50 px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((t) => (
                  <tr
                    key={t.id}
                    className="border-t border-border transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {t.avatar ? (
                          <img
                            src={t.avatar}
                            alt=""
                            className="h-9 w-9 rounded-lg object-cover"
                            onError={(e) =>
                              (e.currentTarget.style.display = "none")
                            }
                          />
                        ) : (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-lg">
                            🍔
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-sm">{t.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {t.owner}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                        <FiExternalLink className="size-3" />
                        {t.url}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        variant={
                          t.plan === "starter"
                            ? "secondary"
                            : t.plan === "pro"
                              ? "success"
                              : "default"
                        }
                        className="capitalize"
                      >
                        {t.plan}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="flex items-center gap-1.5 text-sm font-semibold">
                        <span
                          className={`size-1.5 rounded-full ${
                            t.status === "active"
                              ? "bg-emerald-500"
                              : t.status === "trial"
                                ? "bg-amber-500"
                                : "bg-muted-foreground"
                          }`}
                        />
                        {t.status === "active"
                          ? "Ativa"
                          : t.status === "trial"
                            ? "Trial"
                            : "Inativa"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm">
                      {t.orders.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-sm">
                      {formatCurrency(t.revenue)}
                    </td>
                    <td
                      className={`px-4 py-3.5 font-semibold text-sm ${
                        t.mrr > 0 ? "text-emerald-600" : "text-muted-foreground"
                      }`}
                    >
                      {t.mrr > 0 ? formatCurrency(t.mrr) : "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-1 h-8"
                        onClick={() => onDetail(t)}
                      >
                        <FiInfo className="mr-1 size-3.5" />
                        Ver detalhes
                      </Button>
                      <Button variant="outline" size="sm" className="h-8">
                        Abrir loja ↗
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
})
