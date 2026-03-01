import { useCallback, useMemo, useState } from "react"
import type { CartItem } from "../schemas"

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  const persist = useCallback((next: CartItem[]) => setItems(next), [])

  const addItem = useCallback(
    (item: Omit<CartItem, "cartId">) => {
      const cartItem: CartItem = {
        ...item,
        cartId: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      }
      persist([...items, cartItem])
      return cartItem
    },
    [items, persist]
  )

  const updateQty = useCallback(
    (cartId: string, delta: number) => {
      const next = items
        .map((i) =>
          i.cartId === cartId ? { ...i, qty: Math.max(0, i.qty + delta) } : i
        )
        .filter((i) => i.qty > 0)
      persist(next)
    },
    [items, persist]
  )

  const removeItem = useCallback(
    (cartId: string) => {
      persist(items.filter((i) => i.cartId !== cartId))
    },
    [items, persist]
  )

  const clearCart = useCallback(() => persist([]), [persist])

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items])
  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.totalPrice * i.qty, 0),
    [items]
  )

  return {
    items,
    count,
    subtotal,
    addItem,
    updateQty,
    removeItem,
    clearCart,
  }
}
