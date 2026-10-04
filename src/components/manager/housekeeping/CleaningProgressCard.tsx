interface CleaningProgressCardProps {
  updatedAt: string
  percent: number
  cleanCount: number
  inProgressCount: number
  totalCount: number
  inProgressPercent: number
}

export default function CleaningProgressCard({
  updatedAt,
  percent,
  cleanCount,
  inProgressCount,
  totalCount,
  inProgressPercent,
}: CleaningProgressCardProps) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
      <h3 className="m-0 text-[15px] font-bold text-[#111827]">Cleaning Progress</h3>
      <p className="mt-1 mb-0 text-[11px] text-[#9CA3AF]">Last updated: {updatedAt}</p>

      <div className="mt-3.5 flex items-end gap-2.5">
        <span className="text-[28px] font-bold leading-none text-[#0F172A]">{percent}%</span>
        <span className="mb-0.5 text-[11px] text-[#9CA3AF]">
          {cleanCount} of {totalCount} rooms cleaned
        </span>
      </div>

      <div className="mt-3.5 flex h-2.5 overflow-hidden rounded-full bg-[#E5E7EB]">
        <div className="h-full bg-[#22C55E]" style={{ width: `${percent}%` }} />
        <div className="h-full bg-[#3B82F6]" style={{ width: `${inProgressPercent}%` }} />
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-[12px]">
          <span className="h-2 w-2 shrink-0 rounded-full bg-[#22C55E]" />
          <span className="text-[#374151]">Clean</span>
          <span className="ml-auto text-[#6B7280]">
            {cleanCount}
            <span className="mx-1.5 text-[#D1D5DB]">·</span>
            <span className="font-semibold text-[#16A34A]">{percent}%</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-[12px]">
          <span className="h-2 w-2 shrink-0 rounded-full bg-[#3B82F6]" />
          <span className="text-[#374151]">In Progress</span>
          <span className="ml-auto text-[#6B7280]">
            {inProgressCount}
            <span className="mx-1.5 text-[#D1D5DB]">·</span>
            <span className="font-semibold text-[#2563EB]">{inProgressPercent}%</span>
          </span>
        </div>
      </div>
    </div>
  )
}
