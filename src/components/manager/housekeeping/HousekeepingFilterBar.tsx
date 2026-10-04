import { Search, ChevronDown, Calendar } from 'lucide-react'

export interface FilterOption {
  value: string
  label: string
}

interface HousekeepingFilterBarProps {
  search: string
  onSearchChange: (value: string) => void
  floor: string
  onFloorChange: (value: string) => void
  floorOptions: FilterOption[]
  status: string
  onStatusChange: (value: string) => void
  statusOptions: FilterOption[]
  staff: string
  onStaffChange: (value: string) => void
  staffOptions: FilterOption[]
  date: string
  onDateChange: (value: string) => void
}

function formatDateLabel(value: string): string {
  if (!value) return 'Select date'
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return value
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function SelectControl({
  value,
  onChange,
  options,
  widthClass = 'sm:min-w-[150px]',
}: {
  value: string
  onChange: (value: string) => void
  options: FilterOption[]
  widthClass?: string
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full min-w-0 cursor-pointer appearance-none rounded-lg border border-[#E5E7EB] bg-white py-2.5 pl-3.5 pr-9 text-[13px] font-medium text-[#374151] outline-none focus:border-[#93C5FD] ${widthClass}`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
      />
    </div>
  )
}

export default function HousekeepingFilterBar({
  search,
  onSearchChange,
  floor,
  onFloorChange,
  floorOptions,
  status,
  onStatusChange,
  statusOptions,
  staff,
  onStaffChange,
  staffOptions,
  date,
  onDateChange,
}: HousekeepingFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative w-full min-w-0 sm:w-auto sm:max-w-[280px] sm:flex-1">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
        <input
          type="text"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search room number or type..."
          className="w-full rounded-lg border border-[#E5E7EB] bg-white py-2.5 pl-9 pr-3.5 text-[13px] text-[#374151] outline-none placeholder:text-[#9CA3AF] focus:border-[#93C5FD]"
        />
      </div>

      <SelectControl value={floor} onChange={onFloorChange} options={floorOptions} widthClass="sm:min-w-[150px]" />
      <SelectControl value={status} onChange={onStatusChange} options={statusOptions} widthClass="sm:min-w-[170px]" />
      <SelectControl value={staff} onChange={onStaffChange} options={staffOptions} widthClass="sm:min-w-[200px]" />

      <div className="relative">
        <div className="pointer-events-none flex max-w-full items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white py-2.5 pl-3 pr-3.5 text-[13px] font-medium text-[#374151]">
          <Calendar size={14} className="text-[#9CA3AF]" />
          <span>{formatDateLabel(date)}</span>
        </div>
        <input
          type="date"
          value={date}
          onChange={e => onDateChange(e.target.value)}
          aria-label="Filter by date"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  )
}
