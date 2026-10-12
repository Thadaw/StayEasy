import { Search, Plus } from 'lucide-react'
import { GUEST_TYPE_OPTIONS, NATIONALITY_OPTIONS, GUEST_STATUS_OPTIONS } from './demoGuests'

const controlStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #e5e7eb',
  background: '#fff',
  fontSize: 13,
  color: '#374151',
  outline: 'none',
  boxSizing: 'border-box',
  width: '100%',
}

interface ManagerGuestFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  typeFilter: string
  onTypeChange: (value: string) => void
  nationalityFilter: string
  onNationalityChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  onAddGuest: () => void
}

export default function ManagerGuestFilters({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeChange,
  nationalityFilter,
  onNationalityChange,
  statusFilter,
  onStatusChange,
  onAddGuest,
}: ManagerGuestFiltersProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
      }}
    >
      <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 200 }}>
        <Search
          size={15}
          color="#9ca3af"
          style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search guest name, email or phone..."
          style={{ ...controlStyle, paddingLeft: 34 }}
        />
      </div>

      <select
        value={typeFilter}
        onChange={(e) => onTypeChange(e.target.value)}
        style={{ ...controlStyle, flex: '1 1 150px', minWidth: 130, cursor: 'pointer' }}
      >
        {GUEST_TYPE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <select
        value={nationalityFilter}
        onChange={(e) => onNationalityChange(e.target.value)}
        style={{ ...controlStyle, flex: '1 1 150px', minWidth: 130, cursor: 'pointer' }}
      >
        {NATIONALITY_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        style={{ ...controlStyle, flex: '1 1 130px', minWidth: 120, cursor: 'pointer' }}
      >
        {GUEST_STATUS_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <button
        onClick={onAddGuest}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flex: '0 0 auto',
          padding: '10px 18px',
          borderRadius: 8,
          border: 'none',
          background: '#111827',
          color: '#fff',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        <Plus size={15} />
        Add Guest
      </button>
    </div>
  )
}
