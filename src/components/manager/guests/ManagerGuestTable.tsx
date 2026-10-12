import { useEffect, useMemo, useRef, useState } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import GuestActionsMenu, { type GuestAction } from './GuestActionsMenu'
import { STATUS_PILL, TYPE_PILL, getInitials, formatPoints, type GuestRow } from './demoGuests'

const ITEMS_PER_PAGE = 7

interface ManagerGuestTableProps {
  guests: GuestRow[]
  onAction: (guest: GuestRow, action: GuestAction) => void
}

function getPageItems(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set<number>([1, total, current, current - 1, current + 1])
  if (current <= 3) [2, 3].forEach((p) => pages.add(p))
  if (current >= total - 2) [total - 2, total - 1].forEach((p) => pages.add(p))
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const items: (number | '…')[] = []
  let prev = 0
  for (const p of sorted) {
    if (prev && p - prev > 1) items.push('…')
    items.push(p)
    prev = p
  }
  return items
}

export default function ManagerGuestTable({ guests, onAction }: ManagerGuestTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const pageCount = Math.max(1, Math.ceil(guests.length / ITEMS_PER_PAGE))
  const page = Math.min(currentPage, pageCount)

  useEffect(() => {
    setCurrentPage(1)
  }, [guests])

  useEffect(() => {
    if (!openMenuId) return
    const handleMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenuId(null)
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [openMenuId])

  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const pageRows = useMemo(
    () => guests.slice(startIndex, startIndex + ITEMS_PER_PAGE),
    [guests, startIndex],
  )

  const headerStyle: React.CSSProperties = {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: 11,
    fontWeight: 700,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid #e5e7eb',
    whiteSpace: 'nowrap',
  }

  const cellStyle: React.CSSProperties = {
    padding: '14px 16px',
    fontSize: 13,
    color: '#374151',
    borderBottom: '1px solid #f3f4f6',
    verticalAlign: 'middle',
  }

  const pageButtonStyle = (active: boolean): React.CSSProperties => ({
    minWidth: 32,
    height: 32,
    padding: '0 8px',
    borderRadius: 6,
    border: 'none',
    background: active ? '#111827' : 'transparent',
    color: active ? '#fff' : '#374151',
    fontSize: 13,
    fontWeight: active ? 600 : 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  })

  const from = guests.length === 0 ? 0 : startIndex + 1
  const to = Math.min(startIndex + ITEMS_PER_PAGE, guests.length)

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1120 }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={headerStyle}>Guest</th>
              <th style={headerStyle}>Contact</th>
              <th style={headerStyle}>Current Last Stay</th>
              <th style={{ ...headerStyle, textAlign: 'center' }}>Total Stays</th>
              <th style={headerStyle}>Guest Type</th>
              <th style={headerStyle}>Loyalty</th>
              <th style={headerStyle}>Status</th>
              <th style={headerStyle}>Ratings</th>
              <th style={headerStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((guest) => {
              const typeStyle = TYPE_PILL[guest.type]
              const statusStyle = STATUS_PILL[guest.status]
              return (
                <tr
                  key={guest.id}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: guest.avatarColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: 12,
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {getInitials(guest.name)}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{guest.name}</div>
                        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>ID: {guest.guestCode}</div>
                      </div>
                    </div>
                  </td>
                  <td style={cellStyle}>
                    <div style={{ fontSize: 13, color: '#374151' }}>{guest.phone}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{guest.email}</div>
                  </td>
                  <td style={cellStyle}>
                    <div style={{ fontSize: 13, color: '#374151' }}>{guest.stayPrimary}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{guest.staySecondary}</div>
                  </td>
                  <td style={{ ...cellStyle, textAlign: 'center', fontWeight: 600, color: '#111827' }}>
                    {guest.totalStays}
                  </td>
                  <td style={cellStyle}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 500,
                        background: typeStyle.background,
                        color: typeStyle.color,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {guest.type}
                    </span>
                  </td>
                  <td style={cellStyle}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{guest.loyaltyTier}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                      {formatPoints(guest.loyaltyPoints)} pts
                    </div>
                  </td>
                  <td style={cellStyle}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 500,
                        background: statusStyle.background,
                        color: statusStyle.color,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {guest.status}
                    </span>
                  </td>
                  <td style={cellStyle}>
                    {guest.rating > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Star size={13} color="#f59e0b" fill="#f59e0b" />
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                          {guest.rating.toFixed(1)}
                        </span>
                      </div>
                    ) : (
                      <span style={{ fontSize: 13, color: '#9ca3af' }}>—</span>
                    )}
                  </td>
                  <td style={{ ...cellStyle, position: 'relative' }}>
                    <div ref={openMenuId === guest.id ? menuRef : undefined}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenMenuId(openMenuId === guest.id ? null : guest.id)
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: 18,
                          lineHeight: 1,
                          color: '#9ca3af',
                          padding: '0 4px',
                        }}
                      >
                        ⋮
                      </button>
                      {openMenuId === guest.id && (
                        <GuestActionsMenu
                          guest={guest}
                          onAction={(action) => {
                            setOpenMenuId(null)
                            onAction(guest, action)
                          }}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={9} style={{ ...cellStyle, textAlign: 'center', padding: '32px 16px', color: '#9ca3af' }}>
                  No guests found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          padding: '14px 20px',
        }}
      >
        <div style={{ fontSize: 13, color: '#6b7280' }}>
          Showing {from}–{to} of {guests.length} guests
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, Math.min(p, pageCount) - 1))}
            disabled={page <= 1}
            style={{
              ...pageButtonStyle(false),
              opacity: page <= 1 ? 0.4 : 1,
              cursor: page <= 1 ? 'default' : 'pointer',
            }}
          >
            <ChevronLeft size={15} />
          </button>
          {getPageItems(page, pageCount).map((item, index) =>
            item === '…' ? (
              <span key={`gap-${index}`} style={{ padding: '0 4px', fontSize: 13, color: '#9ca3af' }}>
                …
              </span>
            ) : (
              <button
                key={item}
                onClick={() => setCurrentPage(item)}
                style={pageButtonStyle(item === page)}
                onMouseEnter={(e) => {
                  if (item !== page) e.currentTarget.style.background = '#f3f4f6'
                }}
                onMouseLeave={(e) => {
                  if (item !== page) e.currentTarget.style.background = 'transparent'
                }}
              >
                {item}
              </button>
            ),
          )}
          <button
            onClick={() => setCurrentPage((p) => Math.min(pageCount, Math.min(p, pageCount) + 1))}
            disabled={page >= pageCount}
            style={{
              ...pageButtonStyle(false),
              opacity: page >= pageCount ? 0.4 : 1,
              cursor: page >= pageCount ? 'default' : 'pointer',
            }}
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
