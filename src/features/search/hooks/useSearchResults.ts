import { useCallback, useEffect, useState } from "react";
import api from "../../../services/axios";
import { getDefaultDates } from "../../../shared/utils/date";
import { parseSearchResponse, parseSearchMeta } from "../../../shared/utils/helpers";
import type { SearchProperty } from "../../../shared/types/api";

export function useSearchResults(
  location: string,
  propertyType: string,
  checkIn: string,
  checkOut: string,
  guests: string,
  page = 1,
  pageSize = 10
) {
  const [results, setResults] = useState<SearchProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const loadSearchResults = useCallback(async () => {
    if (!location && !propertyType) {
      setLoading(false);
      setResults([]);
      setTotal(0);
      setHasMore(false);
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
      params.skip = String((page - 1) * pageSize);
      params.limit = String(pageSize);

      const response = await api.get("/search", { params });
      const meta = parseSearchMeta(response.data);
      setResults(parseSearchResponse<SearchProperty>(response.data));
      setTotal(meta?.total ?? 0);
      setHasMore(meta?.has_more ?? false);
    } catch (error) {
      console.error("Search API error:", error);
      setResults([]);
      setTotal(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [location, propertyType, checkIn, checkOut, guests, page, pageSize]);

  useEffect(() => {
    loadSearchResults();
  }, [loadSearchResults]);

  return {
    results,
    loading,
    total,
    hasMore,
  };
}
