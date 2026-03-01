import type { DayKey } from "../schemas"
import type { StoreConfigData } from "../data/storeData"

const JS_DAY_TO_KEY: Record<number, DayKey> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
}

/** Converte "HH:mm" para minutos desde meia-noite */
function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}

/** Retorna se a loja está aberta no horário atual */
export function isStoreOpen(config: Partial<StoreConfigData>, now?: Date): boolean {
  const hours = config.operatingHours
  if (!hours) return true

  const d = now ?? new Date()
  const dayKey = JS_DAY_TO_KEY[d.getDay()]
  const schedule = hours[dayKey]
  if (!schedule) return false

  const nowMin = d.getHours() * 60 + d.getMinutes()
  const openMin = timeToMinutes(schedule.open)
  const closeMin = timeToMinutes(schedule.close)

  if (closeMin >= openMin) {
    return nowMin >= openMin && nowMin < closeMin
  }
  return nowMin >= openMin || nowMin < closeMin
}

/** Retorna se ainda é possível fazer pedido (antes do cutoff) */
export function canPlaceOrder(config: Partial<StoreConfigData>, now?: Date): boolean {
  const cutoff = config.orderCutoffTime
  if (!cutoff) return true

  const d = now ?? new Date()
  const nowMin = d.getHours() * 60 + d.getMinutes()
  const cutoffMin = timeToMinutes(cutoff)
  return nowMin < cutoffMin
}

/** Retorna status resumido para exibição */
export function getStoreStatus(config: Partial<StoreConfigData>, now?: Date): {
  isOpen: boolean
  canOrder: boolean
  message: string
} {
  const isOpen = isStoreOpen(config, now)
  const canOrder = canPlaceOrder(config, now)

  if (!isOpen) {
    return { isOpen: false, canOrder: false, message: "Fechado" }
  }
  if (!canOrder) {
    return { isOpen: true, canOrder: false, message: "Encerramos pedidos por hoje" }
  }
  return { isOpen: true, canOrder: true, message: "Aberto" }
}
