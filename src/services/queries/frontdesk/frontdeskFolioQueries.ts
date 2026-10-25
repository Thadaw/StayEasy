import { useQuery } from "@tanstack/react-query"
import api from "@/api/axiosInstance"
import { frontdeskKeys } from "@/lib/queryKeys"

export interface FolioCharge {
  id: string
  folio_id: string
  description: string
  amount: number
  category: string
  posted_by: string
  posted_by_name: string
  posted_at: string
}

export interface FolioDetail {
  id: string
  subtotal: number
  tax: number
  discount: number
  total: number
  charges: FolioCharge[]
}

// -- Folio detail (checkout page bill) --
export function useFolioDetailQuery(folioId: string | null | undefined) {
  return useQuery({
    queryKey: frontdeskKeys.folioDetail(folioId ?? undefined),
    queryFn: async (): Promise<FolioDetail | null> => {
      if (!folioId) return null
      const { data: result } = await api.get(`/staff/folios/${folioId}`)
      const wrapped = result as {
        success?: boolean
        data?: FolioDetail
      }
      if (wrapped?.success && wrapped.data) {
        const d = wrapped.data
        return {
          ...d,
          subtotal: Number(d.subtotal) || 0,
          tax: Number(d.tax) || 0,
          discount: Number(d.discount) || 0,
          total: Number(d.total) || 0,
          charges: (d.charges || []).map((c) => ({
            ...c,
            amount: Number(c.amount) || 0,
          })),
        }
      }
      return null
    },
    enabled: !!folioId,
  })
}
