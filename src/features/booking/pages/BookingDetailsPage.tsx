import { useState, useEffect, useMemo } from "react"
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom"
import { ChevronRight, Star } from "lucide-react"
import type { RoomType } from "../../../data/hotels"
import { Navbar } from "../../../shared/components/Navbar"
import { Footer } from "../../../shared/components/Footer"
import { PageMessage } from "../../../shared/components/PageMessage"
import { GuestInformationForm } from "../components/GuestInformationForm"
import { useGuestProfile } from "../../profile/hooks/useGuestProfile"
import { formatDate } from "../../../shared/utils/format"
import type { ApiProperty, ApiRoom } from "../../../shared/types/api"
import { mapPropertyToHotel } from "../../../shared/utils/propertyMapper"
import { useBookingCreation } from "../hooks/useBookingCreation"
import { parseJSON } from "../../../shared/utils/helpers"
import { getDefaultDates } from "../../../shared/utils/date"
import { allCountries } from "../../../data/countries"
import { calculateNights } from "../../../shared/utils/time"
import api from "../../../services/axios"

const HOTEL_IMAGE_HEIGHT = "h-56"
const MAX_AMENITIES_DISPLAY = 5
const DEFAULT_PHONE_CODE = "+977"

interface ReservedRoom {
  room_id: string
  room_name: string
  room_type: string
  bed_type: string
  max_adults: number
  max_children: number
  base_rate: number
  nights: number
  subtotal: number
}

interface BookingGuests {
  adults: number
  children: number
}

export default function BookingDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const { profile: guestProfile } = useGuestProfile()

  const checkIn = searchParams.get("checkIn") ?? ""
  const checkOut = searchParams.get("checkOut") ?? ""
  const roomsParam = searchParams.get("rooms") ?? ""
  const guestCountsParam = searchParams.get("guestCounts") ?? ""
  const refParam = searchParams.get("ref") ?? ""

  const bookingParams = {
    adults: Number(searchParams.get("adults") ?? 2),
    children: Number(searchParams.get("children") ?? 0),
    guests: searchParams.get("guests") ?? "",
  }

  const [refNumber, setRefNumber] = useState(refParam)
  const selectedRooms: Record<string, number> = parseJSON(roomsParam, {})
  const guestAllocation: Record<string, number> = parseJSON(guestCountsParam, {})

  const [property, setProperty] = useState<ApiProperty | null>(null)
  const [availableRooms, setAvailableRooms] = useState<ApiRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [reservedRooms, setReservedRooms] = useState<ReservedRoom[]>([])
  const [bookingGuests, setBookingGuests] = useState<BookingGuests | null>(null)

  const totalGuests = (bookingGuests ? bookingGuests.adults + bookingGuests.children : null)
    || Object.values(guestAllocation).reduce((s, c) => s + c, 0)
    || bookingParams.adults + bookingParams.children

  const [guest, setGuest] = useState({
    name: "",
    email: "",
    phoneCode: DEFAULT_PHONE_CODE,
    phone: "",
    country: "",
  })

  useEffect(() => {
    if (!guestProfile) return
    setGuest(prev => {
      const next = { ...prev }
      if (guestProfile.full_name) next.name = guestProfile.full_name
      if (guestProfile.email) next.email = guestProfile.email
      if (guestProfile.phone) {
        const match = guestProfile.phone.match(/^(\+\d+)(.*)$/)
        if (match) {
          next.phoneCode = match[1]
          next.phone = match[2].replace(/\D/g, '')
        } else {
          next.phone = guestProfile.phone.replace(/\D/g, '')
        }
      }
      if (guestProfile.nationality) {
        const nat = guestProfile.nationality.trim().toLowerCase()
        const found = allCountries.find(c =>
          c.name.toLowerCase() === nat ||
          c.code.toLowerCase() === nat ||
          c.name.toLowerCase().includes(nat) ||
          nat.includes(c.name.toLowerCase())
        )
        if (found) next.country = found.code
      }
      return next
    })
  }, [guestProfile])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const { createBooking } = useBookingCreation()

  useEffect(() => {
    if (!id || refNumber) return
    const { today, tomorrow } = getDefaultDates()
    const rooms: Record<string, number> = parseJSON(roomsParam, {})
    const roomIds = Object.entries(rooms)
      .filter(([, qty]) => qty > 0)
      .flatMap(([roomId, qty]) => Array(qty).fill(roomId))
    const adults = bookingParams.adults
    const children = bookingParams.children
    createBooking({
      property_id: id,
      room_ids: roomIds,
      check_in: checkIn || today,
      check_out: checkOut || tomorrow,
      adults,
      children,
    }).then(ref => {
      if (ref) setRefNumber(ref)
    }).catch(() => {
      // error handled by hook
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, refNumber, roomsParam, checkIn, checkOut])

  useEffect(() => {
    if (!refNumber) return
    const loadBookingDetails = async () => {
      try {
        const { data } = await api.get(`/bookings/${refNumber}`)
        const booking = data?.data || data
        if (booking?.rooms) setReservedRooms(booking.rooms)
        if (booking?.number_of_adults != null || booking?.number_of_children != null) {
          setBookingGuests({
            adults: booking.number_of_adults || 0,
            children: booking.number_of_children || 0,
          })
        }
      } catch {
        // fallback to URL params
      }
    }
    loadBookingDetails()
  }, [refNumber])

  useEffect(() => {
    if (!id) return
    const loadPropertyDetails = async () => {
      setLoading(true)
      try {
        const { today, tomorrow } = getDefaultDates()
        const checkInDate = checkIn || today
        const checkOutDate = checkOut || tomorrow
        const roomsParamQ = searchParams.get("rooms")
        const adults = bookingParams.adults
        const children = bookingParams.children
        const rooms = roomsParamQ ? Number(roomsParamQ) : 1
        const propRes = await api.get(`/properties/${id}/public`)
        setProperty(propRes.data?.data || null)
        try {
          const roomsRes = await api.get(`/properties/${id}/rooms/available-rooms`, {
            params: { checkin_date: checkInDate, checkout_date: checkOutDate, adults, children, rooms },
          })
          setAvailableRooms(roomsRes.data?.data || [])
        } catch {
          setAvailableRooms([])
        }
      } catch {
        setProperty(null)
        setAvailableRooms([])
      } finally {
        setLoading(false)
      }
    }
    loadPropertyDetails()
  }, [id, searchParams, checkIn, checkOut])

  const hotel = useMemo(() => {
    if (!property) return null
    return mapPropertyToHotel(property, availableRooms)
  }, [property, availableRooms])

  const currency = property?.currency || 'USD'

  const selectedRoomTypes = useMemo(() => {
    if (!hotel) return []
    if (reservedRooms.length > 0) {
      return hotel.roomTypes.filter(rt => reservedRooms.some(br => br.room_id === rt.id))
    }
    return hotel.roomTypes.filter(rt => selectedRooms[rt.id] && selectedRooms[rt.id] > 0)
  }, [hotel, reservedRooms, selectedRooms])

  const roomLines = useMemo(() => {
    if (reservedRooms.length > 0) {
      return reservedRooms.map(br => {
        const rt = hotel?.roomTypes.find(r => r.id === br.room_id)
        const qty = 1
        const gc = br.max_adults + br.max_children
        const ep = br.base_rate
        return { room: rt || { id: br.room_id, name: br.room_name, price: br.base_rate, maxGuests: gc } as RoomType, qty, gc, ep, lineTotal: qty * ep }
      })
    }
    return selectedRoomTypes.map(rt => {
      const qty = selectedRooms[rt.id] || 0
      const gc = guestAllocation[rt.id] || 1
      const ep = rt.price
      const lineTotal = qty * ep
      return { room: rt, qty, gc, ep, lineTotal }
    })
  }, [reservedRooms, selectedRoomTypes, hotel, selectedRooms, guestAllocation])

  const nights = calculateNights(checkIn, checkOut)
  const subtotal = roomLines.reduce((s, l) => s + l.lineTotal * nights, 0)
  const total = subtotal

  const handleNext = () => {
    const params = new URLSearchParams()
    if (checkIn) params.set("checkIn", checkIn)
    if (checkOut) params.set("checkOut", checkOut)
    if (roomsParam) params.set("rooms", roomsParam)
    if (guestCountsParam) params.set("guestCounts", guestCountsParam)
    params.set("adults", String(bookingParams.adults))
    params.set("children", String(bookingParams.children))
    params.set("guestName", guest.name)
    params.set("guestEmail", guest.email)
    params.set("guestPhone", `${guest.phoneCode}${guest.phone}`)
    if (guest.country) params.set("guestCountry", guest.country)
    if (refNumber) params.set("ref", refNumber)
    navigate(`/reserve/${id}?${params.toString()}`)
  }

  if (loading) {
    return <PageMessage loading title="Loading booking details..." />
  }

  if (!hotel) {
    return (
      <PageMessage
        icon="🏨"
        title="Property not found"
        action={
          <Link to="/" className="px-5 py-2.5 bg-[#1A3C5E] text-white rounded-full text-sm font-medium hover:opacity-90">
            Back to home
          </Link>
        }
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-jakarta">
      <Navbar />

      {/* Full-width stepper */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#1A3C5E] text-white flex items-center justify-center text-sm font-bold">1</span>
              <span className="text-sm font-semibold text-[#1A3C5E]">Your selection</span>
            </div>

            <div className="flex-1 h-[2px] bg-[#1A3C5E] mx-4 min-w-[60px] max-w-[120px]" />

            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#1A3C5E] text-white flex items-center justify-center text-sm font-bold">2</span>
              <span className="text-sm font-semibold text-[#1A3C5E]">Enter your details</span>
            </div>

            <div className="flex-1 h-[2px] bg-gray-200 mx-4 min-w-[60px] max-w-[120px]" />

            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-bold">3</span>
              <span className="text-sm text-gray-500">Confirm your reservation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6">

        <div className="bg-[#e8f5e9] border border-[#c8e6c9] rounded-lg px-5 py-3 mb-6 text-center">
          <p className="text-sm font-medium text-[#2e7d32]">Great choice! You're almost done.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
          <div className="order-1 lg:order-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <img
                src={hotel.imageUrl || hotel.images[0]}
                alt={hotel.name}
                className={`w-full ${HOTEL_IMAGE_HEIGHT} object-cover`}
              />
              <div className="p-5">
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={i < Math.floor(hotel.rating) ? "fill-[#febb02] stroke-[#febb02]" : "fill-gray-200 stroke-gray-200"} />
                  ))}
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1 font-display">
                  {hotel.name}
                </h2>
                <p className="text-sm text-gray-500 mb-2">{hotel.location}</p>
                {hotel.rating > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold text-white bg-[#003580] px-2 py-1 rounded">
                      {hotel.rating.toFixed(1)}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {hotel.rating >= 4 ? "Excellent" : hotel.rating >= 3 ? "Good" : "Bad"}
                    </span>
                    {hotel.reviews > 0 && (
                      <span className="text-sm text-gray-500">· {hotel.reviews} reviews</span>
                    )}
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.slice(0, MAX_AMENITIES_DISPLAY).map((amenity) => (
                    <span key={amenity} className="inline-flex items-center gap-1 text-xs text-gray-600">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Your booking details */}
              <div className="border-t border-gray-200 p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Your booking details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Check-in</p>
                    <p className="text-sm font-bold text-gray-900">
                      {checkIn ? `${formatDate(checkIn)}` : "Select dates"}
                    </p>
                    <p className="text-xs text-gray-400">From 2:00 PM</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Check-out</p>
                    <p className="text-sm font-bold text-gray-900">
                      {checkOut ? `${formatDate(checkOut)}` : "Select dates"}
                    </p>
                    <p className="text-xs text-gray-400">Until 12:00 PM</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Guests</p>
                    <p className="text-sm font-bold text-gray-900">
                      {bookingGuests
                        ? `${bookingGuests.adults} adult${bookingGuests.adults !== 1 ? 's' : ''}${bookingGuests.children > 0 ? `, ${bookingGuests.children} child${bookingGuests.children !== 1 ? 'ren' : ''}` : ''}`
                        : `${totalGuests} guest${totalGuests !== 1 ? 's' : ''}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Stays</p>
                    <p className="text-sm font-bold text-gray-900">
                      {nights} night{nights !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Your price summary</h3>
                {roomLines.map(l => (
                  <div key={l.room.id} className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">{l.room.name}</span>
                    <span className="text-xs text-gray-900">{currency}{(l.lineTotal * nights).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 mt-3 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-900">Total</span>
                    <span className="text-sm font-bold text-gray-900">{currency}{Math.max(0, total).toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">Taxes & fees included</p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-2 lg:order-2">
            <GuestInformationForm
              guest={guest}
              onGuestChange={setGuest}
              roomNames={roomLines.map(l => l.room.name).join(", ")}
            />

            <button
              onClick={handleNext}
              className="w-full mt-5 py-3.5 rounded-xl bg-[#0071c2] text-white font-semibold text-sm hover:bg-[#005fa3] transition-all flex items-center justify-center gap-2"
            >
              Next: Final details
              <ChevronRight size={16} />
            </button>
            <p className="text-center text-xs text-gray-400 mt-2">
              Don't worry — you won't be charged yet
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
