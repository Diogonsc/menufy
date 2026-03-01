import { memo } from "react"
import {
  FiBarChart2,
  FiPieChart,
  FiFolder,
  FiPackage,
  FiSettings,
  FiShoppingCart,
  FiExternalLink,
  FiGrid,
} from "react-icons/fi"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type AdminTab =
  | "dashboard"
  | "analytics"
  | "categories"
  | "products"
  | "orders"
  | "settings"

const NAV_ITEMS: { id: AdminTab; icon: typeof FiBarChart2; label: string }[] = [
  { id: "dashboard", icon: FiBarChart2, label: "Dashboard" },
  { id: "analytics", icon: FiPieChart, label: "Analytics" },
  { id: "categories", icon: FiFolder, label: "Categorias" },
  { id: "products", icon: FiPackage, label: "Produtos" },
  { id: "orders", icon: FiShoppingCart, label: "Pedidos" },
  { id: "settings", icon: FiSettings, label: "Configurações" },
]

interface AdminLayoutProps {
  tab: AdminTab
  onTabChange: (tab: AdminTab) => void
  children: React.ReactNode
  onOpenStore?: () => void
}

export const AdminLayout = memo(function AdminLayout({
  tab,
  onTabChange,
  children,
  onOpenStore,
}: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      {/* Sidebar: desktop (md+) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-background md:block">
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <FiGrid className="size-6 text-primary" />
          <span className="font-serif text-lg font-extrabold">Painel Admin</span>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
            <Button
              key={id}
              type="button"
              variant={tab === id ? "default" : "ghost"}
              onClick={() => onTabChange(id)}
              className={cn(
                "flex w-full justify-start gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                tab !== id && "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Button>
          ))}
          {onOpenStore && (
            <Button
              type="button"
              variant="ghost"
              onClick={onOpenStore}
              className="mt-4 flex w-full justify-start gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <FiExternalLink className="size-4 shrink-0" />
              Ver loja
            </Button>
          )}
        </nav>
      </aside>

      {/* Header: mobile only */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 md:hidden">
        <div className="flex items-center gap-2">
          <FiGrid className="size-6 text-primary" />
          <span className="font-serif text-lg font-extrabold">Painel Admin</span>
        </div>
        {onOpenStore && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenStore}
            className="gap-1.5"
          >
            <FiExternalLink className="size-4" />
            Ver loja
          </Button>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 pb-20 md:ml-64 md:pb-6 md:p-6">{children}</main>

      {/* Bottom nav: mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t bg-background pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] md:hidden">
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            type="button"
            variant="ghost"
            onClick={() => onTabChange(id)}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 rounded-none py-2 transition-colors",
              tab === id ? "text-primary font-semibold" : "text-muted-foreground"
            )}
          >
            <Icon className="size-5 shrink-0" />
            <span className="text-[10px] font-medium">{label}</span>
          </Button>
        ))}
      </nav>
    </div>
  )
})
