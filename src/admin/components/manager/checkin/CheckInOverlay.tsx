import { useEffect, useState } from 'react'
import { DEMO_BOOKINGS, STATUS_PILL, formatNPR, type BookingDetail } from '../bookings/demoBookings'
import type { BookingRow } from '../bookings/ManagerBookingTable'
import CheckInPageHeader from './CheckInPageHeader'
import SelectedBookingCard from './SelectedBookingCard'
import GuestVerificationCard from './GuestVerificationCard'
import RoomReadinessCard from './RoomReadinessCard'
import CheckInNotesCard from './CheckInNotesCard'

interface CheckInOverlayProps {
  row: BookingRow
  detail: BookingDetail
  status: string
  onClose: () => void
  onComplete: (notes: string) => void
}

const PAYMENT_LABEL: Record<string, string> = {
  Paid: 'Paid in Full',
  Partial: 'Partially Paid',
  Unpaid: 'Unpaid',
  Refunded: 'Refunded',
}

export default function CheckInOverlay({ row, detail, status, onClose, onComplete }: CheckInOverlayProps) {
  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const todaysArrivals = DEMO_BOOKINGS.filter((b) => b.checkIn === today)
  const arrivals = todaysArrivals.length
  const remaining = todaysArrivals.filter((b) => b.status !== 'Checked-in').length

  const pill = STATUS_PILL[status] ?? { bg: '#f3f4f6', text: '#374151' }
  const paymentReady = row.paymentStatus === 'Paid'

  return (
    <div
      className="fixed bottom-0 right-0 z-40 overflow-y-auto bg-[#f8f9fb]"
      style={{ top: 'var(--manager-header-h, 64px)', left: 'var(--manager-sidebar-w, 260px)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Check-in Guest"
    >
      <div className="w-full px-4 py-6 sm:px-6">
        <CheckInPageHeader
          arrivals={arrivals}
          remaining={remaining}
          search={search}
          onSearchChange={setSearch}
        />

        <div className="mt-6">
          <SelectedBookingCard
            bookingId={row.id}
            guest={row.guest}
            room={`${row.room} · ${row.roomType}`}
            stay={`${row.checkIn} — ${row.checkOut}`}
            guests={detail.guestsSummary}
            status={status}
            statusBg={pill.bg}
            statusText={pill.text}
          />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.15fr_1fr]">
          <GuestVerificationCard
            primaryGuest={detail.guestName}
            idPassport={detail.guestIdPassport}
            phone={detail.guestPhone}
            email={detail.guestEmail}
          />
          <RoomReadinessCard
            roomStatus={detail.roomStatus}
            housekeeping="Completed 12:42 PM"
            paymentLabel={PAYMENT_LABEL[row.paymentStatus] ?? row.paymentStatus}
            paymentReady={paymentReady}
            balanceLabel={formatNPR(detail.balance)}
            balanceDue={detail.balance > 0}
            keyCards="2 cards"
          />
        </div>

        <div className="mt-5">
          <CheckInNotesCard value={notes} onChange={setNotes} />
        </div>

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onComplete(notes)}
            className="w-full rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0f172a] sm:w-auto"
            style={{ background: '#1e293b' }}
          >
            Complete Check-in
          </button>
        </div>
      </div>
    </div>
  )
}
