import { useQuery } from '@tanstack/react-query'
import { getAllProperties } from '@/api/pms/pmsApi'
import { propertyKeys } from '@/lib/queryKeys'
import type { GeneralInfoResponse } from '@/types/pms'

export function useSettingsPropertiesQuery() {
  return useQuery<GeneralInfoResponse[]>({
    queryKey: propertyKeys.all,
    queryFn: getAllProperties,
  })
}
