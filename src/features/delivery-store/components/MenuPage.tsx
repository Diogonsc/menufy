import { memo } from "react"
import { ProductCard } from "./ProductCard"
import { StoreHero } from "./StoreHero"
import { CategoryPills } from "./CategoryPills"
import type { Product } from "../schemas"

interface Category {
  id: number
  name: string
  icon?: string
}

interface MenuPageProps {
  activeCategoryId: number | null
  onCategoryChange: (id: number | null) => void
  categories: Category[]
  products: Product[]
  onProductSelect: (product: Product) => void
}

const getCategoryById = (cats: Category[], id: number) =>
  cats.find((c) => c.id === id)

const getFilteredProducts = (products: Product[], catId: number | null) =>
  catId
    ? products.filter((p) => p.categoryId === catId)
    : products

export const MenuPage = memo(function MenuPage({
  activeCategoryId,
  onCategoryChange,
  categories,
  products,
  onProductSelect,
}: MenuPageProps) {
  const catsToShow = activeCategoryId
    ? [getCategoryById(categories, activeCategoryId)].filter(Boolean)
    : categories
  const filtered = getFilteredProducts(products, activeCategoryId)

  return (
    <div>
      <StoreHero />
      <CategoryPills categories={categories} activeId={activeCategoryId} onSelect={onCategoryChange} />
      <div className="space-y-5 p-5">
        {catsToShow.map((cat) => {
          const prods = filtered.filter((p) => p.categoryId === cat!.id)
          if (!prods.length) return null
          return (
            <section key={cat!.id}>
              <div className="mb-3 flex items-center gap-2">
                <span className="font-serif text-base font-bold text-foreground">
                  {cat!.name}
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="space-y-2.5">
                {prods.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onSelect={onProductSelect}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
})
