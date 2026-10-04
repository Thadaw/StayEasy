import type { DistributionEntry } from './demoHousekeeping'

interface RoomStatusDistributionCardProps {
  entries: DistributionEntry[]
  totalRooms: number
}

export default function RoomStatusDistributionCard({ entries, totalRooms }: RoomStatusDistributionCardProps) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
      <h3 className="m-0 text-[15px] font-bold text-[#111827]">Room Status Distribution</h3>
      <p className="mt-1 mb-0 text-[11px] text-[#9CA3AF]">Total {totalRooms} rooms</p>

      <div className="mt-3.5 flex h-2.5 overflow-hidden rounded-full bg-[#E5E7EB]">
        {entries.map(entry => (
          <div key={entry.label} style={{ width: `${entry.percent}%`, background: entry.color }} />
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        {entries.map(entry => (
          <div key={entry.label} className="flex items-center gap-2 text-[13px]">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: entry.color }}
            />
            <span className="text-[#374151]">{entry.label}</span>
            <span className="ml-auto text-[12px] text-[#9CA3AF]">{entry.count} rooms</span>
            <span className="w-10 text-right text-[13px] font-semibold" style={{ color: entry.color }}>
              {entry.percent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
