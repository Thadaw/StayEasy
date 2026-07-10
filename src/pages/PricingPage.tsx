import { useState } from 'react'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import PricingStats from '../components/pricing/PricingStats'
import PricingTabs from '../components/pricing/PricingTabs'
import RoomPricingTable from '../components/pricing/RoomPricingTable'
import SeasonalPricingTable from '../components/pricing/SeasonalPricingTable'
import DiscountsTable from '../components/pricing/DiscountsTable'
import type { RoomPricing, SeasonalPricing, Discount } from '../types/pricing'

const MOCK_ROOM_PRICING: RoomPricing[] = [
  { id: 1, roomType: 'Deluxe Room', bedDescription: '1 King Bed', occupancy: '2 Adults', baseRate: 12000, weekendRate: 14000, extraPersonRate: 1500, status: 'Active' },
  { id: 2, roomType: 'Suite Room', bedDescription: '1 King Bed', occupancy: '2 Adults', baseRate: 18000, weekendRate: 21000, extraPersonRate: 2000, status: 'Active' },
  { id: 3, roomType: 'Standard Room', bedDescription: '2 Single Beds', occupancy: '2 Adults', baseRate: 8000, weekendRate: 9500, extraPersonRate: 1000, status: 'Active' },
  { id: 4, roomType: 'Family Room', bedDescription: '1 King + 1 Single Bed', occupancy: '3 Adults', baseRate: 15000, weekendRate: 17500, extraPersonRate: 1800, status: 'Active' },
]

const MOCK_SEASONS: SeasonalPricing[] = [
  { id: 1, seasonName: 'Peak Season', emoji: '☀️', dateRange: 'Jun 1, 2026 - Aug 31, 2026', appliesTo: 'All Room Types', rateAdjustment: '+20%', status: 'Active' },
  { id: 2, seasonName: 'Winter Season', emoji: '❄️', dateRange: 'Dec 1, 2026 - Feb 28, 2027', appliesTo: 'All Room Types', rateAdjustment: '-15%', status: 'Scheduled' },
  { id: 3, seasonName: 'Dashain Festival', emoji: '🎊', dateRange: 'Oct 10, 2026 - Oct 20, 2026', appliesTo: 'All Room Types', rateAdjustment: '+25%', status: 'Scheduled' },
  { id: 4, seasonName: 'Monsoon Offer', emoji: '🌧️', dateRange: 'Jul 1, 2026 - Aug 15, 2026', appliesTo: 'All Room Types', rateAdjustment: '-10%', status: 'Active' },
]

const MOCK_DISCOUNTS: Discount[] = [
  { id: 1, discountName: 'Early Bird Offer', type: '% (Percentage)', value: '15%', appliesTo: 'All Room Types', validUntil: 'Jun 30, 2026', status: 'Active' },
  { id: 2, discountName: 'Long Stay Deal', type: 'Flat Amount', value: 'NPR 2,000', appliesTo: 'All Room Types', validUntil: 'Dec 31, 2026', status: 'Active' },
  { id: 3, discountName: 'Weekend Special', type: '% (Percentage)', value: '10%', appliesTo: 'Deluxe, Suite', validUntil: 'Jun 30, 2026', status: 'Active' },
  { id: 4, discountName: 'Honeymoon Offer', type: 'Flat Amount', value: 'NPR 3,000', appliesTo: 'Suite, Family', validUntil: 'Aug 31, 2026', status: 'Scheduled' },
]

export default function PricingPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('Room Pricing')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Pricing & Discounts" subtitle="Manage room pricing, seasonal rates and discount offers" />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>

          <PricingStats
            stats={{ activeDiscounts: 12, seasonalPrices: 8, bestRate: 12000, revenueImpact: 18.6 }}
            onAddDiscount={() => {}}
          />

          <PricingTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <RoomPricingTable rooms={MOCK_ROOM_PRICING} />

          <div style={{ display: 'flex', gap: 20 }}>
            <SeasonalPricingTable seasons={MOCK_SEASONS} onAddSeason={() => {}} />
            <DiscountsTable discounts={MOCK_DISCOUNTS} onAddDiscount={() => {}} />
          </div>
        </main>
      </div>
    </div>
  )
}
