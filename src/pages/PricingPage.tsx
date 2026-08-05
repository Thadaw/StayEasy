import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useUIStore } from '../stores/uiStore'
import { usePropertyStore } from '../stores/propertyStore'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import PricingOverview from '../components/pricing/PricingOverview'
import SeasonalPricingView from '../components/pricing/SeasonalPricingView'
import DiscountsOffersView from '../components/pricing/DiscountsOffersView'
import PackagesView from '../components/pricing/PackagesView'
import { getAllProperties, getDiscountCodes } from '../services/pmsApi'
import { propertyKeys, discountCodeKeys } from '../lib/queryKeys'
import type {
  PricingOverviewStat, PricingFeatureCard, PricingActivity, UpcomingPromotion,
  SeasonTimeline, SeasonalPricingEntry,
  DiscountOffer, OfferDetail,
  Package, PackageDetail,
} from '../types/pricing'
import type { GeneralInfoResponse } from '../types/pms'

const OVERVIEW_STATS: PricingOverviewStat[] = [
  { id: 1, label: 'Average Room Rate', value: 'NPR 12,500', subtitle: 'Per night average', icon: 'TrendingUp', iconBg: '#FEF3C7', iconColor: '#D97706', linkText: 'Manage Seasonal Pricing' },
  { id: 2, label: 'Active Discounts', value: '8', subtitle: 'Currently running', icon: 'Tag', iconBg: '#D1FAE5', iconColor: '#059669', linkText: 'Manage Discounts' },
  { id: 3, label: 'Seasonal Adjustments', value: '12', subtitle: 'Applied this month', icon: 'Calendar', iconBg: '#FCE7F3', iconColor: '#DB2777', linkText: 'Manage Packages' },
  { id: 4, label: 'Revenue Impact', value: '+18.6%', subtitle: 'From pricing changes', icon: 'Gift', iconBg: '#F3E8FF', iconColor: 'var(--primary)', linkText: 'Manage Discounts' },
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
  { id: 4, name: 'New Year Celebration', dateRange: 'Dec 20, 2025 – Jan 5, 2026', description: '25% OFF for New Year bookings', status: 'Upcoming', iconBg: '#F3E8FF', iconColor: 'var(--primary)', icon: 'Calendar' },
]

const MOCK_SEASON_TIMELINE: SeasonTimeline[] = [
  { id: 1, name: 'Summer Promotion', color: '#22C55E', startDate: '2025-06-01', endDate: '2025-08-31', label: 'Jun 1 – Aug 31' },
  { id: 2, name: 'Monsoon Offer', color: '#3B82F6', startDate: '2025-07-01', endDate: '2025-09-15', label: 'Jul 1 – Sep 15' },
  { id: 3, name: 'Dashain Festival', color: '#8B5CF6', startDate: '2025-10-05', endDate: '2025-10-20', label: 'Oct 5 – Oct 20' },
  { id: 4, name: 'Winter Special', color: '#F97316', startDate: '2025-11-15', endDate: '2026-01-15', label: 'Nov 15 – Jan 15' },
  { id: 5, name: 'New Year Offer', color: '#EC4899', startDate: '2025-12-25', endDate: '2026-01-05', label: 'Dec 25 – Jan 5' },
]

const MOCK_SEASONAL_ENTRIES: SeasonalPricingEntry[] = []

const MOCK_DISCOUNT_OFFERS: DiscountOffer[] = []

const MOCK_OFFER_DETAILS: OfferDetail[] = []

const MOCK_PACKAGES: Package[] = [
  { id: 1, name: 'Honeymoon Package', description: 'Romantic getaway with special amenities', type: 'Romantic', typeColor: '#DB2777', applicableTo: 'Couples', price: 45000, validity: '3 Days / 2 Nights', status: 'Active', bookings: 24, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&h=120&fit=crop' },
  { id: 2, name: 'Family Retreat Package', description: 'Perfect family vacation package', type: 'Family', typeColor: '#059669', applicableTo: 'Families', price: 55000, validity: '4 Days / 3 Nights', status: 'Active', bookings: 18, image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=300&h=120&fit=crop' },
  { id: 3, name: 'Weekend Escape Package', description: 'Quick weekend getaway', type: 'Weekend', typeColor: '#2563EB', applicableTo: 'All Guests', price: 28000, validity: '2 Days / 1 Night', status: 'Active', bookings: 42, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&h=120&fit=crop' },
  { id: 4, name: 'Business Traveler Package', description: 'Corporate travel essentials included', type: 'Business', typeColor: '#D97706', applicableTo: 'Business', price: 35000, validity: '3 Days / 2 Nights', status: 'Active', bookings: 15, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=300&h=120&fit=crop' },
  { id: 5, name: 'Adventure Nepal Package', description: 'Adventure activities included', type: 'Adventure', typeColor: '#DC2626', applicableTo: 'All Guests', price: 65000, validity: '5 Days / 4 Nights', status: 'Upcoming', bookings: 0, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300&h=120&fit=crop' },
  { id: 6, name: 'Festival Special Package', description: 'Special festival celebration', type: 'Event', typeColor: 'var(--primary)', applicableTo: 'All Guests', price: 42000, validity: '3 Days / 2 Nights', status: 'Expired', bookings: 31, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=300&h=120&fit=crop' },
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
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)
  const location = useLocation()
  const navigate = useNavigate()

  const activeView = VIEW_MAP[location.pathname] || 'overview'
  const viewInfo = VIEW_TITLES[activeView] || VIEW_TITLES.overview

  const { data: properties = [] } = useQuery<GeneralInfoResponse[]>({
    queryKey: propertyKeys.all,
    queryFn: getAllProperties,
  })

  const currentPropertyId = usePropertyStore((s) => s.currentPropertyId)
  const propertyId = properties.find((p) => p.id === currentPropertyId)?.id ?? properties[0]?.id

  const { data: discountCodes = [] } = useQuery({
    queryKey: discountCodeKeys.byProperty(propertyId ?? ''),
    queryFn: () => getDiscountCodes(propertyId!),
    enabled: !!propertyId,
  })

  const liveDiscountOffers: DiscountOffer[] = discountCodes.map((dc, i) => ({
    id: i + 1,
    name: dc.code,
    description: '',
    code: dc.code,
    type: dc.type === 'PERCENTAGE' ? '% (Percentage)' : 'Flat Amount',
    applicableTo: 'All Room Types',
    discount: dc.type === 'PERCENTAGE' ? `${dc.discount_value}%` : `NPR ${dc.discount_value}`,
    validity: `${dc.valid_from || 'N/A'} – ${dc.valid_to || 'N/A'}`,
    status: 'Active',
    usage: dc.used_count || 0,
    iconBg: '#D1FAE5',
    iconColor: '#059669',
    icon: 'Tag',
  }))

  const liveOfferDetails: OfferDetail[] = discountCodes.map((dc, i) => ({
    id: i + 1,
    name: dc.code,
    status: 'Active',
    code: dc.code,
    type: dc.type === 'PERCENTAGE' ? '% (Percentage)' : 'Flat Amount',
    discount: dc.type === 'PERCENTAGE' ? `${dc.discount_value}%` : `NPR ${dc.discount_value}`,
    applicableTo: 'All Room Types',
    minimumStay: dc.min_amount ? `NPR ${dc.min_amount}` : 'No Minimum',
    maximumDiscount: `NPR ${dc.max_uses}`,
    validityPeriod: `${dc.valid_from || 'N/A'} – ${dc.valid_to || 'N/A'}`,
    usageLimit: 'Unlimited',
    used: String(dc.used_count || 0),
    description: '',
  }))

  const finalDiscountOffers = liveDiscountOffers.length > 0 ? liveDiscountOffers : MOCK_DISCOUNT_OFFERS
  const finalOfferDetails = liveOfferDetails.length > 0 ? liveOfferDetails : MOCK_OFFER_DETAILS

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
      <Sidebar />
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
              offers={finalDiscountOffers}
              offerDetails={finalOfferDetails}
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
