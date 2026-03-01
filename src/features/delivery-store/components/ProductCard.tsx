import { memo, useCallback } from "react"
import { FiPlus } from "react-icons/fi"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatCurrency } from "../data/constants"
import type { Product } from "../schemas"

interface ProductCardProps {
  product: Product
  onSelect: (product: Product) => void
}

export const ProductCard = memo(function ProductCard({
  product,
  onSelect,
}: ProductCardProps) {
  const handleClick = useCallback(() => {
    if (product.available) onSelect(product)
  }, [product, onSelect])

  const handleAddClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (product.available) onSelect(product)
    },
    [product, onSelect]
  )

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className="flex cursor-pointer gap-3 rounded-xl border border-border bg-card p-3.5 transition-shadow hover:shadow-md active:scale-[0.99]"
    >
      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          className="h-[90px] w-[90px] shrink-0 rounded-xl object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none"
            e.currentTarget.nextElementSibling?.classList.remove("hidden")
          }}
        />
      ) : null}
      <div
        className={cn(
          "flex h-[90px] w-[90px] shrink-0 items-center justify-center rounded-xl bg-muted/50 text-3xl",
          product.image ? "hidden" : ""
        )}
      >
        🍔
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        {product.badge && (
          <Badge variant="secondary" className="mb-1 w-fit text-[10px]">
            {product.badge}
          </Badge>
        )}
        <h3 className="truncate font-semibold text-foreground">{product.name}</h3>
        <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
          {product.description}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-serif text-base font-bold text-primary">
            {formatCurrency(product.price)}
          </span>
          {product.available ? (
            <Button
              type="button"
              size="icon"
              onClick={handleAddClick}
              className="h-9 w-9 shrink-0 rounded-xl"
            >
              <FiPlus className="size-5" />
            </Button>
          ) : (
            <span className="rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              Indisponível
            </span>
          )}
        </div>
      </div>
    </div>
  )
})
