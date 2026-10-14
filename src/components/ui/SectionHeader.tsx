import { ReactNode } from "react"

interface SectionHeaderProps {
  icon: ReactNode
  title: string
}

export default function SectionHeader({ icon, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-brand-accent">{icon}</span>
      <h3 className="text-sm font-bold text-gray-900">{title}</h3>
    </div>
  )
}
