import { useMemo } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { mapPropertyToHotel } from "@/utils/propertyMapper"
import { allCountries } from "@/data/static/countries"
import { useBookingQuery, usePropertyQuery, useAvailableRoomsQuery } from "@/services/queries/bookingQueries"

// Loads and derives everything the reserve page needs to render: the booking
// (by ref), the property, the available rooms, the mapped hotel, and the guest
// details carried either in the URL or on the booking itself.
export function useReservationData() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()

  const refNumber = searchParams.get('ref') || localStorage.getItem('esewa_ref_number') || ''

  // React Query hooks — automatically cached, deduplicated, and abortable
  const { data: booking, isLoading: bookingLoading } = useBookingQuery(refNumber)
  const propertyId = booking?.property?.id || id || ''
  const { data: property, isLoading: propertyLoading } = usePropertyQuery(propertyId)

  const bookingAdults = booking?.number_of_adults || 2
  const bookingChildren = booking?.number_of_children || 0
  const { data: availableRooms = [], isLoading: roomsLoading } = useAvailableRoomsQuery(
    propertyId,
    booking?.check_in || searchParams.get('checkIn') || '',
    booking?.check_out || searchParams.get('checkOut') || '',
    bookingAdults,
    bookingChildren,
    1,
  )

  const loading = bookingLoading || (refNumber ? false : propertyLoading)

  const hotel = useMemo(() => {
    if (!property) return null
    return mapPropertyToHotel(property, availableRooms)
  }, [property, availableRooms])

  const currency = property?.currency || booking?.property?.currency || 'USD'

  const checkIn = booking?.check_in || searchParams.get('checkIn') || ''
  const checkOut = booking?.check_out || searchParams.get('checkOut') || ''

  const guestName = searchParams.get('guestName') || booking?.guest_name || ''
  const guestEmail = searchParams.get('guestEmail') || booking?.guest_email || ''
  const guestPhone = searchParams.get('guestPhone') || booking?.guest_phone || ''
  const guestNationality = searchParams.get('guestCountry')
    ? allCountries.find(c => c.code === searchParams.get('guestCountry'))?.name || ''
    : ''

  const hotelName = booking?.property?.name || hotel?.name || ''
  const hotelCity = booking?.property?.city || hotel?.city || ''
  const hotelCountry = booking?.property?.country || hotel?.country || ''

  return {
    id,
    searchParams,
    refNumber,
    propertyId,
    booking,
    property,
    availableRooms,
    bookingLoading,
    propertyLoading,
    roomsLoading,
    loading,
    hotel,
    currency,
    bookingAdults,
    bookingChildren,
    checkIn,
    checkOut,
    guestName,
    guestEmail,
    guestPhone,
    guestNationality,
    hotelName,
    hotelCity,
    hotelCountry,
  }
}
