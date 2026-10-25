import { useMemo, useState } from 'react'
import { useUIStore } from '@/store/ui/uiStore'
import { usePropertyStore } from '@/store/properties/propertyStore'
import { useReportsStore } from '@/store/admin/reportsStore'
import Sidebar from '@/components/admin/dashboard/Sidebar'
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader'
import ReportFilters from '@/components/admin/reports/ReportFilters'
import ReportStats from '@/components/admin/reports/ReportStats'
import RevenueChart from '@/components/admin/reports/RevenueChart'
import RevenueByRoomType from '@/components/admin/reports/RevenueByRoomType'
import RevenueInRoomTypeTable from '@/components/admin/reports/RevenueInRoomTypeTable'
import BookingsTrend from '@/components/admin/reports/BookingsTrend'
import TopPerformingChannels from '@/components/admin/reports/TopPerformingChannels'
import {
  useAdminPropertiesQuery,
  usePropertyAnalyticsQuery,
  useRevenueTrendQuery,
  useRevenueByRoomTypeQuery,
  useBookingTrendQuery,
} from '@/services/queries/admin/dashboardQueries'
import type {
  KpiCardData,
  RevenueTrendData,
  RoomTypeRevenue,
  RevenueInRoomTypeRow,
  BookingTrendData,
  ChannelData,
} from '@/types/reports'

const CHANNEL_COLORS = ['#1A3C5E', '#2E86AB', '#3BA0CA', '#6BC0D8', '#A8D8EA', '#7C3AED', '#0891B2']
const PERIOD_DAYS: Record<string, number> = { 'Last 7 Days': 7, 'Last 30 Days': 30 }
const DEFAULT_PERIOD = 'Last 30 Days'

function formatDay(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatNpr(value: number | string | null | undefined): string {
  return `NPR ${Math.round(Number(value) || 0).toLocaleString()}`
}

export default function ReportsPage() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)
  const currentPropertyId = usePropertyStore((s) => s.currentPropertyId)
  const dateRange = useReportsStore((s) => s.dateRange)
  const setDateRange = useReportsStore((s) => s.setDateRange)
  const roomType = useReportsStore((s) => s.roomType)
  const setRoomType = useReportsStore((s) => s.setRoomType)
  const bookingChannel = useReportsStore((s) => s.bookingChannel)
  const setBookingChannel = useReportsStore((s) => s.setBookingChannel)
  const resetFilters = useReportsStore((s) => s.resetFilters)

  const [period, setPeriod] = useState(DEFAULT_PERIOD)
  const days = PERIOD_DAYS[period] ?? 30

  const { data: properties = [], isLoading: loadingProperties } = useAdminPropertiesQuery()
  const property = properties.find((p) => p.id === currentPropertyId) ?? properties[0] ?? null
  const propertyId = property?.id ?? ''

  // Analytics API (GET /properties/{id}/analytics*)
  const { data: analytics, isLoading: loadingOverview, isError: overviewError } = usePropertyAnalyticsQuery(propertyId)
  const { data: revenueTrend = [], isLoading: loadingRevenueTrend } = useRevenueTrendQuery(propertyId, days)
  const { data: revenueByRoomType = [], isLoading: loadingByRoomType } = useRevenueByRoomTypeQuery(propertyId, days)
  const { data: bookingTrend = [], isLoading: loadingBookingTrend } = useBookingTrendQuery(propertyId, days)

  const loading =
    loadingProperties ||
    (!!propertyId && (loadingOverview || loadingRevenueTrend || loadingByRoomType || loadingBookingTrend))

  const stats: KpiCardData[] = useMemo(
    () => [
      { label: 'Total Revenue', value: formatNpr(analytics?.total_revenue), iconBg: '#E8F6EF', iconColor: '#1E8449', iconType: 'currency' },
      { label: 'ARR', value: formatNpr(analytics?.arr), iconBg: '#FEF3C7', iconColor: '#D97706', iconType: 'dollar' },
      { label: 'Occupancy Rate', value: `${Math.round(Number(analytics?.occupancy_rate) || 0)}%`, iconBg: '#DBEAFE', iconColor: '#2563EB', iconType: 'building' },
      { label: 'Bookings Today', value: String(analytics?.bookings_today ?? 0), iconBg: '#FEE2E2', iconColor: '#DC2626', iconType: 'bell' },
    ],
    [analytics],
  )

  const revenueTrendData: RevenueTrendData[] = useMemo(
    () => revenueTrend.map((point) => ({ date: formatDay(point.date), revenue: Number(point.revenue) || 0 })),
    [revenueTrend],
  )

  const roomTypeRevenueData: RoomTypeRevenue[] = useMemo(
    () => revenueByRoomType.map((row) => ({ roomType: row.room_type_name, revenue: Number(row.revenue) || 0 })),
    [revenueByRoomType],
  )

  const roomTypeRows: RevenueInRoomTypeRow[] = useMemo(() => {
    const total = revenueByRoomType.reduce((sum, row) => sum + (Number(row.revenue) || 0), 0)
    return revenueByRoomType.map((row) => {
      const revenue = Number(row.revenue) || 0
      return {
        roomType: row.room_type_name,
        bookings: row.booking_count,
        revenue,
        percentOfTotal: total > 0 ? Math.round((revenue / total) * 1000) / 10 : 0,
      }
    })
  }, [revenueByRoomType])

  const totalRoomTypeBookings = useMemo(
    () => revenueByRoomType.reduce((sum, row) => sum + row.booking_count, 0),
    [revenueByRoomType],
  )

  const totalRoomTypeRevenue = useMemo(
    () => revenueByRoomType.reduce((sum, row) => sum + (Number(row.revenue) || 0), 0),
    [revenueByRoomType],
  )

  const bookingTrendData: BookingTrendData[] = useMemo(
    () => bookingTrend.map((point) => ({ date: formatDay(point.date), bookings: point.booking_count })),
    [bookingTrend],
  )

  const channelData: ChannelData[] = useMemo(() => {
    const channels = analytics?.top_channels ?? []
    const channelTotal = channels.reduce((sum, channel) => sum + (Number(channel.revenue) || 0), 0)
    const reference = channelTotal || Number(analytics?.total_revenue) || 0
    return channels.map((channel, index) => ({
      channel: channel.channel_name,
      percentage: reference > 0 ? Math.round(((Number(channel.revenue) || 0) / reference) * 1000) / 10 : 0,
      color: CHANNEL_COLORS[index % CHANNEL_COLORS.length],
    }))
  }, [analytics])

  const channelRevenue = useMemo(
    () =>
      (analytics?.top_channels ?? []).reduce((sum, channel) => sum + (Number(channel.revenue) || 0), 0) ||
      Number(analytics?.total_revenue) ||
      0,
    [analytics],
  )

  const roomTypeOptions = useMemo(
    () => Array.from(new Set(revenueByRoomType.map((row) => row.room_type_name).filter(Boolean))),
    [revenueByRoomType],
  )

  const channelOptions = useMemo(
    () => Array.from(new Set((analytics?.top_channels ?? []).map((channel) => channel.channel_name).filter(Boolean))),
    [analytics],
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          title="Reports & Analytics"
          subtitle={property ? property.name : 'Analytics and reporting dashboard'}
        />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>
          {!loadingProperties && !propertyId ? (
            <div
              style={{
                background: '#fff',
                borderRadius: 12,
                border: '1px solid #E2E8F0',
                padding: 60,
                textAlign: 'center',
                color: '#64748B',
                fontSize: 14,
              }}
            >
              No properties found. Add a property to view analytics.
            </div>
          ) : loading ? (
            <div
              style={{
                background: '#fff',
                borderRadius: 12,
                border: '1px solid #E2E8F0',
                padding: 60,
                textAlign: 'center',
                color: '#64748B',
                fontSize: 14,
              }}
            >
              Loading analytics...
            </div>
          ) : (
            <>
              {overviewError && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 18px',
                    borderRadius: 10,
                    border: '1px solid #FECACA',
                    background: '#FEF2F2',
                    color: '#B91C1C',
                    fontSize: 13,
                    marginBottom: 20,
                  }}
                >
                  Could not load the dashboard overview for this property. Other charts may still be available.
                </div>
              )}

              <ReportFilters
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                roomType={roomType}
                onRoomTypeChange={setRoomType}
                bookingChannel={bookingChannel}
                onBookingChannelChange={setBookingChannel}
                roomTypes={roomTypeOptions}
                bookingChannels={channelOptions}
                onApply={() => {}}
                onReset={resetFilters}
                onExport={() => {}}
              />

              <ReportStats stats={stats} />

              <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
                <RevenueChart data={revenueTrendData} period={period} onPeriodChange={setPeriod} />
                <RevenueByRoomType data={roomTypeRevenueData} period={period} onPeriodChange={setPeriod} />
              </div>

              <RevenueInRoomTypeTable
                data={roomTypeRows}
                totalBookings={totalRoomTypeBookings}
                totalRevenue={totalRoomTypeRevenue}
              />

              <div style={{ display: 'flex', gap: 20 }}>
                <BookingsTrend data={bookingTrendData} period={period} onPeriodChange={setPeriod} />
                <TopPerformingChannels data={channelData} totalRevenue={channelRevenue} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
