import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'

/**
 * `denied` and `failed` are deliberately separate. A 15s timeout or a
 * POSITION_UNAVAILABLE is transient and must stay retryable, whereas only an
 * explicit PERMISSION_DENIED is a decision the user made. Latching the two
 * together (as the old `locationDenied` flag did) meant one slow GPS fix
 * permanently degraded the landing page.
 */
export type LocationStatus =
  | 'idle'
  | 'prompting'
  | 'granted'
  | 'denied'
  | 'failed'
  | 'unavailable'

export interface Coords {
  lat: number
  lng: number
}

const LOCATION_KEY = 'stayeasy:location'
const STATUS_KEY = 'stayeasy:locationStatus'
const PROMPT_KEY = 'stayeasy:locationPrompt'

const LEGACY_LOCATION_KEY = 'nearbyLocation'
const LEGACY_DENIED_KEY = 'locationDenied'
const LEGACY_PROMPT_KEY = 'locationPopupSeen'

const VALID_STATUSES: LocationStatus[] = [
  'idle',
  'prompting',
  'granted',
  'denied',
  'failed',
  'unavailable',
]

const GEO_TIMEOUT = 15000

function isValidCoords(value: unknown): value is Coords {
  if (!value || typeof value !== 'object') return false
  const { lat, lng } = value as Record<string, unknown>
  return (
    typeof lat === 'number' && Number.isFinite(lat) && lat >= -90 && lat <= 90 &&
    typeof lng === 'number' && Number.isFinite(lng) && lng >= -180 && lng <= 180
  )
}

function loadCoords(): Coords | null {
  try {
    const raw = localStorage.getItem(LOCATION_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return isValidCoords(parsed) ? { lat: parsed.lat, lng: parsed.lng } : null
  } catch {
    return null
  }
}

function saveCoords(coords: Coords) {
  try {
    localStorage.setItem(LOCATION_KEY, JSON.stringify({ ...coords, grantedAt: Date.now() }))
  } catch {
    // private browsing / storage disabled — location still works this session
  }
}

function loadStatus(): LocationStatus {
  try {
    const raw = localStorage.getItem(STATUS_KEY)
    if (raw && VALID_STATUSES.includes(raw as LocationStatus)) return raw as LocationStatus
  } catch {
    // ignore
  }
  // A stored position with no status means storage was partially evicted.
  // Re-derive `granted` rather than dropping to `idle` and re-prompting.
  return loadCoords() ? 'granted' : 'idle'
}

function saveStatus(status: LocationStatus) {
  try {
    localStorage.setItem(STATUS_KEY, status)
  } catch {
    // ignore
  }
}

function loadPromptDismissed(): boolean {
  try {
    return localStorage.getItem(PROMPT_KEY) === 'dismissed'
  } catch {
    return false
  }
}

function savePromptDismissed(dismissed: boolean) {
  try {
    if (dismissed) localStorage.setItem(PROMPT_KEY, 'dismissed')
    else localStorage.removeItem(PROMPT_KEY)
  } catch {
    // ignore
  }
}

/**
 * One-time migration off the legacy keys. The old design smuggled coordinates
 * through a human-readable string ("Nearby (27.72, 85.32)") and used
 * `locationDenied` for every kind of failure. Parsing that string once means
 * returning users keep the location they already granted and — importantly —
 * the stuck `locationDenied` latch is dropped, which is the only escape for
 * anyone trapped in the re-prompt loop.
 */
function migrateLegacyKeys() {
  try {
    const legacyLocation = localStorage.getItem(LEGACY_LOCATION_KEY)
    if (legacyLocation) {
      const match = legacyLocation.match(/(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/)
      if (match && !loadCoords()) {
        const coords = { lat: parseFloat(match[1]), lng: parseFloat(match[2]) }
        if (isValidCoords(coords)) {
          saveCoords(coords)
          saveStatus('granted')
        }
      }
      localStorage.removeItem(LEGACY_LOCATION_KEY)
    }
    // The old code also wrote `locationDenied` on timeout / unsupported
    // browser. Treating that as a refusal is what locked those users out, so
    // reset to `idle` and let them be asked properly.
    if (localStorage.getItem(LEGACY_DENIED_KEY) !== null) {
      const current = localStorage.getItem(STATUS_KEY)
      if (!current || !VALID_STATUSES.includes(current as LocationStatus)) {
        saveStatus(loadCoords() ? 'granted' : 'idle')
      }
      localStorage.removeItem(LEGACY_DENIED_KEY)
    }
    localStorage.removeItem(LEGACY_PROMPT_KEY)
  } catch {
    // nothing to migrate
  }
}

interface LocationContextValue {
  status: LocationStatus
  coords: Coords | null
  /** True only while the native permission dialog is open. */
  isRequesting: boolean
  /** Show the "find stays near you" consent prompt. Never true once answered. */
  shouldPrompt: boolean
  requestLocation: () => Promise<void>
  dismissPrompt: () => void
  clearLocation: () => void
}

const LocationContext = createContext<LocationContextValue | null>(null)

export function LocationProvider({ children }: { children: ReactNode }) {
  const [coords, setCoords] = useState<Coords | null>(null)
  const [status, setStatus] = useState<LocationStatus>('idle')
  const [isRequesting, setIsRequesting] = useState(false)
  const [promptDismissed, setPromptDismissed] = useState(true)
  // Guards shouldPrompt for the first paint, before storage has been read.
  const [ready, setReady] = useState(false)

  useEffect(() => {
    migrateLegacyKeys()
    setCoords(loadCoords())
    setStatus(loadStatus())
    setPromptDismissed(loadPromptDismissed())
    setReady(true)
  }, [])

  const applyCoords = useCallback((next: Coords) => {
    setCoords(next)
    setStatus('granted')
    saveCoords(next)
    saveStatus('granted')
  }, [])

  const applyStatus = useCallback((next: LocationStatus) => {
    setStatus(next)
    saveStatus(next)
  }, [])

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      applyStatus('unavailable')
      return
    }

    setIsRequesting(true)
    applyStatus('prompting')

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: GEO_TIMEOUT,
          // Full precision on purpose: truncating to 2dp discarded ~1.1km of
          // accuracy against a 5km search radius.
          enableHighAccuracy: true,
        })
      })
      applyCoords({ lat: position.coords.latitude, lng: position.coords.longitude })
      setPromptDismissed(true)
      savePromptDismissed(true)
    } catch (error) {
      const code = (error as GeolocationPositionError | null)?.code
      if (code === 1) {
        // PERMISSION_DENIED — an actual decision by the user. Stop asking.
        applyStatus('denied')
        setPromptDismissed(true)
        savePromptDismissed(true)
      } else {
        // TIMEOUT (3) / POSITION_UNAVAILABLE (2) / anything else is transient.
        // Stay retryable and leave the prompt available for one more try.
        applyStatus('failed')
      }
    } finally {
      setIsRequesting(false)
    }
  }, [applyCoords, applyStatus])

  const dismissPrompt = useCallback(() => {
    setPromptDismissed(true)
    savePromptDismissed(true)
  }, [])

  const clearLocation = useCallback(() => {
    setCoords(null)
    setStatus('idle')
    try {
      localStorage.removeItem(LOCATION_KEY)
    } catch {
      // ignore
    }
    saveStatus('idle')
    // Explicitly opting out should still allow opting back in.
    setPromptDismissed(false)
    savePromptDismissed(false)
  }, [])

  // Ask at most once and never nag someone who already answered. `failed`
  // keeps the prompt eligible because a transient failure deserves one retry;
  // `granted`, `denied`, `unavailable` and any prior dismissal all close it.
  const shouldPrompt =
    ready && !promptDismissed && (status === 'idle' || status === 'failed')

  return (
    <LocationContext.Provider
      value={{
        status,
        coords,
        isRequesting,
        shouldPrompt,
        requestLocation,
        dismissPrompt,
        clearLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLocation() {
  const ctx = useContext(LocationContext)
  if (!ctx) throw new Error('useLocation must be inside LocationProvider')
  return ctx
}
