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

export interface SearchMeta {
  total: number
  skip: number
  limit: number
  has_more: boolean
}

// Extracts the pagination metadata (`total`, `has_more`, ...) that the search
// API returns alongside the results. Handles both top-level and `data.meta`
// response shapes like `parseSearchResponse`, plus responses that expose
// `total`/`skip`/`limit` directly on `data` or at the top level.
export function parseSearchMeta(data: unknown): SearchMeta | undefined {
  const d = data as Record<string, unknown> | undefined
  if (!d || typeof d !== "object") return undefined

  const nested = d.data as Record<string, unknown> | undefined
  const candidates: Record<string, unknown>[] = []

  if (nested && typeof nested === "object") {
    if (typeof nested.meta === "object" && nested.meta) candidates.push(nested.meta as Record<string, unknown>)
    if (typeof nested.pagination === "object" && nested.pagination) candidates.push(nested.pagination as Record<string, unknown>)
    candidates.push(nested)
  }
  if (typeof d.meta === "object" && d.meta) candidates.push(d.meta as Record<string, unknown>)
  if (typeof d.pagination === "object" && d.pagination) candidates.push(d.pagination as Record<string, unknown>)
  candidates.push(d)

  for (const candidate of candidates) {
    if (typeof candidate.total === "number" || typeof candidate.total === "string") {
      return {
        total: Number(candidate.total ?? 0),
        skip: Number(candidate.skip ?? 0),
        limit: Number(candidate.limit ?? 0),
        has_more: Boolean(candidate.has_more ?? false),
      }
    }
  }

  return undefined
}

export function truncateWords(text: string, maxWords = 12): string {
  if (!text) return ''
  const words = text.trim().split(/\s+/)
  if (words.length <= maxWords) return text.trim()
  return words.slice(0, maxWords).join(' ') + '...'
}
