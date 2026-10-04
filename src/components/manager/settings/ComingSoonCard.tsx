import { Construction } from 'lucide-react'

interface ComingSoonCardProps {
  label: string
}

export default function ComingSoonCard({ label }: ComingSoonCardProps) {
  return (
    <div className="s-card s-coming">
      <span className="s-coming-icon">
        <Construction size={22} />
      </span>
      <h3 className="s-coming-title">{label} — Coming soon</h3>
      <p className="s-coming-sub">This section is under construction. Check back shortly.</p>
    </div>
  )
}
