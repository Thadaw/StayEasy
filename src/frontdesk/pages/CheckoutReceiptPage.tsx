import { useParams, useNavigate } from "react-router-dom"
import { BookingReceipt } from "../components/BookingReceipt"

export default function CheckoutReceiptPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  if (!id) return null

  return (
    <BookingReceipt
      bookingId={id}
      title="INVOICE"
      printLabel="Print Receipt"
      summaryTitle="Payment Summary"
      onClose={() => navigate(-1)}
      autoPrint
    />
  )
}