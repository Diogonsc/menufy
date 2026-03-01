import { lazy, Suspense, useCallback, useState } from "react"
import { FiShoppingBag, FiLayout, FiSettings } from "react-icons/fi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import "./index.css"

const DeliveryStorePage = lazy(
  () => import("@/features/delivery-store/DeliveryStorePage")
)
const SaasDashboardPage = lazy(
  () => import("@/features/saas-dashboard/SaasDashboardPage")
)
const StoreAdminPage = lazy(
  () => import("@/features/store-admin/StoreAdminPage")
)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
})

type Page = "delivery-store" | "saas-dashboard" | "store-admin"

function AppContent() {
  const [page, setPage] = useState<Page | null>(null)

  const handleSelectPage = useCallback((p: Page) => () => setPage(p), [])

  if (!page) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-8">
        <h1 className="font-serif text-2xl font-extrabold text-foreground">
          Menufy
        </h1>
        <p className="text-center text-muted-foreground">
          Escolha uma página para visualizar
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleSelectPage("delivery-store")}
            className="flex flex-col items-center gap-3 h-auto rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary hover:shadow-lg active:scale-[0.98]"
          >
            <FiShoppingBag className="size-12 text-primary" />
            <span className="font-semibold text-foreground">
              Delivery Store
            </span>
            <span className="max-w-[200px] text-center text-sm text-muted-foreground font-normal">
              Loja de delivery com cardápio, carrinho e checkout
            </span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleSelectPage("saas-dashboard")}
            className="flex flex-col items-center gap-3 h-auto rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary hover:shadow-lg active:scale-[0.98]"
          >
            <FiLayout className="size-12 text-primary" />
            <span className="font-semibold text-foreground">
              SaaS Dashboard
            </span>
            <span className="max-w-[200px] text-center text-sm text-muted-foreground font-normal">
              Painel admin com lojas, analytics e planos
            </span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleSelectPage("store-admin")}
            className="flex flex-col items-center gap-3 h-auto rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary hover:shadow-lg active:scale-[0.98]"
          >
            <FiSettings className="size-12 text-primary" />
            <span className="font-semibold text-foreground">
              Painel Admin da Loja
            </span>
            <span className="max-w-[200px] text-center text-sm text-muted-foreground font-normal">
              Gerencie categorias, produtos, pedidos e PIX
            </span>
          </Button>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setPage(null)}
          className="mt-4 text-sm text-muted-foreground underline hover:text-foreground"
        >
          Voltar
        </Button>
      </div>
    )
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Carregando...</p>
          </div>
        </div>
      }
    >
      {page === "delivery-store" && <DeliveryStorePage />}
      {page === "saas-dashboard" && <SaasDashboardPage />}
      {page === "store-admin" && (
        <StoreAdminPage onOpenStore={() => setPage("delivery-store")} />
      )}
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          type="button"
          variant="outline"
          onClick={() => setPage(null)}
          className="rounded-lg border border-border bg-background/95 backdrop-blur hover:bg-muted/50"
        >
          ← Menu
        </Button>
      </div>
    </Suspense>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  )
}
