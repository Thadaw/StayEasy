import { useEffect, useState } from "react";
import api from "../../../services/axios";

interface Amenity {
  id: string;
  amenity_name: string;
  name?: string;
}

export function useSystemAmenities() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchAmenities() {
      try {
        setLoading(true);
        const res = await api.get("/search/system-amenities");
        if (!cancelled) {
          const data = res.data;
          let items: any[] = [];
          if (Array.isArray(data)) {
            items = data;
          } else if (data && Array.isArray(data.data)) {
            items = data.data;
          }
          const normalized: Amenity[] = items.map((item: any) => ({
            id: item?.id || "",
            amenity_name: item?.amenity_name || item?.name || "",
          })).filter((n: Amenity) => n.amenity_name);
          setAmenities(normalized);
        }
      } catch (error) {
        console.error("Failed to fetch amenities:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAmenities();
    return () => { cancelled = true; };
  }, []);

  return { amenities, loading };
}
