import { memo } from "react"
import {
  FiClock,
  FiMapPin,
  FiDollarSign,
  FiCreditCard,
  FiSmartphone,
  FiMessageCircle,
  FiInstagram,
  FiFacebook,
} from "react-icons/fi"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { STORE, formatCurrency } from "../data/constants"
import { getStoreStatus } from "@/features/store-admin/utils/storeStatus"
import type { StoreConfigData } from "@/features/store-admin/data/storeData"

const CARD_BRANDS = "Visa, Mastercard, Elo"

interface StoreInfoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  config: StoreConfigData | null
}

export const StoreInfoModal = memo(function StoreInfoModal({
  open,
  onOpenChange,
  config,
}: StoreInfoModalProps) {
  const status = getStoreStatus(config ?? {})
  const storeName = config?.storeName?.trim() || STORE.name
  const storeDescription = config?.storeDescription?.trim() || STORE.tagline
  const storeAddress = config?.storeAddress?.trim() || STORE.address
  const whatsapp = config?.whatsapp?.trim() || STORE.whatsapp
  const instagram = config?.instagram?.trim()
  const facebook = config?.facebook?.trim()
  const accepted = config?.acceptedPaymentMethods ?? {
    pix: true,
    card: true,
    cash: true,
  }

  const hasSocial = whatsapp || instagram || facebook

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-extrabold text-foreground">
            {storeName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5 pt-2">
          {storeDescription && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {storeDescription}
            </p>
          )}

          <div
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium ${
              status.isOpen && status.canOrder
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            <span
              className={`size-2.5 rounded-full ${
                status.isOpen && status.canOrder ? "bg-emerald-500 animate-pulse" : "bg-red-500"
              }`}
            />
            {status.message}
          </div>

          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Formas de pagamento
            </h4>
            <ul className="space-y-2">
              {accepted.cash && (
                <li className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                  <FiDollarSign className="size-5 shrink-0 text-emerald-600" />
                  <span className="font-medium text-foreground">Dinheiro</span>
                </li>
              )}
              {accepted.card && (
                <li className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                  <FiCreditCard className="size-5 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <span className="font-medium text-foreground">Crédito e Débito</span>
                    <p className="text-xs text-muted-foreground">{CARD_BRANDS}</p>
                  </div>
                </li>
              )}
              {accepted.pix && (
                <li className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                  <FiSmartphone className="size-5 shrink-0 text-teal-600" />
                  <span className="font-medium text-foreground">PIX</span>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <FiMapPin className="size-3.5" />
              Endereço da loja
            </h4>
            <p className="rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm text-foreground">
              {storeAddress}
            </p>
          </div>

          {hasSocial && (
            <div>
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Redes sociais
              </h4>
              <div className="flex flex-wrap gap-2">
                {whatsapp && (
                  <a
                    href={`https://wa.me/55${whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
                  >
                    <FiMessageCircle className="size-4 text-green-600" />
                    WhatsApp
                  </a>
                )}
                {instagram && (
                  <a
                    href={
                      instagram.startsWith("http")
                        ? instagram
                        : `https://instagram.com/${instagram.replace(/^@/, "")}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
                  >
                    <FiInstagram className="size-4 text-pink-600" />
                    Instagram
                  </a>
                )}
                {facebook && (
                  <a
                    href={
                      facebook.startsWith("http") ? facebook : `https://facebook.com/${facebook}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
                  >
                    <FiFacebook className="size-4 text-blue-600" />
                    Facebook
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <FiClock className="size-3.5" />
              Entrega: {config?.deliveryTime ?? STORE.deliveryTime}
            </span>
            <span>•</span>
            <span>Taxa de entrega: {formatCurrency(config?.deliveryFee ?? STORE.deliveryFee)}</span>
            <span>•</span>
            <span>Ped. mínimo: {formatCurrency(config?.minOrder ?? STORE.minOrder)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
})
