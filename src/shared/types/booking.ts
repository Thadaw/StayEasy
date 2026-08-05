export interface Booking {
  id: string
  refNumber?: string
  hotelId: number
  hotelName: string
  hotelCity: string
  hotelCountry: string
  hotelImage: string
  checkIn: string
  checkOut: string
  roomTypeName: string
  guests: number
  totalPrice: number
  discountApplied?: {
    code: string
    type: 'percentage' | 'fixed'
    amount: number
  }
  status: 'upcoming' | 'completed' | 'cancelled'
  createdAt: string
}
