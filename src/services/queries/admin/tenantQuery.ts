import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { getTenant } from '@/api/pms/pmsApi'
import { tenantKeys } from '@/lib/queryKeys'
import type { TenantResponse } from '@/types/pms'

export function useTenantQuery(
  options?: Pick<UseQueryOptions<TenantResponse>, 'enabled'>
) {
  return useQuery<TenantResponse>({
    queryKey: tenantKeys.all,
    queryFn: getTenant,
    retry: false,
    enabled: options?.enabled ?? true,
  })
}
