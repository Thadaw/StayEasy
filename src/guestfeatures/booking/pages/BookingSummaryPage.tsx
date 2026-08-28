import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, Copy, Share2, Download, QrCode, ArrowRight, Heart, Star } from "lucide-react"
import QRCodeLib from "qrcode"
import { Navbar } from "../../../shared/components/Navbar"
import { Footer } from "../../../shared/components/Footer"
import { PageMessage } from "../../../shared/components/PageMessage"
import { BookingHeader } from "../components/BookingHeader"
import { StayInformation } from "../components/StayInformation"
import { BookingRoomDetails } from "../components/BookingRoomDetails"
import { BookingGuestInfo } from "../components/BookingGuestInfo"
import { CancellationCard } from "../components/CancellationCard"
import { BookingPaymentSummary } from "../components/BookingPaymentSummary"
import { useBookingActions } from "../../../shared/hooks/useBookingActions"
import { useBookingDetails } from "../hooks/useBookingDetails"
import { WriteReviewModal } from "../../review/components/WriteReviewModal"
import { getStatusColor, canCancelBooking, buildShareText, buildQrData } from "../../../shared/utils/bookingHelpers"
import { formatDateFull } from "../../../shared/utils/format"

interface ConfirmationState {
  propertyImages?: string[]
  amenities?: string[]
  guestName?: string
  guestEmail?: string
  guestPhone?: string
  totalGuests?: number
  rating?: number
  reviews?: number
}

export default function BookingDetailsView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const confirmationState =
    (location.state as ConfirmationState | null) ?? null
  const { copied, copyCode, shareBooking, downloadReceipt } = useBookingActions()
  const qrCanvasRef = useRef<HTMLCanvasElement>(null)
  const [localCopied, setLocalCopied] = useState(false)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)

  const {
    booking,
    localBooking,
    loading,
    coverImage,
    propertyName,
    propertyCity,
    propertyCountry,
    propertyLocation,
    propertyDetails,
    currency,
    nights,
    checkIn,
    checkOut,
    adults,
    children,
    rooms,
    roomNames,
    totalAmount,
    specialOfferDiscount,
    couponDiscount,
    paymentStatus,
    paymentGateway,
    refNumber,
    createdAt,
    bookingStatus,
    statusLabel,
    guestName,
    guestEmail,
    guestPhone,
    guestNationality,
    taxAmount,
    basePrice,
  } = useBookingDetails(id)

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  const reviewPropertyId = booking?.property?.id || ""
  const canReview = bookingStatus === "completed" && UUID_RE.test(reviewPropertyId)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const shareText = buildShareText(propertyName, refNumber, checkIn, formatDateFull)

  const qrData = buildQrData({
    confirmationCode: refNumber,
    propertyName,
    propertyLocation: propertyLocation || `${propertyCity}, ${propertyCountry}`,
    propertyPhone: propertyDetails.phone,
    propertyEmail: propertyDetails.email,
    checkIn,
    checkOut,
    nights,
    totalGuests: adults + children,
    rooms: roomNames,
    roomTypes: rooms.map(r => r.room_type).join(", "),
    bedTypes: rooms.map(r => r.bed_type).join(", "),
    guestName,
    guestEmail,
    guestPhone,
    roomPrice: basePrice,
    taxes: taxAmount,
    totalAmount,
    currency,
    paymentMethod: paymentGateway || 'Online',
    cancellationPolicy: rooms[0]?.cancellation_description || rooms[0]?.cancellation_title || '',
    bookedOn: createdAt || new Date().toISOString(),
  })

  useEffect(() => {
    if (qrCanvasRef.current) {
      QRCodeLib.toCanvas(qrCanvasRef.current, qrData || refNumber, {
        width: 180,
        margin: 2,
        color: { dark: "#000000", light: "#FFFFFF" },
      })
    }
  }, [qrData, refNumber])

  const [shareMessage, setShareMessage] = useState("")

  const handleCopyCode = () => {
    copyCode(refNumber)
    setShareMessage("Booking details copied!")
    setTimeout(() => setShareMessage(""), 3000)
  }

  const handleShareBooking = () => {
    shareBooking(shareText)
    setShareMessage("Booking shared!")
    setTimeout(() => setShareMessage(""), 3000)
  }

  const handleCopyQR = async () => {
    try {
      await navigator.clipboard.writeText(qrData || refNumber)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = qrData || refNumber
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
    }
    setLocalCopied(true)
    setTimeout(() => setLocalCopied(false), 2000)
  }

  const handleShareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: qrData || shareText })
      } catch {}
    } else {
      handleShareBooking()
    }
  }

  const viewOnMap = () => {
    const hasCoords = propertyDetails.lat !== null && propertyDetails.lat !== "" && propertyDetails.lng !== null && propertyDetails.lng !== ""
    const query = hasCoords
      ? `${propertyDetails.lat},${propertyDetails.lng}`
      : [propertyName, propertyDetails.address, propertyCity, propertyDetails.state, propertyCountry].filter(Boolean).join(", ")
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, "_blank", "noopener,noreferrer")
  }

  const handleDownloadReceipt = () => {
    if (!booking && !localBooking) return
    downloadReceipt({
      refNumber,
      shareText,
      propertyName,
      propertyLocation: propertyLocation || `${propertyCity}, ${propertyCountry}`,
      propertyPhone: propertyDetails.phone,
      propertyEmail: propertyDetails.email,
      propertyImage: coverImage,
      checkIn,
      checkOut,
      roomNames,
      totalGuests: adults + children,
      guestName,
      guestEmail,
      guestPhone,
      guestNationality,
      rooms,
      specialOfferDiscount,
      couponCode: booking?.coupon_code ?? undefined,
      couponDiscount,
      totalAmount,
      currency,
      createdAt,
      paymentGateway,
    })
  }

  const cancelBooking = () => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      navigate("/profile/bookings")
    }
  }

  if (loading) {
    return <PageMessage loading title="Loading booking details..." />
  }

  if (!booking && !localBooking) {
    return (
      <PageMessage
        icon="📋"
        title="Booking not found"
        action={
          <button
            onClick={() => navigate("/profile/bookings")}
            className="px-5 py-2.5 bg-brand-accent text-white rounded-full text-sm font-medium hover:opacity-90 cursor-pointer"
          >
            Back to bookings
          </button>
        }
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-jakarta">
      <Navbar />

      <div className="bg-white border-b border-gray-200 sticky top-[56px] sm:top-[60px] md:top-[68px] z-40">
        <div className="max-w-[1250px] mx-auto px-4 sm:px-6 py-4 grid grid-cols-3 items-center">
          <button
            onClick={() => navigate("/profile/bookings")}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors cursor-pointer justify-self-start"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <h1 className="text-base font-semibold text-gray-900 text-center">Booking Details</h1>
          <span />
        </div>
      </div>

      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <BookingHeader
              propertyName={propertyName}
              propertyLocation={propertyLocation}
              coverImage={coverImage}
              statusLabel={statusLabel}
              statusColor={getStatusColor(bookingStatus)}
              refNumber={refNumber}
              createdAt={createdAt}
              paymentStatus={paymentStatus}
              currency={currency}
              totalAmount={totalAmount}
              propertyDetails={propertyDetails}
              onViewOnMap={viewOnMap}
            />

            <StayInformation
              checkIn={checkIn}
              checkOut={checkOut}
              nights={nights}
              adults={adults}
              children={children}
              roomNames={roomNames}
            />

            <BookingRoomDetails rooms={rooms} currency={currency} />

            <BookingGuestInfo
              guestName={guestName}
              guestEmail={guestEmail}
              guestPhone={guestPhone}
              guestNationality={guestNationality}
            />

            <CancellationCard
              rooms={rooms}
              checkIn={checkIn}
              canCancel={canCancelBooking(bookingStatus, checkIn)}
              onCancel={cancelBooking}
            />
          </div>

          <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <BookingPaymentSummary
              currency={currency}
              basePrice={basePrice}
              taxAmount={taxAmount}
              specialOfferDiscount={specialOfferDiscount}
              couponDiscount={couponDiscount}
              couponCode={booking?.coupon_code}
              totalAmount={totalAmount}
              paymentGateway={paymentGateway || undefined}
              refNumber={refNumber}
              advanceAmount={booking?.advance_amount}
              amountPaid={booking?.amount_paid}
              amountDue={booking?.amount_due}
            />

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleCopyQR}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:border-[#1A3C5E] transition cursor-pointer"
                >
                  <Copy size={14} /> {localCopied ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={handleShareQR}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:border-[#1A3C5E] transition cursor-pointer"
                >
                  <Share2 size={14} /> Share
                </button>
                <button
                  onClick={handleDownloadReceipt}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:border-[#1A3C5E] transition cursor-pointer"
                >
                  <Download size={14} /> Receipt
                </button>
              </div>
              {shareMessage && <p className="mt-2 text-sm text-[#1A3C5E]">{shareMessage}</p>}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <QrCode size={18} className="text-gray-600" />
                <h3 className="text-sm font-bold text-gray-900">Reservation QR</h3>
              </div>
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                <canvas
                  ref={qrCanvasRef}
                  className="w-[180px] h-[180px] mx-auto rounded-lg"
                />
                <p className="text-xs text-gray-400 text-center mt-3">Scan to view booking details.</p>
              </div>
            </div>

            <button
              onClick={() => navigate("/")}
              className="w-full py-3 rounded-xl bg-brand-primary text-white font-semibold text-sm hover:bg-brand-primary-hover transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Done <ArrowRight size={16} />
            </button>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-1">Book Again</h3>
              <p className="text-xs text-gray-500 mb-3">Love this property?</p>
              <button
                onClick={() => navigate(`/hotel/${booking?.property?.id || localBooking?.hotelId}`)}
                className="w-full py-3 rounded-xl bg-brand-primary text-white font-semibold text-sm hover:bg-brand-primary-hover transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart size={14} /> Book Again
              </button>
            </div>

            {canReview && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-1">Write a Review</h3>
              <p className="text-xs text-gray-500 mb-3">Share your experience at this property.</p>
              <button
                onClick={() => setReviewModalOpen(true)}
                className="w-full py-3 rounded-xl border border-[#1A3C5E] text-[#1A3C5E] font-semibold text-sm hover:bg-[#1A3C5E] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Star size={14} /> Write a Review
              </button>
            </div>
            )}
          </div>
        </div>
      </div>

      {reviewModalOpen && (
        <WriteReviewModal
          propertyId={reviewPropertyId}
          propertyName={propertyName}
          onClose={() => setReviewModalOpen(false)}
        />
      )}

      <Footer />
    </div>
  )
}
