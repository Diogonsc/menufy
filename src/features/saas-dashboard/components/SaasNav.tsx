import { memo } from "react"
import { FiZap, FiLogIn, FiPlus, FiArrowLeft } from "react-icons/fi"
import { Button } from "@/components/ui/button"

interface SaasNavProps {
  view: "landing" | "dashboard"
  onViewChange: (view: "landing" | "dashboard") => void
  onNewStore: () => void
}

export const SaasNav = memo(function SaasNav({
  view,
  onViewChange,
  onNewStore,
}: SaasNavProps) {
  return (
    <nav className="sticky top-0 z-[100] flex h-14 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <FiZap className="size-2.5 text-primary" />
        <span className="font-serif text-lg font-extrabold text-foreground">
          DeliveryHub
        </span>
      </div>
      <div className="flex items-center gap-2">
        {view === "landing" ? (
          <>
            <Button variant="outline" size="sm" onClick={() => onViewChange("dashboard")}>
              <FiLogIn className="mr-1.5 size-3.5" />
              Entrar
            </Button>
            <Button size="sm" onClick={() => onViewChange("dashboard")}>
              Começar grátis →
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewChange("landing")}
            >
              <FiArrowLeft className="mr-1.5 size-3.5" />
              Landing Page
            </Button>
            <Button size="sm" onClick={onNewStore}>
              <FiPlus className="mr-1.5 size-3.5" />
              Nova Loja
            </Button>
          </>
        )}
      </div>
    </nav>
  )
})
