import type { HostBankDetails } from '../types/razorpay'

export interface RoomType {
  id: string;
  name: string;
  price: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  description: string;
  totalRooms: number;
  availableRooms: number;
  roomNumbers: string[];
  bedType: string;
  areaSqFt: number;
  floorNumber?: number;
  maxAdults?: number;
  maxChildren?: number;
  cancellationTitle?: string;
  customAmenities?: { name: string; icon: string | null }[];
  image: string;
  gallery?: string[];
  bathroomAmenities?: string[];
  roomFacilities?: string[];
  smokingPolicy?: string;
  cancellationPolicy?: string;
  breakfastIncluded?: boolean;
  bedComfortRating?: number;
  bedComfortReviews?: number;
  room_type_id?: string;
  bed_type_id?: string;
  roomTypeName?: string;
}

export interface Hotel {
  id: number;
  name: string;
  location: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  rating: number;
  reviews: number;
  price: number;
  imageUrl: string;
  images: string[];
  tag?: string;
  isSuperhost?: boolean;
  category: string;
  description: string;
  amenities: string[];
  hostName: string;
  hostAvatar: string;
  hostJoined: string;
  hostReviews: number;
  hostBankDetails: HostBankDetails;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  maxGuests: number;
  maxAdults: number;
  maxChildren: number;
  roomTypes: RoomType[];
}
