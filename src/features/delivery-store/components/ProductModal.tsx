import { memo, useCallback, useMemo, useState } from "react"
import { FiMinus, FiPlus, FiCheck, FiX } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "../data/constants"
import type { Product, ProductExtra, ProductVariation, ProductVariationOption } from "../schemas"

interface ProductModalProps {
  product: Product
  onClose: () => void
  onAdd: (item: {
    id: number
    name: string
    price: number
    totalPrice: number
    qty: number
    image?: string | null
    mods?: string
    obs?: string
  }) => void
}

export const ProductModal = memo(function ProductModal({
  product,
  onClose,
  onAdd,
}: ProductModalProps) {
  const [qty, setQty] = useState(1)
  const [selectedVars, setSelectedVars] = useState<
    Record<string, ProductVariationOption>
  >({})
  const [selectedExtras, setSelectedExtras] = useState<ProductExtra[]>([])
  const [obs, setObs] = useState("")

  const varExtra = useMemo(
    () =>
      Object.values(selectedVars).reduce((s, v) => s + (v?.price ?? 0), 0),
    [selectedVars]
  )
  const extrasExtra = useMemo(
    () => selectedExtras.reduce((s, e) => s + e.price, 0),
    [selectedExtras]
  )
  const unitPrice = product.price + varExtra + extrasExtra
  const totalPrice = unitPrice * qty

  const allRequiredFilled = (product.variations ?? [])
    .filter((v) => v.required)
    .every((v) => selectedVars[v.name])

  const toggleExtra = useCallback((extra: ProductExtra) => {
    setSelectedExtras((prev) =>
      prev.find((e) => e.label === extra.label)
        ? prev.filter((e) => e.label !== extra.label)
        : [...prev, extra]
    )
  }, [])

  const handleAdd = useCallback(() => {
    const mods = [
      ...Object.entries(selectedVars).map(([, v]) => v?.label),
      ...selectedExtras.map((e) => "+" + e.label),
    ]
      .filter(Boolean)
      .join(", ")

    onAdd({
      id: product.id,
      name: product.name,
      price: product.price,
      totalPrice: unitPrice,
      qty,
      image: product.image,
      mods: mods || undefined,
      obs: obs || undefined,
    })
    onClose()
  }, [
    product,
    selectedVars,
    selectedExtras,
    obs,
    qty,
    unitPrice,
    onAdd,
    onClose,
  ])

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/55"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative h-[100dvh] max-h-[100dvh] md:max-h-[92vh] md:h-auto w-full max-w-[480px] overflow-y-auto rounded-t-3xl bg-background pb-8 animate-in slide-in-from-bottom duration-300">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="absolute right-3 top-3 z-10 size-10 rounded-full shadow-md"
          onClick={onClose}
          aria-label="Fechar"
        >
          <FiX className="size-5" />
        </Button>
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="h-[300px] min-h-[300px] sm:h-[340px] sm:min-h-[340px] w-full shrink-0 object-cover"
          />
        )}
        <div className="p-5">
          <h2 className="font-serif text-xl font-extrabold text-foreground">
            {product.name}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </p>
          <p className="mt-2.5 font-serif text-2xl font-bold text-primary">
            {formatCurrency(product.price)}
          </p>

          {(product.variations ?? []).map((v) => (
            <VariationSection
              key={v.name}
              variation={v}
              selected={selectedVars[v.name]}
              onSelect={(opt) =>
                setSelectedVars((prev) => ({ ...prev, [v.name]: opt }))
              }
            />
          ))}

          {(product.extras ?? []).length > 0 && (
            <>
              <hr className="my-4 border-border" />
              <p className="mb-2 font-semibold text-sm">
                Adicionais <span className="font-normal text-muted-foreground">Opcional</span>
              </p>
              <div className="space-y-1.5">
                {product.extras!.map((ex) => {
                  const isOn = selectedExtras.some((e) => e.label === ex.label)
                  return (
                    <Button
                      key={ex.label}
                      type="button"
                      variant="outline"
                      onClick={() => toggleExtra(ex)}
                      className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 h-auto transition-colors ${
                        isOn
                          ? "border-amber-400 bg-amber-50/60"
                          : "border-border"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-md border text-[10px] ${
                            isOn
                              ? "border-amber-400 bg-amber-400 text-white"
                              : "border-border"
                          }`}
                        >
                          {isOn && <FiCheck className="size-3" />}
                        </span>
                        <span className="font-semibold text-sm">{ex.label}</span>
                      </span>
                      <span className="text-xs font-bold text-muted-foreground">
                        +{formatCurrency(ex.price)}
                      </span>
                    </Button>
                  )
                })}
              </div>
            </>
          )}

          <hr className="my-4 border-border" />
          <p className="mb-2 font-semibold text-sm">
            Observações <span className="font-normal text-muted-foreground">Opcional</span>
          </p>
          <Textarea
            placeholder="Ex: sem cebola, molho à parte..."
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            className="min-h-[80px] resize-none"
          />

          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-xl"
                disabled={qty <= 1}
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <FiMinus className="size-5" />
              </Button>
              <span className="min-w-[24px] text-center font-serif text-lg font-bold">
                {qty}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-xl"
                onClick={() => setQty((q) => q + 1)}
              >
                <FiPlus className="size-5" />
              </Button>
            </div>
            <Button
              disabled={!allRequiredFilled}
              className="flex-1 font-semibold"
              onClick={handleAdd}
            >
              Adicionar · {formatCurrency(totalPrice)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
})

function VariationSection({
  variation,
  selected,
  onSelect,
}: {
  variation: ProductVariation
  selected?: ProductVariationOption
  onSelect: (opt: ProductVariationOption) => void
}) {
  return (
    <>
      <hr className="my-4 border-border" />
      <div className="mb-2 flex items-center justify-between">
        <span className="font-semibold text-sm">{variation.name}</span>
        {variation.required && (
          <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
            Obrigatório
          </span>
        )}
      </div>
      <div className="space-y-1.5">
        {variation.options.map((opt) => {
          const isOn = selected?.label === opt.label
          return (
            <Button
              key={opt.label}
              type="button"
              variant="outline"
              onClick={() => onSelect(opt)}
              className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 h-auto transition-colors ${
                isOn ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span
                  className={`h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center ${
                    isOn ? "border-primary bg-primary" : "border-border"
                  }`}
                >
                  {isOn && (
                    <span className="h-2 w-2 rounded-full bg-white" />
                  )}
                </span>
                <span className="font-semibold text-sm">{opt.label}</span>
              </span>
              <span className="text-xs font-bold text-muted-foreground">
                {opt.price > 0 ? "+" + formatCurrency(opt.price) : "Incluso"}
              </span>
            </Button>
          )
        })}
      </div>
    </>
  )
}
