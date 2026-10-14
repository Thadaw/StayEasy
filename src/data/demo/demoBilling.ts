export type InvoiceStatus = 'Paid' | 'Pending' | 'Partially Paid' | 'Overdue'

export const STATUS_PILL: Record<InvoiceStatus, { background: string; color: string }> = {
  Paid: { background: '#dcfce7', color: '#16a34a' },
  Pending: { background: '#fef3c7', color: '#d97706' },
  'Partially Paid': { background: '#ffedd5', color: '#ea580c' },
  Overdue: { background: '#fee2e2', color: '#dc2626' },
}

export const INVOICE_METHODS = ['Cash', 'Online Payment', 'Mobile Banking'] as const
export type InvoiceMethod = (typeof INVOICE_METHODS)[number]

export interface InvoiceRow {
  id: string
  invoice: string
  booking: string
  guest: string
  avatarColor: string
  room: string
  amount: number
  method: InvoiceMethod
  status: InvoiceStatus
  invoiceDate: string
  dueDate: string
}

const GUEST_POOL = [
  { name: 'Jane Smith', color: '#f97316' },
  { name: 'Emily Carter', color: '#8b5cf6' },
  { name: 'Michael Tan', color: '#2563eb' },
  { name: 'Sarah Johnson', color: '#10b981' },
  { name: 'David Wilson', color: '#ef4444' },
  { name: 'Mohan Light', color: '#f59e0b' },
  { name: 'Anna Lee', color: '#0ea5e9' },
  { name: 'Carlos Mendes', color: '#84cc16' },
  { name: 'Priya Sharma', color: '#ec4899' },
  { name: 'Tom Becker', color: '#6366f1' },
]

const SEED_ROOMS = ['301', '205', '306', '1008', '101', '513']
const SEED_AMOUNTS = [4500, 8200, 12600, 22000, 6800, 10000]
const SEED_METHODS: InvoiceMethod[] = ['Cash', 'Online Payment', 'Mobile Banking', 'Cash', 'Cash', 'Online Payment']
const SEED_STATUSES: InvoiceStatus[] = ['Paid', 'Pending', 'Partially Paid', 'Paid', 'Overdue', 'Paid']
const SEED_INVOICE_DATES = ['Apr 20', 'Apr 27', 'Apr 27', 'Apr 27', 'Apr 26', 'Apr 25']
const SEED_DUE_DATES = ['Apr 28', 'Apr 28', 'Apr 28', 'Apr 27', 'Apr 27', 'Apr 27']

const TOTAL_INVOICES = 145

export const DEMO_INVOICES: InvoiceRow[] = Array.from({ length: TOTAL_INVOICES }, (_, i) => {
  const seed = i % 6
  const guest = i < 6 ? GUEST_POOL[i] : GUEST_POOL[(i * 3 + seed) % GUEST_POOL.length]
  const num = 541 - i
  return {
    id: `inv-${num}`,
    invoice: `INV-${String(num).padStart(4, '0')}`,
    booking: `BK-${5103 - i}`,
    guest: guest.name,
    avatarColor: guest.color,
    room: SEED_ROOMS[seed],
    amount: SEED_AMOUNTS[seed],
    method: SEED_METHODS[seed],
    status: SEED_STATUSES[seed],
    invoiceDate: SEED_INVOICE_DATES[seed],
    dueDate: SEED_DUE_DATES[seed],
  }
})

export const MONTHLY_REVENUE = [
  { month: 'Jan', revenue: 320 },
  { month: 'Feb', revenue: 275 },
  { month: 'Mar', revenue: 455 },
  { month: 'Apr', revenue: 380 },
  { month: 'May', revenue: 520 },
  { month: 'Jun', revenue: 605 },
  { month: 'Jul', revenue: 470 },
  { month: 'Aug', revenue: 645 },
  { month: 'Sep', revenue: 835 },
  { month: 'Oct', revenue: 965 },
  { month: 'Nov', revenue: 780 },
  { month: 'Dec', revenue: 900 },
]

export const REVENUE_COMPARISON = [
  { month: 'Jan', thisYear: 260, lastYear: 210 },
  { month: 'Feb', thisYear: 320, lastYear: 250 },
  { month: 'Mar', thisYear: 390, lastYear: 300 },
  { month: 'Apr', thisYear: 360, lastYear: 290 },
  { month: 'May', thisYear: 440, lastYear: 350 },
  { month: 'Jun', thisYear: 490, lastYear: 380 },
  { month: 'Jul', thisYear: 420, lastYear: 340 },
  { month: 'Aug', thisYear: 540, lastYear: 410 },
  { month: 'Sep', thisYear: 510, lastYear: 400 },
  { month: 'Oct', thisYear: 580, lastYear: 450 },
  { month: 'Nov', thisYear: 550, lastYear: 430 },
  { month: 'Dec', thisYear: 570, lastYear: 460 },
]

export const PAYMENT_METHODS = [
  { name: 'Card', value: 55, color: '#10b981' },
  { name: 'Online Payment', value: 20, color: '#f97316' },
  { name: 'Mobile Banking', value: 15, color: '#1f2937' },
  { name: 'Cash', value: 10, color: '#2563eb' },
]

export const ROOM_TYPE_REVENUE = [
  { room: 'Deluxe', revenue: 164, fill: '#1f2937' },
  { room: 'Suite', revenue: 148, fill: '#cbd5e1' },
  { room: 'Family', revenue: 124, fill: '#f97316' },
  { room: 'Standard', revenue: 86, fill: '#d1d5db' },
]

export const TRANSACTION_TABS = [
  'Latest Payments',
  'Refund Transactions',
  'Outstanding Dues',
  'Invoice Updates',
] as const

export interface TransactionRow {
  id: string
  name: string
  avatarColor: string
  meta: string
  method: string
  amount: string
  time: string
  tone?: 'default' | 'danger' | 'success'
}

export const RECENT_TRANSACTIONS: Record<string, TransactionRow[]> = {
  'Latest Payments': [
    { id: 't1', name: 'John Smith', avatarColor: '#2563eb', meta: 'BK-5103 · Apr 20', method: 'Online Payment', amount: 'NPR 45.5K', time: '11:24 AM' },
    { id: 't2', name: 'Maria Lopez', avatarColor: '#8b5cf6', meta: 'BK-5098 · Apr 19', method: 'Cash', amount: 'NPR 25.6K', time: '10:45 AM' },
    { id: 't3', name: 'Robert King', avatarColor: '#f97316', meta: 'BK-5095 · Apr 18', method: 'Card', amount: 'NPR 62.4K', time: '09:30 AM' },
  ],
  'Refund Transactions': [
    { id: 't4', name: 'David Wilson', avatarColor: '#ef4444', meta: 'INV-0537 · Apr 26', method: 'Card Refund', amount: 'NPR 6.8K', time: '01:12 PM', tone: 'danger' },
    { id: 't5', name: 'Anna Lee', avatarColor: '#0ea5e9', meta: 'INV-0531 · Apr 24', method: 'Online Refund', amount: 'NPR 12.2K', time: '11:02 AM', tone: 'danger' },
    { id: 't6', name: 'Tom Becker', avatarColor: '#6366f1', meta: 'INV-0524 · Apr 22', method: 'Mobile Refund', amount: 'NPR 4.5K', time: '09:18 AM', tone: 'danger' },
  ],
  'Outstanding Dues': [
    { id: 't7', name: 'Sarah Johnson', avatarColor: '#10b981', meta: 'INV-0538 · Due Apr 27', method: 'Cash', amount: 'NPR 22.0K', time: 'Overdue', tone: 'danger' },
    { id: 't8', name: 'Michael Tan', avatarColor: '#2563eb', meta: 'INV-0539 · Due Apr 28', method: 'Mobile Banking', amount: 'NPR 6.3K', time: 'Due tomorrow' },
    { id: 't9', name: 'Emily Carter', avatarColor: '#8b5cf6', meta: 'INV-0540 · Due Apr 28', method: 'Online Payment', amount: 'NPR 8.2K', time: 'Due tomorrow' },
  ],
  'Invoice Updates': [
    { id: 't10', name: 'Jane Smith', avatarColor: '#f97316', meta: 'INV-0541 · Marked as paid', method: 'Status change', amount: 'NPR 4.5K', time: '11:42 AM', tone: 'success' },
    { id: 't11', name: 'Mohan Light', avatarColor: '#f59e0b', meta: 'INV-0536 · Payment received', method: 'Status change', amount: 'NPR 10.0K', time: '10:20 AM', tone: 'success' },
    { id: 't12', name: 'David Wilson', avatarColor: '#ef4444', meta: 'INV-0537 · Marked overdue', method: 'Status change', amount: 'NPR 6.8K', time: '08:55 AM', tone: 'danger' },
  ],
}

export interface SummaryTile {
  label: string
  value: string
  delta?: string
  deltaPositive?: boolean
  danger?: boolean
}

export const FINANCIAL_TILES: SummaryTile[] = [
  { label: 'Total Collected', value: 'NPR 4.28M', delta: '+8.5%', deltaPositive: true },
  { label: 'Total Refunded', value: 'NPR 642K', delta: '-2.1%', deltaPositive: false },
  { label: 'Additional Charges', value: 'NPR 283K', delta: '+12.4%', deltaPositive: true },
  { label: 'Total Discounts', value: 'NPR 248K', delta: '+4.2%', deltaPositive: true },
  { label: 'Refunds Due', value: 'NPR 64K', danger: true },
]

export type PaymentStatus = 'Captured' | 'Pending' | 'Failed' | 'Refunded'

export const PAYMENT_STATUS_PILL: Record<PaymentStatus, { background: string; color: string }> = {
  Captured: { background: '#dcfce7', color: '#16a34a' },
  Pending: { background: '#fef3c7', color: '#d97706' },
  Failed: { background: '#fee2e2', color: '#dc2626' },
  Refunded: { background: '#dbeafe', color: '#2563eb' },
}

export type PaymentMethod = InvoiceMethod | 'Card'

export interface PaymentRecord {
  id: string
  invoice: string
  booking: string
  guest: string
  avatarColor: string
  method: PaymentMethod
  amount: number
  date: string
  status: PaymentStatus
}

const PAY_SEED_METHODS: PaymentMethod[] = ['Online Payment', 'Cash', 'Mobile Banking', 'Card', 'Cash', 'Online Payment']
const PAY_SEED_STATUS: PaymentStatus[] = ['Captured', 'Captured', 'Pending', 'Failed', 'Captured', 'Refunded']
const PAY_SEED_DATES = ['Apr 28', 'Apr 27', 'Apr 27', 'Apr 26', 'Apr 25', 'Apr 24']

export const DEMO_PAYMENTS: PaymentRecord[] = Array.from({ length: 42 }, (_, i) => {
  const seed = i % 6
  const guest = GUEST_POOL[(i * 2 + 1) % GUEST_POOL.length]
  const num = 2201 - i
  return {
    id: `PAY-${num}`,
    invoice: `INV-${String(541 - i).padStart(4, '0')}`,
    booking: `BK-${5103 - i}`,
    guest: guest.name,
    avatarColor: guest.color,
    method: PAY_SEED_METHODS[seed],
    amount: SEED_AMOUNTS[seed] + (i % 4) * 500,
    date: PAY_SEED_DATES[seed],
    status: PAY_SEED_STATUS[seed],
  }
})

export type RefundStatus = 'Pending' | 'Approved' | 'Rejected'

export const REFUND_STATUS_PILL: Record<RefundStatus, { background: string; color: string }> = {
  Pending: { background: '#fef3c7', color: '#d97706' },
  Approved: { background: '#dcfce7', color: '#16a34a' },
  Rejected: { background: '#fee2e2', color: '#dc2626' },
}

export interface RefundRequest {
  id: string
  invoice: string
  booking: string
  guest: string
  avatarColor: string
  reason: string
  amount: number
  requestedOn: string
  status: RefundStatus
}

const REFUND_REASONS = [
  'Double payment',
  'Booking cancelled',
  'Service issue',
  'Room overcharged',
  'Early checkout',
]

const REFUND_SEED_STATUS: RefundStatus[] = ['Pending', 'Approved', 'Pending', 'Rejected', 'Pending', 'Approved']
const REFUND_DATES = ['Apr 28', 'Apr 27', 'Apr 26', 'Apr 25', 'Apr 24', 'Apr 23']

export const DEMO_REFUNDS: RefundRequest[] = Array.from({ length: 18 }, (_, i) => {
  const seed = i % 6
  const guest = GUEST_POOL[(i * 4 + 2) % GUEST_POOL.length]
  return {
    id: `REF-${1041 - i}`,
    invoice: `INV-${String(535 - i).padStart(4, '0')}`,
    booking: `BK-${5097 - i}`,
    guest: guest.name,
    avatarColor: guest.color,
    reason: REFUND_REASONS[seed % REFUND_REASONS.length],
    amount: SEED_AMOUNTS[seed],
    requestedOn: REFUND_DATES[seed],
    status: REFUND_SEED_STATUS[seed],
  }
})

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function formatNpr(amount: number): string {
  return `NPR ${amount.toLocaleString('en-US')}`
}
