import { useQuery } from "@tanstack/react-query"
import { usePropertyStore } from "../../stores/propertyStore"
import api from "../../services/axios"

export function usePropertyCurrency() {
  const { currentPropertyId } = usePropertyStore()

  const { data: property } = useQuery({
    queryKey: ["property", currentPropertyId],
    queryFn: async () => {
      if (!currentPropertyId) return null
      try {
        const { data } = await api.get(`/properties/${currentPropertyId}`)
        return data?.data || data
      } catch {
        return null
      }
    },
    enabled: !!currentPropertyId,
  })

  const currency = property?.currency || "NPR"

  const formatAmount = (amount: number) => {
    return `${currency} ${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
  }

  return { currency, formatAmount, property }
}
