import { useQuery } from "@tanstack/react-query"
import api from "../../../services/axios"

interface Amenity {
  id: string
  amenity_name: string
  name?: string
}

interface RawAmenity {
  id?: string
  amenity_name?: string
  name?: string
}

async function fetchAmenities(): Promise<Amenity[]> {
  const res = await api.get("/search/system-amenities")
  const data = res.data
  let items: RawAmenity[] = []
  if (Array.isArray(data)) {
    items = data
  } else if (data && Array.isArray(data.data)) {
    items = data.data
  }
  return items
    .map((item) => ({
      id: item?.id || "",
      amenity_name: item?.amenity_name || item?.name || "",
    }))
    .filter((n) => n.amenity_name)
}

export function useSystemAmenities() {
  const { data: amenities = [], ...rest } = useQuery({
    queryKey: ["system-amenities"],
    queryFn: fetchAmenities,
    staleTime: Infinity,
    gcTime: Infinity,
  })

  return { amenities, ...rest }
}
