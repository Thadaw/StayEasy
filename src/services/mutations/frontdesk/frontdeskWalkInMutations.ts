import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/api/axiosInstance"
import { frontdeskKeys } from "@/lib/queryKeys"

export interface CreateWalkInBookingVars {
  bookingData: Record<string, unknown>
  idDocumentFront?: File
  idDocumentBack?: File
}

// Creates a walk-in booking via multipart POST. Cache invalidation is handled
// internally; per-call UI callbacks can be supplied via mutate options.
export function useCreateWalkInBookingMutation(propertyId: string | null | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ bookingData, idDocumentFront, idDocumentBack }: CreateWalkInBookingVars) => {
      const fd = new FormData()

      Object.entries(bookingData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          fd.append(key, Array.isArray(value) ? JSON.stringify(value) : String(value))
        }
      })

      if (idDocumentFront) fd.append("front", idDocumentFront)
      if (idDocumentBack) fd.append("back", idDocumentBack)

      const TOKEN_KEY = "token"
      const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
      const baseURL = (api.defaults.baseURL || "").replace(/\/+$/, "")
      const response = await fetch(`${baseURL}/staff/create-walkin-booking`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      })
      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err?.error || `Request failed with status ${response.status}`)
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: frontdeskKeys.roomCalendar(propertyId || "") })
      queryClient.invalidateQueries({ queryKey: frontdeskKeys.arrivals(propertyId || "") })
      queryClient.invalidateQueries({ queryKey: frontdeskKeys.summary(propertyId || "") })
    },
  })
}
