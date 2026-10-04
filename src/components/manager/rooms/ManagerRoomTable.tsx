import { useState, useMemo, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatNPR } from '../bookings/demoBookings'
import { ROOM_STATUS_COLORS, HOUSEKEEPING_COLORS, type RoomRow } from './demoRooms'

interface ManagerRoomTableProps {
  rooms: RoomRow[]
  onViewRoom: (room: RoomRow) => void
  onEditRoom: (room: RoomRow) => void
  onChangeStatus: (room: RoomRow) => void
  onDeleteRoom: (room: RoomRow) => void
}

type SortKey = 'number' | 'type' | 'floor' | 'status' | 'capacity' | 'price'

const ITEMS_PER_PAGE = 8

export default function ManagerRoomTable({
  rooms, onViewRoom, onEditRoom, onChangeStatus, onDeleteRoom,
}: ManagerRoomTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<SortKey>('number')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [openMenuRowId, setOpenMenuRowId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCurrentPage(1)
  }, [rooms.length])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuRowId(null)
      }
    }
    if (openMenuRowId) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openMenuRowId])

  const sorted = useMemo(() => {
    return [...rooms].sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      const cmp = typeof aVal === 'number' && typeof bVal === 'number'
        ? aVal - bVal
        : String(aVal).localeCompare(String(bVal))
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [rooms, sortField, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE))
  const paginated = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  const startItem = sorted.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, sorted.length)

  const handleSort = (field: SortKey) => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const columns: { key: SortKey; label: string; width?: string }[] = [
    { key: 'number', label: 'ROOM NO.', width: '96px' },
    { key: 'type', label: 'ROOM TYPE' },
    { key: 'floor', label: 'FLOOR', width: '90px' },
    { key: 'status', label: 'STATUS', width: '116px' },
    { key: 'capacity', label: 'CAPACITY', width: '110px' },
    { key: 'price', label: 'PRICE / NIGHT', width: '130px' },
  ]

  const headerStyle: React.CSSProperties = {
    padding: '12px 12px',
    textAlign: 'left',
    fontSize: 11,
    fontWeight: 700,
    color: '#6b7280',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    borderBottom: '1px solid #e5e7eb',
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  }

  const cellStyle: React.CSSProperties = {
    padding: '14px 12px',
    fontSize: 13,
    color: '#374151',
    borderBottom: '1px solid #f3f4f6',
  }

  const menuItems = [
    { label: 'View Details', color: '#3b82f6', run: onViewRoom },
    { label: 'Edit Room', color: '#3b82f6', run: onEditRoom },
    { label: 'Change Status', color: '#16a34a', run: onChangeStatus },
    { label: 'Delete Room', color: '#dc2626', run: onDeleteRoom },
  ]

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1040 }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  style={{ ...headerStyle, width: col.width }}
                >
                  {col.label}
                  {sortField === col.key && (
                    <span style={{ marginLeft: 4 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
              ))}
              <th style={headerStyle}>FEATURES</th>
              <th style={headerStyle}>GUEST / STAY</th>
              <th style={headerStyle}>HOUSEKEEPING</th>
              <th style={{ ...headerStyle, width: '60px', cursor: 'default' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((room) => {
              const statusStyle = ROOM_STATUS_COLORS[room.status] ?? { bg: '#f3f4f6', text: '#374151' }
              const hkStyle = HOUSEKEEPING_COLORS[room.housekeeping]
              return (
                <tr
                  key={room.id}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ ...cellStyle, fontWeight: 600, color: '#111827' }}>#{room.number}</td>
                  <td style={{ ...cellStyle, whiteSpace: 'nowrap' }}>
                    <div style={{ fontWeight: 500, color: '#111827' }}>{room.type}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{room.bedInfo}</div>
                  </td>
                  <td style={cellStyle}>{room.floor}</td>
                  <td style={cellStyle}>
                    <span style={{
                      padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                      background: statusStyle.bg, color: statusStyle.text, whiteSpace: 'nowrap',
                    }}>
                      {room.status}
                    </span>
                  </td>
                  <td style={cellStyle}>{room.capacity} Guests</td>
                  <td style={{ ...cellStyle, fontWeight: 600, color: '#111827' }}>{formatNPR(room.price)}</td>
                  <td style={{ ...cellStyle, fontSize: 12, color: '#6b7280' }}>
                    {room.features.join(' · ')}
                  </td>
                  <td style={{ ...cellStyle, whiteSpace: 'nowrap' }}>
                    {room.guestStay === '—'
                      ? <span style={{ color: '#d1d5db' }}>—</span>
                      : room.guestStay}
                  </td>
                  <td style={cellStyle}>
                    {hkStyle ? (
                      <span style={{
                        padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                        background: hkStyle.bg, color: hkStyle.text, whiteSpace: 'nowrap',
                      }}>
                        {room.housekeeping}
                      </span>
                    ) : (
                      <span style={{ color: '#d1d5db' }}>—</span>
                    )}
                  </td>
                  <td style={{ ...cellStyle, position: 'relative' }}>
                    <div ref={openMenuRowId === room.id ? menuRef : undefined}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenMenuRowId(openMenuRowId === room.id ? null : room.id)
                        }}
                        aria-label={`Actions for room ${room.number}`}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: 18, color: '#9ca3af', padding: '0 4px',
                        }}
                      >
                        ⋯
                      </button>
                      {openMenuRowId === room.id && (
                        <div style={{
                          position: 'absolute', right: 16, top: '100%', zIndex: 50,
                          background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)', minWidth: 190, padding: '8px 0',
                        }}>
                          <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid #f3f4f6' }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Room Actions</div>
                            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Room #{room.number}</div>
                          </div>
                          <div style={{ padding: '4px 0' }}>
                            {menuItems.map((item) => (
                              <button
                                key={item.label}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setOpenMenuRowId(null)
                                  item.run(room)
                                }}
                                style={{
                                  display: 'block', width: '100%', textAlign: 'left',
                                  padding: '10px 16px', background: 'none', border: 'none',
                                  fontSize: 14, fontWeight: 500, color: item.color, cursor: 'pointer',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={10} style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>
                  No rooms found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid #e5e7eb' }}>
        <span style={{ fontSize: 13, color: '#6b7280' }}>
          Showing {startItem}-{endItem} of {sorted.length} rooms
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              width: 32, height: 32, borderRadius: 6, border: '1px solid #e5e7eb',
              background: currentPage === 1 ? '#f9fafb' : '#fff',
              color: currentPage === 1 ? '#d1d5db' : '#374151',
              cursor: currentPage === 1 ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              style={{
                width: 32, height: 32, borderRadius: 6, border: '1px solid #e5e7eb',
                background: currentPage === pageNum ? '#3b82f6' : '#fff',
                color: currentPage === pageNum ? '#fff' : '#374151',
                cursor: 'pointer', fontSize: 13, fontWeight: 500,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {pageNum}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{
              width: 32, height: 32, borderRadius: 6, border: '1px solid #e5e7eb',
              background: currentPage === totalPages ? '#f9fafb' : '#fff',
              color: currentPage === totalPages ? '#d1d5db' : '#374151',
              cursor: currentPage === totalPages ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
