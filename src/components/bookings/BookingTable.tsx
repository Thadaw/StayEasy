import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react'

export interface Booking {
  id: string
  guest: string
  email: string
  roomType: string
  roomNumber: string
  checkIn: string
  checkOut: string
  nights: number
  status: string
  amount: string
  paymentStatus: string
}

export const statusColors: Record<string, { bg: string; text: string }> = {
  Confirmed: { bg: '#dcfce7', text: '#16a34a' },
  Pending: { bg: '#fef3c7', text: '#d97706' },
  Cancelled: { bg: '#fee2e2', text: '#dc2626' },
  'Checked-in': { bg: '#dbeafe', text: '#2563eb' },
  'Checked-out': { bg: '#f3f4f6', text: '#6b7280' },
}

const paymentColors: Record<string, { bg: string; text: string }> = {
  Paid: { bg: '#dcfce7', text: '#16a34a' },
  Pending: { bg: '#fef3c7', text: '#d97706' },
  Refunded: { bg: '#ede9fe', text: '#7c3aed' },
}

interface BookingTableProps {
  bookings: Booking[]
  searchQuery: string
  activeStatus: string
  roomType: string
  dateFilter: string
}

type SortKey = 'id' | 'guest' | 'roomType' | 'checkIn' | 'checkOut' | 'amount' | 'status'

export default function BookingTable({ bookings, searchQuery, activeStatus, roomType, dateFilter }: BookingTableProps) {
  const navigate = useNavigate()
  const [sortKey, setSortKey] = useState<SortKey>('id')
  const [sortAsc, setSortAsc] = useState(true)
  const [page, setPage] = useState(1)
  const perPage = 8

  const filtered = bookings.filter((b) => {
    const matchesSearch = searchQuery === '' || b.guest.toLowerCase().includes(searchQuery.toLowerCase()) || b.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = activeStatus === 'All' || b.status === activeStatus
    const matchesRoom = roomType === 'All Rooms' || b.roomType.toLowerCase().includes(roomType.toLowerCase())
    const matchesDate = dateFilter === '' || b.checkIn === new Date(dateFilter).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    return matchesSearch && matchesStatus && matchesRoom && matchesDate
  })

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0
    if (sortKey === 'amount') cmp = parseInt(a.amount.replace(/\D/g, '')) - parseInt(b.amount.replace(/\D/g, ''))
    else if (sortKey === 'checkIn' || sortKey === 'checkOut') cmp = new Date(a[sortKey]).getTime() - new Date(b[sortKey]).getTime()
    else cmp = String(a[sortKey]).localeCompare(String(b[sortKey]))
    return sortAsc ? cmp : -cmp
  })

  const totalPages = Math.ceil(sorted.length / perPage)
  const paged = sorted.slice((page - 1) * perPage, page * perPage)

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(true) }
  }

  const columns: { key: SortKey; label: string }[] = [
    { key: 'id', label: 'BOOKING ID' },
    { key: 'guest', label: 'GUEST' },
    { key: 'roomType', label: 'ROOM TYPE' },
    { key: 'checkIn', label: 'CHECK-IN' },
    { key: 'checkOut', label: 'CHECK-OUT' },
    { key: 'status', label: 'STATUS' },
    { key: 'amount', label: 'AMOUNT' },
  ]

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>All Bookings ({filtered.length})</h3>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--muted)' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  style={{
                    textAlign: 'left', padding: '10px 14px', fontWeight: 600, fontSize: 11,
                    color: 'var(--muted-foreground)', cursor: 'pointer', userSelect: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {col.label}
                    <ArrowUpDown size={12} color={sortKey === col.key ? 'var(--primary)' : '#ccc'} />
                  </span>
                </th>
              ))}
              <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 600, fontSize: 11, color: 'var(--muted-foreground)' }}>PAYMENT</th>
              <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 600, fontSize: 11, color: 'var(--muted-foreground)' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((b) => (
              <tr key={b.id} onClick={() => navigate(`/host/bookings/${b.id}`)} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--muted)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '12px 14px', color: 'var(--primary)', fontWeight: 600 }}>{b.id}</td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ fontWeight: 500 }}>{b.guest}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{b.email}</div>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <div>{b.roomType}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{b.roomNumber === '1' ? '1 room' : `${b.roomNumber} rooms`}</div>
                </td>
                <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>{b.checkIn}</td>
                <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>{b.checkOut}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                    background: statusColors[b.status]?.bg, color: statusColors[b.status]?.text,
                  }}>
                    {b.status}
                  </span>
                </td>
                <td style={{ padding: '12px 14px', fontWeight: 600 }}>{b.amount}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                    background: paymentColors[b.paymentStatus]?.bg, color: paymentColors[b.paymentStatus]?.text,
                  }}>
                    {b.paymentStatus}
                  </span>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/host/bookings/${b.id}`) }}
                    style={{
                      padding: '4px 12px', borderRadius: 6, border: '1px solid var(--border)',
                      background: '#fff', cursor: 'pointer', fontSize: 12, color: 'var(--foreground)',
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={9} style={{ padding: '40px 14px', textAlign: 'center', color: 'var(--muted-foreground)' }}>
                  No bookings found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
            Showing {((page - 1) * perPage) + 1}–{Math.min(page * perPage, sorted.length)} of {sorted.length}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              style={{
                width: 32, height: 32, borderRadius: 6, border: '1px solid var(--border)',
                background: '#fff', cursor: page === 1 ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: page === 1 ? 0.4 : 1,
              }}
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  width: 32, height: 32, borderRadius: 6,
                  border: p === page ? '1px solid var(--primary)' : '1px solid var(--border)',
                  background: p === page ? 'var(--primary)' : '#fff',
                  color: p === page ? '#fff' : 'var(--foreground)',
                  cursor: 'pointer', fontSize: 13, fontWeight: 500,
                }}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              style={{
                width: 32, height: 32, borderRadius: 6, border: '1px solid var(--border)',
                background: '#fff', cursor: page === totalPages ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: page === totalPages ? 0.4 : 1,
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
