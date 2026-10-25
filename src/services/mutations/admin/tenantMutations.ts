import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTenant, updateTenant } from '@/api/pms/pmsApi'
import { tenantKeys, propertyKeys } from '@/lib/queryKeys'

export function useCreateTenantMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (name: string) => createTenant(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.all })
      // /properties is tenant-scoped and was cached as a 403 for this account.
      // Drop it so the dashboard refetches against the new tenant.
      queryClient.invalidateQueries({ queryKey: propertyKeys.all })
    },
  })
}

export function useUpdateTenantMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (name: string) => updateTenant(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.all })
    },
  })
}
