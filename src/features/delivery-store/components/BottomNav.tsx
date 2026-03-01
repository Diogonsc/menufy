import { memo } from "react"
import { FiPackage, FiShoppingBag, FiShoppingCart } from "react-icons/fi"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface BottomNavProps {
  tab: "menu" | "track"
  onTabChange: (tab: "menu" | "track") => void
  cartCount: number
  onOpenCart: () => void
}

export const BottomNav = memo(function BottomNav({
  tab,
  onTabChange,
  cartCount,
  onOpenCart,
}: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t bg-background pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <Button
        type="button"
        variant="ghost"
        onClick={() => onTabChange("menu")}
        className={cn(
          "flex flex-1 flex-col items-center gap-1 rounded-none py-2.5 transition-colors",
          tab === "menu" ? "text-foreground" : "text-muted-foreground"
        )}
      >
        <FiShoppingBag className="size-5" />
        <span className="text-[10px] font-bold">Cardápio</span>
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={onOpenCart}
        className="relative flex flex-1 flex-col items-center gap-1 rounded-none py-2.5 text-muted-foreground hover:text-foreground"
      >
        <span className="relative">
          <FiShoppingCart className="size-5" />
          {cartCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </span>
        <span className="text-[10px] font-bold">Carrinho</span>
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={() => onTabChange("track")}
        className={cn(
          "flex flex-1 flex-col items-center gap-1 rounded-none py-2.5 transition-colors",
          tab === "track" ? "text-foreground" : "text-muted-foreground"
        )}
      >
        <FiPackage className="size-5" />
        <span className="text-[10px] font-bold">Meu Pedido</span>
      </Button>
    </nav>
  )
})
