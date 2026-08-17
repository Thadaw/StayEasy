import { useCallback, useEffect, useState } from "react";
import api from "../../../services/axios";
import { getDefaultDates } from "../../../shared/utils/date";
import { parseSearchResponse, parseSearchMeta } from "../../../shared/utils/helpers";
import type { SearchProperty } from "../../../shared/types/api";

// The search API only supports a max limit of 100 and its meta.total reflects the
// number of items returned for the current skip/limit, not the overall count.
// Fetching everything in one request gives us the full result set and an
// accurate total, so pagination can happen on the client.
const FETCH_LIMIT = 100;

export function useSearchResults(
  location: string,
  propertyType: string,
  checkIn: string,
  checkOut: string,
  guests: string
) {
  const [results, setResults] = useState<SearchProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const loadSearchResults = useCallback(async () => {
    if (!location && !propertyType) {
      setLoading(false);
      setResults([]);
      setTotal(0);
      return;
    }

    try {
      setLoading(true);

      const { today, tomorrow } = getDefaultDates();
      const params: Record<string, string> = {
        check_in: checkIn || today,
        check_out: checkOut || tomorrow,
        skip: "0",
        limit: String(FETCH_LIMIT),
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
      const meta = parseSearchMeta(response.data);
      setResults(parseSearchResponse<SearchProperty>(response.data));
      setTotal(meta?.total ?? 0);
    } catch (error) {
      console.error("Search API error:", error);
      setResults([]);
      setTotal(0);
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
    total,
  };
}
