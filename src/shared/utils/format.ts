import i18n from "../../i18n";
import { parseBookingDate } from "./time";

export function formatDateShort(dateStr: string): string {
  if (!dateStr) return ""
  return parseBookingDate(dateStr).toLocaleDateString(i18n.language, {
    month: "short",
    day: "numeric",
  })
}

export function formatDate(date: string): string {
  if (!date) return ''
  return parseBookingDate(date).toLocaleDateString(i18n.language, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateFull(date: string): string {
  if (!date) return ''
  return parseBookingDate(date).toLocaleDateString(i18n.language, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateRange(checkIn: string, checkOut: string): string {
  if (!checkIn) return i18n.t("addDates")
  if (!checkOut) return `${formatDateShort(checkIn)} – ...`
  return `${formatDateShort(checkIn)} – ${formatDateShort(checkOut)}`
}

export function buildGuestLabel(
  adults: number,
  children: number,
  infants: number
): string {
  const parts: string[] = []
  if (adults > 0) parts.push(`${adults} ${i18n.t("adults", { count: adults })}`)
  if (children > 0) parts.push(`${children} ${i18n.t("children", { count: children })}`)
  if (infants > 0) parts.push(`${infants} ${i18n.t("room", { count: infants })}`)
  return parts.length > 0 ? parts.join(", ") : i18n.t("addGuests")
}

// The API returns multiple status variants (CONFIRMED, CHECKED_OUT, CANCELED)
// that map to the same internal states. Normalizing them avoids scattered
// status comparisons throughout the UI.
export function normalizeBookingStatus(status: string): 'upcoming' | 'completed' | 'cancelled' | 'unknown' {
  const s = status.toLowerCase()
  if (s === 'upcoming' || s === 'confirmed') return 'upcoming'
  if (s === 'completed' || s === 'checked_out') return 'completed'
  if (s === 'cancelled' || s === 'canceled') return 'cancelled'
  return 'unknown'
}
