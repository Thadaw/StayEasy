import { useEffect, useState, useRef } from "react"
import { useBookings } from "../../../context/BookingContext"
import { useAuth } from "../../../auth/AuthContext"
import { calculateNights } from "../../../shared/utils/time"
import { buildPropertyLocation, calculatePriceBreakdown, resolveBookingStatus } from "../../../shared/utils/bookingHelpers"
import api from "../../../services/axios"
import type { ApiBooking } from "../types"

interface PropertyDetails {
  address: string
  state: string
  phone: string
  email: string
  lat: string | number | null
  lng: string | number | null
}

interface GuestProfile {
  name?: string
  email?: string
  phone?: string
  nationality?: string
}

export function useBookingDetails(id: string | undefined) {
  const { bookings } = useBookings()
  const { user } = useAuth()
  const [booking, setBooking] = useState<ApiBooking | null>(null)
  const [loading, setLoading] = useState(true)
  const [coverPhoto, setCoverPhoto] = useState("")
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails>({
    address: "",
    state: "",
    phone: "",
    email: "",
    lat: null,
    lng: null,
  })
  const [guestProfile, setGuestProfile] = useState<GuestProfile | null>(null)

  // Track the last fetched id to prevent unnecessary re-fetches when
  // the bookings context array changes (e.g. addBooking in ReservePage).
  const lastFetchedIdRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    // Skip re-fetch if we already loaded this exact booking
    if (lastFetchedIdRef.current === id && booking) {
      setLoading(false)
      return
    }

    const controller = new AbortController()
    const localMatch = bookings.find((b) => b.refNumber === id || b.id === id)

    const loadBookingDetails = async () => {
      try {
        const response = await api.get(`/bookings/${localMatch?.refNumber || id}`, { signal: controller.signal })
        const result = response.data?.data || response.data
        setBooking(result)
        if (result?.guest_name || result?.guest_email || result?.guest_phone) {
          setGuestProfile((prev) => ({
            name: prev?.name ?? result.guest_name ?? "",
            email: prev?.email ?? result.guest_email ?? "",
            phone: prev?.phone ?? result.guest_phone ?? "",
            nationality: prev?.nationality ?? result.guest_nationality ?? "",
          }))
        }
        if (result?.property?.id) {
          try {
            const propResponse = await api.get(`/properties/${result.property.id}/public`, { signal: controller.signal })
            const prop = propResponse.data?.data
            const photos = prop?.photos
            if (photos?.cover) setCoverPhoto(photos.cover)
            if (prop) {
              setPropertyDetails({
                address: prop.address ?? "",
                state: prop.state ?? "",
                phone: prop.phone_number ?? "",
                email: prop.email ?? "",
                lat: prop.latitude || null,
                lng: prop.longitude || null,
              })
            }
          } catch {
            // Property details are non-critical — booking still loads without them.
          }
        }
      } catch {
        // API booking not found — will fall back to local BookingContext data.
      }
    }

    const loadGuestProfile = async () => {
      try {
        const response = await api.get("/auth/guests/me", { signal: controller.signal })
        if (response.data) {
          setGuestProfile((prev) => ({
            name: prev?.name ?? response.data.full_name ?? "",
            email: prev?.email ?? response.data.email ?? "",
            phone: prev?.phone ?? response.data.phone ?? "",
            nationality: prev?.nationality ?? response.data.nationality ?? "",
          }))
        }
      } catch {
        // Guest profile endpoint is optional — existing guest data remains intact.
      }
    }

    // Two independent data sources fetched in parallel — any one can fail without
    // blocking the other. Guest profile is progressively enriched from the booking
    // response → guest profile endpoint.
    Promise.allSettled([loadBookingDetails(), loadGuestProfile()]).finally(() => {
      lastFetchedIdRef.current = id
      setLoading(false)
    })

    return () => { controller.abort() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const localBooking = bookings.find((b) => b.refNumber === id || b.id === id)

  const propertyName = booking?.property?.name ?? localBooking?.hotelName ?? ""
  const propertyCity = booking?.property?.city ?? localBooking?.hotelCity ?? ""
  const propertyCountry = booking?.property?.country ?? localBooking?.hotelCountry ?? ""
  const propertyId = booking?.property?.id ?? localBooking?.hotelId ?? ""
  const propertyLocation = buildPropertyLocation(propertyDetails.address, propertyCity, propertyDetails.state, propertyCountry)
  const currency = booking?.property?.currency || "USD"
  const nights = booking?.nights || (localBooking ? calculateNights(localBooking.checkIn, localBooking.checkOut) : 1)
  const checkIn = booking?.check_in || localBooking?.checkIn || ""
  const checkOut = booking?.check_out || localBooking?.checkOut || ""
  const adults = booking?.number_of_adults ?? localBooking?.guests ?? 0
  const children = booking?.number_of_children ?? 0
  const totalGuests = adults + children
  const rooms = booking?.rooms || []
  const roomNames = rooms.length > 0 ? rooms.map((r) => r.room_name).join(", ") : localBooking?.roomTypeName || ""
  const totalAmount = booking?.total_amount || localBooking?.totalPrice || 0
  const subtotal = booking?.subtotal || 0
  const specialOfferDiscount = booking?.special_offer_discount || 0
  const couponDiscount = booking?.coupon_discount || 0
  const paymentStatus = booking?.payment_status || (localBooking ? "paid" : null)
  const paymentGateway = booking?.payment_gateway || ""
  const refNumber = booking?.ref_number || localBooking?.refNumber || localBooking?.id || id || ""
  const createdAt = booking?.created_at || localBooking?.createdAt || new Date().toISOString()
  const bookingStatus = resolveBookingStatus(
    booking?.status || localBooking?.status || "upcoming",
    booking?.check_out || localBooking?.checkOut
  )
  const statusLabel = bookingStatus.charAt(0).toUpperCase() + bookingStatus.slice(1)

  const guestName = guestProfile?.name || booking?.guest_name || user?.full_name || `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Guest"
  const guestEmail = guestProfile?.email || booking?.guest_email || user?.email || ""
  const guestPhone = guestProfile?.phone || booking?.guest_phone || ""
  const guestNationality = guestProfile?.nationality || ""

  const coverImage = coverPhoto || localBooking?.hotelImage || ""

  const { taxAmount, basePrice } = calculatePriceBreakdown(totalAmount, subtotal, specialOfferDiscount, couponDiscount, rooms)

  return {
    booking,
    localBooking,
    loading,
    coverImage,
    propertyName,
    propertyCity,
    propertyCountry,
    propertyId,
    propertyLocation,
    propertyDetails,
    currency,
    nights,
    checkIn,
    checkOut,
    adults,
    children,
    totalGuests,
    rooms,
    roomNames,
    totalAmount,
    subtotal,
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
  }
}
