import { memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PLANS } from "../data/constants"
import type { Tenant } from "../schemas"

interface PlansPageProps {
  tenants: Tenant[]
}

export const PlansPage = memo(function PlansPage({ tenants }: PlansPageProps) {
  return (
    <div className="mx-auto max-w-[1200px] p-6">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-extrabold text-foreground">
          Planos & Preços
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure os planos que você oferece aos seus clientes
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {PLANS.map((p) => (
          <Card
            key={p.id}
            className={`relative overflow-hidden ${
              p.highlight
                ? "border-primary shadow-[0_0_0_4px_rgba(99,102,241,0.12)]"
                : ""
            }`}
          >
            {p.highlight && (
              <div className="absolute right-4 top-4 rounded-full bg-primary px-2.5 py-1 text-[10px] font-extrabold text-primary-foreground">
                ⭐ Mais popular
              </div>
            )}
            <CardContent className="p-7">
              <div className="font-serif text-lg font-extrabold text-foreground">
                {p.name}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {p.desc}
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-sm font-bold">R$</span>
                <span className="font-serif text-3xl font-extrabold text-foreground">
                  {p.price}
                </span>
                <span className="text-sm font-semibold text-muted-foreground">
                  /mês
                </span>
              </div>
              <ul className="mt-5 space-y-1">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <span className="font-bold text-primary">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className={`mt-6 w-full ${p.highlight ? "bg-primary" : ""}`}
                variant={p.highlight ? "default" : "outline"}
              >
                Editar plano
              </Button>
              <div className="mt-3 rounded-lg bg-muted/50 px-3 py-2.5 text-center text-xs font-semibold text-muted-foreground">
                {tenants.filter((t) => t.plan === p.id).length} loja(s) neste
                plano
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
})
