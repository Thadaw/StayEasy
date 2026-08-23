import { useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Navbar } from "../../../shared/components/Navbar"
import { Footer } from "../../../shared/components/Footer"
import { PageMessage } from "../../../shared/components/PageMessage"
import { BookingHeader } from "../components/BookingHeader"
import { StayInformation } from "../components/StayInformation"
import { BookingRoomDetails } from "../components/BookingRoomDetails"
import { BookingGuestInfo } from "../components/BookingGuestInfo"
import { CancellationCard } from "../components/CancellationCard"
import { ReserveSummaryCard } from "../components/ReserveSummaryCard"
import { useBookingActions } from "../../../shared/hooks/useBookingActions"
import { useBookingDetails } from "../hooks/useBookingDetails"
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

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-4 grid grid-cols-3 items-center">
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

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
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

          <div className="space-y-6">
            <ReserveSummaryCard
              propertyName={propertyName}
              roomNames={roomNames}
              propertyCity={propertyCity}
              propertyCountry={propertyCountry}
              confirmationCode={refNumber}
              checkIn={checkIn}
              checkOut={checkOut}
              nights={nights}
              totalGuests={adults + children}
              rooms={rooms}
              currency={currency}
              couponCode={booking?.coupon_code}
              couponDiscount={couponDiscount}
              specialOfferDiscount={specialOfferDiscount}
              totalAmount={totalAmount}
              paymentStatus={paymentStatus}
              shareText={shareText}
              qrData={qrData}
              copied={copied}
              shareMessage={shareMessage}
              onCopyCode={handleCopyCode}
              onShare={handleShareBooking}
              onDownloadReceipt={handleDownloadReceipt}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
