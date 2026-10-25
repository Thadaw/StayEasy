import { useEffect } from "react"
import { usePropertyStore } from "@/store/properties/propertyStore"
import { usePropertyQuery } from "@/services/queries/property/propertyDetailQueries"
import { useBookingReceiptQuery } from "@/services/queries/frontdesk/frontdeskBookingQueries"
import { InvoiceReceipt } from "@/components/frontdesk/InvoiceReceipt"

interface BookingReceiptProps {
  bookingId: string
  title?: string
  printLabel?: string
  summaryTitle?: string
  onPrint?: () => void
  onClose?: () => void
  autoPrint?: boolean
  embedded?: boolean
}

export function BookingReceipt({
  bookingId,
  title = "INVOICE",
  printLabel = "Print Receipt",
  summaryTitle = "Payment Summary",
  onPrint,
  onClose,
  autoPrint = false,
  embedded = false,
}: BookingReceiptProps) {
  const { currentPropertyId } = usePropertyStore()

  const { data: property } = usePropertyQuery(currentPropertyId, { skipAuthRedirect: true })

  const { data: booking, isLoading } = useBookingReceiptQuery(currentPropertyId, bookingId)

  useEffect(() => {
    if (autoPrint && booking) window.print()
  }, [autoPrint, booking])

  if (isLoading) {
    return (
      <div className={embedded ? "flex items-center justify-center py-16" : "min-h-screen bg-gray-50 flex items-center justify-center"}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className={embedded ? "py-16 text-center bg-gray-50" : "min-h-screen bg-gray-50 flex items-center justify-center"}>
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
      title={title}
      printLabel={printLabel}
      onPrint={onPrint}
      onClose={onClose}
      guestInfo={{
        name: booking.guest_name || "—",
        email: booking.guest_email || "—",
        phone: booking.guest_phone || "—",
        nationality: booking.guest_nationality || "—",
      }}
      rooms={roomNames}
      checkinDate={booking.checkin_date}
      checkoutDate={booking.checkout_date}
      summaryTitle={summaryTitle}
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
      embedded={embedded}
    />
  )
}