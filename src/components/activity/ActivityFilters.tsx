import { Search, ChevronDown, Filter, Download } from 'lucide-react'

interface ActivityFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  userFilter: string
  onUserFilterChange: (value: string) => void
  moduleFilter: string
  onModuleFilterChange: (value: string) => void
  actionFilter: string
  onActionFilterChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
}

const selectStyle: React.CSSProperties = {
  appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
  background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8,
  padding: '10px 36px 10px 14px', fontSize: 14, color: '#374151',
  fontWeight: 500, cursor: 'pointer', outline: 'none', backgroundImage: 'none', minWidth: 130,
}

export default function ActivityFilters({
  search, onSearchChange,
  userFilter, onUserFilterChange,
  moduleFilter, onModuleFilterChange,
  actionFilter, onActionFilterChange,
  statusFilter, onStatusFilterChange,
}: ActivityFiltersProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: 320 }}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
        <input
          type="text" value={search} onChange={e => onSearchChange(e.target.value)}
          placeholder="Search activities, users, modules..."
          style={{
            width: '100%', padding: '10px 14px 10px 38px', border: '1px solid #E5E7EB',
            borderRadius: 8, fontSize: 14, color: '#374151', outline: 'none', background: '#fff',
          }}
        />
      </div>

      <div style={{ position: 'relative' }}>
        <select value={userFilter} onChange={e => onUserFilterChange(e.target.value)} style={selectStyle}>
          <option value="">All Users</option>
          <option value="Admin">Admin</option>
          <option value="Sita Sharma">Sita Sharma</option>
          <option value="Ramesh Thapa">Ramesh Thapa</option>
          <option value="Maya Gurung">Maya Gurung</option>
          <option value="Anita Karki">Anita Karki</option>
          <option value="System">System</option>
          <option value="John Doe">John Doe</option>
          <option value="Pooja Lama">Pooja Lama</option>
        </select>
        <ChevronDown size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9CA3AF' }} />
      </div>

      <div style={{ position: 'relative' }}>
        <select value={moduleFilter} onChange={e => onModuleFilterChange(e.target.value)} style={selectStyle}>
          <option value="">All Modules</option>
          <option value="Bookings">Bookings</option>
          <option value="Guests">Guests</option>
          <option value="Rooms">Rooms</option>
          <option value="Housekeeping">Housekeeping</option>
          <option value="Pricing">Pricing</option>
          <option value="Payments">Payments</option>
          <option value="System">System</option>
          <option value="Users">Users</option>
          <option value="Settings">Settings</option>
        </select>
        <ChevronDown size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9CA3AF' }} />
      </div>

      <div style={{ position: 'relative' }}>
        <select value={actionFilter} onChange={e => onActionFilterChange(e.target.value)} style={selectStyle}>
          <option value="">All Actions</option>
          <option value="Created">Created</option>
          <option value="Updated">Updated</option>
          <option value="Completed">Completed</option>
          <option value="Login">Login</option>
          <option value="Deleted">Deleted</option>
          <option value="Login Failed">Login Failed</option>
        </select>
        <ChevronDown size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9CA3AF' }} />
      </div>

      <div style={{ position: 'relative' }}>
        <select value={statusFilter} onChange={e => onStatusFilterChange(e.target.value)} style={selectStyle}>
          <option value="">All Status</option>
          <option value="Success">Success</option>
          <option value="Warning">Warning</option>
          <option value="Failed">Failed</option>
        </select>
        <ChevronDown size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9CA3AF' }} />
      </div>

      <button style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px',
        border: '1px solid var(--primary)', borderRadius: 8, background: '#fff',
        fontSize: 14, fontWeight: 500, color: 'var(--primary)', cursor: 'pointer',
      }}>
        <Filter size={14} /> Filters
      </button>

      <button style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px',
        border: '1px solid var(--primary)', borderRadius: 8, background: '#fff',
        fontSize: 14, fontWeight: 500, color: 'var(--primary)', cursor: 'pointer',
      }}>
        <Download size={14} /> Export
      </button>
    </div>
  )
}
