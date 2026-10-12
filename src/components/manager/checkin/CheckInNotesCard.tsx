interface CheckInNotesCardProps {
  value: string
  onChange: (v: string) => void
}

export default function CheckInNotesCard({ value, onChange }: CheckInNotesCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="m-0 mb-3 text-[15px] font-bold text-gray-900">Check-in Notes</h3>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Add arrival notes for front desk / operations..."
        className="min-h-[86px] w-full resize-y rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-3 text-[13px] leading-relaxed text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-300 focus:bg-white"
      />
    </div>
  )
}
