import { Clock, Printer, Tag, MoreHorizontal } from 'lucide-react'

const actions = [
  { icon: Clock, label: 'Hold Order', color: '#f97316', bg: '#fff7ed' },
  { icon: Printer, label: 'Print Bill', color: '#2563eb', bg: '#eff6ff' },
  { icon: Tag, label: 'Apply Discount', color: '#16a34a', bg: '#f0fdf4' },
  { icon: MoreHorizontal, label: 'More Actions', color: '#6b7280', bg: '#f9fafb' },
]

export default function PosActionBar() {
  return (
    <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
      {actions.map((a) => (
        <button key={a.label} style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '14px 0', borderRadius: 10, border: '1px solid var(--border)',
          background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: 'var(--foreground)',
        }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <a.icon size={16} color={a.color} />
          </div>
          {a.label}
        </button>
      ))}
    </div>
  )
}
