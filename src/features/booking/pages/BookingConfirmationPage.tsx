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
import { buildShareText } from '../../../shared/utils/bookingHelpers'

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

export default function BookingConfirmationPage() {
  const { refNumber } = useParams<{ refNumber: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const confirmationState =
    (location.state as ConfirmationState | null) ?? null

  const {
    booking,
    loading,
    propertyName,
    propertyCity,
    propertyCountry,
    propertyDetails,
    currency,
    rooms,
    roomNames,
    totalGuests,
    checkIn,
    refNumber: confirmationCode,
    taxAmount,
    basePrice,
    guestName,
    guestEmail,
    guestPhone,
    guestNationality,
    coverImage,
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

  if (!booking) {
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

  const {
    check_in,
    check_out,
    rooms: bookingRooms,
    special_offer_discount,
    coupon_code,
    coupon_discount,
    total_amount,
    payment_gateway,
  } = booking

  // Receipt can only be generated once booking data is available.
  const handleDownloadReceipt = () => {
    downloadReceipt({
      refNumber: confirmationCode,
      propertyName,
      shareText,
      propertyLocation: `${propertyCity}, ${propertyCountry}`,
      checkIn: check_in,
      checkOut: check_out,
      roomNames,
      totalGuests,
      guestName: guestName ?? 'Guest',
      guestEmail,
      guestPhone,
      rooms: bookingRooms,
      specialOfferDiscount: special_offer_discount,
      couponCode: coupon_code ?? undefined,
      couponDiscount: coupon_discount,
      totalAmount: total_amount,
      currency,
    })
  }

  const propertyImage =
    confirmationState?.propertyImages?.[0] ?? coverImage
  const cancellationTitle = rooms[0]?.cancellation_title
  const cancellationDescription = rooms[0]?.cancellation_description

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
        specialOfferDiscount={special_offer_discount ?? 0}
        couponDiscount={coupon_discount ?? 0}
        couponCode={coupon_code}
        totalAmount={total_amount}
        paymentGateway={payment_gateway ?? undefined}
        refNumber={confirmationCode}
      />
      <BookingActions
        refNumber={confirmationCode}
        shareText={shareText}
        copied={copied}
        onCopyCode={handleCopyCode}
        onShare={handleShareBooking}
        onDownloadReceipt={handleDownloadReceipt}
        onDone={() => navigate('/profile/bookings')}
      />
    </>
  )

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-jakarta">
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
