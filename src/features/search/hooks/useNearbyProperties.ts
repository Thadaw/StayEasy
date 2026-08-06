import { useState, useEffect } from "react";
import api from "../../../services/axios";
import type { SearchProperty } from "../../../shared/types/api";
import { getDefaultDates } from "../../../shared/utils/date";

const CACHE_KEY = "nearbyPropertiesCache";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

interface NearbyCache {
  timestamp: number;
  limit: number;
  properties: SearchProperty[];
}

function readCache(): NearbyCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as NearbyCache;
  } catch {
    return null;
  }
}

function writeCache(entry: NearbyCache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // localStorage unavailable or full
  }
}

function hasPermissionApi(): boolean {
  return typeof navigator !== "undefined" && "permissions" in navigator;
}

export function useNearbyProperties(limit = 6) {
  const [properties, setProperties] = useState<SearchProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const cached = readCache();
    const cacheValid = !!cached && cached.limit === limit && cached.properties.length > 0;
    const isFresh = cacheValid && Date.now() - cached.timestamp < CACHE_TTL_MS;

    if (cacheValid) {
      setProperties(cached.properties);
      setLoading(false);
    }

    // Fresh cache — skip network + geolocation entirely, render instantly.
    if (isFresh) return;

    const loadNearbyProperties = async () => {
      if (!cacheValid) setLoading(true);
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 });
        });
        const { today, tomorrow } = getDefaultDates();
        const response = await api.get("/search/nearby", {
          params: {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            limit,
            check_in: today,
            check_out: tomorrow,
            adults: 2,
            children: 0,
            rooms: 1,
          },
        });
        const results: SearchProperty[] = response.data?.data || [];
        const withDetails = await Promise.all(
          results.map(async (p) => {
            try {
              const detailResponse = await api.get(`/properties/${p.property_id}/public`);
              const prop = detailResponse.data?.data;
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
              // Individual property detail failure is non-critical — return the basic search result.
              return p;
            }
          })
        );
        if (!cancelled) {
          setProperties(withDetails);
          if (withDetails.length > 0) {
            writeCache({ timestamp: Date.now(), limit, properties: withDetails });
          }
        }
      } catch {
        // Geolocation or API failure — show empty state.
        if (!cancelled) setProperties([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const maybeFetchNearby = async () => {
      if (!hasPermissionApi()) {
        setLoading(false);
        return;
      }
      try {
        const status = await navigator.permissions.query({ name: "geolocation" });
        if (status.state === "granted") {
          await     loadNearbyProperties();
        } else {
          setLoading(false);
        }
      } catch {
        // Permissions API not supported or query failed — skip nearby results.
        setLoading(false);
      }
    };

    maybeFetchNearby();

    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { properties, loading };
}
