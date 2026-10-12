function toLocalISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Built from local calendar parts, not `toISOString()`. The latter returns the
// UTC date, so for anyone east of UTC (e.g. Asia/Kathmandu, UTC+5:45) `today`
// was yesterday between 00:00 and 05:45 local — the search then requested a
// stay that had already started, and the date picker's `min` allowed a past date.
export function getDefaultDates() {
  const now = new Date()
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  return { today: toLocalISODate(now), tomorrow: toLocalISODate(tomorrow) }
}
