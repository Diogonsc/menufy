import { memo, useCallback, useRef, useState } from "react"
import { FiSave, FiKey, FiClock, FiPackage, FiImage, FiCreditCard, FiUpload, FiInfo, FiMapPin, FiMessageCircle } from "react-icons/fi"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { useStoreConfig } from "../hooks/useStoreData"
import { storeConfigSchema, type StoreConfig, type DayKey } from "../schemas"
import { INITIAL_CONFIG, type StoreConfigData } from "../data/storeData"
import { resizeImageToDataUrl, BANNER_MAX, AVATAR_MAX } from "../utils/imageUpload"

const DAY_LABELS: Record<DayKey, string> = {
  monday: "Segunda-feira",
  tuesday: "Terça-feira",
  wednesday: "Quarta-feira",
  thursday: "Quinta-feira",
  friday: "Sexta-feira",
  saturday: "Sábado",
  sunday: "Domingo",
}

const DAYS: DayKey[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

export const SettingsPage = memo(function SettingsPage() {
  const { config, update } = useStoreConfig()

  const validTypes = ["cpf", "cnpj", "email", "phone", "random"] as const
  const pixKeyType = config.pixKeyType && validTypes.includes(config.pixKeyType as (typeof validTypes)[number])
    ? (config.pixKeyType as (typeof validTypes)[number])
    : "email"

  const operatingHours = config.operatingHours ?? INITIAL_CONFIG.operatingHours
  const orderCutoffTime = config.orderCutoffTime ?? INITIAL_CONFIG.orderCutoffTime
  const banner = config.banner ?? INITIAL_CONFIG.banner
  const avatar = config.avatar ?? INITIAL_CONFIG.avatar
  const deliveryFee = config.deliveryFee ?? INITIAL_CONFIG.deliveryFee
  const minOrder = config.minOrder ?? INITIAL_CONFIG.minOrder
  const deliveryTime = config.deliveryTime ?? INITIAL_CONFIG.deliveryTime
  const acceptedPaymentMethods = config.acceptedPaymentMethods ?? INITIAL_CONFIG.acceptedPaymentMethods

  const form = useForm<StoreConfig>({
    resolver: zodResolver(storeConfigSchema),
    defaultValues: {
      pixKey: config.pixKey ?? "",
      pixKeyType,
      orderCutoffTime,
    },
    values: {
      pixKey: config.pixKey ?? "",
      pixKeyType,
      orderCutoffTime,
    },
  })

  const handleSubmit = useCallback(
    (data: StoreConfig) => {
      update({
        pixKey: data.pixKey ?? "",
        pixKeyType: data.pixKeyType ?? "email",
        orderCutoffTime: data.orderCutoffTime ?? orderCutoffTime,
      })
    },
    [update, orderCutoffTime]
  )

  const handlePaymentMethodChange = useCallback(
    (id: "pix" | "card" | "cash", enabled: boolean) => {
      const next = { ...acceptedPaymentMethods, [id]: enabled }
      if (!next.pix && !next.card && !next.cash) return
      update({ acceptedPaymentMethods: next })
    },
    [acceptedPaymentMethods, update]
  )

  const handleDayChange = useCallback(
    (day: DayKey, enabled: boolean, open?: string, close?: string) => {
      const openTime = open ?? "11:00"
      const closeTime = close ?? "22:00"
      const next: StoreConfigData["operatingHours"] = {
        ...operatingHours,
        [day]: enabled ? { open: openTime, close: closeTime } : null,
      }
      update({ operatingHours: next })
    },
    [operatingHours, update]
  )

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-extrabold text-foreground">
        Configurações
      </h1>
      <p className="mb-8 text-muted-foreground">
        Configure pagamentos, horários e limites de pedidos
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 max-w-auto">
        <Card>
          <CardContent className="p-6">
            <div className="mb-2 flex items-center gap-2">
              <FiImage className="size-5 text-primary" />
              <h2 className="font-semibold text-foreground">Identidade e Entrega</h2>
            </div>
            <p className="mb-6 text-sm text-muted-foreground">
              Imagens da loja e regras de entrega exibidas ao cliente.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const deliveryFeeVal = parseFloat((formData.get("deliveryFee") as string) || "0") || deliveryFee
                const minOrderVal = parseFloat((formData.get("minOrder") as string) || "0") || minOrder
                const deliveryTimeVal = (formData.get("deliveryTime") as string) || deliveryTime
                update({
                  deliveryFee: deliveryFeeVal,
                  minOrder: minOrderVal,
                  deliveryTime: deliveryTimeVal,
                })
              }}
              className="space-y-6"
            >
              {/* Identidade visual */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Identidade visual</h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  <ImageUploadField
                    label="Banner da loja"
                    hint="Imagem exibida no topo da página. Recomendado: 800×400px"
                    value={banner}
                    maxSize={BANNER_MAX}
                    previewClass="aspect-[2/1] w-full rounded-lg object-cover"
                    onUpload={(dataUrl) => update({ banner: dataUrl })}
                  />
                  <ImageUploadField
                    label="Foto do perfil"
                    hint="Logo ou foto da loja. Quadrada, ex: 200×200px"
                    value={avatar}
                    maxSize={AVATAR_MAX}
                    previewClass="aspect-square w-24 rounded-full object-cover"
                    onUpload={(dataUrl) => update({ avatar: dataUrl })}
                  />
                </div>
              </div>

              <Separator />

              {/* Entrega */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Entrega</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Taxa de entrega (R$)</Label>
                    <Input
                      name="deliveryFee"
                      type="number"
                      step="0.01"
                      min={0}
                      placeholder="5,90"
                      defaultValue={deliveryFee}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Pedido mínimo (R$)</Label>
                    <Input
                      name="minOrder"
                      type="number"
                      step="0.01"
                      min={0}
                      placeholder="25,00"
                      defaultValue={minOrder}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Tempo de preparo</Label>
                    <Input
                      name="deliveryTime"
                      type="text"
                      placeholder="30–45 min"
                      defaultValue={deliveryTime}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit">
                <FiSave className="mr-2 size-4" />
                Salvar
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-6 flex items-center gap-2">
              <FiClock className="size-5 text-primary" />
              <h2 className="font-semibold text-foreground">Horário de funcionamento</h2>
            </div>
            <p className="mb-6 text-sm text-muted-foreground">
              Defina os dias e horários em que sua loja está aberta. Os clientes verão se está aberto ou fechado.
            </p>
            <div className="space-y-4">
              {DAYS.map((day) => {
                const schedule = operatingHours[day]
                const enabled = !!schedule
                return (
                  <DayRow
                    key={day}
                    label={DAY_LABELS[day]}
                    enabled={enabled}
                    open={schedule?.open ?? "11:00"}
                    close={schedule?.close ?? "22:00"}
                    onToggle={(checked) => handleDayChange(day, checked, schedule?.open, schedule?.close)}
                    onTimeChange={(open, close) => handleDayChange(day, enabled, open, close)}
                  />
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-6 flex items-center gap-2">
              <FiPackage className="size-5 text-primary" />
              <h2 className="font-semibold text-foreground">Limite para pedidos</h2>
            </div>
            <p className="mb-6 text-sm text-muted-foreground">
              Horário limite para aceitar pedidos de entrega. Após esse horário, novos pedidos não serão aceitos.
            </p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-wrap items-end gap-4">
                <FormField
                  control={form.control}
                  name="orderCutoffTime"
                  render={({ field }) => (
                    <FormItem className="min-w-[160px]">
                      <FormLabel>Pedidos aceitos até</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">
                  <FiSave className="mr-2 size-4" />
                  Salvar
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-6 flex items-center gap-2">
              <FiInfo className="size-5 text-primary" />
              <h2 className="font-semibold text-foreground">Informações da loja</h2>
            </div>
            <p className="mb-6 text-sm text-muted-foreground">
              Nome, descrição, endereço e redes sociais exibidos no modal de informações para o cliente.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                update({
                  storeName: (formData.get("storeName") as string) || "",
                  storeDescription: (formData.get("storeDescription") as string) || "",
                  storeAddress: (formData.get("storeAddress") as string) || "",
                  whatsapp: (formData.get("whatsapp") as string) || "",
                  instagram: (formData.get("instagram") as string) || "",
                  facebook: (formData.get("facebook") as string) || "",
                })
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label className="text-muted-foreground">Nome da loja</Label>
                <Input
                  name="storeName"
                  placeholder="Ex: Boi Burguer"
                  defaultValue={config.storeName ?? ""}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Descrição / slogan</Label>
                <Input
                  name="storeDescription"
                  placeholder="Ex: Hambúrgueres artesanais na sua porta"
                  defaultValue={config.storeDescription ?? ""}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5 text-muted-foreground">
                  <FiMapPin className="size-3.5" />
                  Endereço da loja
                </Label>
                <Input
                  name="storeAddress"
                  placeholder="Rua, número, bairro, cidade"
                  defaultValue={config.storeAddress ?? ""}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5 text-muted-foreground">
                  <FiMessageCircle className="size-3.5" />
                  WhatsApp (com DDD, só números ou com formatação)
                </Label>
                <Input
                  name="whatsapp"
                  placeholder="(11) 99999-0000"
                  defaultValue={config.whatsapp ?? ""}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Instagram (@usuario ou link)</Label>
                <Input
                  name="instagram"
                  placeholder="@minhaloja ou https://instagram.com/minhaloja"
                  defaultValue={config.instagram ?? ""}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Facebook (link ou nome da página)</Label>
                <Input
                  name="facebook"
                  placeholder="https://facebook.com/minhaloja"
                  defaultValue={config.facebook ?? ""}
                  className="w-full"
                />
              </div>
              <Button type="submit">
                <FiSave className="mr-2 size-4" />
                Salvar informações
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-6 flex items-center gap-2">
              <FiCreditCard className="size-5 text-primary" />
              <h2 className="font-semibold text-foreground">Métodos de pagamento</h2>
            </div>
            <p className="mb-6 text-sm text-muted-foreground">
              Selecione os métodos de pagamento que sua loja aceita. Apenas os marcados serão exibidos ao cliente.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-lg border border-border p-4">
                <Checkbox
                  id="pay-pix"
                  checked={acceptedPaymentMethods.pix}
                  onCheckedChange={(v) => handlePaymentMethodChange("pix", v === true)}
                />
                <label htmlFor="pay-pix" className="text-sm font-medium cursor-pointer">
                  PIX
                </label>
                <span className="text-xs text-muted-foreground">Aprovação instantânea</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border p-4">
                <Checkbox
                  id="pay-card"
                  checked={acceptedPaymentMethods.card}
                  onCheckedChange={(v) => handlePaymentMethodChange("card", v === true)}
                />
                <label htmlFor="pay-card" className="text-sm font-medium cursor-pointer">
                  Cartão na entrega
                </label>
                <span className="text-xs text-muted-foreground">Débito ou crédito</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border p-4">
                <Checkbox
                  id="pay-cash"
                  checked={acceptedPaymentMethods.cash}
                  onCheckedChange={(v) => handlePaymentMethodChange("cash", v === true)}
                />
                <label htmlFor="pay-cash" className="text-sm font-medium cursor-pointer">
                  Dinheiro
                </label>
                <span className="text-xs text-muted-foreground">Troco se necessário</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-6 flex items-center gap-2">
              <FiKey className="size-5 text-primary" />
              <h2 className="font-semibold text-foreground">Chave PIX</h2>
            </div>
            <p className="mb-6 text-sm text-muted-foreground">
              Cadastre sua chave PIX para que os clientes possam pagar pelos
              pedidos. A chave será exibida após a confirmação do pedido.
            </p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="pixKeyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de chave</FormLabel>
                      <Select
                        value={field.value ?? "email"}
                        onValueChange={(v) => field.onChange(v as StoreConfig["pixKeyType"])}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="email">E-mail</SelectItem>
                          <SelectItem value="cpf">CPF</SelectItem>
                          <SelectItem value="cnpj">CNPJ</SelectItem>
                          <SelectItem value="phone">Telefone</SelectItem>
                          <SelectItem value="random">Chave aleatória</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pixKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chave PIX</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="seu@email.com ou 123.456.789-00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">
                  <FiSave className="mr-2 size-4" />
                  Salvar configurações
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
})

function ImageUploadField({
  label,
  hint,
  value,
  maxSize,
  previewClass,
  onUpload,
}: {
  label: string
  hint: string
  value: string
  maxSize: { width: number; height: number }
  previewClass: string
  onUpload: (dataUrl: string) => void
}) {
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
      resizeImageToDataUrl(file, maxSize.width, maxSize.height)
        .then(onUpload)
        .catch(() => setError("Erro ao processar imagem"))
        .finally(() => setLoading(false))
    },
    [maxSize, onUpload]
  )

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <p className="text-xs text-muted-foreground">{hint}</p>
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
        className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/30 p-4 transition-colors hover:border-primary/50 hover:bg-muted/50 cursor-pointer"
      >
        {value ? (
          <img
            src={value}
            alt=""
            className={previewClass}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 py-4 text-muted-foreground">
            <FiUpload className="size-8" />
            <span className="text-sm font-medium">Clique para enviar</span>
          </div>
        )}
        <span className="text-xs text-muted-foreground">
          {loading ? "Processando…" : value ? "Clique para trocar" : "JPG, PNG ou WebP"}
        </span>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

function DayRow({
  label,
  enabled,
  open,
  close,
  onToggle,
  onTimeChange,
}: {
  label: string
  enabled: boolean
  open: string
  close: string
  onToggle: (checked: boolean) => void
  onTimeChange: (open: string, close: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border p-4">
      <div className="flex min-w-[140px] items-center gap-2">
        <Checkbox
          id={label}
          checked={enabled}
          onCheckedChange={(v) => onToggle(v === true)}
        />
        <label htmlFor={label} className="text-sm font-medium cursor-pointer">
          {label}
        </label>
      </div>
      {enabled && (
        <div className="flex items-center gap-2">
          <Input
            type="time"
            value={open}
            onChange={(e) => onTimeChange(e.target.value, close)}
            className="w-28"
          />
          <span className="text-muted-foreground">até</span>
          <Input
            type="time"
            value={close}
            onChange={(e) => onTimeChange(open, e.target.value)}
            className="w-28"
          />
        </div>
      )}
      {!enabled && (
        <span className="text-sm text-muted-foreground">Fechado</span>
      )}
    </div>
  )
}
