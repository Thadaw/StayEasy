import { useNavigate } from 'react-router-dom'
import { Star, Wifi, Plane, UtensilsCrossed, BedDouble } from 'lucide-react'
import { formatDate } from '../../../shared/utils/format'

interface RoomLine {
  room: {
    id: string
    name: string
    price: number
    maxGuests: number
    bedType?: string
    roomTypeName?: string
    cancellationTitle?: string
    cancellationPolicy?: string
  }
  qty: number
  gc: number
  ep: number
  lineTotal: number
  cancellationTitle?: string
  cancellationPolicy?: string
}

interface ApiRoom {
  id: string
  room_name: string
  room_type_id?: string
  max_adults: number
  max_children: number
  photos?: { cover: string; gallery: string[] }
}

interface PropertySummaryCardProps {
  hotelName: string
  hotelCity: string
  hotelCountry: string
  hotelImage?: string
  rating: number
  reviews: number
  amenities: string[]
  checkIn: string
  checkOut: string
  totalGuests: number
  nights: number
  bookingData?: {
    number_of_adults?: number
    number_of_children?: number
  } | null
  guestName?: string
  guestEmail?: string
  guestPhone?: string
  guestNationality?: string
  roomLines: RoomLine[]
  availableRooms: ApiRoom[]
  cancellationTitle?: string
  cancellationDescription?: string
  currency: string
}

export function PropertySummaryCard({
  hotelName,
  hotelCity,
  hotelCountry,
  hotelImage,
  rating,
  reviews,
  amenities,
  checkIn,
  checkOut,
  totalGuests,
  nights,
  bookingData,
  guestName,
  guestEmail,
  guestPhone,
  guestNationality,
  roomLines,
  availableRooms,
  cancellationTitle,
  cancellationDescription,
  currency,
}: PropertySummaryCardProps) {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <img
        src={hotelImage || ''}
        alt={hotelName}
        className="w-full h-56 object-cover"
      />
      <div className="p-5">
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={14} className={i < Math.floor(rating) ? "fill-[#febb02] stroke-[#febb02]" : "fill-gray-200 stroke-gray-200"} />
          ))}
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
          {hotelName}
        </h2>
        <p className="text-sm text-gray-500 mb-2">{hotelCity}{hotelCountry ? `, ${hotelCountry}` : ''}</p>
        {rating > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-white bg-[#003580] px-2 py-1 rounded">
              {rating.toFixed(1)}
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {rating >= 4 ? "Excellent" : rating >= 3 ? "Good" : "Bad"}
            </span>
            {reviews > 0 && (
              <span className="text-sm text-gray-500">· {reviews} reviews</span>
            )}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {amenities.length > 0 ? amenities.map((amenity) => (
            <span key={amenity} className="inline-flex items-center gap-1 text-xs text-gray-600">
              {amenity}
            </span>
          )) : (
            <>
              <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                <Wifi size={12} /> Free WiFi
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                <Plane size={12} /> Airport shuttle
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                <UtensilsCrossed size={12} /> Restaurant
              </span>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Your booking details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Check-in</p>
            <p className="text-sm font-bold text-gray-900">{checkIn ? formatDate(checkIn) : '—'}</p>
            <p className="text-xs text-gray-400 hidden lg:block">From 2:00 PM</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Check-out</p>
            <p className="text-sm font-bold text-gray-900">{checkOut ? formatDate(checkOut) : '—'}</p>
            <p className="text-xs text-gray-400 hidden lg:block">Until 12:00 PM</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Guests</p>
            <p className="text-sm font-bold text-gray-900">
              {bookingData?.number_of_adults != null
                ? `${bookingData.number_of_adults} adult${bookingData.number_of_adults !== 1 ? 's' : ''}${(bookingData.number_of_children || 0) > 0 ? `, ${bookingData.number_of_children} child${bookingData.number_of_children !== 1 ? 'ren' : ''}` : ''}`
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

      {roomLines.length > 0 && (
        <div className="border-t border-gray-200 p-5 hidden lg:block">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Room details</h3>
          <div className="space-y-3">
            {roomLines.map((rl, i) => {
              const matchedRoom = availableRooms.find(r => r.id === rl.room.id || r.room_name === rl.room.name)
              const cover = matchedRoom?.photos?.cover || ''
              return (
                <div key={i} className="flex items-start gap-3">
                  {cover ? (
                    <img src={cover} alt={rl.room.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <BedDouble size={20} className="text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{rl.room.name}</p>
                    <p className="text-xs text-gray-500">{rl.room.roomTypeName || rl.room.bedType || ''}</p>
                    <p className="text-xs text-gray-400">
                      {rl.gc} guest{rl.gc !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 shrink-0">{currency}{rl.ep.toFixed(2)}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {(guestName || guestEmail) && (
        <div className="border-t border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900">Guest details</h3>
            <button
              onClick={() => navigate(-1)}
              className="text-xs font-semibold text-[#0071c2] hover:underline cursor-pointer"
            >
              Edit
            </button>
          </div>
          <div className="space-y-2 text-sm">
            {guestName && (
              <div className="flex gap-2">
                <span className="text-gray-500">Name:</span>
                <span className="text-gray-900 font-medium">{guestName}</span>
              </div>
            )}
            {guestEmail && (
              <div className="flex gap-2">
                <span className="text-gray-500">Email:</span>
                <span className="text-gray-900">{guestEmail}</span>
              </div>
            )}
            {guestPhone && (
              <div className="flex gap-2">
                <span className="text-gray-500">Phone:</span>
                <span className="text-gray-900">{guestPhone}</span>
              </div>
            )}
            {guestNationality && (
              <div className="flex gap-2">
                <span className="text-gray-500">Nationality:</span>
                <span className="text-gray-900">{guestNationality}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {(cancellationTitle || cancellationDescription) && (
        <div className="border-t border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-1">{cancellationTitle}</h3>
          <p className="text-xs text-gray-600 leading-relaxed">{cancellationDescription}</p>
        </div>
      )}
    </div>
  )
}
