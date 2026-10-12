import ManagerLayout from '@/admin/components/manager/ManagerLayout'
import FeedbackStatsRow from '@/admin/components/manager/feedback/FeedbackStatsRow'
import CustomerSatisfactionCard from '@/admin/components/manager/feedback/CustomerSatisfactionCard'
import FeedbackInsightsCard from '@/admin/components/manager/feedback/FeedbackInsightsCard'
import PerformanceHighlights from '@/admin/components/manager/feedback/PerformanceHighlights'
import GuestReviewsTable from '@/admin/components/manager/feedback/GuestReviewsTable'
import RecentReviewsCard from '@/admin/components/manager/feedback/RecentReviewsCard'
import '@/styles/manager-feedback.css'

export default function ManagerFeedbackPage() {
  return (
    <ManagerLayout
      title="Feedback & Reviews"
      subtitle="Manage guest reviews & ratings"
      breadcrumb="Dashboard  /  Feedback & Reviews"
      searchPlaceholder="Search guests, bookings, reviews..."
    >
      <FeedbackStatsRow />

      <div className="f-top">
        <CustomerSatisfactionCard />
        <FeedbackInsightsCard />
      </div>

      <PerformanceHighlights />

      <GuestReviewsTable />

      <RecentReviewsCard />
    </ManagerLayout>
  )
}
