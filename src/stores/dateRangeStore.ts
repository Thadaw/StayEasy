import { create } from 'zustand'

export type DateRangePreset =
  | 'this-month'
  | 'last-month'
  | 'last-7-days'
  | 'last-30-days'
  | 'this-quarter'
  | 'this-year'

export interface DateRangeValue {
  preset: DateRangePreset
  label: string
  from: string
  to: string
}

function fmt(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

function computeRange(preset: DateRangePreset): DateRangeValue {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  let from: Date
  let to: Date

  switch (preset) {
    case 'last-month':
      from = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      to = endOfMonth(from)
      break
    case 'last-7-days':
      from = new Date(today)
      from.setDate(from.getDate() - 6)
      to = new Date(today)
      break
    case 'last-30-days':
      from = new Date(today)
      from.setDate(from.getDate() - 29)
      to = new Date(today)
      break
    case 'this-quarter': {
      const quarterStart = Math.floor(today.getMonth() / 3) * 3
      from = new Date(today.getFullYear(), quarterStart, 1)
      to = endOfMonth(new Date(today.getFullYear(), quarterStart + 2, 1))
      break
    }
    case 'this-year':
      from = new Date(today.getFullYear(), 0, 1)
      to = new Date(today.getFullYear(), 11, 31)
      break
    case 'this-month':
    default:
      from = new Date(today.getFullYear(), today.getMonth(), 1)
      to = endOfMonth(today)
      break
  }

  return { preset, label: `${fmt(from)} - ${fmt(to)}`, from: from.toISOString(), to: to.toISOString() }
}

export const DATE_RANGE_PRESETS: { id: DateRangePreset; label: string }[] = [
  { id: 'this-month', label: 'This Month' },
  { id: 'last-month', label: 'Last Month' },
  { id: 'last-7-days', label: 'Last 7 Days' },
  { id: 'last-30-days', label: 'Last 30 Days' },
  { id: 'this-quarter', label: 'This Quarter' },
  { id: 'this-year', label: 'This Year' },
]

interface DateRangeState extends DateRangeValue {
  setRange: (preset: DateRangePreset) => void
}

export function isWithinRange(date: string | Date | undefined | null, from: string, to: string): boolean {
  if (!date) return true
  const time = new Date(date).getTime()
  if (Number.isNaN(time)) return true
  const fromTime = new Date(from).setHours(0, 0, 0, 0)
  const toTime = new Date(to).setHours(23, 59, 59, 999)
  return time >= fromTime && time <= toTime
}

const initial = computeRange('this-month')

export const useDateRangeStore = create<DateRangeState>((set) => ({
  ...initial,
  setRange: (preset) => set(computeRange(preset)),
}))
