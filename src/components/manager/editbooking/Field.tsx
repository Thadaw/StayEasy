interface FieldProps {
  label: string
  error?: string
  children: React.ReactNode
}

export default function Field({ label, error, children }: FieldProps) {
  return (
    <div className="min-w-0">
      <label className="mb-1 block text-[13px] font-medium text-gray-700">{label}</label>
      {children}
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </div>
  )
}
