export interface GuestRow {
  id: string
  guestCode: string
  name: string
  avatarColor: string
  phone: string
  email: string
  stayPrimary: string
  staySecondary: string
  staying: boolean
  totalStays: number
  type: 'VIP' | 'Regular' | 'Corporate'
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  loyaltyPoints: number
  status: 'Staying' | 'Active'
  rating: number
  nationality: string
}

export interface GuestStat {
  label: string
  value: string
  sub: string
  dot: string
}

export const DEMO_GUESTS: GuestRow[] = [
  {
    id: 'g1',
    guestCode: 'G-1024',
    name: 'John Smith',
    avatarColor: '#f97316',
    phone: '+1 415 832 5682',
    email: 'john.smith@email.com',
    stayPrimary: 'Room 508 · Staying',
    staySecondary: 'Apr 26 – Apr 30',
    staying: true,
    totalStays: 6,
    type: 'VIP',
    loyaltyTier: 'Gold',
    loyaltyPoints: 1320,
    status: 'Staying',
    rating: 4.9,
    nationality: 'United States',
  },
  {
    id: 'g2',
    guestCode: 'G-1025',
    name: 'Emily Johnson',
    avatarColor: '#8b5cf6',
    phone: '+44 20 7946 0958',
    email: 'emily.j@email.com',
    stayPrimary: 'May 28, 2026',
    staySecondary: 'Suite Room · Last stay',
    staying: false,
    totalStays: 3,
    type: 'Regular',
    loyaltyTier: 'Silver',
    loyaltyPoints: 640,
    status: 'Active',
    rating: 4.8,
    nationality: 'United Kingdom',
  },
  {
    id: 'g3',
    guestCode: 'G-1026',
    name: 'Michael Brown',
    avatarColor: '#16a34a',
    phone: '+81 2 6387 5839',
    email: 'michael.b@email.com',
    stayPrimary: 'Jun 05, 2026',
    staySecondary: 'Standard Room · Last stay',
    staying: false,
    totalStays: 2,
    type: 'Corporate',
    loyaltyTier: 'Bronze',
    loyaltyPoints: 500,
    status: 'Active',
    rating: 4.4,
    nationality: 'Japan',
  },
  {
    id: 'g4',
    guestCode: 'G-1027',
    name: 'Sarah Taylor',
    avatarColor: '#3b82f6',
    phone: '+1 917 445 2901',
    email: 'sarah.t@email.com',
    stayPrimary: 'Room 301 · Staying',
    staySecondary: 'Apr 27 – Apr 30',
    staying: true,
    totalStays: 7,
    type: 'VIP',
    loyaltyTier: 'Platinum',
    loyaltyPoints: 3300,
    status: 'Staying',
    rating: 5.0,
    nationality: 'United States',
  },
  {
    id: 'g5',
    guestCode: 'G-1028',
    name: 'Azrav Joshi',
    avatarColor: '#f59e0b',
    phone: '+977 9812345678',
    email: 'azrav.j@email.com',
    stayPrimary: 'Apr 12, 2026',
    staySecondary: 'Executive Room · Last stay',
    staying: false,
    totalStays: 5,
    type: 'Regular',
    loyaltyTier: 'Gold',
    loyaltyPoints: 1050,
    status: 'Active',
    rating: 4.7,
    nationality: 'Nepal',
  },
  {
    id: 'g6',
    guestCode: 'G-1029',
    name: 'Sophie Martin',
    avatarColor: '#ec4899',
    phone: '+33 6 12 34 56 78',
    email: 'sophie.m@email.com',
    stayPrimary: 'Room 214 · Staying',
    staySecondary: 'Apr 30 – May 03',
    staying: true,
    totalStays: 4,
    type: 'Corporate',
    loyaltyTier: 'Gold',
    loyaltyPoints: 1800,
    status: 'Staying',
    rating: 4.8,
    nationality: 'France',
  },
  {
    id: 'g7',
    guestCode: 'G-1030',
    name: 'Daniel Lee',
    avatarColor: '#ef4444',
    phone: '+65 8913 4567',
    email: 'daniel.l@email.com',
    stayPrimary: 'Mar 30, 2026',
    staySecondary: 'Executive Suite · Last stay',
    staying: false,
    totalStays: 8,
    type: 'VIP',
    loyaltyTier: 'Platinum',
    loyaltyPoints: 4510,
    status: 'Active',
    rating: 4.9,
    nationality: 'Singapore',
  },
]

export const GUEST_STATS: GuestStat[] = [
  { label: 'Total Guests', value: '2,486', sub: '+12.5% vs last month', dot: '#14b8a6' },
  { label: 'Current Staying', value: '146', sub: '14 Suite • 9 double • 7 triple', dot: '#3b82f6' },
  { label: 'New Guests', value: '118', sub: '+8.9% vs last month', dot: '#3b82f6' },
  { label: 'Returning Guests', value: '1,032', sub: '+15.6% vs last month', dot: '#f59e0b' },
  { label: 'Loyal Guests', value: '624', sub: '+30.7% vs last month', dot: '#3b82f6' },
  { label: 'VIP Guests', value: '86', sub: '+1.4% vs last month', dot: '#ef4444' },
]

export const GUEST_TYPE_OPTIONS = ['All Guest Types', 'VIP', 'Regular', 'Corporate']

export const NATIONALITY_OPTIONS = [
  'All Nationalities',
  'United States',
  'United Kingdom',
  'Japan',
  'Nepal',
  'France',
  'Singapore',
]

export const GUEST_STATUS_OPTIONS = ['All Status', 'Staying', 'Active']

export const TYPE_PILL: Record<GuestRow['type'], { background: string; color: string }> = {
  VIP: { background: '#f1f5f9', color: '#0f172a' },
  Regular: { background: '#f3f4f6', color: '#374151' },
  Corporate: { background: '#eff6ff', color: '#2563eb' },
}

export const STATUS_PILL: Record<GuestRow['status'], { background: string; color: string }> = {
  Staying: { background: '#eff6ff', color: '#2563eb' },
  Active: { background: '#ecfdf5', color: '#16a34a' },
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export function formatPoints(points: number) {
  return points.toLocaleString('en-US')
}
