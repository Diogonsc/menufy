import { useCallback, useState } from "react"
import { useCart } from "./hooks/useCart"
import { useOrders } from "./hooks/useOrders"
import { useStoreProducts, useStoreCategories, useStoreConfig } from "@/features/store-admin/hooks/useStoreData"
import { getStoreStatus } from "@/features/store-admin/utils/storeStatus"
import {
  MenuPage,
  ProductModal,
  CartSheet,
  TrackPage,
  BottomNav,
} from "./components"
import { generateOrderId } from "./data/constants"
import type { CheckoutFormValues, Order, Product } from "./schemas"

export default function DeliveryStorePage() {
  const [tab, setTab] = useState<"menu" | "track">("menu")
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null)
  const [productModal, setProductModal] = useState<Product | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [cartStep, setCartStep] = useState<0 | 1 | 2>(0)
  const [trackId, setTrackId] = useState("")
  const [lastOrder, setLastOrder] = useState<Order | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const cart = useCart()
  const orders = useOrders()
  const { products: storeProducts } = useStoreProducts()
  const { categories } = useStoreCategories()
  const { config } = useStoreConfig()
  const status = getStoreStatus(config ?? {})
  const deliveryFee = config?.deliveryFee ?? 5.9
  const minOrder = config?.minOrder ?? 25

  const cartTotal = cart.subtotal + deliveryFee
  const meetsMinOrder = cart.subtotal >= minOrder

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }, [])

  const handleAddToCart = useCallback(
    (item: Parameters<typeof cart.addItem>[0]) => {
      cart.addItem(item)
      showToast(`✅ ${item.name} adicionado!`)
      setProductModal(null)
    },
    [cart.addItem, showToast]
  )

  const handleOpenCart = useCallback(() => {
    setCartStep(0)
    setCartOpen(true)
  }, [])

  const handleContinueToCheckout = useCallback(() => setCartStep(1), [])

  const handlePlaceOrder = useCallback(
    (data: CheckoutFormValues) => {
      if (!status.isOpen) {
        showToast("⚠️ A loja está fechada no momento")
        return
      }
      if (!status.canOrder) {
        showToast("⚠️ Encerramos os pedidos por hoje")
        return
      }
      if (!meetsMinOrder) {
        showToast("⚠️ Pedido mínimo não atingido")
        return
      }
      const id = generateOrderId()
      const order: Order = {
        id,
        status: "pending",
        customer: data.name,
        phone: data.phone,
        address: `${data.address}, ${data.number}${data.complement ? ` - ${data.complement}` : ""}`,
        payment: data.payment,
        change: data.change,
        items: cart.items,
        subtotal: cart.subtotal,
        deliveryFee,
        total: cartTotal,
        time: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }
      orders.addOrder(order)
      setLastOrder(order)
      setTrackId(order.id)
      cart.clearCart()
      setCartStep(2)
    },
    [cart, meetsMinOrder, cartTotal, status, orders.addOrder, cart.clearCart]
  )

  const handleTrackOrder = useCallback(() => {
    setCartOpen(false)
    setCartStep(0)
    setTab("track")
    if (lastOrder) setTrackId(lastOrder.id)
  }, [lastOrder])

  const handleSearchOrder = useCallback(
    (orderId: string) => {
      const upper = orderId.toUpperCase()
      const found = orders.orders.find((o) => o.id === upper)
      setTrackId(found ? upper : "")
      if (!found) showToast("❌ Pedido não encontrado")
    },
    [orders.orders, showToast]
  )

  const handleAdvanceStatus = useCallback(
    (orderId: string) => {
      orders.advanceStatus(orderId)
      showToast("Status atualizado!")
    },
    [orders.advanceStatus, showToast]
  )

  const trackedOrder = trackId
    ? orders.orders.find((o) => o.id === trackId) ?? null
    : null

  const filteredProducts = activeCategoryId
    ? storeProducts.filter((p) => p.categoryId === activeCategoryId)
    : storeProducts

  return (
    <div className="mx-auto max-w-[480px] bg-background pb-20">
      <main className="min-h-[60vh] pb-4">
        {tab === "menu" && (
          <MenuPage
            activeCategoryId={activeCategoryId}
            onCategoryChange={setActiveCategoryId}
            categories={categories}
            products={filteredProducts}
            onProductSelect={setProductModal}
          />
        )}
        {tab === "track" && (
          <TrackPage
            orders={orders.orders}
            trackedOrder={trackedOrder}
            onSearch={handleSearchOrder}
            onSelectOrder={(o) => setTrackId(o.id)}
            advanceStatus={handleAdvanceStatus}
          />
        )}
      </main>

      <BottomNav
        tab={tab}
        onTabChange={setTab}
        cartCount={cart.count}
        onOpenCart={handleOpenCart}
      />

      {productModal && (
        <ProductModal
          product={productModal}
          onClose={() => setProductModal(null)}
          onAdd={handleAddToCart}
        />
      )}

      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        step={cartStep}
        items={cart.items}
        subtotal={cart.subtotal}
        total={cartTotal}
        meetsMinOrder={meetsMinOrder}
        minOrder={minOrder}
        deliveryFee={deliveryFee}
        onUpdateQty={cart.updateQty}
        onContinueToCheckout={handleContinueToCheckout}
        onPlaceOrder={handlePlaceOrder}
        lastOrderId={lastOrder?.id}
        onTrackOrder={handleTrackOrder}
      />

      {toast && (
        <div className="fixed left-1/2 top-16 z-[1000] -translate-x-1/2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
          {toast}
        </div>
      )}
    </div>
  )
}
