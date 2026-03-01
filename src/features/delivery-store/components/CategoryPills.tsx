import { memo, useCallback } from "react"
import { FiMenu, FiCoffee, FiPackage, FiGift } from "react-icons/fi"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const ICON_MAP = {
  hamburger: FiMenu,
  fries: FiCoffee,
  beverage: FiPackage,
  combo: FiGift,
} as const

interface Category {
  id: number
  name: string
  icon?: string
}

interface CategoryPillsProps {
  categories: Category[]
  activeId: number | null
  onSelect: (id: number | null) => void
}

export const CategoryPills = memo(function CategoryPills({
  categories,
  activeId,
  onSelect,
}: CategoryPillsProps) {
  const handleAll = useCallback(() => onSelect(null), [onSelect])
  const handleSelect = useCallback(
    (id: number) => () => onSelect(id),
    [onSelect]
  )

  return (
    <div className="flex gap-2 overflow-x-auto border-b bg-background px-4 py-3.5 scrollbar-none [-webkit-overflow-scrolling:touch]">
      <Button
        type="button"
        variant={!activeId ? "default" : "outline"}
        size="sm"
        onClick={handleAll}
        className={cn(
          "shrink-0 rounded-full px-3.5 font-semibold",
          !activeId ? "" : "border-border bg-transparent text-muted-foreground hover:bg-muted"
        )}
      >
        Todos
      </Button>
      {categories.map((cat) => {
        const Icon = ICON_MAP[cat.icon as keyof typeof ICON_MAP] ?? FiMenu
        return (
          <Button
            key={cat.id}
            type="button"
            variant={activeId === cat.id ? "default" : "outline"}
            size="sm"
            onClick={handleSelect(cat.id)}
            className={cn(
              "shrink-0 gap-1 rounded-full px-3.5 font-semibold",
              activeId !== cat.id && "border-border bg-transparent text-muted-foreground hover:bg-muted"
            )}
          >
            <Icon className="size-4" />
            {cat.name}
          </Button>
        )
      })}
    </div>
  )
})
