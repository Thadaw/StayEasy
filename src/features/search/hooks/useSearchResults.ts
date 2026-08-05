import { useCallback, useEffect, useState } from "react";
import api from "../../../services/axios";
import { getDefaultDates } from "../../../shared/utils/date";
import { parseSearchResponse } from "../../../shared/utils/helpers";
import type { SearchProperty } from "../../../shared/types/api";

export function useSearchResults(
  location: string,
  propertyType: string,
  checkIn: string,
  checkOut: string,
  guests: string
) {
  const [results, setResults] = useState<SearchProperty[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSearchResults = useCallback(async () => {
    if (!location && !propertyType) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { today, tomorrow } = getDefaultDates();
      const params: Record<string, string> = {
        check_in: checkIn || today,
        check_out: checkOut || tomorrow,
      };
      if (location) {
        params.destination = location;
      } else if (propertyType) {
        params.destination = propertyType;
      }
      if (propertyType) {
        params.property_type = propertyType;
      }
      params.adults = guests.match(/\d+/)?.[0] || "1";
      params.children = "0";
      params.rooms = "1";

      const response = await api.get("/search", { params });
      setResults(parseSearchResponse<SearchProperty>(response.data));
    } catch (error) {
      console.error("Search API error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [location, propertyType, checkIn, checkOut, guests]);

  useEffect(() => {
    loadSearchResults();
  }, [loadSearchResults]);

  return {
    results,
    loading,
  };
}
