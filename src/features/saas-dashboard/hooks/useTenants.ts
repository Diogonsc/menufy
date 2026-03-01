import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Tenant } from "../schemas"

const TENANTS_QUERY_KEY = ["tenants"] as const

async function fetchTenants(): Promise<Tenant[]> {
  return []
}

async function createTenant(tenant: Tenant): Promise<Tenant> {
  await new Promise((r) => setTimeout(r, 300))
  return tenant
}

async function updateTenant(
  id: string,
  updates: Partial<Tenant>
): Promise<Tenant> {
  await new Promise((r) => setTimeout(r, 200))
  return { id, ...updates } as Tenant
}

export function useTenants(initialTenants: Tenant[] = []) {
  const queryClient = useQueryClient()

  const { data: tenants = initialTenants } = useQuery({
    queryKey: TENANTS_QUERY_KEY,
    queryFn: fetchTenants,
    initialData: initialTenants,
  })

  const createMutation = useMutation({
    mutationFn: createTenant,
    onSuccess: (newTenant) => {
      queryClient.setQueryData<Tenant[]>(TENANTS_QUERY_KEY, (prev = []) => [
        newTenant,
        ...prev,
      ])
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Tenant> }) =>
      updateTenant(id, updates),
    onSuccess: (updated) => {
      queryClient.setQueryData<Tenant[]>(TENANTS_QUERY_KEY, (prev = []) =>
        prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t))
      )
    },
  })

  const addTenant = (tenant: Tenant) => createMutation.mutate(tenant)
  const updateTenantById = (id: string, updates: Partial<Tenant>) =>
    updateMutation.mutate({ id, updates })

  return {
    tenants,
    addTenant,
    updateTenant: updateTenantById,
    isLoading: createMutation.isPending || updateMutation.isPending,
  }
}
