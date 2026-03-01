import { memo } from "react"
import { FiZap, FiTrendingUp, FiDollarSign, FiClock } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { PLANS } from "../data/constants"

interface LandingPageProps {
  onCTA: () => void
}

const STATS = [
  { val: "5+", lbl: "Lojas ativas", Icon: FiZap },
  { val: "1.200+", lbl: "Pedidos processados", Icon: FiTrendingUp },
  { val: "R$ 0", lbl: "Taxa por pedido", Icon: FiDollarSign },
  { val: "< 5min", lbl: "Para configurar", Icon: FiClock },
] as const

const STEPS = [
  {
    n: "01",
    t: "Crie sua loja",
    d: "Cadastre o nome, logo, banner e configure as cores da sua marca. Sua URL exclusiva fica pronta na hora.",
  },
  {
    n: "02",
    t: "Adicione seu cardápio",
    d: "Crie categorias, produtos com fotos, variações (tamanho, ponto) e adicionais. Simples como montar uma planilha.",
  },
  {
    n: "03",
    t: "Comece a receber pedidos",
    d: "Compartilhe o link com seus clientes. Receba pedidos, gerencie o status e acompanhe suas vendas em tempo real.",
  },
] as const

const FEATURES = [
  {
    icon: "📱",
    t: "100% Mobile-First",
    d: "Interface projetada para quem pede pelo celular. 80% dos pedidos vêm do mobile.",
  },
  {
    icon: "🛒",
    t: "Carrinho Inteligente",
    d: "Variações, adicionais, observações por item, pedido mínimo e taxa de entrega automática.",
  },
  {
    icon: "📦",
    t: "Rastreamento ao Vivo",
    d: "Cliente acompanha o pedido em tempo real: confirmado, preparando, saiu, entregue.",
  },
  {
    icon: "🎨",
    t: "Totalmente Personalizável",
    d: "Cores, logo, banner, nome — cada loja com a identidade visual da sua marca.",
  },
  {
    icon: "💳",
    t: "Múltiplas Formas de Pag.",
    d: "PIX, cartão na entrega ou dinheiro com troco. Sem integrações complicadas.",
  },
  {
    icon: "📊",
    t: "Analytics Completo",
    d: "Faturamento, pedidos, produtos mais vendidos, ticket médio e horário de pico.",
  },
] as const

export const LandingPage = memo(function LandingPage({ onCTA }: LandingPageProps) {
  return (
    <div className="mx-auto max-w-[1100px] px-6 py-16">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary mb-5">
        <FiZap className="size-3.5" />
        Plataforma SaaS de Delivery
      </div>
      <h1 className="font-serif text-4xl font-extrabold leading-tight text-foreground md:text-5xl">
        Seu restaurante
        <br />
        vende mais com a <em className="italic text-primary">plataforma certa</em>
      </h1>
      <p className="mt-4 max-w-[520px] text-base text-muted-foreground leading-relaxed">
        Crie a loja de delivery do seu restaurante em minutos. Cardápio digital,
        carrinho otimizado para mobile, rastreamento de pedidos e painel admin —
        tudo com a sua cara.
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        <Button size="lg" onClick={onCTA}>
          Criar minha loja grátis →
        </Button>
        <Button variant="outline" size="lg" onClick={onCTA}>
          Ver demonstração
        </Button>
      </div>

      <div className="my-14 grid grid-cols-2 gap-4 md:grid-cols-4">
        {STATS.map(({ val, lbl }) => (
          <div
            key={lbl}
            className="rounded-xl border border-border bg-card p-5 text-center"
          >
            <div className="font-serif text-2xl font-extrabold text-foreground">
              {val}
            </div>
            <div className="mt-1 text-xs font-semibold text-muted-foreground">
              {lbl}
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-primary">
          Como funciona
        </div>
        <h2 className="mt-2 font-serif text-2xl font-extrabold text-foreground md:text-3xl">
          Três passos para vender mais
        </h2>
        <p className="mt-2 max-w-[520px] text-sm text-muted-foreground leading-relaxed">
          Do cadastro ao primeiro pedido em menos de uma hora.
        </p>
        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {STEPS.map(({ n, t, d }) => (
            <div
              key={n}
              className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
            >
              <div className="font-serif text-4xl font-extrabold text-border">
                {n}
              </div>
              <div className="mt-3 font-semibold text-foreground">{t}</div>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                {d}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 border-t border-border pt-16">
        <div className="text-xs font-bold uppercase tracking-wider text-primary">
          Funcionalidades
        </div>
        <h2 className="mt-2 font-serif text-2xl font-extrabold text-foreground md:text-3xl">
          Tudo que seu restaurante precisa
        </h2>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon, t, d }) => (
            <div
              key={t}
              className="rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <div className="mb-2.5 text-2xl">{icon}</div>
              <div className="font-semibold text-foreground">{t}</div>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {d}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 border-t border-border pt-16">
        <div className="text-xs font-bold uppercase tracking-wider text-primary">
          Planos
        </div>
        <h2 className="mt-2 font-serif text-2xl font-extrabold text-foreground md:text-3xl">
          Preço justo para todo tamanho
        </h2>
        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className={`relative rounded-2xl border bg-card p-7 transition-shadow ${
                p.highlight
                  ? "border-primary shadow-[0_0_0_4px_rgba(99,102,241,0.12)]"
                  : "border-border"
              }`}
            >
              {p.highlight && (
                <div className="absolute right-4 top-4 rounded-full bg-primary px-2.5 py-1 text-[10px] font-extrabold text-primary-foreground">
                  ⭐ Mais popular
                </div>
              )}
              <div className="font-serif text-lg font-extrabold text-foreground">
                {p.name}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{p.desc}</div>
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
                className="mt-6 w-full"
                variant={p.highlight ? "default" : p.id === "agency" ? "default" : "outline"}
                onClick={onCTA}
              >
                {p.id === "agency" ? "Falar com vendas" : "Começar agora →"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 rounded-3xl bg-primary px-9 py-12 text-center">
        <h3 className="font-serif text-2xl font-extrabold text-primary-foreground">
          Pronto para começar?
        </h3>
        <p className="mt-3 text-primary-foreground/80">
          Crie a loja do seu restaurante agora e receba seus primeiros pedidos
          hoje.
        </p>
        <Button
          size="lg"
          className="mt-6 bg-background text-foreground hover:bg-background/90"
          onClick={onCTA}
        >
          Criar minha loja grátis →
        </Button>
      </div>
    </div>
  )
})
