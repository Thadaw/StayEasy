import type { BookingRow } from './ManagerBookingTable'

export const STATUS_PILL: Record<string, { bg: string; text: string }> = {
  Confirmed: { bg: '#dcfce7', text: '#166534' },
  Pending: { bg: '#fef3c7', text: '#92400e' },
  'Checked-in': { bg: '#dbeafe', text: '#1e40af' },
  'Checked-out': { bg: '#f3f4f6', text: '#374151' },
  Cancelled: { bg: '#fee2e2', text: '#991b1b' },
}

export function formatNPR(n: number): string {
  return `NPR ${n.toLocaleString()}`
}

export const DEMO_NIGHTLY_RATE = 240

function today() { return new Date() }
function fmtDate(d: Date) { return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
function addDays(d: Date, n: number) { const r = new Date(d); r.setDate(r.getDate() + n); return r }

const t = today()

function createdAt(checkIn: string): string {
  const d = new Date(checkIn)
  d.setDate(d.getDate() - 4)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const DEMO_BOOKINGS: BookingRow[] = [
  { id: 'BK-2024-001', guest: 'Aarav Sharma', room: '501', roomType: 'Deluxe King', checkIn: fmtDate(addDays(t, -2)), checkOut: fmtDate(addDays(t, 1)), guests: 2, source: 'Direct', paymentStatus: 'Paid', status: 'Checked-in', createdAt: createdAt(fmtDate(addDays(t, -2))) },
  { id: 'BK-2024-002', guest: 'Emily Watson', room: '502', roomType: 'Deluxe King', checkIn: fmtDate(addDays(t, 0)), checkOut: fmtDate(addDays(t, 3)), guests: 1, source: 'OTA', paymentStatus: 'Paid', status: 'Confirmed', createdAt: createdAt(fmtDate(addDays(t, 0))) },
  { id: 'BK-2024-003', guest: 'Rajan Thapa', room: '503', roomType: 'Deluxe Twin', checkIn: fmtDate(addDays(t, -1)), checkOut: fmtDate(addDays(t, 2)), guests: 2, source: 'Phone', paymentStatus: 'Partial', status: 'Checked-in', createdAt: createdAt(fmtDate(addDays(t, -1))) },
  { id: 'BK-2024-004', guest: 'Sakura Tanaka', room: '504', roomType: 'Suite', checkIn: fmtDate(addDays(t, 0)), checkOut: fmtDate(addDays(t, 5)), guests: 2, source: 'OTA', paymentStatus: 'Paid', status: 'Confirmed', createdAt: createdAt(fmtDate(addDays(t, 0))) },
  { id: 'BK-2024-005', guest: 'Priya Gurung', room: '505', roomType: 'Standard', checkIn: fmtDate(addDays(t, 1)), checkOut: fmtDate(addDays(t, 3)), guests: 1, source: 'Direct', paymentStatus: 'Unpaid', status: 'Pending', createdAt: createdAt(fmtDate(addDays(t, 1))) },
  { id: 'BK-2024-006', guest: 'James Mitchell', room: '506', roomType: 'Deluxe King', checkIn: fmtDate(addDays(t, -5)), checkOut: fmtDate(addDays(t, -2)), guests: 2, source: 'Walk-in', paymentStatus: 'Paid', status: 'Checked-out', createdAt: createdAt(fmtDate(addDays(t, -5))) },
  { id: 'BK-2024-007', guest: 'Suman Magar', room: '507', roomType: 'Deluxe Twin', checkIn: fmtDate(addDays(t, 2)), checkOut: fmtDate(addDays(t, 5)), guests: 3, source: 'Direct', paymentStatus: 'Unpaid', status: 'Pending', createdAt: createdAt(fmtDate(addDays(t, 2))) },
  { id: 'BK-2024-008', guest: 'Lisa Chen', room: '508', roomType: 'Suite', checkIn: fmtDate(addDays(t, -3)), checkOut: fmtDate(addDays(t, 0)), guests: 2, source: 'OTA', paymentStatus: 'Paid', status: 'Checked-out', createdAt: createdAt(fmtDate(addDays(t, -3))) },
  { id: 'BK-2024-009', guest: 'Bikash Rai', room: '509', roomType: 'Standard', checkIn: fmtDate(addDays(t, 0)), checkOut: fmtDate(addDays(t, 2)), guests: 1, source: 'Phone', paymentStatus: 'Paid', status: 'Confirmed', createdAt: createdAt(fmtDate(addDays(t, 0))) },
  { id: 'BK-2024-010', guest: 'Anna Kowalski', room: '510', roomType: 'Deluxe King', checkIn: fmtDate(addDays(t, 3)), checkOut: fmtDate(addDays(t, 6)), guests: 2, source: 'Direct', paymentStatus: 'Unpaid', status: 'Pending', createdAt: createdAt(fmtDate(addDays(t, 3))) },
  { id: 'BK-2024-011', guest: 'Deepak Tamang', room: '511', roomType: 'Deluxe Twin', checkIn: fmtDate(addDays(t, -7)), checkOut: fmtDate(addDays(t, -4)), guests: 2, source: 'Walk-in', paymentStatus: 'Paid', status: 'Checked-out', createdAt: createdAt(fmtDate(addDays(t, -7))) },
  { id: 'BK-2024-012', guest: 'Michael Brown', room: '512', roomType: 'Suite', checkIn: fmtDate(addDays(t, 0)), checkOut: fmtDate(addDays(t, 4)), guests: 2, source: 'OTA', paymentStatus: 'Paid', status: 'Checked-in', createdAt: createdAt(fmtDate(addDays(t, 0))) },
  { id: 'BK-2024-013', guest: 'Nisha Shrestha', room: '501', roomType: 'Deluxe King', checkIn: fmtDate(addDays(t, 4)), checkOut: fmtDate(addDays(t, 7)), guests: 1, source: 'Direct', paymentStatus: 'Unpaid', status: 'Pending', createdAt: createdAt(fmtDate(addDays(t, 4))) },
  { id: 'BK-2024-014', guest: 'Hans Mueller', room: '505', roomType: 'Standard', checkIn: fmtDate(addDays(t, -4)), checkOut: fmtDate(addDays(t, -1)), guests: 1, source: 'Phone', paymentStatus: 'Refunded', status: 'Cancelled', createdAt: createdAt(fmtDate(addDays(t, -4))) },
  { id: 'BK-2024-015', guest: 'Sita Lama', room: '503', roomType: 'Deluxe Twin', checkIn: fmtDate(addDays(t, 1)), checkOut: fmtDate(addDays(t, 4)), guests: 2, source: 'Direct', paymentStatus: 'Unpaid', status: 'Pending', createdAt: createdAt(fmtDate(addDays(t, 1))) },
]

export interface TimelineEvent {
  label: string
  timestamp: string
}

export interface BookingDetail {
  roomSummary: string
  checkInAt: string
  checkOutAt: string
  guestsSummary: string
  ratePlan: string
  roomStatus: string
  guestName: string
  guestEmail: string
  guestPhone: string
  guestNationality: string
  guestIdPassport: string
  guestLoyalty: string
  roomCharges: number
  taxesFees: number
  total: number
  paid: number
  balance: number
  paymentMethod: string
  timeline: TimelineEvent[]
  notes: string
}

const TIER_BY_STAY: Record<string, string> = {
  'BK-2024-004': 'Gold · 4,880 points',
  'BK-2024-012': 'Platinum · 9,240 points',
  'BK-2024-008': 'Gold · 6,110 points',
  'BK-2024-002': 'Silver · 2,150 points',
}

const NOTES: Record<string, string> = {
  'BK-2024-001': 'Guest requested airport pickup and a high-floor room. Front desk should confirm pickup ETA on arrival.',
  'BK-2024-002': 'Anniversary stay - complimentary cake and flowers arranged in room. Charge to manager account.',
  'BK-2024-003': 'Returning guest, prefers quiet room away from elevator. Late checkout requested if possible.',
  'BK-2024-004': 'VIP arrival. Send welcome note and upgrade to lounge access. Airport pickup arranged for 3:30 PM.',
  'BK-2024-005': 'First visit. Explained breakfast hours and WiFi at check-in. Guest asked about late checkout options.',
  'BK-2024-006': 'Walk-in booking paid in cash at the desk. Receipt issued. No further action required.',
  'BK-2024-007': 'Family of three. Extra bed requested for child. Confirm crib availability before arrival.',
  'BK-2024-008': 'Departed early on schedule. Late checkout denied as room was already sold. Invoice settled in full.',
  'BK-2024-009': 'Corporate rate applied. Billing to be split between company account and personal card.',
  'BK-2024-010': 'Repeat guest. Prefers upper floors away from stairwell. Requested extra pillows at check-in.',
  'BK-2024-011': 'Group leader for a three-room block. Master folio to be consolidated at checkout.',
  'BK-2024-012': 'Platinum tier benefits applied. Room upgraded to suite. Welcome amenity delivered on arrival.',
  'BK-2024-013': 'Long stay booking. Weekly linen change scheduled for each Monday. Laundry instructions shared.',
  'BK-2024-014': 'Cancelled by guest 48 hours before arrival. Full refund issued to original card. Reason: travel plans changed.',
  'BK-2024-015': 'Requested connecting rooms for family. Assigned 503 and 504. Breakfast for two confirmed.',
}

const ROOM_STATUS: Record<string, string> = {
  'Checked-in': 'Occupied',
  'Checked-out': 'Clean & Ready',
  'Confirmed': 'Ready · Clean',
  'Pending': 'Awaiting Arrival',
  'Cancelled': 'Released',
}

function buildTimeline(row: BookingRow): TimelineEvent[] {
  const created = new Date(row.createdAt ?? row.checkIn)
  const createdLabel = created.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const events: TimelineEvent[] = [
    { label: 'Booking created', timestamp: `${createdLabel}, 10:45 AM` },
  ]
  if (row.paymentStatus === 'Paid' || row.paymentStatus === 'Partial') {
    events.push({ label: 'Payment received', timestamp: `${createdLabel}, 3:15 PM` })
  }
  if (row.status !== 'Cancelled') {
    events.push({ label: 'Pre-arrival reminder sent', timestamp: `${createdLabel}, 8:00 PM` })
  }
  if (row.status === 'Checked-in' || row.status === 'Checked-out') {
    events.push({ label: 'Guest checked in', timestamp: `${row.checkIn}, 2:00 PM` })
  }
  if (row.status === 'Checked-out') {
    events.push({ label: 'Guest checked out & folio settled', timestamp: `${row.checkOut}, 11:00 AM` })
  }
  if (row.status === 'Cancelled') {
    events.push({ label: 'Booking cancelled & refunded', timestamp: `${row.checkOut}, 4:30 PM` })
  }
  return events
}

function buildDetail(row: BookingRow): BookingDetail {
  const nights = 3
  const rate = DEMO_NIGHTLY_RATE
  const roomCharges = nights * rate
  const taxesFees = Math.round(roomCharges * 0.13)
  const total = roomCharges + taxesFees

  const paidMap: Record<string, number> = {
    Paid: total,
    Partial: Math.round(total * 0.5),
    Unpaid: 0,
    Refunded: total,
  }
  const paid = paidMap[row.paymentStatus] ?? 0

  const paymentMethodMap: Record<string, string> = {
    Paid: 'Credit Card',
    Partial: 'Bank Transfer',
    Unpaid: row.source === 'Walk-in' ? 'Cash' : 'Due on Arrival',
    Refunded: 'Credit Card (Refunded)',
  }

  return {
    roomSummary: `${row.room} · ${row.roomType}`,
    checkInAt: `${row.checkIn} · 2:00 PM`,
    checkOutAt: `${row.checkOut} · 11:00 AM`,
    guestsSummary: row.guests === 1 ? '1 Adult' : `${row.guests} Adults`,
    ratePlan: 'Flexible · Breakfast Included',
    roomStatus: ROOM_STATUS[row.status] ?? 'Ready · Clean',
    guestName: row.guest,
    guestEmail: `${row.guest.toLowerCase().replace(/[^a-z]+/g, '.')}@example.com`,
    guestPhone: '+977 9841' + String(100000 + row.guests * 3571).slice(0, 6),
    guestNationality: 'Nepal',
    guestIdPassport: `NP-08-${String(100000 + Number(row.id.slice(-3)) * 7).slice(0, 6)}`,
    guestLoyalty: TIER_BY_STAY[row.id] ?? 'Member · 1,240 points',
    roomCharges,
    taxesFees,
    total,
    paid,
    balance: row.paymentStatus === 'Refunded' ? 0 : total - paid,
    paymentMethod: paymentMethodMap[row.paymentStatus] ?? 'Credit Card',
    timeline: buildTimeline(row),
    notes: NOTES[row.id] ?? 'No special notes recorded for this booking.',
  }
}

const detailCache = new Map<string, BookingDetail>()

export function getDemoBookingDetail(id: string): BookingDetail | null {
  const cached = detailCache.get(id)
  if (cached) return cached
  const row = DEMO_BOOKINGS.find((b) => b.id === id)
  if (!row) return null
  const detail = buildDetail(row)
  detailCache.set(id, detail)
  return detail
}
