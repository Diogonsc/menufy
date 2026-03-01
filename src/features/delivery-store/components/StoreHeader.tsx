import { memo } from "react"
import { FiShoppingCart } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { STORE, formatCurrency } from "../data/constants"

interface StoreHeaderProps {
  cartCount: number
  cartSubtotal: number
  onOpenCart: () => void
}

export const StoreHeader = memo(function StoreHeader({
  cartCount,
  cartSubtotal,
  onOpenCart,
}: StoreHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <img
            src={STORE.avatar}
            alt=""
            className="h-7 w-7 rounded-full border-2 border-amber-400 object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <span className="font-serif text-base font-extrabold text-foreground">
            {STORE.name}
          </span>
        </div>
        <Button
          size="sm"
          className="relative gap-1.5 bg-primary font-semibold"
          onClick={onOpenCart}
        >
          <FiShoppingCart className="size-4" />
          {cartCount > 0 ? formatCurrency(cartSubtotal) : "Carrinho"}
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-amber-400 text-[10px] font-extrabold text-primary">
              {cartCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  )
})
