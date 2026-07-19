import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import PricingOverview from '../components/pricing/PricingOverview'
import SeasonalPricingView from '../components/pricing/SeasonalPricingView'
import DiscountsOffersView from '../components/pricing/DiscountsOffersView'
import PackagesView from '../components/pricing/PackagesView'
import type {
  PricingOverviewStat, PricingFeatureCard, PricingActivity, UpcomingPromotion,
  SeasonTimeline, SeasonalPricingEntry,
  DiscountOffer, OfferDetail,
  Package, PackageDetail,
} from '../types/pricing'

const OVERVIEW_STATS: PricingOverviewStat[] = [
  { id: 1, label: 'Average Room Rate', value: 'NPR 12,500', subtitle: 'Per night average', icon: 'TrendingUp', iconBg: '#FEF3C7', iconColor: '#D97706', linkText: 'Manage Seasonal Pricing' },
  { id: 2, label: 'Active Discounts', value: '8', subtitle: 'Currently running', icon: 'Tag', iconBg: '#D1FAE5', iconColor: '#059669', linkText: 'Manage Discounts' },
  { id: 3, label: 'Seasonal Adjustments', value: '12', subtitle: 'Applied this month', icon: 'Calendar', iconBg: '#FCE7F3', iconColor: '#DB2777', linkText: 'Manage Packages' },
  { id: 4, label: 'Revenue Impact', value: '+18.6%', subtitle: 'From pricing changes', icon: 'Gift', iconBg: '#F3E8FF', iconColor: '#7C3AED', linkText: 'Manage Discounts' },
]

const FEATURE_CARDS: PricingFeatureCard[] = [
  { id: 1, title: 'Seasonal Pricing', description: 'Adjust room rates based on seasonal demand, holidays, and special events to maximize revenue.', icon: 'Calendar', iconBg: '#FEF3C7', iconColor: '#D97706', buttonColor: '#D97706', viewKey: 'seasonal' },
  { id: 2, title: 'Discounts & Offers', description: 'Create and manage promotional discounts, special offers, and loyalty rewards for guests.', icon: 'Tag', iconBg: '#FCE7F3', iconColor: '#DB2777', buttonColor: '#DB2777', viewKey: 'discounts' },
  { id: 3, title: 'Packages', description: 'Create bundled room packages with included amenities and special services.', icon: 'Gift', iconBg: '#EDE9FE', iconColor: '#5B21B6', buttonColor: '#5B21B6', viewKey: 'packages' },
]

const RECENT_ACTIVITY: PricingActivity[] = [
  { id: 1, date: '24 May, 2025', time: '2 hours ago', module: 'Packages', moduleColor: { bg: '#EDE9FE', text: '#5B21B6' }, action: 'Updated Summer Package price to NPR 14,500', user: 'Rajesh Kumar', status: 'Completed' },
  { id: 2, date: '24 May, 2025', time: '5 hours ago', module: 'Discounts', moduleColor: { bg: '#FCE7F3', text: '#DB2777' }, action: 'New discount "Weekend Getaway" created', user: 'Sunita Sharma', status: 'Completed' },
  { id: 3, date: '23 May, 2025', time: '1 day ago', module: 'Seasonal', moduleColor: { bg: '#FEF3C7', text: '#D97706' }, action: 'Seasonal pricing for Dashain activated', user: 'Rajesh Kumar', status: 'Completed' },
  { id: 4, date: '23 May, 2025', time: '1 day ago', module: 'Pricing', moduleColor: { bg: '#D1FAE5', text: '#059669' }, action: 'Suite rates adjusted +8% for peak season', user: 'System', status: 'Completed' },
  { id: 5, date: '22 May, 2025', time: '2 days ago', module: 'Discounts', moduleColor: { bg: '#FCE7F3', text: '#DB2777' }, action: 'Early bird discount extended to Dec 2025', user: 'Sunita Sharma', status: 'Completed' },
]

const UPCOMING_PROMOTIONS: UpcomingPromotion[] = [
  { id: 1, name: 'Summer Getaway', dateRange: 'Jun 1, 2025 – Aug 31, 2025', description: '15% OFF on all room types', status: 'Upcoming', iconBg: '#FEF3C7', iconColor: '#D97706', icon: 'Sun' },
  { id: 2, name: 'Festival Season', dateRange: 'Oct 1, 2025 – Nov 15, 2025', description: '20% OFF during festival period', status: 'Upcoming', iconBg: '#FCE7F3', iconColor: '#DB2777', icon: 'Gift' },
  { id: 3, name: 'Winter Special', dateRange: 'Dec 15, 2025 – Feb 28, 2026', description: '18% OFF for winter stays', status: 'Upcoming', iconBg: '#DBEAFE', iconColor: '#2563EB', icon: 'Snowflake' },
  { id: 4, name: 'New Year Celebration', dateRange: 'Dec 20, 2025 – Jan 5, 2026', description: '25% OFF for New Year bookings', status: 'Upcoming', iconBg: '#F3E8FF', iconColor: '#7C3AED', icon: 'Calendar' },
]

const MOCK_SEASON_TIMELINE: SeasonTimeline[] = [
  { id: 1, name: 'Summer Promotion', color: '#22C55E', startDate: '2025-06-01', endDate: '2025-08-31', label: 'Jun 1 – Aug 31' },
  { id: 2, name: 'Monsoon Offer', color: '#3B82F6', startDate: '2025-07-01', endDate: '2025-09-15', label: 'Jul 1 – Sep 15' },
  { id: 3, name: 'Dashain Festival', color: '#8B5CF6', startDate: '2025-10-05', endDate: '2025-10-20', label: 'Oct 5 – Oct 20' },
  { id: 4, name: 'Winter Special', color: '#F97316', startDate: '2025-11-15', endDate: '2026-01-15', label: 'Nov 15 – Jan 15' },
  { id: 5, name: 'New Year Offer', color: '#EC4899', startDate: '2025-12-25', endDate: '2026-01-05', label: 'Dec 25 – Jan 5' },
]

const MOCK_SEASONAL_ENTRIES: SeasonalPricingEntry[] = [
  { id: 1, seasonName: 'Dashain Festival', seasonColor: '#8B5CF6', roomType: 'Deluxe', dateRange: 'Oct 5, 2025 – Oct 20, 2025', basePrice: 6000, seasonalPrice: 7500, change: 25, status: 'Active' },
  { id: 2, seasonName: 'Christmas & New Year', seasonColor: '#EC4899', roomType: 'Suite', dateRange: 'Dec 20, 2025 – Dec 31, 2025', basePrice: 10000, seasonalPrice: 12000, change: 20, status: 'Upcoming' },
  { id: 3, seasonName: 'Summer Promotion', seasonColor: '#22C55E', roomType: 'Standard', dateRange: 'Jun 1, 2025 – Aug 31, 2025', basePrice: 4500, seasonalPrice: 4000, change: -11, status: 'Active' },
  { id: 4, seasonName: 'Monsoon Offer', seasonColor: '#3B82F6', roomType: 'Deluxe', dateRange: 'Jul 1, 2025 – Sep 15, 2025', basePrice: 6000, seasonalPrice: 5200, change: -13, status: 'Active' },
  { id: 5, seasonName: 'Winter Special', seasonColor: '#F97316', roomType: 'Family', dateRange: 'Jan 1, 2025 – Jan 31, 2025', basePrice: 8000, seasonalPrice: 7000, change: -13, status: 'Expired' },
]

const MOCK_DISCOUNT_OFFERS: DiscountOffer[] = [
  { id: 1, name: 'Early Bird Offer', description: 'Discount for early bookings', code: 'EARLY15', type: '% (Percentage)', applicableTo: 'All Room Types', discount: '15%', validity: 'Mar 21, 2025 – Jun 30, 2026', status: 'Active', usage: 124, iconBg: '#D1FAE5', iconColor: '#059669', icon: 'Clock' },
  { id: 2, name: 'Long Stay Deal', description: 'Discount for extended stays', code: 'LONGSTAY', type: 'Flat Amount', applicableTo: 'All Room Types', discount: 'NPR 2,000', validity: 'Mar 21, 2025 – Dec 31, 2026', status: 'Active', usage: 89, iconBg: '#DBEAFE', iconColor: '#2563EB', icon: 'Calendar' },
  { id: 3, name: 'Weekend Special', description: 'Weekend getaway discount', code: 'WEEKEND10', type: '% (Percentage)', applicableTo: 'Deluxe, Suite', discount: '10%', validity: 'Mar 21, 2025 – Jun 30, 2026', status: 'Active', usage: 67, iconBg: '#FEF3C7', iconColor: '#D97706', icon: 'Tag' },
  { id: 4, name: 'Honeymoon Offer', description: 'Special couples package', code: 'HONEYMOON', type: 'Flat Amount', applicableTo: 'Suite, Family', discount: 'NPR 3,000', validity: 'Mar 21, 2025 – Aug 31, 2026', status: 'Upcoming', usage: 0, iconBg: '#FCE7F3', iconColor: '#DB2777', icon: 'Heart' },
]

const MOCK_OFFER_DETAILS: OfferDetail[] = [
  { id: 1, name: 'Early Bird Offer', status: 'Active', code: 'EARLY15', type: '% (Percentage)', discount: '15%', applicableTo: 'All Room Types', minimumStay: '14 Days', maximumDiscount: 'NPR 5,000', validityPeriod: 'Mar 21, 2025 – Jun 30, 2026', usageLimit: 'Unlimited', used: '124', description: 'Available to all guests' },
  { id: 2, name: 'Long Stay Deal', status: 'Active', code: 'LONGSTAY', type: 'Flat Amount', discount: 'NPR 2,000', applicableTo: 'All Room Types', minimumStay: 'No Minimum', maximumDiscount: 'NPR 2,000', validityPeriod: 'Mar 21, 2025 – Dec 31, 2026', usageLimit: 'Unlimited', used: '89', description: 'Applicable for long stays' },
]

const MOCK_PACKAGES: Package[] = [
  { id: 1, name: 'Honeymoon Package', description: 'Romantic getaway with special amenities', type: 'Romantic', typeColor: '#DB2777', applicableTo: 'Couples', price: 45000, validity: '3 Days / 2 Nights', status: 'Active', bookings: 24, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&h=120&fit=crop' },
  { id: 2, name: 'Family Retreat Package', description: 'Perfect family vacation package', type: 'Family', typeColor: '#059669', applicableTo: 'Families', price: 55000, validity: '4 Days / 3 Nights', status: 'Active', bookings: 18, image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=300&h=120&fit=crop' },
  { id: 3, name: 'Weekend Escape Package', description: 'Quick weekend getaway', type: 'Weekend', typeColor: '#2563EB', applicableTo: 'All Guests', price: 28000, validity: '2 Days / 1 Night', status: 'Active', bookings: 42, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&h=120&fit=crop' },
  { id: 4, name: 'Business Traveler Package', description: 'Corporate travel essentials included', type: 'Business', typeColor: '#D97706', applicableTo: 'Business', price: 35000, validity: '3 Days / 2 Nights', status: 'Active', bookings: 15, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=300&h=120&fit=crop' },
  { id: 5, name: 'Adventure Nepal Package', description: 'Adventure activities included', type: 'Adventure', typeColor: '#DC2626', applicableTo: 'All Guests', price: 65000, validity: '5 Days / 4 Nights', status: 'Upcoming', bookings: 0, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300&h=120&fit=crop' },
  { id: 6, name: 'Festival Special Package', description: 'Special festival celebration', type: 'Event', typeColor: '#7C3AED', applicableTo: 'All Guests', price: 42000, validity: '3 Days / 2 Nights', status: 'Expired', bookings: 31, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=300&h=120&fit=crop' },
]

const MOCK_PACKAGE_DETAILS: PackageDetail[] = [
  { id: 1, name: 'Honeymoon Package', status: 'Active', type: 'Romantic', applicableTo: 'Couples', price: 45000, validity: '3 Days / 2 Nights', minimumStay: '2 Nights', inclusions: ['Candlelight Dinner', 'Couple Spa Treatment', 'Room Decoration', 'Breakfast Included', 'Airport Transfer'], description: 'A romantic escape designed for newlyweds and couples. Enjoy a luxurious stay with special amenities and experiences.', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&h=120&fit=crop' },
  { id: 2, name: 'Family Retreat Package', status: 'Active', type: 'Family', applicableTo: 'Families', price: 55000, validity: '4 Days / 3 Nights', minimumStay: '3 Nights', inclusions: ['Family Suite Upgrade', 'Kids Activities', 'All Meals Included', 'Airport Transfer', 'Late Checkout'], description: 'A perfect family vacation with activities and amenities for all ages.', image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=300&h=120&fit=crop' },
  { id: 3, name: 'Weekend Escape Package', status: 'Active', type: 'Weekend', applicableTo: 'All Guests', price: 28000, validity: '2 Days / 1 Night', minimumStay: '1 Night', inclusions: ['Breakfast & Dinner', 'Late Checkout', 'Welcome Drink', 'Wi-Fi Access'], description: 'Quick weekend getaway with breakfast and dinner included.', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&h=120&fit=crop' },
]

const VIEW_MAP: Record<string, string> = {
  '/host/pricing': 'overview',
  '/host/pricing/seasonal': 'seasonal',
  '/host/pricing/discounts': 'discounts',
  '/host/pricing/packages': 'packages',
}

const VIEW_TITLES: Record<string, { title: string; subtitle: string }> = {
  overview: { title: 'Pricing & Discounts', subtitle: 'Manage room pricing, seasonal rates and discount offers' },
  seasonal: { title: 'Seasonal Pricing', subtitle: 'Adjust room rates based on seasonal demand and events' },
  discounts: { title: 'Discounts & Offers', subtitle: 'Create and manage promotional discounts and special offers' },
  packages: { title: 'Packages', subtitle: 'Create and manage room packages and bundled offers' },
}

export default function PricingPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const activeView = VIEW_MAP[location.pathname] || 'overview'
  const viewInfo = VIEW_TITLES[activeView] || VIEW_TITLES.overview

  const handleNavigate = (viewKey: string) => {
    const pathMap: Record<string, string> = {
      overview: '/host/pricing',
      seasonal: '/host/pricing/seasonal',
      discounts: '/host/pricing/discounts',
      packages: '/host/pricing/packages',
    }
    navigate(pathMap[viewKey] || '/host/pricing')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title={viewInfo.title} subtitle={viewInfo.subtitle} />
        <main style={{ flex: 1, padding: 24, overflow: 'auto' }}>
          {activeView === 'overview' && (
            <PricingOverview
              stats={OVERVIEW_STATS}
              featureCards={FEATURE_CARDS}
              activities={RECENT_ACTIVITY}
              promotions={UPCOMING_PROMOTIONS}
              onNavigate={handleNavigate}
            />
          )}

          {activeView === 'seasonal' && (
            <SeasonalPricingView
              timelineSeasons={MOCK_SEASON_TIMELINE}
              entries={MOCK_SEASONAL_ENTRIES}
            />
          )}

          {activeView === 'discounts' && (
            <DiscountsOffersView
              offers={MOCK_DISCOUNT_OFFERS}
              offerDetails={MOCK_OFFER_DETAILS}
            />
          )}

          {activeView === 'packages' && (
            <PackagesView
              packages={MOCK_PACKAGES}
              packageDetails={MOCK_PACKAGE_DETAILS}
            />
          )}
        </main>
      </div>
    </div>
  )
}
