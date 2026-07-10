export interface HousekeepingRoom {
  id: number
  roomNumber: string
  roomType: string
  bedDescription: string
  floor: string
  status: 'Clean' | 'Dirty' | 'In Progress' | 'Out of Service'
  assignedTo: string | null
  assignedAvatar?: string
  lastCleaned: string | null
  nextCleaning: string | null
  image?: string
}

export interface HousekeepingStats {
  total: number
  clean: number
  dirty: number
  inProgress: number
  outOfService: number
}
