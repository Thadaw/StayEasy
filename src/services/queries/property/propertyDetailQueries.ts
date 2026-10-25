import { useQuery } from "@tanstack/react-query"
import type { AuthRequestConfig } from "@/api/axiosInstance"
import { getPropertyPublic } from "@/api/properties/propertyApi"
import { propertyKeys } from "@/lib/queryKeys"

// -- Property public details --
export function usePropertyQuery(
  propertyId: string | null | undefined,
  requestConfig?: AuthRequestConfig,
) {
  return useQuery({
    queryKey: propertyKeys.detail(propertyId || ""),
    queryFn: ({ signal }) => getPropertyPublic(propertyId || "", requestConfig, signal),
    enabled: !!propertyId,
    staleTime: 5 * 60_000,
  })
}
