import { useCallback, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AdminLayout, type AdminTab } from "./components/AdminLayout"
import { DashboardPage } from "./components/DashboardPage"
import { AnalyticsPage } from "./components/AnalyticsPage"
import { CategoriesPage } from "./components/CategoriesPage"
import { ProductsPage } from "./components/ProductsPage"
import { OrdersPage } from "./components/OrdersPage"
import { SettingsPage } from "./components/SettingsPage"

export default function StoreAdminPage() {
  const { storeSlug } = useParams<{ storeSlug: string }>()
  const navigate = useNavigate()
  const [tab, setTab] = useState<AdminTab>("dashboard")

  const handleTabChange = useCallback((t: AdminTab) => setTab(t), [])
  const onOpenStore = useCallback(() => {
    if (storeSlug) navigate(`/${storeSlug}`)
  }, [storeSlug, navigate])

  const renderContent = () => {
    switch (tab) {
      case "dashboard":
        return <DashboardPage />
      case "analytics":
        return <AnalyticsPage />
      case "categories":
        return <CategoriesPage />
      case "products":
        return <ProductsPage />
      case "orders":
        return <OrdersPage />
      case "settings":
        return <SettingsPage />
      default:
        return <DashboardPage />
    }
  }

  return (
    <AdminLayout tab={tab} onTabChange={handleTabChange} onOpenStore={storeSlug ? onOpenStore : undefined}>
      {renderContent()}
    </AdminLayout>
  )
}
