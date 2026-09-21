import { useQuery } from "@tanstack/react-query"
import api from "../../../services/axios"

interface RoomType {
  id: string
  room_type_name: string
  name?: string
}

async function fetchRoomTypes(): Promise<RoomType[]> {
  const res = await api.get("/search/system-room-types")
  const data = res.data
  let items: RoomType[] = []
  if (Array.isArray(data)) {
    items = data
  } else if (data && Array.isArray(data.data)) {
    items = data.data
  }
  return items.map((item) => ({
    id: item.id,
    room_type_name: item.room_type_name || item.name || "",
  }))
}

export function useSystemRoomTypes() {
  const { data: roomTypes = [], ...rest } = useQuery({
    queryKey: ["system-room-types"],
    queryFn: fetchRoomTypes,
    staleTime: Infinity,
    gcTime: Infinity,
  })

  return { roomTypes, ...rest }
}
