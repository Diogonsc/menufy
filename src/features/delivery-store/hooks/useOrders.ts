import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Order } from "../schemas"
import { STATUS } from "../data/constants"

const ORDERS_QUERY_KEY = ["orders"] as const

/** Mock API para operações de pedidos (será substituído por API real) */
async function fetchOrders(): Promise<Order[]> {
  return []
}

async function createOrder(order: Order): Promise<Order> {
  await new Promise((r) => setTimeout(r, 300))
  return order
}

async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<Order> {
  await new Promise((r) => setTimeout(r, 200))
  return { id: orderId, status } as Order
}

export function useOrders() {
  const queryClient = useQueryClient()

  const { data: orders = [] } = useQuery({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: fetchOrders,
    initialData: [],
  })

  const createMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (newOrder) => {
      queryClient.setQueryData<Order[]>(ORDERS_QUERY_KEY, (prev = []) => [
        newOrder,
        ...prev,
      ])
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: Order["status"] }) =>
      updateOrderStatus(orderId, status),
    onSuccess: (updated) => {
      queryClient.setQueryData<Order[]>(ORDERS_QUERY_KEY, (prev = []) =>
        prev.map((o) => (o.id === updated.id ? { ...o, status: updated.status } : o))
      )
    },
  })

  const addOrder = (order: Order) => createMutation.mutate(order)

  const advanceStatus = (orderId: string) => {
    const currentOrders =
      queryClient.getQueryData<Order[]>(ORDERS_QUERY_KEY) ?? []
    const order = currentOrders.find((o) => o.id === orderId)
    if (!order) return
    const next = STATUS[order.status as keyof typeof STATUS]?.next
    if (!next) return
    updateStatusMutation.mutate({
      orderId,
      status: next as Order["status"],
    })
  }

  return {
    orders,
    addOrder,
    advanceStatus,
    isLoading: createMutation.isPending || updateStatusMutation.isPending,
  }
}
