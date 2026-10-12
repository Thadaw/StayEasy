import toast from 'react-hot-toast'
import ManagerLayout from '../../components/manager/ManagerLayout'
import ReportsToolbar from '../../components/manager/reports/ReportsToolbar'
import ReportsStatsRow from '../../components/manager/reports/ReportsStatsRow'
import RevenueOccupancyCard from '../../components/manager/reports/RevenueOccupancyCard'
import BookingSourceCard from '../../components/manager/reports/BookingSourceCard'
import OperationalInsightsCard from '../../components/manager/reports/OperationalInsightsCard'
import RevenueByRoomTypeCard from '../../components/manager/reports/RevenueByRoomTypeCard'
import TopInsightsCard from '../../components/manager/reports/TopInsightsCard'
import '../../styles/manager-reports.css'

export default function ManagerReportsPage() {
  return (
    <ManagerLayout
      title="Reports & Analytics"
      subtitle="Comprehensive financial insights"
      breadcrumb="Dashboard  /  Reports & Analytics"
      searchPlaceholder="Search reports, bookings, rooms..."
    >
      <ReportsToolbar
        onExport={() => toast.success('Report exported as CSV')}
        onDownload={() => toast.success('Report downloaded as PDF')}
      />

      <ReportsStatsRow />

      <div className="r-top">
        <RevenueOccupancyCard />
        <BookingSourceCard />
      </div>

      <div className="r-bottom">
        <OperationalInsightsCard />
        <div className="r-side-col">
          <RevenueByRoomTypeCard />
          <TopInsightsCard />
        </div>
      </div>
    </ManagerLayout>
  )
}
