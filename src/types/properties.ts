export interface Property {
  id: number
  name: string
  code: string
  type: 'Hotel' | 'Resort' | 'Lodge'
  location: string
  phone: string
  rooms: number
  occupancy: number
  status: 'Active' | 'Inactive'
  manager: string
  managerEmail: string
  image?: string
}

export interface PropertyStats {
  totalProperties: number
  totalRooms: number
  totalBookings: number
  revenue: number
  occupancyRate: number
  revenueGrowth: number
  occupancyGrowth: number
}
