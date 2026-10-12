import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil, LogIn, XCircle, MapPin, Mail, Phone, Globe, IdCard, Award, Clock, FileText, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import ManagerLayout from '../../components/manager/ManagerLayout'
import CheckInOverlay from '../../components/manager/checkin/CheckInOverlay'
import { getDemoBookingDetail, DEMO_BOOKINGS, STATUS_PILL, formatNPR } from '../../components/manager/bookings/demoBookings'
import { useBookingStatusStore } from '../../stores/bookingStatusStore'
import { useEditBookingStore } from '../../stores/editBookingStore'
import { useBookingEditStore, applyBookingEdit } from '../../stores/bookingEditStore'

const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  padding: 24,
}
const cardTitle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: '#111827',
  marginBottom: 16,
}
const rowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 16,
  padding: '7px 0',
  fontSize: 13,
}
const rowLabel: React.CSSProperties = { color: '#6b7280', flexShrink: 0 }
const rowValue: React.CSSProperties = {
  color: '#111827',
  fontWeight: 500,
  textAlign: 'right',
  wordBreak: 'break-word',
}

export default function ManagerBookingDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [showCheckIn, setShowCheckIn] = useState(false)
  const statusOverride = useBookingStatusStore((s) => s.overrides[id])
  const setBookingStatus = useBookingStatusStore((s) => s.setStatus)
  const openEditBooking = useEditBookingStore((s) => s.open)
  const savedEdit = useBookingEditStore((s) => s.edits[id])

  const baseRow = useMemo(() => DEMO_BOOKINGS.find((b) => b.id === id), [id])
  const baseDetail = useMemo(() => getDemoBookingDetail(id), [id])
  const { row, detail } = useMemo(() => {
    if (!baseRow || !baseDetail) return { row: baseRow, detail: baseDetail }
    return applyBookingEdit(baseRow, baseDetail, savedEdit)
  }, [baseRow, baseDetail, savedEdit])

  if (!row || !detail) {
    return (
      <ManagerLayout>
        <div style={{ textAlign: 'center', padding: 64 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#111827' }}>Booking not found</h2>
          <p style={{ margin: '8px 0 20px', fontSize: 14, color: '#6b7280' }}>
            We couldn't find booking <strong>{id}</strong>.
          </p>
          <button
            onClick={() => navigate('/manager/bookings')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 8, border: '1px solid #d1d5db',
              background: '#fff', color: '#374151', fontSize: 14, fontWeight: 500, cursor: 'pointer',
            }}
          >
            <ArrowLeft size={15} /> Back to Bookings
          </button>
        </div>
      </ManagerLayout>
    )
  }

  const status = statusOverride ?? row.status
  const pill = STATUS_PILL[status] ?? { bg: '#f3f4f6', text: '#374151' }
  const money = formatNPR

  const handleCompleteCheckIn = (notes: string) => {
    setBookingStatus(row.id, 'Checked-in')
    setShowCheckIn(false)
    toast.success(
      notes.trim()
        ? `Check-in complete for ${row.guest} · notes saved for the front desk.`
        : `Check-in complete for ${row.guest} · Room ${row.room}.`,
    )
  }

  return (
    <ManagerLayout>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <button
          onClick={() => navigate('/manager/bookings')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 500, color: '#6b7280', padding: 0, marginBottom: 16,
          }}
        >
          <ArrowLeft size={15} /> Back to Bookings
        </button>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          flexWrap: 'wrap', gap: 16, marginBottom: 24,
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}>
              {row.id} · {row.guest}
            </h2>
            <p style={{ margin: '6px 0 0', fontSize: 14, color: '#6b7280' }}>
              Review booking, guest, payment and operational status.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              <span style={{
                padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                background: pill.bg, color: pill.text,
              }}>
                {status}
              </span>
              <span style={{
                padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                background: '#e0f2fe', color: '#075985',
              }}>
                {row.source}
              </span>
              <span style={{
                padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                background: '#f3f4f6', color: '#374151',
              }}>
                {row.paymentStatus}
              </span>
              <span style={{ fontSize: 12, color: '#9ca3af', alignSelf: 'center' }}>
                Created {row.createdAt}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={() => openEditBooking(row.id)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '9px 16px', borderRadius: 8, border: '1px solid #d1d5db',
                background: '#fff', color: '#374151', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              }}
            >
              <Pencil size={14} /> Edit Booking
            </button>
            <button
              onClick={() => setShowCheckIn(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '9px 16px', borderRadius: 8, border: 'none',
                background: '#16a34a', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              <LogIn size={14} /> Check-in
            </button>
            <button
              onClick={() => {
                setBookingStatus(row.id, 'Cancelled')
                toast.success(`Booking ${row.id} cancelled`)
              }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '9px 16px', borderRadius: 8, border: 'none',
                background: '#dc2626', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>
              <XCircle size={14} /> Cancel Booking
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
          {/* Stay & Room */}
          <div style={cardStyle}>
            <h3 style={cardTitle}>Stay &amp; Room</h3>
            <div style={rowStyle}>
              <span style={rowLabel}>Room</span>
              <span style={rowValue}><MapPin size={12} style={{ verticalAlign: -1, marginRight: 4 }} />{detail.roomSummary}</span>
            </div>
            <div style={rowStyle}>
              <span style={rowLabel}>Check-in</span>
              <span style={rowValue}><Clock size={12} style={{ verticalAlign: -1, marginRight: 4 }} />{detail.checkInAt}</span>
            </div>
            <div style={rowStyle}>
              <span style={rowLabel}>Check-out</span>
              <span style={rowValue}><Clock size={12} style={{ verticalAlign: -1, marginRight: 4 }} />{detail.checkOutAt}</span>
            </div>
            <div style={rowStyle}>
              <span style={rowLabel}>Guests</span>
              <span style={rowValue}>{detail.guestsSummary}</span>
            </div>
            <div style={rowStyle}>
              <span style={rowLabel}>Rate Plan</span>
              <span style={rowValue}>{detail.ratePlan}</span>
            </div>
            <div style={rowStyle}>
              <span style={rowLabel}>Room Status</span>
              <span style={{ ...rowValue, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={12} color="#16a34a" />{detail.roomStatus}
              </span>
            </div>
          </div>

          {/* Guest Profile */}
          <div style={cardStyle}>
            <h3 style={cardTitle}>Guest Profile</h3>
            <div style={rowStyle}>
              <span style={rowLabel}>Guest</span>
              <span style={rowValue}>{detail.guestName}</span>
            </div>
            <div style={rowStyle}>
              <span style={rowLabel}>Email</span>
              <span style={rowValue}><Mail size={12} style={{ verticalAlign: -1, marginRight: 4 }} />{detail.guestEmail}</span>
            </div>
            <div style={rowStyle}>
              <span style={rowLabel}>Phone</span>
              <span style={rowValue}><Phone size={12} style={{ verticalAlign: -1, marginRight: 4 }} />{detail.guestPhone}</span>
            </div>
            <div style={rowStyle}>
              <span style={rowLabel}>Nationality</span>
              <span style={rowValue}><Globe size={12} style={{ verticalAlign: -1, marginRight: 4 }} />{detail.guestNationality}</span>
            </div>
            <div style={rowStyle}>
              <span style={rowLabel}>ID / Passport</span>
              <span style={rowValue}><IdCard size={12} style={{ verticalAlign: -1, marginRight: 4 }} />{detail.guestIdPassport}</span>
            </div>
            <div style={rowStyle}>
              <span style={rowLabel}>Loyalty</span>
              <span style={{ ...rowValue, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Award size={12} color="#ca8a04" />{detail.guestLoyalty}
              </span>
            </div>
          </div>

          {/* Payment & Invoice */}
          <div style={cardStyle}>
            <h3 style={cardTitle}>Payment &amp; Invoice</h3>
            <div style={rowStyle}>
              <span style={rowLabel}>Room Charges</span>
              <span style={rowValue}>{money(detail.roomCharges)}</span>
            </div>
            <div style={rowStyle}>
              <span style={rowLabel}>Taxes &amp; Fees</span>
              <span style={rowValue}>{money(detail.taxesFees)}</span>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '10px 0', marginTop: 4, borderTop: '1px solid #e5e7eb',
            }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Total</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{money(detail.total)}</span>
            </div>
            <div style={rowStyle}>
              <span style={rowLabel}>Paid</span>
              <span style={{ ...rowValue, color: '#16a34a' }}>{money(detail.paid)}</span>
            </div>
            <div style={rowStyle}>
              <span style={rowLabel}>Balance</span>
              <span style={{ ...rowValue, color: detail.balance > 0 ? '#dc2626' : '#16a34a' }}>{money(detail.balance)}</span>
            </div>
            <div style={rowStyle}>
              <span style={rowLabel}>Payment Method</span>
              <span style={rowValue}><FileText size={12} style={{ verticalAlign: -1, marginRight: 4 }} />{detail.paymentMethod}</span>
            </div>
          </div>

          {/* Booking Timeline */}
          <div style={cardStyle}>
            <h3 style={cardTitle}>Booking Timeline</h3>
            <div>
              {detail.timeline.map((event, i) => (
                <div key={`${event.label}-${i}`} style={{ display: 'flex', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: '#3b82f6', marginTop: 4,
                    }} />
                    {i < detail.timeline.length - 1 && (
                      <div style={{ width: 2, flex: 1, background: '#e5e7eb', minHeight: 24 }} />
                    )}
                  </div>
                  <div style={{ paddingBottom: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{event.label}</div>
                    <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{event.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notes & Requests */}
        <div style={{ ...cardStyle, marginTop: 20 }}>
          <h3 style={cardTitle}>Notes &amp; Requests</h3>
          <p style={{ margin: 0, fontSize: 13, color: '#374151', lineHeight: 1.7 }}>
            {detail.notes}
          </p>
        </div>
      </div>

      {showCheckIn && (
        <CheckInOverlay
          row={row}
          detail={detail}
          status={status}
          onClose={() => setShowCheckIn(false)}
          onComplete={handleCompleteCheckIn}
        />
      )}
    </ManagerLayout>
  )
}
