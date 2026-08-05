import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import type { Hotel } from "../../../data/hotels"
import type { ApiProperty, ApiRoom } from "../../../shared/types/api"
import { mapPropertyToHotel } from "../../../shared/utils/propertyMapper"
import { getDefaultDates } from "../../../shared/utils/date"
import { calculateNights } from "../../../shared/utils/time"
import api from "../../../services/axios"

interface GuestCounts {
  adults: number
  children: number
  rooms: number
}

interface UsePropertyDetailsReturn {
  property: ApiProperty | null
  hotel: Hotel | null
  availableRooms: ApiRoom[]
  isLoading: boolean
  currency: string
  checkIn: string
  checkOut: string
  guests: GuestCounts
  roomQuantities: Record<string, number>
  roomGuestCounts: Record<string, number>
  selectedRoomId: string | null
  detailRoomId: string | null
  nights: number
  capacityError: string
  recommendedRooms: Hotel["roomTypes"]
  hotelMatchesFilters: boolean
  setCheckIn: (value: string) => void
  setCheckOut: (value: string) => void
  setGuests: (value: GuestCounts | ((prev: GuestCounts) => GuestCounts)) => void
  setDetailRoomId: (roomId: string | null) => void
  handleQtyChange: (roomId: string, delta: number) => void
  handleSelectRoom: (roomId: string) => void
}

export function usePropertyDetails(id: string | undefined): UsePropertyDetailsReturn {
  const [searchParams] = useSearchParams()
  const guestsParam = searchParams.get("guests") || ""
  const whereParam = searchParams.get("where") || ""
  const budgetParam = searchParams.get("budget") || ""
  const checkinParam = searchParams.get("checkin") || ""
  const checkoutParam = searchParams.get("checkout") || ""
  const filterAmenities = useMemo(() => searchParams.get("amenities")?.split(",").filter(Boolean) || [], [searchParams])
  const filterBedTypes = useMemo(() => searchParams.get("bedTypes")?.split(",").filter(Boolean) || [], [searchParams])
  const filterGuestRating = searchParams.get("guestRating") || "Any"
  const filterPriceMin = Number(searchParams.get("priceMin")) || 0
  const filterPriceMax = Number(searchParams.get("priceMax")) || 500
  const filterPropertyTypes = searchParams.get("propertyTypes")?.split(",").filter(Boolean) || []
  const hasSearchParams = filterAmenities.length > 0 || filterBedTypes.length > 0 || filterGuestRating !== "Any" || filterPriceMin > 0 || filterPriceMax < 500 || filterPropertyTypes.length > 0 || guestsParam !== "" || whereParam !== "" || budgetParam !== "" || checkinParam !== "" || checkoutParam !== ""

  const [property, setProperty] = useState<ApiProperty | null>(null)
  const [availableRooms, setAvailableRooms] = useState<ApiRoom[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [checkIn, setCheckIn] = useState(checkinParam || "")
  const [checkOut, setCheckOut] = useState(checkoutParam || "")
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [detailRoomId, setDetailRoomId] = useState<string | null>(null)
  const [roomQuantities, setRoomQuantities] = useState<Record<string, number>>({})
  const [roomGuestCounts, setRoomGuestCounts] = useState<Record<string, number>>({})

  const [guests, setGuests] = useState<GuestCounts>(() => {
    const total = parseInt(guestsParam || "0")
    if (total > 0) return { adults: total, children: 0, rooms: 1 }
    return { adults: 2, children: 0, rooms: 1 }
  })

  useEffect(() => {
    if (!id) return
    const loadPropertyDetails = async () => {
      setIsLoading(true)
      try {
        const { today, tomorrow } = getDefaultDates()
        const checkInDate = checkinParam || today
        const checkOutDate = checkoutParam || tomorrow
        const adultsParam = searchParams.get("adults")
        const childrenParam = searchParams.get("children")
        const roomsParam = searchParams.get("rooms")
        const adults = adultsParam ? Number(adultsParam) : (guestsParam ? Number(guestsParam.match(/\d+/g)?.[0] || "2") : 2)
        const children = childrenParam ? Number(childrenParam) : (guestsParam ? Number(guestsParam.match(/\d+/g)?.[1] || "0") : 0)
        const rooms = roomsParam ? Number(roomsParam) : 1
        const propResponse = await api.get(`/properties/${id}/public`)
        setProperty(propResponse.data?.data || null)
        try {
          const roomsResponse = await api.get(`/properties/${id}/rooms/available-rooms`, {
            params: { checkin_date: checkInDate, checkout_date: checkOutDate, adults, children, rooms },
          })
          setAvailableRooms(roomsResponse.data?.data || [])
        } catch {
          // Room availability is non-critical on initial load — UI shows a loading state instead.
        }
      } catch {
        setProperty(null)
        setAvailableRooms([])
      } finally {
        setIsLoading(false)
      }
    }
    loadPropertyDetails()
  }, [id, searchParams, checkinParam, checkoutParam, guestsParam])

  const hotel = useMemo(() => {
    if (!property) return null
    return mapPropertyToHotel(property, availableRooms)
  }, [property, availableRooms])

  useEffect(() => {
    if (!id || isLoading || !checkIn || !checkOut) return
    const loadAvailableRooms = async () => {
      try {
        const roomsResponse = await api.get(`/properties/${id}/rooms/available-rooms`, {
          params: {
            checkin_date: checkIn,
            checkout_date: checkOut,
            adults: guests.adults,
            children: guests.children,
            rooms: guests.rooms,
          },
        })
        setAvailableRooms(roomsResponse.data?.data || [])
      } catch {
        // Keep existing rooms on error — the user can still browse the current selection.
      }
    }
    loadAvailableRooms()
  }, [id, isLoading, guests.adults, guests.children, guests.rooms, checkIn, checkOut])

  // Distribute guests across selected rooms proportionally to each room's max
  // capacity. The last room absorbs any rounding remainder so the total always
  // matches exactly.
  useEffect(() => {
    if (!hotel?.roomTypes) return
    const totalGuests = guests.adults + guests.children
    const selectedEntries = Object.entries(roomQuantities).filter(([, q]) => q > 0)
    if (selectedEntries.length === 0 || totalGuests <= 0) {
      setRoomGuestCounts(hotel.roomTypes.reduce((acc, rt) => ({ ...acc, [rt.id]: 1 }), {}))
      return
    }
    const totalMaxCapacity = selectedEntries.reduce((s, [roomId]) => {
      const rt = hotel.roomTypes.find(r => r.id === roomId)
      return s + (rt ? rt.maxGuests : 2)
    }, 0)
    const newCounts: Record<string, number> = {}
    let assigned = 0
    selectedEntries.forEach(([roomId, qty], idx) => {
      const rt = hotel.roomTypes.find(r => r.id === roomId)
      const maxGuests = rt ? rt.maxGuests : 2
      if (idx === selectedEntries.length - 1) {
        newCounts[roomId] = Math.max(1, totalGuests - assigned)
      } else {
        const proportional = Math.round((totalGuests * maxGuests * qty) / totalMaxCapacity)
        const count = Math.max(1, Math.min(proportional, totalGuests - assigned - (selectedEntries.length - idx - 1)))
        newCounts[roomId] = count
        assigned += count
      }
    })
    setRoomGuestCounts(newCounts)
  }, [hotel, roomQuantities, guests.adults, guests.children])

  const handleQtyChange = (roomId: string, delta: number) => {
    setRoomQuantities(prev => {
      const current = prev[roomId] || 0
      const nextVal = current + delta
      if (nextVal < 0) return prev
      const room = hotel?.roomTypes.find(r => r.id === roomId)
      if (room && nextVal > room.availableRooms) return prev
      return { ...prev, [roomId]: nextVal }
    })
  }

  const guestCount = (() => {
    if (!guestsParam) return 2
    const matches = guestsParam.match(/\d+/g)
    return matches ? matches.reduce((sum, n) => sum + parseInt(n), 0) : 2
  })()

  // Validate adult, child, and total guest counts separately because rooms have
  // independent adult and child capacity limits (e.g. a room may allow 2 adults
  // + 1 child but not 3 adults).
  const capacityError = useMemo(() => {
    if (!hotel) return ""
    const totalGuests = guests.adults + guests.children
    const selectedEntries = Object.entries(roomQuantities).filter(([, q]) => q > 0)
    if (selectedEntries.length === 0 || totalGuests <= 0) return ""

    let totalMaxAdults = 0
    let totalMaxChildren = 0
    let totalMaxGuests = 0

    selectedEntries.forEach(([roomId, qty]) => {
      const rt = hotel.roomTypes.find(r => r.id === roomId)
      if (rt) {
        totalMaxAdults += rt.maxAdults * qty
        totalMaxChildren += rt.maxChildren * qty
        totalMaxGuests += rt.maxGuests * qty
      }
    })

    if (guests.adults > totalMaxAdults) {
      return `Selected room${selectedEntries.length > 1 ? "s" : ""} can accommodate ${totalMaxAdults} adult${totalMaxAdults !== 1 ? "s" : ""}, but you have ${guests.adults} adult${guests.adults !== 1 ? "s" : ""}. Please select a room with higher adult capacity.`
    }
    if (guests.children > totalMaxChildren) {
      return `Selected room${selectedEntries.length > 1 ? "s" : ""} can accommodate ${totalMaxChildren} child${totalMaxChildren !== 1 ? "ren" : ""}, but you have ${guests.children} child${guests.children !== 1 ? "ren" : ""}. Please select a room with higher child capacity.`
    }
    if (totalGuests > totalMaxGuests) {
      return `Selected room${selectedEntries.length > 1 ? "s" : ""} can accommodate ${totalMaxGuests} guest${totalMaxGuests !== 1 ? "s" : ""}, but you have ${totalGuests} guest${totalGuests !== 1 ? "s" : ""}. Please add more rooms or reduce guest count.`
    }
    return ""
  }, [hotel, roomQuantities, guests.adults, guests.children])

  const recommendedRooms = useMemo(() => {
    if (!hotel || guestCount === 0) return []
    const scored = hotel.roomTypes
      .filter((rt) => rt.availableRooms > 0 && rt.maxGuests >= guestCount)
      .map((rt) => {
        let score = 0
        let total = 0

        if (filterBedTypes.length > 0) {
          total += 1
          const rtBed = rt.bedType?.toLowerCase() || ""
          if (filterBedTypes.some((bt) => rtBed.includes(bt.toLowerCase().replace(" bed", "")))) score += 1
        }

        if (filterAmenities.length > 0) {
          total += filterAmenities.length
          const roomAmenities = (rt.roomFacilities || []).map((a) => a.toLowerCase())
          const allAmenities = [...new Set([...roomAmenities, ...hotel.amenities.map((a) => a.toLowerCase())])]
          for (const a of filterAmenities) {
            if (allAmenities.some((ha) => ha.includes(a.toLowerCase()))) score += 1
          }
        }

        if (filterPriceMin > 0 || filterPriceMax < 500) {
          total += 1
          if (rt.price >= filterPriceMin && rt.price <= filterPriceMax) score += 1
        }

        return { rt, score, total }
      })
      .sort((a, b) => (b.total > 0 ? b.score / b.total : 0) - (a.total > 0 ? a.score / a.total : 0))

    if (scored.length === 0) return []
    return [scored[0].rt]
  }, [hotel, guestCount, filterBedTypes, filterAmenities, filterPriceMin, filterPriceMax])

  const hotelMatchesFilters = (() => {
    if (!hotel) return false
    if (!hasSearchParams) return false
    if (filterGuestRating !== "Any" && hotel.rating < parseFloat(filterGuestRating)) return false
    if (filterPropertyTypes.length > 0) {
      const typeMap: Record<string, string[]> = {
        "Villas": ["villa"],
        "Hotels": ["resort", "hotel"],
        "Apartments": ["apartment", "loft"],
        "Resorts": ["resort", "eco"],
        "Cottages": ["cottage", "chalet", "lodge"],
      }
      const matches = filterPropertyTypes.some((t) =>
        typeMap[t]?.some((k) => hotel.category.toLowerCase().includes(k) || hotel.name.toLowerCase().includes(k))
      )
      if (!matches) return false
    }
    return true
  })()

  const nights = calculateNights(checkIn, checkOut)

  const handleSelectRoom = (roomId: string) => {
    const qty = roomQuantities[roomId] || 0
    setRoomQuantities(prev => ({ ...prev, [roomId]: qty > 0 ? 0 : 1 }))
    setSelectedRoomId(roomId)
    setTimeout(() => setSelectedRoomId(null), 3000)
    const el = document.getElementById(`room-${roomId}`)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  return {
    property,
    hotel,
    availableRooms,
    isLoading,
    currency: property?.currency || "USD",
    checkIn,
    checkOut,
    guests,
    roomQuantities,
    roomGuestCounts,
    selectedRoomId,
    detailRoomId,
    nights,
    capacityError,
    recommendedRooms,
    hotelMatchesFilters,
    setCheckIn,
    setCheckOut,
    setGuests,
    setDetailRoomId,
    handleQtyChange,
    handleSelectRoom,
  }
}
