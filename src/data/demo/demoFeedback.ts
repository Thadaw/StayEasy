export interface FeedbackKpi {
  label: string
  value: string
  delta: string
  positive: boolean
}

export const FEEDBACK_KPIS: FeedbackKpi[] = [
  { label: 'Average Rating', value: '4.8 / 5', delta: '+12% vs last month', positive: true },
  { label: 'Total Reviews', value: '650', delta: '+18% vs last month', positive: true },
  { label: 'Positive Reviews', value: '548', delta: '+6% vs last month', positive: true },
  { label: 'Negative Reviews', value: '102', delta: '-6% vs last month', positive: false },
]

export const RATING_DISTRIBUTION = [
  { stars: 5, count: 483, percent: 74 },
  { stars: 4, count: 117, percent: 18 },
  { stars: 3, count: 29, percent: 5 },
  { stars: 2, count: 12, percent: 2 },
  { stars: 1, count: 9, percent: 1 },
]

export const TOTAL_REVIEWS = 650

export const FEEDBACK_CATEGORIES = [
  { name: 'Rooms', value: 228, percent: 35, color: '#1f2937' },
  { name: 'Staff Service', value: 163, percent: 25, color: '#10b981' },
  { name: 'Cleanliness', value: 130, percent: 20, color: '#f97316' },
  { name: 'Booking Process', value: 97, percent: 15, color: '#2563eb' },
  { name: 'Facilities', value: 32, percent: 5, color: '#f43f5e' },
]

export interface PerformanceHighlight {
  id: string
  label: string
  category: string
  score: string
  reviews: string
  tone: 'top' | 'improved' | 'dissatisfied'
}

export const PERFORMANCE_HIGHLIGHTS: PerformanceHighlight[] = [
  { id: 'h1', label: 'Top Rated Category', category: 'Staff Service', score: '4.9 / 5', reviews: '130 reviews', tone: 'top' },
  { id: 'h2', label: 'Most Improved Category', category: 'Room Cleanliness', score: '5.0 / 5', reviews: '120 reviews', tone: 'improved' },
  { id: 'h3', label: 'Most Dissatisfied Department', category: 'Front Desk', score: '4.6 / 5', reviews: '102 reviews', tone: 'dissatisfied' },
]

export const REVIEW_CATEGORIES = ['Room Quality', 'Staff Service', 'Housekeeping', 'Booking Experience', 'Facilities', 'Cleanliness']

export type ReviewStatus = 'Replied' | 'Pending Response'

export const REVIEW_STATUS_PILL: Record<ReviewStatus, { background: string; color: string }> = {
  Replied: { background: '#dcfce7', color: '#16a34a' },
  'Pending Response': { background: '#ffedd5', color: '#ea580c' },
}

export interface ReviewRow {
  id: string
  reviewId: string
  guest: string
  avatarColor: string
  room: string
  rating: number
  category: string
  date: string
  status: ReviewStatus
}

const REVIEW_GUESTS = [
  { name: 'John Smith', color: '#2563eb' },
  { name: 'Emily Carter', color: '#8b5cf6' },
  { name: 'Michael Tan', color: '#f97316' },
  { name: 'Sarah Johnson', color: '#10b981' },
  { name: 'David Wilson', color: '#ef4444' },
  { name: 'Maria Lopez', color: '#ec4899' },
  { name: 'James Wilson', color: '#6366f1' },
  { name: 'Sophie Martin', color: '#f59e0b' },
]

const REVIEW_SEED: Array<Omit<ReviewRow, 'id' | 'avatarColor' | 'guest'> & { guest: number }> = [
  { reviewId: 'REV-2025-1002', guest: 0, room: '501', rating: 4.8, category: 'Room Quality', date: 'Apr 28, 2025', status: 'Replied' },
  { reviewId: 'REV-2025-1001', guest: 1, room: '306', rating: 4.5, category: 'Staff Service', date: 'Apr 27, 2025', status: 'Replied' },
  { reviewId: 'REV-2025-1000', guest: 2, room: '210', rating: 4.9, category: 'Housekeeping', date: 'Apr 25, 2025', status: 'Replied' },
  { reviewId: 'REV-2025-0999', guest: 3, room: '108', rating: 3.2, category: 'Booking Experience', date: 'Apr 24, 2025', status: 'Pending Response' },
  { reviewId: 'REV-2025-0998', guest: 4, room: '415', rating: 4.6, category: 'Facilities', date: 'Apr 23, 2025', status: 'Pending Response' },
  { reviewId: 'REV-2025-0997', guest: 5, room: '205', rating: 4.2, category: 'Staff Service', date: 'Apr 21, 2025', status: 'Pending Response' },
  { reviewId: 'REV-2025-0996', guest: 6, room: '307', rating: 4.7, category: 'Room Quality', date: 'Apr 20, 2025', status: 'Replied' },
  { reviewId: 'REV-2025-0995', guest: 7, room: '402', rating: 3.9, category: 'Cleanliness', date: 'Apr 18, 2025', status: 'Pending Response' },
  { reviewId: 'REV-2025-0994', guest: 4, room: '112', rating: 4.4, category: 'Booking Experience', date: 'Apr 16, 2025', status: 'Pending Response' },
]

export const REVIEW_ROWS: ReviewRow[] = REVIEW_SEED.map((row, i) => ({
  id: `rev-${i}`,
  reviewId: row.reviewId,
  guest: REVIEW_GUESTS[row.guest].name,
  avatarColor: REVIEW_GUESTS[row.guest].color,
  room: row.room,
  rating: row.rating,
  category: row.category,
  date: row.date,
  status: row.status,
}))

export interface RecentReview {
  id: string
  guest: string
  avatarColor: string
  meta: string
  category: string
  rating: number
  text: string
}

export const RECENT_REVIEWS: RecentReview[] = [
  {
    id: 'rr1',
    guest: 'John Smith',
    avatarColor: '#2563eb',
    meta: 'Room 501 · April 28, 2025',
    category: 'Room Quality',
    rating: 5,
    text: 'Excellent stay! The room was clean, spacious and the bed was very comfortable. Staff was friendly and helpful throughout.',
  },
  {
    id: 'rr2',
    guest: 'Emily Carter',
    avatarColor: '#8b5cf6',
    meta: 'Room 306 · April 27, 2025',
    category: 'Staff Service',
    rating: 5,
    text: 'Great service from the front desk team. Check-in was smooth and the staff were very accommodating. Will definitely return.',
  },
  {
    id: 'rr3',
    guest: 'Michael Tan',
    avatarColor: '#f97316',
    meta: 'Room 210 · April 26, 2025',
    category: 'Housekeeping',
    rating: 4,
    text: 'Housekeeping did an amazing job. The room was spotless every day and the amenities were well stocked. Very satisfied.',
  },
]

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
