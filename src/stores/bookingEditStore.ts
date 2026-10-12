import { create } from 'zustand'
import type { BookingRow } from '../components/manager/bookings/ManagerBookingTable'
import type { BookingDetail } from '../components/manager/bookings/demoBookings'

export interface BookingEdit {
  guestName: string
  guestEmail: string
  guestPhone: string
  idPassport: string
  nationality: string
  guestType: string
  checkIn: string
  checkOut: string
  adults: number
  children: number
  bookingSource: string
  arrivalTime: string
  promoCode: string
  roomType: string
  room: string
  ratePlan: string
  specialRequests: string
  internalNote: string
}

interface BookingEditState {
  edits: Record<string, BookingEdit>
  save: (id: string, edit: BookingEdit) => void
}

export const useBookingEditStore = create<BookingEditState>((set) => ({
  edits: {},
  save: (id, edit) => set((s) => ({ edits: { ...s.edits, [id]: edit } })),
}))

function guestsSummary(adults: number, children: number): string {
  const parts = [`${adults} ${adults === 1 ? 'Adult' : 'Adults'}`]
  if (children > 0) parts.push(`${children} ${children === 1 ? 'Child' : 'Children'}`)
  return parts.join(' · ')
}

function buildNotes(edit: BookingEdit): string {
  const internal = edit.internalNote.trim()
  const base = edit.specialRequests.trim()
  if (!internal) return base
  return base ? `${base} · Internal: ${internal}` : `Internal: ${internal}`
}

export function applyBookingRowEdit(row: BookingRow, edit?: BookingEdit): BookingRow {
  if (!edit) return row
  return {
    ...row,
    guest: edit.guestName.trim() || row.guest,
    room: edit.room || row.room,
    roomType: edit.roomType || row.roomType,
    checkIn: edit.checkIn || row.checkIn,
    checkOut: edit.checkOut || row.checkOut,
    guests: edit.adults + edit.children || row.guests,
    source: edit.bookingSource.split(' (')[0] || row.source,
  }
}

export function applyBookingEdit(
  row: BookingRow,
  detail: BookingDetail,
  edit?: BookingEdit,
): { row: BookingRow; detail: BookingDetail } {
  const mergedRow = applyBookingRowEdit(row, edit)
  if (!edit) return { row: mergedRow, detail }

  const mergedDetail: BookingDetail = {
    ...detail,
    roomSummary: `${mergedRow.room} · ${mergedRow.roomType}`,
    checkInAt: `${mergedRow.checkIn} · 2:00 PM`,
    checkOutAt: `${mergedRow.checkOut} · 11:00 AM`,
    guestsSummary: guestsSummary(edit.adults, edit.children),
    ratePlan: edit.ratePlan || detail.ratePlan,
    guestName: edit.guestName.trim() || detail.guestName,
    guestEmail: edit.guestEmail.trim() || detail.guestEmail,
    guestPhone: edit.guestPhone.trim() || detail.guestPhone,
    guestNationality: edit.nationality || detail.guestNationality,
    guestIdPassport: edit.idPassport.trim() || detail.guestIdPassport,
    notes: buildNotes(edit) || detail.notes,
  }

  return { row: mergedRow, detail: mergedDetail }
}
