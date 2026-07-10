import { Search, Calendar, Filter } from 'lucide-react'

interface OrdersFiltersProps {
  searchQuery: string
  onSearchChange: (q: string) => void
  statusFilter: string
  onStatusChange: (s: string) => void
  typeFilter: string
  onTypeChange: (t: string) => void
  tableFilter: string
  onTableChange: (t: string) => void
}

export default function OrdersFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  tableFilter,
  onTableChange,
}: OrdersFiltersProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', flex: 1, minWidth: 280, maxWidth: 400 }}>
        <Search size={16} color="var(--muted-foreground)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          placeholder="Search by Order ID, customer, table..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px 10px 36px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: '#fff',
            fontSize: 13,
            color: 'var(--foreground)',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ position: 'relative' }}>
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          style={{
            padding: '10px 36px 10px 14px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: '#fff',
            fontSize: 13,
            cursor: 'pointer',
            appearance: 'none',
            outline: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235D6D7E' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 10px center',
          }}
        >
          <option value="all">All Status</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="on-delivery">On Delivery</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div style={{ position: 'relative' }}>
        <select
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value)}
          style={{
            padding: '10px 36px 10px 14px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: '#fff',
            fontSize: 13,
            cursor: 'pointer',
            appearance: 'none',
            outline: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235D6D7E' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 10px center',
          }}
        >
          <option value="all">All Types</option>
          <option value="dine-in">Dine In</option>
          <option value="takeaway">Takeaway</option>
          <option value="delivery">Delivery</option>
          <option value="walk-in">Walk-in</option>
        </select>
      </div>

      <div style={{ position: 'relative' }}>
        <select
          value={tableFilter}
          onChange={(e) => onTableChange(e.target.value)}
          style={{
            padding: '10px 36px 10px 14px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: '#fff',
            fontSize: 13,
            cursor: 'pointer',
            appearance: 'none',
            outline: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235D6D7E' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 10px center',
          }}
        >
          <option value="all">All Tables</option>
          <option value="table-1">Table 01</option>
          <option value="table-2">Table 02</option>
          <option value="table-3">Table 03</option>
          <option value="table-4">Table 04</option>
          <option value="table-5">Table 05</option>
        </select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', fontSize: 13, cursor: 'pointer' }}>
        <Calendar size={14} color="var(--muted-foreground)" />
        <span>Today</span>
      </div>

      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '10px 16px',
          borderRadius: 8,
          border: '1px solid var(--border)',
          background: '#fff',
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--primary)',
          cursor: 'pointer',
        }}
      >
        <Filter size={14} />
        Filters
      </button>
    </div>
  )
}
