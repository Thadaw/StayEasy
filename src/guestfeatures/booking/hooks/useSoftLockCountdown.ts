import { useEffect, useState } from "react"

const SOFT_LOCK_MINUTES = 10
const SOFT_LOCK_MS = SOFT_LOCK_MINUTES * 60 * 1000

export interface UseSoftLockCountdownOptions {
  expiresAt?: string | null
  createdAt?: string | null
  status?: string | null
}

export interface UseSoftLockCountdownResult {
  available: boolean
  secondsLeft: number
  expired: boolean
  formatted: string
}

function computeDeadline(expiresAt?: string | null, createdAt?: string | null): number | null {
  const expiry = expiresAt ? Date.parse(expiresAt) : NaN
  if (Number.isFinite(expiry)) return expiry
  const created = createdAt ? Date.parse(createdAt) : NaN
  if (Number.isFinite(created)) return created + SOFT_LOCK_MS
  return null
}

function formatSeconds(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds)
  const mins = Math.floor(clamped / 60)
  const secs = clamped % 60
  return `${mins}:${String(secs).padStart(2, "0")}`
}

export function useSoftLockCountdown({
  expiresAt,
  createdAt,
  status,
}: UseSoftLockCountdownOptions): UseSoftLockCountdownResult {
  const deadline = computeDeadline(expiresAt, createdAt)

  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!deadline) return
    const tick = () => setNow(Date.now())
    const interval = window.setInterval(tick, 1000)
    return () => window.clearInterval(interval)
  }, [deadline])

  const secondsLeft = deadline ? Math.max(0, Math.round((deadline - now) / 1000)) : 0
  const expired = !deadline ? false : secondsLeft <= 0 || status?.toUpperCase() === "EXPIRED"

  return {
    available: deadline !== null,
    secondsLeft,
    expired,
    formatted: formatSeconds(secondsLeft),
  }
}