import { useState } from 'react'
import PricingOverviewStats from './PricingOverviewStats'
import PricingFeatureCards from './PricingFeatureCards'
import RecentPricingActivity from './RecentPricingActivity'
import UpcomingPromotions from './UpcomingPromotions'
import type { PricingOverviewStat, PricingFeatureCard, PricingActivity, UpcomingPromotion } from '../../types/pricing'

interface PricingOverviewProps {
  stats: PricingOverviewStat[]
  featureCards: PricingFeatureCard[]
  activities: PricingActivity[]
  promotions: UpcomingPromotion[]
  onNavigate: (key: string) => void
}

export default function PricingOverview({ stats, featureCards, activities, promotions, onNavigate }: PricingOverviewProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 5
  const totalItems = 25

  return (
    <div>
      <PricingOverviewStats stats={stats} onNavigate={onNavigate} />
      <PricingFeatureCards cards={featureCards} onNavigate={onNavigate} />
      <div style={{ display: 'flex', gap: 20 }}>
        <RecentPricingActivity
          activities={activities}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
        />
        <UpcomingPromotions promotions={promotions} />
      </div>
    </div>
  )
}
