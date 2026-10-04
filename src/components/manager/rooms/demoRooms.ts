export interface RoomRow {
  id: string
  number: string
  type: string
  bedInfo: string
  floor: string
  status: string
  capacity: number
  price: number
  features: string[]
  guestStay: string
  housekeeping: string
}

export const ROOM_STATUSES = ['Available', 'Occupied', 'Reserved', 'Cleaning', 'Maintenance', 'Out of Order'] as const

export const HOUSEKEEPING_STATUSES = ['Clean', 'In Progress', 'Blocked'] as const

export const ROOM_STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Available: { bg: '#dcfce7', text: '#166534', dot: '#16a34a' },
  Occupied: { bg: '#dbeafe', text: '#1e40af', dot: '#2563eb' },
  Reserved: { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' },
  Cleaning: { bg: '#e0e7ff', text: '#3730a3', dot: '#6366f1' },
  Maintenance: { bg: '#fee2e2', text: '#991b1b', dot: '#dc2626' },
  'Out of Order': { bg: '#fee2e2', text: '#991b1b', dot: '#dc2626' },
}

export const HOUSEKEEPING_COLORS: Record<string, { bg: string; text: string }> = {
  Clean: { bg: '#dcfce7', text: '#166534' },
  'In Progress': { bg: '#dbeafe', text: '#1e40af' },
  Blocked: { bg: '#fee2e2', text: '#991b1b' },
}

export const LEGEND_STATUSES = ['Available', 'Occupied', 'Reserved', 'Cleaning', 'Maintenance']

export const DEMO_ROOMS: RoomRow[] = [
  { id: 'RM-101', number: '101', type: 'Standard Room', bedInfo: '1 Queen Bed', floor: 'Floor 1', status: 'Available', capacity: 2, price: 12000, features: ['WiFi', 'AC', 'Balcony'], guestStay: '—', housekeeping: 'Clean' },
  { id: 'RM-102', number: '102', type: 'Deluxe Room', bedInfo: '1 King Bed', floor: 'Floor 1', status: 'Occupied', capacity: 4, price: 18000, features: ['WiFi', 'Mini Bar', 'TV'], guestStay: 'Sarah M. · Apr 28', housekeeping: 'Clean' },
  { id: 'RM-103', number: '103', type: 'Standard Room', bedInfo: '2 Single Beds', floor: 'Floor 1', status: 'Cleaning', capacity: 2, price: 12000, features: ['WiFi', 'AC', 'TV'], guestStay: '—', housekeeping: 'In Progress' },
  { id: 'RM-104', number: '104', type: 'Deluxe Room', bedInfo: '1 King Bed', floor: 'Floor 1', status: 'Occupied', capacity: 4, price: 18000, features: ['WiFi', 'AC', 'City View'], guestStay: 'Tom H. · Apr 26', housekeeping: 'Clean' },
  { id: 'RM-201', number: '201', type: 'Family Room', bedInfo: '1 King + 1 Single', floor: 'Floor 2', status: 'Reserved', capacity: 4, price: 22000, features: ['WiFi', 'AC', 'TV'], guestStay: 'Michael R. · May 03', housekeeping: 'Clean' },
  { id: 'RM-202', number: '202', type: 'Deluxe Room', bedInfo: '1 King Bed', floor: 'Floor 2', status: 'Cleaning', capacity: 2, price: 18000, features: ['WiFi', 'AC', 'Work Desk'], guestStay: '—', housekeeping: 'In Progress' },
  { id: 'RM-203', number: '203', type: 'Standard Room', bedInfo: '1 Queen Bed', floor: 'Floor 2', status: 'Available', capacity: 2, price: 12000, features: ['WiFi', 'AC', 'Balcony'], guestStay: '—', housekeeping: 'Clean' },
  { id: 'RM-204', number: '204', type: 'Family Room', bedInfo: '2 Queen Beds', floor: 'Floor 2', status: 'Occupied', capacity: 4, price: 22000, features: ['WiFi', 'AC', 'Mini Bar'], guestStay: 'Anna P. · Apr 29', housekeeping: 'Clean' },
  { id: 'RM-301', number: '301', type: 'Suite Room', bedInfo: '1 King Bed', floor: 'Floor 3', status: 'Occupied', capacity: 4, price: 35000, features: ['WiFi', 'AC', 'Mini Bar', 'View'], guestStay: 'Jasmine T. · Apr 30', housekeeping: 'Clean' },
  { id: 'RM-302', number: '302', type: 'Family Room', bedInfo: '1 King + 1 Single', floor: 'Floor 3', status: 'Available', capacity: 4, price: 22000, features: ['WiFi', 'AC', 'Balcony'], guestStay: '—', housekeeping: 'Clean' },
  { id: 'RM-303', number: '303', type: 'Suite Room', bedInfo: '1 King Bed', floor: 'Floor 3', status: 'Reserved', capacity: 4, price: 35000, features: ['WiFi', 'AC', 'City View'], guestStay: 'David K. · May 05', housekeeping: 'Blocked' },
  { id: 'RM-401', number: '401', type: 'Standard Room', bedInfo: '1 Queen Bed', floor: 'Floor 4', status: 'Maintenance', capacity: 2, price: 12000, features: ['WiFi', 'AC', 'Balcony'], guestStay: '—', housekeeping: 'Blocked' },
  { id: 'RM-402', number: '402', type: 'Deluxe Room', bedInfo: '1 King Bed', floor: 'Floor 4', status: 'Occupied', capacity: 4, price: 18000, features: ['WiFi', 'Mini Bar', 'City View'], guestStay: 'Daniel L. · May 12', housekeeping: 'Clean' },
  { id: 'RM-403', number: '403', type: 'Standard Room', bedInfo: '2 Single Beds', floor: 'Floor 4', status: 'Out of Order', capacity: 2, price: 12000, features: ['WiFi', 'AC', 'TV'], guestStay: '—', housekeeping: 'Blocked' },
  { id: 'RM-404', number: '404', type: 'Deluxe Room', bedInfo: '1 King Bed', floor: 'Floor 4', status: 'Available', capacity: 4, price: 18000, features: ['WiFi', 'AC', 'Work Desk'], guestStay: '—', housekeeping: 'Clean' },
]

export const DEMO_FLOOR_OPTIONS = ['All Floors', 'Floor 1', 'Floor 2', 'Floor 3', 'Floor 4']
