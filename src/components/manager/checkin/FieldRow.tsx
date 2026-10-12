interface FieldRowProps {
  label: string
  value: React.ReactNode
  valueClassName?: string
}

export default function FieldRow({ label, value, valueClassName = 'text-gray-900' }: FieldRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-[7px] text-[13px]">
      <span className="shrink-0 text-gray-500">{label}</span>
      <span className={`min-w-0 break-words text-right font-medium ${valueClassName}`}>{value}</span>
    </div>
  )
}
