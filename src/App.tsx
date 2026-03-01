import { lazy, Suspense } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { DEFAULT_STORE_SLUG } from "@/features/delivery-store/data/constants"
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

const Fallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="text-center">
      <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="text-sm text-muted-foreground">Carregando...</p>
    </div>
  </div>
)

function AppContent() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route path="/" element={<Navigate to={`/${DEFAULT_STORE_SLUG}`} replace />} />
        <Route path="/owner" element={<SaasDashboardPage />} />
        <Route path="/:storeSlug/paineladmin" element={<StoreAdminPage />} />
        <Route path="/:storeSlug" element={<DeliveryStorePage />} />
      </Routes>
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
