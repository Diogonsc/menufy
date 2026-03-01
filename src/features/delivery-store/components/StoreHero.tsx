import { memo } from "react"
import { FiClock, FiTruck, FiStar, FiPackage } from "react-icons/fi"
import { useQuery } from "@tanstack/react-query"
import { loadConfig } from "@/features/store-admin/data/storeData"
import { getStoreStatus } from "@/features/store-admin/utils/storeStatus"
import { STORE, formatCurrency } from "../data/constants"

export const StoreHero = memo(function StoreHero() {
  const { data: config } = useQuery({
    queryKey: ["store-admin", "config"],
    queryFn: loadConfig,
    initialData: loadConfig(),
  })
  const status = getStoreStatus(config ?? {})
  const banner = config?.banner ?? STORE.banner
  const avatar = config?.avatar ?? STORE.avatar
  const deliveryTime = config?.deliveryTime ?? STORE.deliveryTime
  const deliveryFee = config?.deliveryFee ?? STORE.deliveryFee
  const minOrder = config?.minOrder ?? STORE.minOrder

  return (
    <div className="relative border-b bg-background">
      {/* Banner: só imagem + overlay, com overflow para não vazar */}
      <div className="relative h-[200px] w-full overflow-hidden">
        <img
          src={banner}
          alt=""
          className="h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,.6))",
          }}
        />
      </div>
      {/* Avatar: fora do banner, próprio stacking context com z-index alto */}
      <div
        className="absolute left-1/2 top-[200px] z-[100] -translate-x-1/2 -translate-y-1/2"
        style={{ marginTop: 0 }}
      >
        <div className="rounded-full bg-gradient-to-br from-amber-400 to-primary p-[3px] shadow-lg">
          <img
            src={avatar}
            alt=""
            className="h-20 w-20 rounded-full border-4 border-background object-cover bg-background"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </div>
      </div>
      {/* Conteúdo da loja: fica atrás do avatar por causa do z-[100] acima */}
      <div className="relative z-10 pt-12 pb-5 text-center">
        <h1 className="font-serif text-xl font-extrabold text-foreground">
          {STORE.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{STORE.tagline}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
              status.isOpen && status.canOrder
                ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border border-red-200 bg-red-50 text-red-800"
            }`}
          >
            <span
              className={`size-2 rounded-full ${status.isOpen && status.canOrder ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}
            />
            {status.message}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
            <FiClock className="size-3" />
            {deliveryTime}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
            <FiTruck className="size-3" />
            {formatCurrency(deliveryFee)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <FiStar className="size-3" />
            {STORE.rating} ({STORE.reviews})
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
            <FiPackage className="size-3" />
            Mín. {formatCurrency(minOrder)}
          </span>
        </div>
      </div>
    </div>
  )
})
