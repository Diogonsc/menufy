import { memo, useCallback, useState } from "react"
import { FiCopy, FiCheck } from "react-icons/fi"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "../data/constants"

/**
 * Gera um payload PIX (copia e cola) para demonstração.
 * Em produção isso viria do backend (gateway de pagamento).
 */
function buildPixPayload(orderId: string, total: number): string {
  const amount = total.toFixed(2)
  const amountLen = amount.length.toString().padStart(2, "0")
  // Payload no formato BR Code (simplificado para demo; em produção use o retorno da API de pagamento)
  return `00020126580014br.gov.bcb.pix0136${orderId}52040000530398654${amountLen}${amount}5802BR5925MENUFY DEMO6009SAO PAULO62070503***6304`
}

interface PixPaymentStepProps {
  orderId: string
  total: number
  pixKey: string | undefined
  onConfirm: () => void
}

export const PixPaymentStep = memo(function PixPaymentStep({
  orderId,
  total,
  pixKey,
  onConfirm,
}: PixPaymentStepProps) {
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)

  const pixPayload = buildPixPayload(orderId, total)

  const copyToClipboard = useCallback(async (text: string, type: "code" | "key") => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === "code") {
        setCopiedCode(true)
        setTimeout(() => setCopiedCode(false), 2000)
      } else {
        setCopiedKey(true)
        setTimeout(() => setCopiedKey(false), 2000)
      }
    } catch {
      // fallback para navegadores antigos
      const ta = document.createElement("textarea")
      ta.value = text
      ta.style.position = "fixed"
      document.body.appendChild(ta)
      ta.select()
      document.execCommand("copy")
      document.body.removeChild(ta)
      if (type === "code") setCopiedCode(true)
      else setCopiedKey(true)
      setTimeout(() => {
        setCopiedCode(false)
        setCopiedKey(false)
      }, 2000)
    }
  }, [])

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-6">
      <p className="mb-4 text-center text-sm text-muted-foreground">
        Escaneie o QR Code no app do seu banco ou copie o código/chave para pagar.
      </p>

      <div className="mb-6 flex flex-col items-center gap-4">
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <QRCodeSVG value={pixPayload} size={220} level="M" className="rounded-lg" />
        </div>
        <p className="font-serif text-xl font-bold text-primary">{formatCurrency(total)}</p>
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between gap-2 font-medium"
          onClick={() => copyToClipboard(pixPayload, "code")}
        >
          <span className="truncate text-left">Copiar código PIX (copia e cola)</span>
          {copiedCode ? (
            <FiCheck className="size-5 shrink-0 text-green-600" />
          ) : (
            <FiCopy className="size-5 shrink-0" />
          )}
        </Button>

        {pixKey && pixKey.trim() && (
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between gap-2 font-medium"
            onClick={() => copyToClipboard(pixKey.trim(), "key")}
          >
            <span className="truncate text-left">Copiar chave PIX da loja</span>
            {copiedKey ? (
              <FiCheck className="size-5 shrink-0 text-green-600" />
            ) : (
              <FiCopy className="size-5 shrink-0" />
            )}
          </Button>
        )}

        <p className="text-center text-xs text-muted-foreground">
          {pixKey?.trim()
            ? "Use o código no app do banco para pagar o valor acima, ou copie a chave e informe o valor ao pagar."
            : "Cole o código no app do seu banco para concluir o pagamento do valor acima."}
        </p>
      </div>

      <div className="mt-6">
        <Button className="w-full font-semibold" onClick={onConfirm}>
          Já fiz o pagamento →
        </Button>
      </div>
    </div>
  )
})
