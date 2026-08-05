import { ApiProperty, ApiRoom } from '../types/api'
import { Hotel, RoomType } from '../../data/hotels'

// The API returns `ApiProperty` and `ApiRoom[]` as separate objects, but the UI
// expects a single `Hotel` type. This mapper bridges the two shapes and supplies
// sensible defaults for fields the API doesn't provide (e.g. rating, host info).
export function mapPropertyToHotel(property: ApiProperty, rooms: ApiRoom[]): Hotel {
  const allAmenities = [
    ...property.system_amenities.map((a) => a.name),
    ...property.custom_amenities.map((a) => a.name),
  ]
  const totalAdults = rooms.reduce((sum, r) => sum + r.max_adults, 0)
  const totalChildren = rooms.reduce((sum, r) => sum + r.max_children, 0)
  const mappedRooms: RoomType[] = rooms.map((r) => ({
    id: r.id,
    name: r.room_name,
    price: parseFloat(r.base_rate) || 0,
    maxGuests: r.max_adults + r.max_children,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    description: r.cancellation_description ?? "",
    totalRooms: 1,
    availableRooms: r.status === "AVAILABLE" ? 1 : 0,
    roomNumbers: [r.room_name],
    bedType: r.bed_type_id ?? "",
    areaSqFt: 0,
    floorNumber: r.floor_number,
    maxAdults: r.max_adults,
    maxChildren: r.max_children,
    cancellationTitle: r.cancellation_title,
    customAmenities: r.custom_amenities,
    image: r.photos?.cover ?? "",
    gallery: r.photos?.gallery || [],
    bathroomAmenities: [],
    roomFacilities: property.system_amenities.map((a) => a.name),
    smokingPolicy: "",
    cancellationPolicy: r.cancellation_description ?? "",
    breakfastIncluded: false,
  }))
  return {
    id: parseInt(property.id) || 0,
    name: property.name,
    location: `${property.address}, ${property.city}, ${property.country}`,
    city: property.city,
    country: property.country,
    lat: property.latitude ? parseFloat(property.latitude) : 0,
    lng: property.longitude ? parseFloat(property.longitude) : 0,
    rating: 0,
    reviews: 0,
    price: rooms.length > 0 ? parseFloat(rooms[0].base_rate) || 0 : 0,
    imageUrl: property.photos?.cover ?? "",
    images: property.photos?.gallery || [],
    tag: property.type,
    isSuperhost: false,
    category: property.type.toLowerCase(),
    description: property.description ?? "",
    amenities: allAmenities,
    hostName: "",
    hostAvatar: property.brand_logo_url ?? "",
    hostJoined: "",
    hostReviews: 0,
    hostBankDetails: { accountHolderName: "", accountNumber: "", ifscCode: "", bankName: "", upiId: "" },
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    maxGuests: totalAdults + totalChildren,
    maxAdults: totalAdults,
    maxChildren: totalChildren,
    roomTypes: mappedRooms,
  }
}
