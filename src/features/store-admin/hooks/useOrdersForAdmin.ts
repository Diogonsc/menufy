import { useOrders } from "@/features/delivery-store/hooks/useOrders"

export function useOrdersForAdmin() {
  const { orders, advanceStatus } = useOrders()
  return { orders, advanceStatus }
}
