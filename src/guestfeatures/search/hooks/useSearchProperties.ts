import { useQuery } from "@tanstack/react-query"
import api from "../../../services/axios"
import { getDefaultDates } from "../../../shared/utils/date"
import { parseSearchResponse } from "../../../shared/utils/helpers"
import type { SearchProperty } from "../../../shared/types/api"

export function useSearchProperties(destination: string, limit = 6) {
  return useQuery({
    queryKey: ["searchProperties", destination, limit] as const,
    queryFn: async ({ signal }): Promise<SearchProperty[]> => {
      const { today, tomorrow } = getDefaultDates()
      const { data } = await api.get("/search", {
        params: {
          destination,
          check_in: today,
          check_out: tomorrow,
          adults: "2",
          children: "0",
          rooms: "1",
        },
        signal,
      })
      return parseSearchResponse<SearchProperty>(data).slice(0, limit)
    },
    enabled: !!destination,
    staleTime: 5 * 60_000,
  })
}
