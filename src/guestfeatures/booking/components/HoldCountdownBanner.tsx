import { Timer, Loader2 } from "lucide-react"
import { useSoftLockCountdown } from "../hooks/useSoftLockCountdown"

interface HoldCountdownBannerProps {
  expiresAt?: string | null
  createdAt?: string | null
  status?: string | null
  canReserveAgain?: boolean
  reserving?: boolean
  onReserveAgain?: () => void
}

export function HoldCountdownBanner({
  expiresAt,
  createdAt,
  status,
  canReserveAgain = false,
  reserving = false,
  onReserveAgain,
}: HoldCountdownBannerProps) {
  const { available, secondsLeft, expired, formatted } = useSoftLockCountdown({
    expiresAt,
    createdAt,
    status,
  })

  if (!available || !expiresAt) return null

  const hurry = !expired && secondsLeft < 120

  const variant = expired
    ? { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", fg: "text-red-600" }
    : hurry
      ? { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", fg: "text-amber-700" }
      : { bg: "bg-[#E8F6EF]", border: "border-[#A9DFBF]", text: "text-[#1E8449]", fg: "text-[#1E8449]" }

  return (
    <div className={`${variant.bg} border ${variant.border} rounded-lg px-4 sm:px-5 py-3 mb-6 flex flex-col sm:flex-row sm:items-center gap-3`}>
      <div className="flex items-start sm:items-center gap-2.5 min-w-0">
        <Timer size={17} className={`${variant.fg} shrink-0 mt-0.5 sm:mt-0`} aria-hidden="true" />
        {expired ? (
          <div className="min-w-0">
            <p className={`text-sm font-bold ${variant.text}`}>Your reservation hold has expired</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Your rooms may have been released. Reserve again to start a fresh 10-minute hold.
            </p>
          </div>
        ) : (
          <div className="min-w-0">
            <p className={`text-sm font-medium ${variant.text}`}>
              {hurry
                ? `Hurry — your reservation hold expires in ${formatted}`
                : `Your reservation is held for ${formatted} — complete payment before the hold expires.`}
            </p>
          </div>
        )}
      </div>

      {expired && onReserveAgain && canReserveAgain && (
        <button
          onClick={onReserveAgain}
          disabled={reserving}
          className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#1A3C5E] text-white text-sm font-semibold hover:bg-[#163552] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {reserving && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
          Reserve again
        </button>
      )}
    </div>
  )
}