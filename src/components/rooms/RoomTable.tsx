import { useState } from 'react'
import { ChevronLeft, ChevronRight, ArrowUpDown, Wifi, Monitor, Snowflake, MoreVertical, Pencil, Trash2, RefreshCw, Eye } from 'lucide-react'

export interface Room {
  number: string
  type: string
  bedInfo: string
  floor: string
  status: string
  capacity: number
  price: string
  features: string[]
  image: string
}

export const allRooms: Room[] = [
  { number: '101', type: 'Deluxe Room', bedInfo: '1 King Bed', floor: '1st Floor', status: 'Occupied', capacity: 2, price: 'NPR 8,000', features: ['wifi', 'tv', 'ac'], image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200&h=140&fit=crop' },
  { number: '102', type: 'Suite Room', bedInfo: '1 King Bed', floor: '1st Floor', status: 'Available', capacity: 2, price: 'NPR 12,000', features: ['wifi', 'tv', 'ac'], image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=200&h=140&fit=crop' },
  { number: '103', type: 'Standard Room', bedInfo: '2 Single Beds', floor: '1st Floor', status: 'Cleaning', capacity: 2, price: 'NPR 6,000', features: ['wifi', 'tv', 'ac'], image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=200&h=140&fit=crop' },
  { number: '104', type: 'Deluxe Room', bedInfo: '1 King Bed', floor: '1st Floor', status: 'Occupied', capacity: 2, price: 'NPR 8,000', features: ['wifi', 'tv', 'ac'], image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=200&h=140&fit=crop' },
  { number: '201', type: 'Suite Room', bedInfo: '1 King Bed', floor: '2nd Floor', status: 'Available', capacity: 2, price: 'NPR 12,000', features: ['wifi', 'tv', 'ac'], image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=200&h=140&fit=crop' },
  { number: '202', type: 'Standard Room', bedInfo: '2 Single Beds', floor: '2nd Floor', status: 'Maintenance', capacity: 2, price: 'NPR 6,000', features: ['wifi', 'tv', 'ac'], image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=200&h=140&fit=crop' },
  { number: '203', type: 'Deluxe Room', bedInfo: '1 King Bed', floor: '2nd Floor', status: 'Occupied', capacity: 2, price: 'NPR 8,000', features: ['wifi', 'tv', 'ac'], image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=200&h=140&fit=crop' },
  { number: '204', type: 'Family Room', bedInfo: '1 King + 1 Single Bed', floor: '2nd Floor', status: 'Available', capacity: 3, price: 'NPR 10,000', features: ['wifi', 'tv', 'ac'], image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=200&h=140&fit=crop' },
  { number: '301', type: 'Presidential Suite', bedInfo: '1 King Bed', floor: '3rd Floor', status: 'Occupied', capacity: 2, price: 'NPR 25,000', features: ['wifi', 'tv', 'ac'], image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=200&h=140&fit=crop' },
  { number: '302', type: 'Suite Room', bedInfo: '1 King Bed', floor: '3rd Floor', status: 'Available', capacity: 2, price: 'NPR 12,000', features: ['wifi', 'tv', 'ac'], image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&h=140&fit=crop' },
  { number: '303', type: 'Deluxe Room', bedInfo: '1 King Bed', floor: '3rd Floor', status: 'Cleaning', capacity: 2, price: 'NPR 8,000', features: ['wifi', 'tv', 'ac'], image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=200&h=140&fit=crop' },
  { number: '304', type: 'Standard Room', bedInfo: '2 Single Beds', floor: '3rd Floor', status: 'Available', capacity: 2, price: 'NPR 6,000', features: ['wifi', 'tv', 'ac'], image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=200&h=140&fit=crop' },
  { number: '305', type: 'Family Room', bedInfo: '1 King + 1 Single Bed', floor: '3rd Floor', status: 'Occupied', capacity: 3, price: 'NPR 10,000', features: ['wifi', 'tv', 'ac'], image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=200&h=140&fit=crop' },
  { number: '401', type: 'Suite Room', bedInfo: '1 King Bed', floor: '3rd Floor', status: 'Occupied', capacity: 2, price: 'NPR 12,000', features: ['wifi', 'tv', 'ac'], image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=200&h=140&fit=crop' },
  { number: '402', type: 'Deluxe Room', bedInfo: '1 King Bed', floor: '3rd Floor', status: 'Available', capacity: 2, price: 'NPR 8,000', features: ['wifi', 'tv', 'ac'], image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=200&h=140&fit=crop' },
]

export const statusColors: Record<string, { bg: string; text: string }> = {
  Occupied: { bg: '#dcfce7', text: '#16a34a' },
  Available: { bg: '#dcfce7', text: '#16a34a' },
  Cleaning: { bg: '#fff7ed', text: '#ea580c' },
  Maintenance: { bg: '#fee2e2', text: '#dc2626' },
  'Out of Order': { bg: '#fee2e2', text: '#dc2626' },
}

const featureIcons: Record<string, typeof Wifi> = { wifi: Wifi, tv: Monitor, ac: Snowflake }

interface RoomTableProps {
  searchQuery: string
  roomType: string
  status: string
  floor: string
  rooms: Room[]
  onEditRoom: (room: Room) => void
  onDeleteRoom: (room: Room) => void
  onChangeStatus: (room: Room, newStatus: string) => void
}

type SortKey = 'number' | 'type' | 'floor' | 'status' | 'capacity' | 'price'

export default function RoomTable({ searchQuery, roomType, status, floor, rooms, onEditRoom, onDeleteRoom, onChangeStatus }: RoomTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('number')
  const [sortAsc, setSortAsc] = useState(true)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; room: Room } | null>(null)

  const filtered = rooms.filter((r) => {
    const matchesSearch = !searchQuery || r.number.includes(searchQuery) || r.type.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = roomType === 'All Types' || r.type === roomType
    const matchesStatus = status === 'All Status' || r.status === status
    const matchesFloor = floor === 'All Floors' || r.floor === floor
    return matchesSearch && matchesType && matchesStatus && matchesFloor
  })

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0
    if (sortKey === 'price') cmp = parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, ''))
    else if (sortKey === 'number') cmp = a.number.localeCompare(b.number)
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
    { key: 'number', label: 'ROOM NO.' },
    { key: 'type', label: 'ROOM TYPE' },
    { key: 'floor', label: 'FLOOR' },
    { key: 'status', label: 'STATUS' },
    { key: 'capacity', label: 'CAPACITY' },
    { key: 'price', label: 'PRICE / NIGHT' },
  ]

  return (
    <>
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--muted)' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  style={{
                    textAlign: 'left', padding: '12px 14px', fontWeight: 600, fontSize: 11,
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
              <th style={{ textAlign: 'left', padding: '12px 14px', fontWeight: 600, fontSize: 11, color: 'var(--muted-foreground)' }}>FEATURES</th>
              <th style={{ textAlign: 'left', padding: '12px 14px', fontWeight: 600, fontSize: 11, color: 'var(--muted-foreground)' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r) => (
              <tr key={r.number} style={{ borderBottom: '1px solid var(--border)' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--muted)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '12px 14px', color: 'var(--primary)', fontWeight: 600 }}>{r.number}</td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img
                      src={r.image}
                      alt={r.type}
                      style={{ width: 56, height: 40, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div>
                      <div style={{ fontWeight: 500 }}>{r.type}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{r.bedInfo}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 14px' }}>{r.floor}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                    background: statusColors[r.status]?.bg, color: statusColors[r.status]?.text,
                  }}>
                    {r.status}
                  </span>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    {r.capacity}
                  </span>
                </td>
                <td style={{ padding: '12px 14px', fontWeight: 600 }}>{r.price}</td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {r.features.map((f) => {
                      const Icon = featureIcons[f]
                      return Icon ? <Icon key={f} size={16} color="var(--muted-foreground)" /> : null
                    })}
                    <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>+2</span>
                  </div>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button onClick={(e) => { e.stopPropagation(); onEditRoom(r) }} style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Pencil size={14} color="var(--muted-foreground)" />
                    </button>
                    <button onClick={(e) => {
                      e.stopPropagation()
                      const rect = e.currentTarget.getBoundingClientRect()
                      setContextMenu({ x: rect.right, y: rect.bottom, room: r })
                    }} style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MoreVertical size={14} color="var(--muted-foreground)" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '40px 14px', textAlign: 'center', color: 'var(--muted-foreground)' }}>
                  No rooms found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
          Showing {sorted.length === 0 ? 0 : ((page - 1) * perPage) + 1} to {Math.min(page * perPage, sorted.length)} of {sorted.length} rooms
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
              disabled={page === totalPages || totalPages === 0}
              style={{
                width: 32, height: 32, borderRadius: 6, border: '1px solid var(--border)',
                background: '#fff', cursor: page === totalPages || totalPages === 0 ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: page === totalPages || totalPages === 0 ? 0.4 : 1,
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <select
            value={perPage}
            onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1) }}
            style={{
              padding: '6px 28px 6px 10px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: '#fff',
              fontSize: 12,
              color: 'var(--foreground)',
              cursor: 'pointer',
              appearance: 'none',
              outline: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%235D6D7E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
            }}
          >
            {[10, 20, 50].map((n) => <option key={n} value={n}>{n} / page</option>)}
          </select>
        </div>
      </div>
    </div>

      {contextMenu && (
        <>
          <div onClick={() => setContextMenu(null)} style={{ position: 'fixed', inset: 0, zIndex: 999 }} />
          <div style={{
            position: 'fixed', left: contextMenu.x, top: contextMenu.y, zIndex: 1000,
            background: '#fff', borderRadius: 10, border: '1px solid var(--border)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)', padding: 6, minWidth: 180,
          }}>
            {[
              { icon: Eye, label: 'View Details', action: () => { onEditRoom(contextMenu.room); setContextMenu(null) } },
              { icon: Pencil, label: 'Edit Room', action: () => { onEditRoom(contextMenu.room); setContextMenu(null) } },
              { icon: RefreshCw, label: 'Change Status', action: () => {
                const order = ['Available', 'Occupied', 'Cleaning', 'Maintenance', 'Out of Order']
                const idx = order.indexOf(contextMenu.room.status)
                const next = order[(idx + 1) % order.length]
                onChangeStatus(contextMenu.room, next)
                setContextMenu(null)
              }},
              { divider: true },
              { icon: Trash2, label: 'Delete Room', danger: true, action: () => { onDeleteRoom(contextMenu.room); setContextMenu(null) } },
            ].map((item, i) =>
              item.divider ? (
                <div key={i} style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
              ) : (
                <button key={i} onClick={item.action} style={{
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 12px',
                  borderRadius: 6, border: 'none', background: 'none', cursor: 'pointer', fontSize: 13,
                  color: (item as any).danger ? '#dc2626' : 'var(--foreground)',
                  textAlign: 'left',
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--muted)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  {item.icon && <item.icon size={14} />}
                  {item.label}
                </button>
              )
            )}
          </div>
        </>
      )}
    </>
  )
}
