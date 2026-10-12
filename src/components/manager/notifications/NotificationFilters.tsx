import { Search } from 'lucide-react'
import { NOTIFICATION_TYPES, type NotificationStatus } from './demoNotifications'

const selectStyle: React.CSSProperties = {
  padding: '8px 12px',
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  fontSize: 13,
  color: '#374151',
  cursor: 'pointer',
  outline: 'none',
}

interface NotificationFiltersProps {
  query: string
  type: string
  status: string
  category: string
  onQuery: (v: string) => void
  onType: (v: string) => void
  onStatus: (v: string) => void
  onCategory: (v: string) => void
}

export default function NotificationFilters({
  query,
  type,
  status,
  category,
  onQuery,
  onType,
  onStatus,
  onCategory,
}: NotificationFiltersProps) {
  return (
    <div className="n-filters" style={{ marginBottom: 16 }}>
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', flex: '1 1 260px', maxWidth: 360 }}>
        <Search size={14} color="#6b7280" style={{ position: 'absolute', left: 11, pointerEvents: 'none' }} />
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search notifications..."
          style={{
            width: '100%',
            padding: '8px 12px 8px 32px',
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            fontSize: 13,
            color: '#374151',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <select value={type} onChange={(e) => onType(e.target.value)} style={selectStyle}>
        <option value="All">All Types</option>
        {NOTIFICATION_TYPES.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>

      <select value={status} onChange={(e) => onStatus(e.target.value)} style={selectStyle}>
        <option value="All">All Status</option>
        {(['Unread', 'High', 'Pending', 'Resolved'] as NotificationStatus[]).map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      <select value={category} onChange={(e) => onCategory(e.target.value)} style={selectStyle}>
        <option value="All">All Categories</option>
        <option>Bookings</option>
        <option>Operations</option>
        <option>Payments</option>
        <option>Staff</option>
      </select>
    </div>
  )
}
