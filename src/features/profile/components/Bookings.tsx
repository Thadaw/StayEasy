import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../../services/axios'
import { normalizeBookingStatus } from '../../../shared/utils/format'
import { CalendarDays, Clock, X, ChevronRight, RefreshCw, AlertTriangle } from 'lucide-react'
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner'
import toast from 'react-hot-toast'

type Tab = 'upcoming' | 'completed' | 'cancelled'

const tabs: { key: Tab; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
]

interface ApiBookingItem {
  id: string
  ref_number: string
  status: string
  checkin_date: string
  checkout_date: string
  total_amount: string
  created_at: string
  currency?: string
  property?: { id: string; name?: string; city?: string; country?: string; currency?: string }
  property_name?: string
  property_photo?: string
  photos?: { cover?: string; gallery?: string[] }
}

interface NormalizedBooking {
  id: string
  refNumber: string
  status: Tab
  checkIn: string
  checkOut: string
  totalPrice: number
  createdAt: string
  currency: string
  propertyName: string
  coverPhoto: string
}

interface CancelModal {
  show: boolean
  booking: NormalizedBooking | null
}

function normalizeStatus(status: string): Tab {
  switch ((status || '').toUpperCase()) {
    case 'COMPLETED':
    case 'CHECKED_OUT':
      return 'completed'
    case 'CANCELLED':
    case 'CANCELED':
    case 'CANCELLATION_REQUESTED':
      return 'cancelled'
    default:
      return 'upcoming'
  }
}

function normalizeBooking(item: ApiBookingItem): NormalizedBooking {
  const currency = item.currency || item.property?.currency || ''
  return {
    id: item.id,
    refNumber: item.ref_number,
    status: normalizeStatus(item.status),
    checkIn: item.checkin_date,
    checkOut: item.checkout_date,
    totalPrice: Number(item.total_amount) || 0,
    createdAt: item.created_at,
    currency,
    propertyName: item.property?.name || item.property_name || '',
    coverPhoto: item.photos?.cover || item.property_photo || '',
  }
}

export default function Bookings() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('upcoming')
  const [bookings, setBookings] = useState<NormalizedBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [cancelModal, setCancelModal] = useState<CancelModal>({ show: false, booking: null })
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  const loadBookings = async () => {
    setLoading(true)
    setError(false)
    try {
      const { data } = await api.get('/bookings/me')
      const items: ApiBookingItem[] = data?.data?.items ?? data?.data ?? data?.items ?? []
      setBookings(Array.isArray(items) ? items.map(normalizeBooking) : [])
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const closeCancelModal = useCallback(() => {
    if (!cancellingId) setCancelModal({ show: false, booking: null })
  }, [cancellingId])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCancelModal() }
    if (cancelModal.show) {
      document.addEventListener('keydown', handleEsc)
      return () => document.removeEventListener('keydown', handleEsc)
    }
  }, [cancelModal.show, closeCancelModal])

  const handleCancelBooking = async (booking: NormalizedBooking) => {
    setCancellingId(booking.id)
    try {
      await api.patch(`/bookings/${booking.refNumber}/cancel`)
      setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: 'cancelled' } : b))
      setCancelModal({ show: false, booking: null })
      toast.success('Booking cancelled successfully')
    } catch {
      toast.error('Failed to cancel booking. Please try again.')
    } finally {
      setCancellingId(null)
    }
  }

  const filtered = bookings.filter(b => b.status === activeTab)

  const statusColor = (status: string) => {
    switch (normalizeBookingStatus(status)) {
      case 'upcoming': return 'bg-brand-accent-light text-brand-primary'
      case 'completed': return 'bg-brand-success-light text-brand-success'
      case 'cancelled': return 'bg-brand-danger-light text-brand-danger'
      default: return 'bg-brand-secondary-surface text-brand-text-secondary'
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-xl border border-brand-card-border overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-card-border flex items-center justify-between">
          <h2 className="text-base font-semibold text-brand-heading">My Bookings</h2>
          {!loading && !error && (
            <button
              onClick={loadBookings}
              className="flex items-center gap-1.5 text-xs font-semibold text-brand-text-secondary hover:text-brand-accent transition-colors cursor-pointer"
            >
              <RefreshCw size={12} /> Refresh
            </button>
          )}
        </div>

        <div className="flex border-b border-brand-card-border px-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? 'border-brand-accent text-brand-accent'
                  : 'border-transparent text-brand-text-secondary hover:text-brand-heading'
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-xs opacity-60">({bookings.filter(b => b.status === tab.key).length})</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center py-12">
              <LoadingSpinner className="mb-3" />
              <p className="text-sm text-brand-text-secondary">Loading bookings...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-sm text-brand-text-secondary mb-4">Could not load your bookings.</p>
              <button
                onClick={loadBookings}
                className="px-5 py-2 text-sm font-semibold rounded-lg border-none text-white bg-brand-accent hover:bg-brand-accent-hover transition-colors cursor-pointer"
              >
                Try again
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10">
              {activeTab === 'upcoming' && <CalendarDays size={36} className="text-brand-placeholder mx-auto mb-3" />}
              {activeTab === 'completed' && <Clock size={36} className="text-brand-placeholder mx-auto mb-3" />}
              {activeTab === 'cancelled' && <X size={36} className="text-brand-placeholder mx-auto mb-3" />}
              <p className="text-sm text-brand-text-secondary mb-4">
                {activeTab === 'upcoming' && 'No upcoming bookings'}
                {activeTab === 'completed' && 'No completed bookings yet'}
                {activeTab === 'cancelled' && 'No cancelled bookings'}
              </p>
              {activeTab === 'upcoming' && (
                <button
                  onClick={() => navigate('/')}
                  className="px-5 py-2 text-sm font-semibold rounded-lg border-none text-white bg-brand-accent hover:bg-brand-accent-hover transition-colors cursor-pointer"
                >
                  Browse stays
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(booking => (
                <div
                  key={booking.id}
                  className="rounded-xl border border-brand-card-border overflow-hidden hover:shadow-card transition-shadow"
                >
                  <div className="flex gap-4 p-4">
                    <div className="w-24 h-24 rounded-lg bg-brand-secondary-surface overflow-hidden flex items-center justify-center shrink-0">
                      {booking.coverPhoto ? (
                        <img src={booking.coverPhoto} alt={booking.propertyName || 'Booking'} className="w-full h-full object-cover" />
                      ) : (
                        <CalendarDays size={28} className="text-brand-placeholder" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-sm font-semibold text-brand-heading truncate">
                          {booking.propertyName || `Booking ${booking.refNumber}`}
                        </h3>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ml-2 ${statusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-brand-text-secondary mb-1">
                        {new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {' – '}
                        {new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      {booking.createdAt && (
                        <p className="text-[10px] text-brand-text-secondary mb-1">
                          Booked on {new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}, {new Date(booking.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-brand-heading">
                          {booking.currency ? `${booking.currency} ${booking.totalPrice.toFixed(2)}` : `$${booking.totalPrice.toFixed(2)}`}
                        </span>
                        <div className="flex items-center gap-2">
                          {booking.status === 'upcoming' && (
                            <button
                              onClick={() => setCancelModal({ show: true, booking })}
                              disabled={cancellingId === booking.id}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/booking-view/${booking.refNumber}`)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-brand-card-border text-brand-heading hover:bg-brand-secondary-surface transition-colors cursor-pointer flex items-center gap-1"
                          >
                            View Details <ChevronRight size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {cancelModal.show && cancelModal.booking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeCancelModal} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Cancel Booking</h3>
                <p className="text-xs text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              Are you sure you want to cancel booking <span className="font-semibold">{cancelModal.booking.refNumber}</span>?
            </p>
            <p className="text-xs text-gray-500 mb-6">
              Check-in: {new Date(cancelModal.booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
            <div className="flex gap-3">
              <button
                onClick={closeCancelModal}
                disabled={cancellingId === cancelModal.booking.id}
                className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button
                onClick={() => cancelModal.booking && handleCancelBooking(cancelModal.booking)}
                disabled={cancellingId === cancelModal.booking.id}
                className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cancellingId === cancelModal.booking.id ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Cancelling...
                  </>
                ) : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
