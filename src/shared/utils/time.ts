// Parse booking dates with special handling for different formats from the API.
// Date-only strings (YYYY-MM-DD) are anchored at noon UTC to avoid timezone edge
// cases where midnight would shift the date by one day in either direction.
export function parseBookingDate(dateStr: string): Date {
  if (!dateStr) return new Date()
  if (dateStr.includes('T') && (dateStr.includes('Z') || dateStr.includes('+') || dateStr.match(/-\d{2}:\d{2}$/))) {
    return new Date(dateStr)
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return new Date(dateStr + 'T12:00:00Z')
  }
  return new Date(dateStr)
}

export function calculateNights(checkIn: string, checkOut: string): number {
  const start = parseBookingDate(checkIn)
  const end = parseBookingDate(checkOut)
  const diffMs = Math.abs(end.getTime() - start.getTime())
  return Math.max(1, Math.ceil(diffMs / 86400000))
}

export function isPastDate(dateStr: string): boolean {
  return parseBookingDate(dateStr).getTime() < Date.now()
}

export function isBeforeDate(dateStr: string, targetDate: string): boolean {
  return parseBookingDate(dateStr).getTime() < parseBookingDate(targetDate).getTime()
}
