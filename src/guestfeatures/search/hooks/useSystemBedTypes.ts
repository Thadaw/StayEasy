import { useQuery } from "@tanstack/react-query"
import api from "../../../services/axios"

interface BedType {
  id: string
  bed_name: string
}

async function fetchBedTypes(): Promise<BedType[]> {
  const res = await api.get("/search/system-bed-types")
  const data = res.data
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.data)) return data.data
  return []
}

export function useSystemBedTypes() {
  const { data: bedTypes = [], ...rest } = useQuery({
    queryKey: ["system-bed-types"],
    queryFn: fetchBedTypes,
    staleTime: Infinity,
    gcTime: Infinity,
  })

  return { bedTypes, ...rest }
}
