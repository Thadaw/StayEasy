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
        const withDetails = await Promise.all(
          results.slice(0, limit).map(async (p) => {
            try {
              const { data: detail } = await api.get(`/properties/${p.property_id}/public`);
              const prop = detail?.data;
              return {
                ...p,
                description: prop?.description || "",
                total_rooms: prop?.total_rooms || 0,
                year_built: prop?.year_built || 0,
                phone_number: prop?.phone_number || "",
                email: prop?.email || "",
                system_amenities: prop?.system_amenities || [],
                custom_amenities: prop?.custom_amenities || [],
                total_price: p.lowest_rate ?? p.total_price ?? 0,
                currency: prop?.currency || p.currency,
              };
            } catch {
              return p;
            }
          })
        );
        setProperties(withDetails);
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
