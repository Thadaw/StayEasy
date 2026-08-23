import { useState, useEffect } from "react";
import api from "../../../services/axios";
import { getDefaultDates } from "../../../shared/utils/date";
import { parseSearchResponse } from "../../../shared/utils/helpers";
import type { SearchProperty } from "../../../shared/types/api";

export function useSearchProperties(destination: string, limit = 6) {
  const [properties, setProperties] = useState<SearchProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSearchProperties = async () => {
      setLoading(true);
      try {
        const { today, tomorrow } = getDefaultDates();
        const { data } = await api.get("/search", {
          params: {
            destination,
            check_in: today,
            check_out: tomorrow,
            adults: "2",
            children: "0",
            rooms: "1",
          },
        });
        const results = parseSearchResponse<SearchProperty>(data);
        setProperties(results.slice(0, limit));
      } catch {
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    loadSearchProperties();
  }, [destination, limit]);

  return { properties, loading };
}
