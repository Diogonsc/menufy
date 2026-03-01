import { memo } from "react"
import { FiMinus, FiPlus } from "react-icons/fi"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "../data/constants"
import type { CartItem } from "../schemas"
import { CheckoutForm } from "./CheckoutForm"
import { PixPaymentStep } from "./PixPaymentStep"

interface CartSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  step: 0 | 1 | 2 | 3
  items: CartItem[]
  subtotal: number
  total: number
  meetsMinOrder: boolean
  minOrder: number
  deliveryFee: number
  onUpdateQty: (cartId: string, delta: number) => void
  onContinueToCheckout: () => void
  onPlaceOrder: (data: import("../schemas").CheckoutFormValues) => void
  lastOrderId?: string
  lastOrderTotal?: number
  lastOrderPayment?: string
  pixKey?: string
  onConfirmPixPayment?: () => void
  onTrackOrder: () => void
}

export const CartSheet = memo(function CartSheet({
  open,
  onOpenChange,
  step,
  items,
  subtotal,
  total,
  meetsMinOrder,
  minOrder,
  deliveryFee,
  onUpdateQty,
  onContinueToCheckout,
  onPlaceOrder,
  lastOrderId,
  lastOrderTotal = 0,
  lastOrderPayment,
  pixKey,
  onConfirmPixPayment,
  onTrackOrder,
}: CartSheetProps) {
  const showPixStep = step === 2 && lastOrderPayment === "pix"
  const showSuccessStep = step === 3 || (step === 2 && lastOrderPayment !== "pix")

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="flex max-h-[90dvh] flex-col overflow-hidden rounded-t-3xl"
      >
        <SheetHeader className="shrink-0">
          <SheetTitle className="font-serif text-lg font-extrabold">
            {step === 0 && "🛒 Carrinho"}
            {step === 1 && "📋 Dados para entrega"}
            {showPixStep && "📱 Pagamento PIX"}
            {showSuccessStep && "Pedido realizado"}
          </SheetTitle>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {step === 0 && (
            <>
              {items.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center text-muted-foreground">
                  <span className="text-4xl">🛒</span>
                  <p className="font-semibold">Nenhum item ainda</p>
                </div>
              ) : (
                <>
                  {!meetsMinOrder && (
                    <div className="mx-4 mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs font-semibold text-amber-800">
                      ⚠️ Pedido mínimo {formatCurrency(minOrder)} · faltam{" "}
                      {formatCurrency(minOrder - subtotal)}
                    </div>
                  )}
                  <div className="flex-1 space-y-3 overflow-y-auto px-4">
                    {items.map((item) => (
                      <CartItemRow
                        key={item.cartId}
                        item={item}
                        onUpdateQty={onUpdateQty}
                      />
                    ))}
                  </div>
                  <div className="border-t bg-background p-4">
                    <div className="mb-3 rounded-xl border border-border bg-muted/30 p-3.5">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Taxa de entrega</span>
                        <span>{formatCurrency(deliveryFee)}</span>
                      </div>
                      <div className="mt-2 flex justify-between border-t border-border pt-2 font-serif text-base font-bold text-primary">
                        <span>Total</span>
                        <span>{formatCurrency(total)}</span>
                      </div>
                    </div>
                    <Button
                      className="w-full font-semibold"
                      disabled={items.length === 0 || !meetsMinOrder}
                      onClick={onContinueToCheckout}
                    >
                      Continuar →
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
          {step === 1 && (
            <div className="min-h-0 flex-1 overflow-y-auto">
              <CheckoutForm
                cartItems={items}
                cartTotal={total}
                deliveryFee={deliveryFee}
                onSubmit={onPlaceOrder}
              />
            </div>
          )}
          {showPixStep && lastOrderId && onConfirmPixPayment && (
            <PixPaymentStep
              orderId={lastOrderId}
              total={lastOrderTotal}
              pixKey={pixKey}
              onConfirm={onConfirmPixPayment}
            />
          )}
          {showSuccessStep && lastOrderId && (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-center">
              <span className="text-6xl animate-in zoom-in duration-300">🎉</span>
              <h3 className="font-serif text-2xl font-extrabold text-foreground">
                Pedido realizado!
              </h3>
              <div className="rounded-full border border-border bg-muted/50 px-5 py-2 font-mono text-sm font-bold tracking-wider text-amber-600">
                {lastOrderId}
              </div>
              <p className="max-w-xs text-sm text-muted-foreground leading-relaxed">
                Seu pedido foi recebido e está sendo preparado. Guarde o código
                acima para acompanhar a entrega!
              </p>
              <Button className="mt-4 font-semibold" onClick={onTrackOrder}>
                📦 Acompanhar Pedido
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
})

const CartItemRow = memo(function CartItemRow({
  item,
  onUpdateQty,
}: {
  item: CartItem
  onUpdateQty: (cartId: string, delta: number) => void
}) {
  return (
    <div className="flex gap-3 border-b border-border py-3.5">
      <img
        src={item.image ?? ""}
        alt=""
        className="h-14 w-14 shrink-0 rounded-xl object-cover"
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-sm">{item.name}</div>
        {item.mods && (
          <div className="text-xs text-muted-foreground">{item.mods}</div>
        )}
        {item.obs && (
          <div className="text-xs text-muted-foreground">📝 {item.obs}</div>
        )}
        <div className="mt-1.5 flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 rounded-lg"
            onClick={() => onUpdateQty(item.cartId, -1)}
          >
            <FiMinus className="size-3" />
          </Button>
          <span className="min-w-[20px] text-center text-sm font-bold">
            {item.qty}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 rounded-lg"
            onClick={() => onUpdateQty(item.cartId, 1)}
          >
            <FiPlus className="size-3" />
          </Button>
        </div>
      </div>
      <div className="shrink-0 font-serif text-sm font-bold text-primary">
        {formatCurrency(item.totalPrice * item.qty)}
      </div>
    </div>
  )
})
