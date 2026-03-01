import { memo, useCallback, useRef, useState } from "react"
import { FiPlus, FiEdit2, FiTrash2, FiUpload } from "react-icons/fi"
import { useForm, useFieldArray, useFormContext, useWatch, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStoreProducts, useStoreCategories } from "../hooks/useStoreData"
import { newProductSchema, type NewProductValues } from "../schemas"
import { formatCurrency } from "@/features/delivery-store/data/constants"
import type { Product, ProductVariation, ProductExtra } from "@/features/delivery-store/schemas"
import { resizeImageToDataUrl, PRODUCT_IMAGE_MAX } from "../utils/imageUpload"
function VariationOptions({ variationIndex }: { variationIndex: number }) {
  const { control, setValue, getValues } = useFormContext<NewProductValues>()
  const options = useWatch({ control, name: `variations.${variationIndex}.options`, defaultValue: [] }) ?? []

  const addOption = () => {
    const vars = getValues("variations") ?? []
    const v = vars[variationIndex]
    if (!v) return
    const newOpts = [...(v.options ?? []), { label: "", price: 0 }]
    setValue(`variations.${variationIndex}.options`, newOpts)
  }

  const removeOption = (oi: number) => {
    const vars = getValues("variations") ?? []
    const v = vars[variationIndex]
    if (!v) return
    const newOpts = (v.options ?? []).filter((_, i) => i !== oi)
    setValue(`variations.${variationIndex}.options`, newOpts)
  }

  return (
    <div className="space-y-2 rounded border border-border/50 bg-muted/20 p-2">
      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        Opções (label + preço)
        <Button type="button" variant="ghost" size="sm" className="h-6 text-xs" onClick={addOption}>
          <FiPlus className="mr-1 size-3" /> Adicionar
        </Button>
      </div>
      {options.map((_, oi) => (
        <div key={oi} className="flex gap-2 items-center">
          <FormField
            control={control}
            name={`variations.${variationIndex}.options.${oi}.label`}
            render={({ field }) => (
              <FormItem className="flex-1"><FormControl><Input placeholder="Ex: P" {...field} /></FormControl><FormMessage /></FormItem>
            )}
          />
          <FormField
            control={control}
            name={`variations.${variationIndex}.options.${oi}.price`}
            render={({ field }) => (
              <FormItem className="w-20"><FormControl><Input type="number" step="0.01" min={0} placeholder="0" value={field.value ?? ""} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl></FormItem>
            )}
          />
          <Button type="button" variant="ghost" size="icon" className="shrink-0 text-destructive h-8 w-8" onClick={() => removeOption(oi)}><FiTrash2 className="size-4" /></Button>
        </div>
      ))}
    </div>
  )
}

export const ProductsPage = memo(function ProductsPage() {
  const { products, create, update, remove } = useStoreProducts()
  const { categories } = useStoreCategories()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

  const defaultVariations: ProductVariation[] = []
  const defaultExtras: ProductExtra[] = []

  const form = useForm<NewProductValues>({
    resolver: zodResolver(newProductSchema) as Resolver<NewProductValues>,
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      categoryId: 1,
      image: "",
      available: true,
      badge: "",
      variations: defaultVariations,
      extras: defaultExtras,
    },
  })

  const variationsFieldArray = useFieldArray({ control: form.control, name: "variations" })
  const extrasFieldArray = useFieldArray({ control: form.control, name: "extras" })

  const handleOpenNew = useCallback(() => {
    setEditing(null)
    form.reset({
      name: "",
      description: "",
      price: 0,
      categoryId: categories[0]?.id ?? 1,
      image: "",
      available: true,
      badge: "",
      variations: [],
      extras: [],
    })
    setModalOpen(true)
  }, [form, categories])

  const handleOpenEdit = useCallback((prod: Product) => {
    setEditing(prod)
    form.reset({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      categoryId: prod.categoryId,
      image: prod.image ?? "",
      available: prod.available,
      badge: prod.badge ?? "",
      variations: prod.variations ?? [],
      extras: prod.extras ?? [],
    })
    setModalOpen(true)
  }, [form])

  const handleSubmit = useCallback(
    (data: NewProductValues) => {
      const payload = {
        name: data.name,
        description: data.description,
        price: data.price,
        categoryId: data.categoryId,
        image: data.image || undefined,
        available: data.available,
        badge: data.badge || undefined,
        variations: data.variations ?? [],
        extras: data.extras ?? [],
      }
      if (editing) {
        update(editing.id, payload)
      } else {
        create(payload)
      }
      setModalOpen(false)
    },
    [editing, create, update]
  )

  const handleDelete = useCallback((id: number) => {
    if (confirm("Excluir este produto?")) remove(id)
  }, [remove])

  const getCategoryName = (catId: number) => categories.find((c) => c.id === catId)?.name ?? `#${catId}`

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-extrabold text-foreground">Produtos</h1>
          <p className="mt-1 text-muted-foreground">Gerencie os produtos do cardápio</p>
        </div>
        <Button onClick={handleOpenNew}><FiPlus className="mr-2 size-4" />Novo produto</Button>
      </div>
      <div className="space-y-4">
        {products.map((prod) => (
          <Card key={prod.id}>
            <CardContent className="flex items-center gap-4 p-4">
              <img src={prod.image ?? ""} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{prod.name}</span>
                  {prod.badge && <Badge variant="secondary" className="text-xs">{prod.badge}</Badge>}
                  {!prod.available && <Badge variant="destructive">Indisponível</Badge>}
                </div>
                <div className="truncate text-sm text-muted-foreground">{prod.description}</div>
                <div className="mt-1 flex items-center gap-3 text-sm">
                  <span className="font-semibold text-primary">{formatCurrency(prod.price)}</span>
                  <span className="text-muted-foreground">{getCategoryName(prod.categoryId)}</span>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="outline" size="icon" onClick={() => handleOpenEdit(prod)}><FiEdit2 className="size-4" /></Button>
                <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(prod.id)}><FiTrash2 className="size-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Editar produto" : "Novo produto"}</DialogTitle></DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Nome</FormLabel><FormControl><Input placeholder="Ex: Boi Clássico" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Descrição</FormLabel><FormControl><Input placeholder="Descrição" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="price" render={({ field }) => (
                  <FormItem><FormLabel>Preço (R$)</FormLabel><FormControl><Input type="number" step="0.01" min={0} placeholder="29.90" value={field.value || ""} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="categoryId" render={({ field }) => (
                  <FormItem><FormLabel>Categoria</FormLabel><Select value={String(field.value)} onValueChange={(v) => field.onChange(parseInt(v))}>
                    <FormControl><SelectTrigger className="w-full"><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                    <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent>
                  </Select><FormMessage /></FormItem>
                )} />
              </div>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagem do produto</FormLabel>
                    <FormControl>
                      <ProductImageUpload value={field.value ?? ""} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="available" render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0 rounded-md border p-4"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal !mt-0">Disponível</FormLabel><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="badge" render={({ field }) => (
                <FormItem><FormLabel>Badge (opcional)</FormLabel><FormControl><Input placeholder="Mais Pedido" {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              {/* Variações (ex: tamanho) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FormLabel>Variações</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => variationsFieldArray.append({ name: "Tamanho", required: false, options: [] })}
                  >
                    <FiPlus className="mr-1 size-3" /> Adicionar
                  </Button>
                </div>
                {variationsFieldArray.fields.map((v, vi) => (
                  <Card key={v.id} className="p-3">
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <FormField
                          control={form.control}
                          name={`variations.${vi}.name`}
                          render={({ field }) => (
                            <FormItem className="flex-1"><FormControl><Input placeholder="Ex: Tamanho" {...field} /></FormControl><FormMessage /></FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`variations.${vi}.required`}
                          render={({ field }) => (
                            <FormItem className="flex shrink-0 items-center gap-1 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs">Obrigatório</FormLabel></FormItem>
                          )}
                        />
                        <Button type="button" variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => variationsFieldArray.remove(vi)}><FiTrash2 className="size-4" /></Button>
                      </div>
                      <VariationOptions variationIndex={vi} />
                    </div>
                  </Card>
                ))}
              </div>

              {/* Adicionais */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FormLabel>Adicionais</FormLabel>
                  <Button type="button" variant="outline" size="sm" onClick={() => extrasFieldArray.append({ label: "", price: 0 })}>
                    <FiPlus className="mr-1 size-3" /> Adicionar
                  </Button>
                </div>
                {extrasFieldArray.fields.map((e, ei) => (
                  <div key={e.id} className="flex gap-2 items-center">
                    <FormField
                      control={form.control}
                      name={`extras.${ei}.label`}
                      render={({ field }) => (
                        <FormItem className="flex-1"><FormControl><Input placeholder="Ex: Bacon extra" {...field} /></FormControl><FormMessage /></FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`extras.${ei}.price`}
                      render={({ field }) => (
                        <FormItem className="w-24"><FormControl><Input type="number" step="0.01" min={0} placeholder="0" value={field.value ?? ""} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl><FormMessage /></FormItem>
                      )}
                    />
                    <Button type="button" variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => extrasFieldArray.remove(ei)}><FiTrash2 className="size-4" /></Button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
                <Button type="submit">{editing ? "Salvar" : "Criar"}</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
})

function ProductImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      e.target.value = ""
      if (!file) return
      if (!file.type.startsWith("image/")) {
        setError("Selecione uma imagem (JPG, PNG ou GIF)")
        return
      }
      setError(null)
      setLoading(true)
      resizeImageToDataUrl(file, PRODUCT_IMAGE_MAX.width, PRODUCT_IMAGE_MAX.height)
        .then(onChange)
        .catch(() => setError("Erro ao processar imagem"))
        .finally(() => setLoading(false))
    },
    [onChange]
  )

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleChange}
      />
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 p-4 transition-colors hover:border-primary/50 hover:bg-muted/50 cursor-pointer min-h-[120px]"
      >
        {value ? (
          <img
            src={value}
            alt=""
            className="h-20 w-20 rounded-lg object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ) : (
          <FiUpload className="size-8 text-muted-foreground" />
        )}
        <span className="text-xs text-muted-foreground">
          {loading ? "Processando…" : value ? "Clique para trocar" : "Clique para enviar (JPG, PNG ou WebP)"}
        </span>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
