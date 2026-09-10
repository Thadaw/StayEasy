import { useEffect, useState } from "react";
import api from "../../../services/axios";

interface RoomType {
  id: string;
  room_type_name: string;
  name?: string;
}

export function useSystemRoomTypes() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchRoomTypes() {
      try {
        setLoading(true);
        const res = await api.get("/search/system-room-types");
        if (!cancelled) {
          const data = res.data;
          let items: RoomType[] = [];
          if (Array.isArray(data)) {
            items = data;
          } else if (data && Array.isArray(data.data)) {
            items = data.data;
          }
          const normalized = items.map((item) => ({
            id: item.id,
            room_type_name: item.room_type_name || item.name || "",
          }));
          setRoomTypes(normalized);
        }
      } catch (error) {
        console.error("Failed to fetch room types:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchRoomTypes();
    return () => { cancelled = true; };
  }, []);

  return { roomTypes, loading };
}
