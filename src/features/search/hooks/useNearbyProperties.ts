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

function getStoredCoords(): { lat: number; lon: number } | null {
  try {
    const stored = localStorage.getItem("nearbyLocation");
    if (!stored) return null;
    const match = stored.match(/([\d.-]+),\s*([\d.-]+)/);
    if (!match) return null;
    return { lat: parseFloat(match[1]), lon: parseFloat(match[2]) };
  } catch {
    return null;
  }
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

    const fetchNearby = async (lat: number, lon: number) => {
      if (!cacheValid) setLoading(true);
      try {
        const { today, tomorrow } = getDefaultDates();
        const response = await api.get("/search/nearby", {
          params: {
            lat,
            lon,
            limit,
            check_in: today,
            check_out: tomorrow,
            adults: 2,
            children: 0,
            rooms: 1,
          },
        });
        const results: SearchProperty[] = response.data?.data || [];
        if (!cancelled) {
          setProperties(results);
          if (results.length > 0) {
            writeCache({ timestamp: Date.now(), limit, properties: results });
          }
        }
      } catch {
        if (!cancelled) setProperties([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    // 1. Use coordinates saved by HeroSection popup (no permission prompt needed).
    const stored = getStoredCoords();
    if (stored) {
      fetchNearby(stored.lat, stored.lon);
      return () => { cancelled = true; };
    }

    // 2. Fall back to live geolocation.
    const tryGeolocation = async () => {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 });
        });
        await fetchNearby(pos.coords.latitude, pos.coords.longitude);
      } catch {
        if (!cancelled) {
          setProperties([]);
          setLoading(false);
        }
      }
    };

    tryGeolocation();

    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { properties, loading };
}
