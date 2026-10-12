import ManagerLayout from '../../components/manager/ManagerLayout'
import FeedbackStatsRow from '../../components/manager/feedback/FeedbackStatsRow'
import CustomerSatisfactionCard from '../../components/manager/feedback/CustomerSatisfactionCard'
import FeedbackInsightsCard from '../../components/manager/feedback/FeedbackInsightsCard'
import PerformanceHighlights from '../../components/manager/feedback/PerformanceHighlights'
import GuestReviewsTable from '../../components/manager/feedback/GuestReviewsTable'
import RecentReviewsCard from '../../components/manager/feedback/RecentReviewsCard'
import '../../styles/manager-feedback.css'

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
