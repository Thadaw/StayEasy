export interface ReportKpi {
  label: string
  value: string
  delta: string
  positive: boolean
  caption?: string
}

export const REPORT_KPIS: ReportKpi[] = [
  { label: 'Occupancy Rate', value: '84.6%', delta: '+8.2% vs last month', positive: true },
  { label: 'Total Revenue', value: 'NPR 5.42M', delta: '+18.5% vs last month', positive: true },
  { label: 'Total Bookings', value: '486', delta: '+12 vs last month', positive: true },
  { label: 'Guest Satisfaction', value: '4.7 / 5', delta: 'Based on 1,204 reviews', positive: true, caption: 'caption' },
]

export const REVENUE_OCCUPANCY = [
  { date: 'Apr 01', revenue: 620, occupancy: 71 },
  { date: 'Apr 02', revenue: 710, occupancy: 76 },
  { date: 'Apr 03', revenue: 781, occupancy: 82 },
  { date: 'Apr 04', revenue: 891, occupancy: 79 },
  { date: 'Apr 05', revenue: 904, occupancy: 88 },
  { date: 'Apr 06', revenue: 1004, occupancy: 91 },
  { date: 'Apr 07', revenue: 1102, occupancy: 85 },
]

export const BOOKING_SOURCES = [
  { name: 'Direct Booking', value: 146, percent: 30, color: '#1f2937' },
  { name: 'OTA Platforms', value: 122, percent: 25, color: '#2563eb' },
  { name: 'Corporate', value: 97, percent: 20, color: '#f97316' },
  { name: 'Travel Agents', value: 73, percent: 15, color: '#9ca3af' },
  { name: 'Walk-in', value: 48, percent: 10, color: '#d1d5db' },
]

export const TOTAL_BOOKINGS = 486

export const ROOM_TYPE_BARS = [
  { room: 'Deluxe', revenue: 70, fill: '#1f2937' },
  { room: 'Suite', revenue: 44, fill: '#2563eb' },
  { room: 'Family', revenue: 32, fill: '#f97316' },
  { room: 'Standard', revenue: 24, fill: '#9ca3af' },
]

export type InsightStatus = 'Ready' | 'Processing'

export const INSIGHT_STATUS_PILL: Record<InsightStatus, { background: string; color: string }> = {
  Ready: { background: '#dcfce7', color: '#16a34a' },
  Processing: { background: '#fef3c7', color: '#d97706' },
}

export interface OperationalReport {
  id: string
  name: string
  description: string
  period: string
  updatedOn: string
  status: InsightStatus
}

export const OPERATIONAL_REPORTS: OperationalReport[] = [
  {
    id: 'r1',
    name: 'Revenue Report',
    description: 'Detailed revenue breakdown',
    period: 'Apr 01 – Apr 30',
    updatedOn: 'Apr 30, 10:24',
    status: 'Ready',
  },
  {
    id: 'r2',
    name: 'Occupancy Report',
    description: 'Room utilization analysis',
    period: 'Apr 01 – Apr 30',
    updatedOn: 'Apr 29, 14:53',
    status: 'Ready',
  },
  {
    id: 'r3',
    name: 'Booking Source Report',
    description: 'Reservation channel analysis',
    period: 'Apr 01 – Apr 30',
    updatedOn: 'Apr 27, 16:05',
    status: 'Ready',
  },
  {
    id: 'r4',
    name: 'Forecast Report',
    description: 'Predictive demand model',
    period: 'May 01 – May 31',
    updatedOn: 'Apr 26, 09:12',
    status: 'Processing',
  },
  {
    id: 'r5',
    name: 'Guest Analytics',
    description: 'Visitor demographics & behavior',
    period: 'Apr 01 – Apr 30',
    updatedOn: 'Apr 25, 11:40',
    status: 'Ready',
  },
]

export interface TopInsight {
  id: string
  label: string
  value: string
  caption: string
}

export const TOP_INSIGHTS: TopInsight[] = [
  { id: 'i1', label: 'Highest Occupancy Day', value: 'Saturday, Apr 12', caption: '94% occupancy rate' },
  { id: 'i2', label: 'Strongest Booking Source', value: 'Direct Booking', caption: '30% of total bookings' },
  { id: 'i3', label: 'Best Performing Room Type', value: 'Deluxe Rooms', caption: '42% of total revenue' },
  { id: 'i4', label: 'Guest Satisfaction Trend', value: '4.7 / 5', caption: '+0.2 vs last month' },
]
