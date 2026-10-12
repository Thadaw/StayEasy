import { Search } from 'lucide-react'

interface CheckInPageHeaderProps {
  arrivals: number
  remaining: number
  search: string
  onSearchChange: (v: string) => void
}

export default function CheckInPageHeader({ arrivals, remaining, search, onSearchChange }: CheckInPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="m-0 text-[20px] font-bold leading-tight text-gray-900">Check-in Guest</h2>
        <p className="mt-1.5 mb-0 text-xs text-gray-500">
          Today · {arrivals} arrivals · {remaining} remaining
        </p>
      </div>

      <div className="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 sm:w-72">
        <Search size={15} className="shrink-0 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search Booking ID / guest name..."
          className="w-full min-w-0 border-0 bg-transparent text-[13px] text-gray-700 outline-none placeholder:text-gray-400"
        />
      </div>
    </div>
  )
}
