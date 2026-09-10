import { useEffect, useState } from "react";
import api from "../../../services/axios";

interface BedType {
  id: string;
  bed_name: string;
}

export function useSystemBedTypes() {
  const [bedTypes, setBedTypes] = useState<BedType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchBedTypes() {
      try {
        setLoading(true);
        const res = await api.get("/search/system-bed-types");
        if (!cancelled) {
          const data = res.data;
          if (Array.isArray(data)) {
            setBedTypes(data);
          } else if (data && Array.isArray(data.data)) {
            setBedTypes(data.data);
          } else {
            setBedTypes([]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch bed types:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchBedTypes();
    return () => { cancelled = true; };
  }, []);

  return { bedTypes, loading };
}
