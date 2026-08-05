import { Search, SlidersHorizontal } from 'lucide-react'

interface PosTopBarProps {
  table: string
  onTableChange: (t: string) => void
  guests: number
  onGuestsChange: (n: number) => void
  orderType: 'dine-in' | 'takeaway'
  onOrderTypeChange: (t: 'dine-in' | 'takeaway') => void
  searchQuery: string
  onSearchChange: (q: string) => void
}

const tables = Array.from({ length: 20 }, (_, i) => `Table ${i + 1}`)
const guestCounts = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12]

export default function PosTopBar({ table, onTableChange, guests, onGuestsChange, orderType, onOrderTypeChange, searchQuery, onSearchChange }: PosTopBarProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
      <div style={{ position: 'relative' }}>
        <select
          value={table}
          onChange={(e) => onTableChange(e.target.value)}
          style={{
            padding: '10px 36px 10px 14px', borderRadius: 8, border: '1px solid var(--border)',
            background: '#fff', fontSize: 13, cursor: 'pointer', appearance: 'none', outline: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235D6D7E' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
          }}
        >
          {tables.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div style={{ position: 'relative' }}>
        <select
          value={guests}
          onChange={(e) => onGuestsChange(Number(e.target.value))}
          style={{
            padding: '10px 36px 10px 14px', borderRadius: 8, border: '1px solid var(--border)',
            background: '#fff', fontSize: 13, cursor: 'pointer', appearance: 'none', outline: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235D6D7E' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
          }}
        >
          {guestCounts.map((n) => <option key={n} value={n}>{n} Guests</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
        <button
          onClick={() => onOrderTypeChange('dine-in')}
          style={{
            padding: '10px 20px', border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            background: orderType === 'dine-in' ? 'var(--primary)' : '#fff',
            color: orderType === 'dine-in' ? '#fff' : 'var(--foreground)',
          }}
        >Dine In</button>
        <button
          onClick={() => onOrderTypeChange('takeaway')}
          style={{
            padding: '10px 20px', border: 'none', borderLeft: '1px solid var(--border)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            background: orderType === 'takeaway' ? 'var(--primary)' : '#fff',
            color: orderType === 'takeaway' ? '#fff' : 'var(--foreground)',
          }}
        >Takeaway</button>
      </div>

      <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 300 }}>
        <Search size={16} color="var(--muted-foreground)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%', padding: '10px 14px 10px 36px', borderRadius: 8,
            border: '1px solid var(--border)', background: 'var(--muted)', fontSize: 13,
            color: 'var(--foreground)', outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      <button style={{
        width: 40, height: 40, borderRadius: 8, border: '1px solid var(--border)',
        background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <SlidersHorizontal size={16} color="var(--muted-foreground)" />
      </button>
    </div>
  )
}
