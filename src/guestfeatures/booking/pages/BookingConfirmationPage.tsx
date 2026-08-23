import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Navbar } from '../../../shared/components/Navbar'
import { Footer } from '../../../shared/components/Footer'
import { PageMessage } from '../../../shared/components/PageMessage'
import { ReserveLayout } from '../components/ReserveLayout'
import { ReserveStepper } from '../components/ReserveStepper'
import { ConfirmationBanner } from '../components/ConfirmationBanner'
import { BookingRoomDetails } from '../components/BookingRoomDetails'
import { BookingGuestInfo } from '../components/BookingGuestInfo'
import { BookingPaymentSummary } from '../components/BookingPaymentSummary'
import { BookingActions } from '../components/BookingActions'
import { InfoCards } from '../components/InfoCards'
import { useBookingDetails } from '../hooks/useBookingDetails'
import { useBookingActions } from '../../../shared/hooks/useBookingActions'
import { formatDateFull } from '../../../shared/utils/format'
import { buildShareText, buildQrData } from '../../../shared/utils/bookingHelpers'

interface ConfirmationState {
  propertyImages?: string[]
  amenities?: string[]
  guestName?: string
  guestEmail?: string
  guestPhone?: string
  totalGuests?: number
  rating?: number
  reviews?: number
  paymentGateway?: string
}

export default function BookingConfirmationPage() {
  const { refNumber } = useParams<{ refNumber: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const confirmationState =
    (location.state as ConfirmationState | null) ?? null

  const {
    booking,
    localBooking,
    loading,
    propertyName,
    propertyCity,
    propertyCountry,
    propertyDetails,
    currency,
    rooms,
    roomNames,
    totalGuests,
    nights,
    checkIn,
    checkOut,
    refNumber: confirmationCode,
    taxAmount,
    basePrice,
    guestName,
    guestEmail,
    guestPhone,
    guestNationality,
    coverImage,
    totalAmount,
    specialOfferDiscount,
    couponDiscount,
    paymentGateway,
  } = useBookingDetails(refNumber)

  const { copied, copyCode, shareBooking, downloadReceipt } = useBookingActions()

  const shareText = buildShareText(propertyName, confirmationCode, checkIn, formatDateFull)

  const handleCopyCode = () => {
    copyCode(confirmationCode)
  }

  const handleShareBooking = () => {
    shareBooking(shareText)
  }

  if (loading) {
    return <PageMessage loading title="Loading confirmation..." />
  }

  if (!booking && !localBooking) {
    return (
      <PageMessage
        icon="📋"
        title="Booking not found"
        action={
          <button onClick={() => navigate('/')} className="px-5 py-2.5 bg-[#1A3C5E] text-white rounded-full text-sm font-medium hover:opacity-90">
            Back to home
          </button>
        }
      />
    )
  }

  // Receipt can be generated from API data, or from local fallback values when
  // the API booking can't be fetched.
  const handleDownloadReceipt = () => {
    downloadReceipt({
      refNumber: confirmationCode,
      propertyName,
      shareText,
      propertyLocation: `${propertyCity}, ${propertyCountry}`,
      propertyPhone: propertyDetails.phone,
      propertyEmail: propertyDetails.email,
      propertyImage,
      checkIn,
      checkOut,
      roomNames,
      totalGuests,
      guestName: guestName ?? 'Guest',
      guestEmail,
      guestPhone,
      rooms,
      specialOfferDiscount,
      couponCode: booking?.coupon_code ?? undefined,
      couponDiscount,
      totalAmount,
      currency,
    })
  }

  const propertyImage =
    confirmationState?.propertyImages?.[0] ?? coverImage
  const cancellationTitle = rooms[0]?.cancellation_title
  const cancellationDescription = rooms[0]?.cancellation_description

  const qrData = buildQrData({
    confirmationCode,
    propertyName,
    propertyLocation: `${propertyCity}, ${propertyCountry}`,
    propertyPhone: propertyDetails.phone,
    propertyEmail: propertyDetails.email,
    checkIn,
    checkOut,
    nights,
    totalGuests,
    rooms: roomNames,
    roomTypes: rooms.map(r => r.room_type).join(", "),
    bedTypes: rooms.map(r => r.bed_type).join(", "),
    guestName: guestName ?? 'Guest',
    guestEmail,
    guestPhone,
    roomPrice: basePrice,
    taxes: taxAmount,
    totalAmount,
    currency,
    paymentMethod: paymentGateway || 'Online',
    cancellationPolicy: cancellationDescription || cancellationTitle || '',
    bookedOn: new Date().toISOString(),
  })

  const leftContent = (
    <>
      <ConfirmationBanner
        confirmationCode={confirmationCode}
        propertyName={propertyName}
        propertyCity={propertyCity}
        propertyCountry={propertyCountry}
        propertyImage={propertyImage}
        rating={confirmationState?.rating}
        reviews={confirmationState?.reviews}
        amenities={confirmationState?.amenities}
        phone={propertyDetails.phone}
        email={propertyDetails.email}
      />
      <BookingRoomDetails rooms={rooms} currency={currency} />
      <BookingGuestInfo
        guestName={guestName ?? 'Guest'}
        guestEmail={guestEmail}
        guestPhone={guestPhone}
        guestNationality={guestNationality}
      />
      <InfoCards
        cancellationTitle={cancellationTitle}
        cancellationDescription={cancellationDescription}
      />
    </>
  )

  const rightContent = (
    <>
      <BookingPaymentSummary
        currency={currency}
        basePrice={basePrice}
        taxAmount={taxAmount}
        specialOfferDiscount={specialOfferDiscount}
        couponDiscount={couponDiscount}
        couponCode={booking?.coupon_code}
        totalAmount={totalAmount}
        paymentGateway={confirmationState?.paymentGateway || paymentGateway}
        refNumber={confirmationCode}
      />
      <BookingActions
        refNumber={confirmationCode}
        shareText={shareText}
        qrData={qrData}
        copied={copied}
        onCopyCode={handleCopyCode}
        onShare={handleShareBooking}
        onDownloadReceipt={handleDownloadReceipt}
        onDone={() => navigate('/profile/bookings')}
      />
    </>
  )

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-jakarta">
      <Navbar />

      <ReserveStepper />

      <ReserveLayout
        leftColumn={leftContent}
        rightColumn={rightContent}
      />

      <Footer />
    </div>
  )
}
