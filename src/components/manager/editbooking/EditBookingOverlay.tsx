import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { DEMO_BOOKINGS, DEMO_NIGHTLY_RATE, getDemoBookingDetail, type BookingDetail } from '../bookings/demoBookings'
import type { BookingRow } from '../bookings/ManagerBookingTable'
import { useEditBookingStore } from '../../../stores/editBookingStore'
import { useBookingEditStore, type BookingEdit } from '../../../stores/bookingEditStore'
import GuestInformationSection from './GuestInformationSection'
import StayDetailsSection from './StayDetailsSection'
import RoomRateSection from './RoomRateSection'
import PreferencesRequestsSection from './PreferencesRequestsSection'
import {
  ARRIVAL_TIMES,
  BOOKING_SOURCES,
  displayToISO,
  isoToDisplay,
  nightsBetween,
  type EditFormState,
} from './editForm'

interface EditBookingOverlayProps {
  bookingId: string
}

function sourceLabel(source: string): string {
  if (BOOKING_SOURCES.includes(source)) return source
  return source === 'Direct' ? 'Direct (Website)' : BOOKING_SOURCES[0]
}

function buildInitialForm(row: BookingRow, detail: BookingDetail, edit?: BookingEdit): EditFormState {
  return {
    guestName: edit?.guestName ?? detail.guestName,
    guestEmail: edit?.guestEmail ?? detail.guestEmail,
    guestPhone: edit?.guestPhone ?? detail.guestPhone,
    idPassport: edit?.idPassport ?? detail.guestIdPassport,
    nationality: edit?.nationality ?? detail.guestNationality,
    guestType: edit?.guestType ?? 'Regular Guest',
    checkIn: displayToISO(edit?.checkIn ?? row.checkIn),
    checkOut: displayToISO(edit?.checkOut ?? row.checkOut),
    adults: edit?.adults ?? Math.max(1, row.guests),
    children: edit?.children ?? 0,
    bookingSource: edit?.bookingSource ?? sourceLabel(row.source),
    arrivalTime: edit?.arrivalTime ?? ARRIVAL_TIMES[5],
    promoCode: edit?.promoCode ?? '',
    roomType: edit?.roomType ?? row.roomType,
    room: edit?.room ?? row.room,
    ratePlan: edit?.ratePlan ?? detail.ratePlan,
    specialRequests: edit?.specialRequests ?? detail.notes,
    internalNote: edit?.internalNote ?? '',
  }
}

export default function EditBookingOverlay({ bookingId }: EditBookingOverlayProps) {
  const close = useEditBookingStore((s) => s.close)
  const save = useBookingEditStore((s) => s.save)
  const savedEdit = useBookingEditStore((s) => s.edits[bookingId])

  const row = useMemo(() => DEMO_BOOKINGS.find((b) => b.id === bookingId), [bookingId])
  const detail = useMemo(() => getDemoBookingDetail(bookingId), [bookingId])

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState<EditFormState | null>(() =>
    row && detail ? buildInitialForm(row, detail, savedEdit) : null,
  )

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [close])

  const rate = useMemo(() => {
    const nights = nightsBetween(form?.checkIn ?? '', form?.checkOut ?? '')
    const subtotal = nights * DEMO_NIGHTLY_RATE
    const taxes = Math.round(subtotal * 0.13)
    return { nights, nightly: DEMO_NIGHTLY_RATE, taxes, total: subtotal + taxes }
  }, [form?.checkIn, form?.checkOut])

  if (!row || !detail || !form) return null

  const update = (patch: Partial<EditFormState>) =>
    setForm((prev) => (prev ? { ...prev, ...patch } : prev))

  const validate = (): boolean => {
    const e: Record<string, string> = {}
    if (!form.guestName.trim()) e.guestName = 'Required'
    if (!form.guestEmail.trim()) e.guestEmail = 'Required'
    if (!form.guestPhone.trim()) e.guestPhone = 'Required'
    if (!form.checkIn) e.checkIn = 'Required'
    if (!form.checkOut) e.checkOut = 'Required'
    if (form.checkIn && form.checkOut && form.checkOut <= form.checkIn) e.checkOut = 'Must be after check-in'
    if (form.adults < 1) e.adults = 'At least 1'
    if (!form.roomType) e.roomType = 'Select a room type'
    if (!form.room) e.room = 'Select a room'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    save(bookingId, {
      guestName: form.guestName.trim(),
      guestEmail: form.guestEmail.trim(),
      guestPhone: form.guestPhone.trim(),
      idPassport: form.idPassport.trim(),
      nationality: form.nationality,
      guestType: form.guestType,
      checkIn: isoToDisplay(form.checkIn),
      checkOut: isoToDisplay(form.checkOut),
      adults: form.adults,
      children: form.children,
      bookingSource: form.bookingSource,
      arrivalTime: form.arrivalTime,
      promoCode: form.promoCode,
      roomType: form.roomType,
      room: form.room,
      ratePlan: form.ratePlan,
      specialRequests: form.specialRequests,
      internalNote: form.internalNote,
    })
    close()
    toast.success(`Booking ${bookingId} updated.`)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Edit Booking ${bookingId}`}
      className="fixed bottom-0 right-0 z-40 overflow-y-auto bg-[#f8f9fb]"
      style={{ top: 'var(--manager-header-h, 64px)', left: 'var(--manager-sidebar-w, 260px)' }}
    >
      <div className="mx-auto w-full max-w-[900px] p-6">
        <header className="mb-6">
          <h2 className="m-0 text-[22px] font-bold text-gray-900">Edit Booking · {bookingId}</h2>
          <p className="mt-1 mb-0 text-sm text-gray-500">
            Modify guest, stay and room details before saving changes.
          </p>
        </header>

        <GuestInformationSection data={form} errors={errors} onChange={update} />
        <StayDetailsSection data={form} errors={errors} onChange={update} />
        <RoomRateSection data={form} errors={errors} onChange={update} rate={rate} />
        <PreferencesRequestsSection data={form} onChange={update} />

        <div className="flex flex-col-reverse gap-3 rounded-xl border border-gray-200 bg-white px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={close}
            className="w-full rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="w-full rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0f172a] sm:w-auto"
            style={{ background: '#1e293b' }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
