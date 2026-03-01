import { useCallback, useState } from "react"
import { AdminLayout, type AdminTab } from "./components/AdminLayout"
import { DashboardPage } from "./components/DashboardPage"
import { AnalyticsPage } from "./components/AnalyticsPage"
import { CategoriesPage } from "./components/CategoriesPage"
import { ProductsPage } from "./components/ProductsPage"
import { OrdersPage } from "./components/OrdersPage"
import { SettingsPage } from "./components/SettingsPage"

interface StoreAdminPageProps {
  onOpenStore?: () => void
}

export default function StoreAdminPage({ onOpenStore }: StoreAdminPageProps) {
  const [tab, setTab] = useState<AdminTab>("dashboard")

  const handleTabChange = useCallback((t: AdminTab) => setTab(t), [])

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
    <AdminLayout tab={tab} onTabChange={handleTabChange} onOpenStore={onOpenStore}>
      {renderContent()}
    </AdminLayout>
  )
}
