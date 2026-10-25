import { useMutation, useQueryClient } from "@tanstack/react-query"
import { checkInGuest, uploadCitizenshipPhotos } from "@/api/pms/pmsApi"
import { frontdeskKeys } from "@/lib/queryKeys"

export interface CheckInVars {
  refNumber: string
  frontFile?: File | null
  backFile?: File | null
}

// Checks a guest in and (optionally) uploads citizenship photos.
// Cache invalidation is handled internally; per-call UI callbacks can be
// supplied via `mutate(vars, { onSuccess, onError })`.
export function useCheckInGuestMutation(propertyId: string | null | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ refNumber, frontFile, backFile }: CheckInVars) => {
      await checkInGuest(refNumber)
      if (frontFile || backFile) {
        await uploadCitizenshipPhotos(refNumber, frontFile ?? null, backFile ?? null)
      }
      return refNumber
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: frontdeskKeys.arrivals(propertyId || "") })
      queryClient.invalidateQueries({ queryKey: frontdeskKeys.summary(propertyId || "") })
      queryClient.invalidateQueries({ queryKey: frontdeskKeys.arrivalsForFolio(propertyId || "") })
    },
  })
}
