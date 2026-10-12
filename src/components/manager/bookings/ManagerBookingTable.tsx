import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import { useEditBookingStore } from '../../../stores/editBookingStore'
import { useBookingStatusStore } from '../../../stores/bookingStatusStore'
import { DEMO_BOOKINGS } from './demoBookings'

export interface BookingRow {
  id: string
  guest: string
  room: string
  roomType: string
  checkIn: string
  checkOut: string
  guests: number
  source: string
  paymentStatus: string
  status: string
  createdAt?: string
}

interface ManagerBookingTableProps {
  bookings: BookingRow[]
  onNewBooking?: () => void
}

const statusColors: Record<string, { bg: string; text: string }> = {
  Confirmed: { bg: '#dcfce7', text: '#166534' },
  Pending: { bg: '#fef3c7', text: '#92400e' },
  'Checked-in': { bg: '#dbeafe', text: '#1e40af' },
  'Checked-out': { bg: '#f3f4f6', text: '#374151' },
  Cancelled: { bg: '#fee2e2', text: '#991b1b' },
}

const paymentColors: Record<string, { bg: string; text: string }> = {
  Paid: { bg: '#dcfce7', text: '#166534' },
  Partial: { bg: '#fef3c7', text: '#92400e' },
  Unpaid: { bg: '#fee2e2', text: '#991b1b' },
  Refunded: { bg: '#f3f4f6', text: '#374151' },
}

const ITEMS_PER_PAGE = 8

export default function ManagerBookingTable({ bookings, onNewBooking }: ManagerBookingTableProps) {
  const navigate = useNavigate()
  const openEditBooking = useEditBookingStore((s) => s.open)
  const setBookingStatus = useBookingStatusStore((s) => s.setStatus)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<keyof BookingRow>('id')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [openMenuRowId, setOpenMenuRowId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

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
    return [...bookings].sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      const cmp = String(aVal).localeCompare(String(bVal))
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [bookings, sortField, sortDir])

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE)
  const paginated = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, sorted.length)

  const handleSort = (field: keyof BookingRow) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const columns: { key: keyof BookingRow; label: string; width?: string }[] = [
    { key: 'id', label: 'BOOKING ID', width: '110px' },
    { key: 'guest', label: 'GUEST' },
    { key: 'room', label: 'ROOM' },
    { key: 'checkIn', label: 'CHECK-IN' },
    { key: 'checkOut', label: 'CHECK-OUT' },
    { key: 'guests', label: 'GUESTS', width: '80px' },
    { key: 'source', label: 'SOURCE' },
    { key: 'paymentStatus', label: 'PAYMENT' },
    { key: 'status', label: 'STATUS' },
  ]

  const headerStyle: React.CSSProperties = {
    padding: '12px 16px',
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
    padding: '14px 16px',
    fontSize: 13,
    color: '#374151',
    borderBottom: '1px solid #f3f4f6',
  }

  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
    }}>
      {/* Table Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>Bookings</h3>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#9ca3af' }}>
            {sorted.length} total bookings, page {currentPage}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={onNewBooking}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 18px', borderRadius: 8, border: 'none',
              background: '#3b82f6', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            + New Booking
          </button>
          <button
            onClick={() => toast.success('Bookings exported as CSV')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 8, border: '1px solid #e5e7eb',
              background: '#fff', fontSize: 13, fontWeight: 500, color: '#374151', cursor: 'pointer',
            }}>
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
              <th style={{ ...headerStyle, width: '60px', cursor: 'default' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((booking) => {
              const statusStyle = statusColors[booking.status] || { bg: '#f3f4f6', text: '#374151' }
              const paymentStyle = paymentColors[booking.paymentStatus] || { bg: '#f3f4f6', text: '#374151' }
              return (
                <tr
                  key={booking.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/manager/bookings/${booking.id}`)}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ ...cellStyle, fontWeight: 600, color: '#111827' }}>{booking.id}</td>
                  <td style={cellStyle}>{booking.guest}</td>
                  <td style={cellStyle}>{booking.room}</td>
                  <td style={cellStyle}>{booking.checkIn}</td>
                  <td style={cellStyle}>{booking.checkOut}</td>
                  <td style={cellStyle}>{booking.guests}</td>
                  <td style={cellStyle}>{booking.source}</td>
                  <td style={cellStyle}>
                    <span style={{
                      padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                      background: paymentStyle.bg, color: paymentStyle.text,
                    }}>
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td style={cellStyle}>
                    <span style={{
                      padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                      background: statusStyle.bg, color: statusStyle.text,
                    }}>
                      {booking.status}
                    </span>
                  </td>
                  <td style={{ ...cellStyle, position: 'relative' }}>
                    <div ref={openMenuRowId === booking.id ? menuRef : undefined}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenMenuRowId(openMenuRowId === booking.id ? null : booking.id)
                        }}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: 18, color: '#9ca3af', padding: '0 4px',
                        }}
                      >
                        ⋯
                      </button>
                      {openMenuRowId === booking.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            position: 'absolute', right: 16, top: '100%', zIndex: 50,
                            background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)', minWidth: 200, padding: '8px 0',
                          }}
                        >
                          <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid #f3f4f6' }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Booking Actions</div>
                            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Actions for the selected booking</div>
                          </div>
                          <div style={{ padding: '4px 0' }}>
                            {[
                              { label: 'View Details', color: '#3b82f6', action: 'view' },
                              { label: 'Edit Booking', color: '#3b82f6', action: 'edit' },
                              { label: 'Check-in Guest', color: '#16a34a', action: 'checkin' },
                              { label: 'Payment & Invoice', color: '#ea580c', action: 'payment' },
                              { label: 'Cancel Booking', color: '#dc2626', action: 'cancel' },
                            ].map((item) => (
                              <button
                                key={item.label}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setOpenMenuRowId(null)
                                  if (item.action === 'view') {
                                    navigate(`/manager/bookings/${booking.id}`)
                                  } else if (item.action === 'edit') {
                                    if (DEMO_BOOKINGS.some((b) => b.id === booking.id)) {
                                      openEditBooking(booking.id)
                                    } else {
                                      toast.error('Editing is not available for this booking yet.')
                                    }
                                  } else if (item.action === 'checkin') {
                                    setBookingStatus(booking.id, 'Checked-in')
                                    toast.success(`${booking.guest} checked in · Room ${booking.room}`)
                                  } else if (item.action === 'payment') {
                                    navigate('/manager/billing')
                                    toast(`Opening billing for ${booking.id}`, { icon: '💳' })
                                  } else if (item.action === 'cancel') {
                                    setBookingStatus(booking.id, 'Cancelled')
                                    toast.success(`Booking ${booking.id} cancelled`)
                                  }
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
                  No bookings found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid #e5e7eb' }}>
        <span style={{ fontSize: 13, color: '#6b7280' }}>
          Showing {sorted.length > 0 ? startItem : 0}-{endItem} of {sorted.length} bookings
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
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNum: number
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (currentPage <= 3) {
              pageNum = i + 1
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = currentPage - 2 + i
            }
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                style={{
                  width: 32, height: 32, borderRadius: 6, border: '1px solid #e5e7eb',
                  background: currentPage === pageNum ? '#3b82f6' : '#fff',
                  color: currentPage === pageNum ? '#fff' : '#374151',
                  cursor: 'pointer',
                  fontSize: 13, fontWeight: 500,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {pageNum}
              </button>
            )
          })}
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
