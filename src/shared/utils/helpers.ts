export function parseJSON<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

// The API has inconsistent response shapes across endpoints — some wrap results
// in `data.results`, some in `data`, and some return `results` directly. This
// parser handles all three so callers don't need to know which shape they'll get.
export function parseSearchResponse<T>(data: unknown): T[] {
  const d = data as Record<string, unknown> | undefined
  if (!d) return []
  const nested = d.data as Record<string, unknown> | undefined
  if (nested?.results && Array.isArray(nested.results)) return nested.results as T[]
  if (Array.isArray(d.data)) return d.data as T[]
  const direct = d.results
  if (direct && Array.isArray(direct)) return direct as T[]
  return []
}

export function truncateWords(text: string, maxWords = 12): string {
  if (!text) return ''
  const words = text.trim().split(/\s+/)
  if (words.length <= maxWords) return text.trim()
  return words.slice(0, maxWords).join(' ') + '...'
}
