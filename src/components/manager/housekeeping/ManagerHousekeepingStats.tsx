import { BedDouble, CheckCircle2, AlertTriangle, RefreshCw, Ban, BadgeCheck } from 'lucide-react'
import type { StatCardData } from './demoHousekeeping'

interface ManagerHousekeepingStatsProps {
  cards: StatCardData[]
  activeFilter: string
  onFilterChange: (status: string) => void
}

const ICONS: Record<string, { Icon: typeof BedDouble; color: string }> = {
  total: { Icon: BedDouble, color: '#2563EB' },
  clean: { Icon: CheckCircle2, color: '#16A34A' },
  dirty: { Icon: AlertTriangle, color: '#DC2626' },
  inProgress: { Icon: RefreshCw, color: '#2563EB' },
  maintenance: { Icon: Ban, color: '#DC2626' },
  ready: { Icon: BadgeCheck, color: '#16A34A' },
}

export default function ManagerHousekeepingStats({ cards, activeFilter, onFilterChange }: ManagerHousekeepingStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 min-[440px]:grid-cols-2 lg:grid-cols-3 lg:gap-4 xl:grid-cols-6">
      {cards.map(card => {
        const { Icon, color } = ICONS[card.key] ?? ICONS.total
        const isActive = card.filterValue !== '' && activeFilter === card.filterValue
        const clickable = card.filterValue !== '' || card.key === 'total'
        return (
          <button
            key={card.key}
            type="button"
            onClick={() => onFilterChange(card.filterValue)}
            className={`min-w-0 rounded-[10px] border bg-white px-3 py-3.5 min-[440px]:px-4 text-left transition-colors ${
              isActive ? 'border-[#2563EB] ring-1 ring-[#2563EB]' : 'border-[#E5E7EB] hover:border-[#93C5FD]'
            } ${clickable ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="min-w-0 break-words text-[12px] font-medium leading-tight text-[#6B7280]">{card.label}</span>
              <Icon size={16} className="shrink-0" color={color} />
            </div>
            <div className="mt-1.5 text-[26px] font-bold leading-none text-[#111827]">{card.value}</div>
            <div className="mt-1.5 text-[11px] leading-tight text-[#9CA3AF]">{card.caption}</div>
          </button>
        )
      })}
    </div>
  )
}
