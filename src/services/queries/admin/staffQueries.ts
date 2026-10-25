import { useQuery } from "@tanstack/react-query"
import { getAllProperties, getStaff, getStaffList, getStaffSummary } from "@/api/pms/pmsApi"
import { propertyKeys, staffKeys } from "@/lib/queryKeys"
import type { GeneralInfoResponse } from "@/types/pms"
import type { ApiStaff, StaffSummary } from "@/types/staff"

export function useAdminPropertiesQuery() {
  return useQuery<GeneralInfoResponse[]>({
    queryKey: propertyKeys.all,
    queryFn: getAllProperties,
  })
}

export function useStaffListQuery(propertyId: string | null | undefined) {
  return useQuery<ApiStaff[]>({
    queryKey: staffKeys.list(propertyId || ""),
    queryFn: async () => {
      const all: ApiStaff[] = []
      let skip = 0
      const pageSize = 50
      for (;;) {
        const batch = await getStaffList(propertyId!, { skip, limit: pageSize })
        all.push(...batch)
        if (batch.length < pageSize) break
        skip += pageSize
      }
      return all
    },
    enabled: !!propertyId,
  })
}

export function useStaffDetailQuery(propertyId: string | null | undefined, staffId: string | null | undefined) {
  return useQuery<ApiStaff>({
    queryKey: staffKeys.detail(propertyId || "", staffId || ""),
    queryFn: () => getStaff(propertyId!, staffId!),
    enabled: !!propertyId && !!staffId,
  })
}

export function useStaffSummaryQuery(propertyId: string | null | undefined) {
  return useQuery<StaffSummary>({
    queryKey: staffKeys.summary(propertyId || ""),
    queryFn: () => getStaffSummary(propertyId!),
    enabled: !!propertyId,
  })
}
