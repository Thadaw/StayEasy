import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { usePropertyStore } from "../../stores/propertyStore"
import { useQuery } from "@tanstack/react-query"
import api from "../../services/axios"
import { InvoiceReceipt } from "../components/InvoiceReceipt"

interface BookingRoom {
  room_id: string
  room_name: string
  room_type: string
  bed_type: string
  base_rate: number
}

interface BookingFolio {
  folio_id: string
  status: string
  subtotal: number
  tax: number
  discount: number
  total: number
  amount_paid: number
  remaining_balance: number
  charges_count: number
  settled_at: string | null
  charges?: Array<{
    charge_id: string
    description: string
    amount: number
    category?: string
    posted_by_name?: string
    created_at: string
  }>
}

interface Booking {
  booking_id: string
  guest_name: string
  guest_email: string
  guest_phone: string
  guest_nationality: string
  ref_number: string
  status: string
  checkin_date: string
  checkout_date: string
  total_amount: number
  amount_paid: number
  amount_due: number
  rooms: BookingRoom[]
  folio: BookingFolio | null
  payment_method?: string
}

export default function FolioInvoicePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentPropertyId } = usePropertyStore()

  const { data: property } = useQuery({
    queryKey: ["property", currentPropertyId],
    queryFn: async () => {
      if (!currentPropertyId) return null
      try {
        const { data } = await api.get(`/properties/${currentPropertyId}`, { skipAuthRedirect: true } as any)
        return data?.data || data
      } catch {
        return null
      }
    },
    enabled: !!currentPropertyId,
  })

  const { data: booking, isLoading } = useQuery({
    queryKey: ["folio-invoice-booking", currentPropertyId, id],
    queryFn: async (): Promise<Booking | null> => {
      if (!currentPropertyId || !id) return null
      try {
        const { data: result } = await api.get(
          `/staff/properties/${currentPropertyId}/bookings/${id}/guest-folio`,
          { skipAuthRedirect: true } as any
        )
        const wrapped = result as { data?: Booking }
        return (wrapped?.data ?? result) as Booking
      } catch {
        return null
      }
    },
    enabled: !!currentPropertyId && !!id,
  })

  useEffect(() => {
    if (booking) window.print()
  }, [booking])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Booking not found</p>
      </div>
    )
  }

  const nights = Math.max(1, Math.ceil(
    (new Date(booking.checkout_date).getTime() - new Date(booking.checkin_date).getTime()) / (1000 * 60 * 60 * 24)
  ))
  const roomNames = booking.rooms?.map((r) => r.room_name).join(", ") || "—"
  const folio = booking.folio
  const hasFolioCharges = folio?.charges && folio.charges.length > 0

  const receiptCharges = hasFolioCharges
    ? folio!.charges!.map((c) => ({
        id: c.charge_id,
        description: c.description,
        amount: Number(c.amount) || 0,
        category: c.category,
        date: new Date(c.created_at).toLocaleDateString(),
      }))
    : booking.rooms?.map((room, i) => ({
        id: String(i),
        description: `${room.room_name} (${nights} night${nights !== 1 ? "s" : ""}, incl. tax)`,
        amount: room.base_rate * nights,
      })) || []

  const subtotal = hasFolioCharges ? (folio!.subtotal || receiptCharges.reduce((sum, c) => sum + c.amount, 0)) : receiptCharges.reduce((sum, c) => sum + c.amount, 0)
  const tax = folio?.tax || 0
  const discount = folio?.discount || 0
  const total = hasFolioCharges ? (folio!.total || subtotal + tax - discount) : subtotal
  const advancePaid = booking.amount_paid || 0
  const checkoutPayment = booking.amount_due > 0 ? booking.amount_due : 0
  const totalPaid = advancePaid + checkoutPayment
  const balance = folio?.remaining_balance ?? Math.max(0, total - totalPaid)

  return (
    <InvoiceReceipt
      propertyName={property?.name}
      invoiceNumber={booking.ref_number}
      invoiceDate={booking.checkout_date}
      title="INVOICE"
      printLabel="Print Invoice"
      onClose={() => navigate(-1)}
      guestInfo={{
        name: booking.guest_name || "—",
        email: booking.guest_email || "—",
        phone: booking.guest_phone || "—",
        nationality: booking.guest_nationality || "—",
      }}
      rooms={roomNames}
      checkinDate={booking.checkin_date}
      checkoutDate={booking.checkout_date}
      summaryTitle="Folio Summary"
      summary={[
        { label: `Room Charges (${nights} night${nights !== 1 ? "s" : ""}, incl. tax)`, value: subtotal },
        ...(tax > 0 ? [{ label: "Tax", value: tax }] : []),
        ...(discount > 0 ? [{ label: "Discount", value: discount, type: "discount" as const }] : []),
        { label: "Total Bill", value: total, type: "bold" },
        { label: "Advance Paid", value: advancePaid },
        ...(checkoutPayment > 0 ? [{ label: "Checkout Payment", value: checkoutPayment }] : []),
        { label: "Total Paid", value: totalPaid, type: "bold" },
        { label: "Remaining Balance", value: balance, type: "highlight" as const },
      ]}
      charges={receiptCharges}
      payments={[
        { date: booking.checkin_date, description: "Advance Payment", method: booking.payment_method, amount: advancePaid },
        ...(checkoutPayment > 0 ? [{ date: booking.checkout_date, description: "Checkout Payment", method: booking.payment_method, amount: checkoutPayment }] : []),
      ]}
    />
  )
}
