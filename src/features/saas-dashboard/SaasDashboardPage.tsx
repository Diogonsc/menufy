import { lazy, Suspense, useCallback, useMemo, useState } from "react"
import { FiShoppingBag, FiBarChart2, FiStar } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { useTenants } from "./hooks/useTenants"
import { TENANTS } from "./data/constants"
import {
  SaasNav,
  LandingPage,
  TenantsPage,
  NewTenantModal,
  TenantDetailModal,
} from "./components"
import type { Tenant } from "./schemas"
import type { EditTenantFormValues } from "./schemas"
import { cn } from "@/lib/utils"

const AnalyticsPage = lazy(() =>
  import("./components/AnalyticsPage").then((m) => ({ default: m.AnalyticsPage }))
)
const PlansPage = lazy(() =>
  import("./components/PlansPage").then((m) => ({ default: m.PlansPage }))
)

type DashTab = "tenants" | "analytics" | "plans"

const TABS: { id: DashTab; icon: typeof FiShoppingBag; label: string }[] = [
  { id: "tenants", icon: FiShoppingBag, label: "Lojas" },
  { id: "analytics", icon: FiBarChart2, label: "Analytics" },
  { id: "plans", icon: FiStar, label: "Planos" },
]

export default function SaasDashboardPage() {
  const [view, setView] = useState<"landing" | "dashboard">("landing")
  const [dashTab, setDashTab] = useState<DashTab>("tenants")
  const [search, setSearch] = useState("")
  const [modal, setModal] = useState<"new" | "detail" | null>(null)
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const { tenants, addTenant, updateTenant } = useTenants(TENANTS)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2400)
  }, [])

  const totalMRR = useMemo(
    () => tenants.filter((t) => t.status === "active").reduce((s, t) => s + t.mrr, 0),
    [tenants]
  )
  const totalOrders = useMemo(
    () => tenants.reduce((s, t) => s + t.orders, 0),
    [tenants]
  )
  const totalRevenue = useMemo(
    () => tenants.reduce((s, t) => s + t.revenue, 0),
    [tenants]
  )
  const activeCount = useMemo(
    () => tenants.filter((t) => t.status === "active").length,
    [tenants]
  )
  const trialCount = useMemo(
    () => tenants.filter((t) => t.status === "trial").length,
    [tenants]
  )

  const filteredTenants = useMemo(
    () =>
      tenants.filter(
        (t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.owner.toLowerCase().includes(search.toLowerCase()) ||
          t.email.toLowerCase().includes(search.toLowerCase())
      ),
    [tenants, search]
  )

  const handleNewStore = useCallback(() => setModal("new"), [])
  const handleCloseModal = useCallback(() => {
    setModal(null)
    setSelectedTenant(null)
  }, [])

  const handleAddTenant = useCallback(
    (data: Tenant) => {
      addTenant(data)
      showToast(`✅ Loja ${data.name} criada!`)
      handleCloseModal()
    },
    [addTenant, showToast, handleCloseModal]
  )

  const handleDetail = useCallback((tenant: Tenant) => {
    setSelectedTenant(tenant)
    setModal("detail")
  }, [])

  const handleSaveTenant = useCallback(
    (updates: EditTenantFormValues) => {
      if (!selectedTenant) return
      updateTenant(selectedTenant.id, updates)
      showToast("✅ Alterações salvas!")
      handleCloseModal()
    },
    [selectedTenant, updateTenant, showToast, handleCloseModal]
  )

  return (
    <div className="min-h-screen bg-background">
      <SaasNav
        view={view}
        onViewChange={setView}
        onNewStore={handleNewStore}
      />
      {view === "dashboard" && (
        <div className="flex border-b border-border">
          {TABS.map((t) => (
            <Button
              key={t.id}
              type="button"
              variant="ghost"
              onClick={() => setDashTab(t.id)}
              className={cn(
                "flex items-center gap-2 rounded-none border-b-2 border-transparent px-6 py-3.5 text-sm font-semibold transition-colors",
                dashTab === t.id
                  ? "border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <t.icon className="size-4" />
              {t.label}
            </Button>
          ))}
        </div>
      )}
      {view === "landing" && (
        <LandingPage onCTA={() => setView("dashboard")} />
      )}
      {view === "dashboard" && dashTab === "tenants" && (
        <TenantsPage
          tenants={filteredTenants}
          search={search}
          onSearchChange={setSearch}
          totalMRR={totalMRR}
          totalOrders={totalOrders}
          totalRevenue={totalRevenue}
          activeCount={activeCount}
          trialCount={trialCount}
          onDetail={handleDetail}
          onNewStore={handleNewStore}
        />
      )}
      {view === "dashboard" && dashTab === "analytics" && (
        <Suspense fallback={<div className="p-6">Carregando...</div>}>
          <AnalyticsPage
            tenants={tenants}
            totalMRR={totalMRR}
            totalRevenue={totalRevenue}
            totalOrders={totalOrders}
          />
        </Suspense>
      )}
      {view === "dashboard" && dashTab === "plans" && (
        <Suspense fallback={<div className="p-6">Carregando...</div>}>
          <PlansPage tenants={tenants} />
        </Suspense>
      )}
      {modal === "new" && (
        <NewTenantModal
          open
          onClose={handleCloseModal}
          onSave={handleAddTenant}
        />
      )}
      {modal === "detail" && (
        <TenantDetailModal
          open
          tenant={selectedTenant}
          onClose={handleCloseModal}
          onSave={handleSaveTenant}
        />
      )}
      {toast && (
        <div className="fixed right-6 top-16 z-[1000] rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
          {toast}
        </div>
      )}
    </div>
  )
}
