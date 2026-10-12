import { useMemo, useState } from 'react'
import ManagerLayout from '../../components/manager/ManagerLayout'
import NotificationStatsRow from '../../components/manager/notifications/NotificationStatsRow'
import NotificationFilters from '../../components/manager/notifications/NotificationFilters'
import NotificationFeed from '../../components/manager/notifications/NotificationFeed'
import { NOTIFICATION_FEED } from '../../components/manager/notifications/demoNotifications'
import '../../styles/manager-notifications.css'

const CATEGORY_MAP: Record<string, string[]> = {
  Bookings: ['Booking', 'Guest'],
  Operations: ['Maintenance', 'Housekeeping'],
  Payments: ['Payment', 'Review'],
  Staff: ['Staff'],
}

export default function ManagerNotificationsPage() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('All')
  const [status, setStatus] = useState('All')
  const [category, setCategory] = useState('All')

  const items = useMemo(
    () =>
      NOTIFICATION_FEED.filter(
        (item) =>
          (type === 'All' || item.type === type) &&
          (status === 'All' || item.status === status) &&
          (category === 'All' || CATEGORY_MAP[category]?.includes(item.type)) &&
          (query.trim() === '' ||
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())),
      ),
    [query, type, status, category],
  )

  const reset = () => {
    setQuery('')
    setType('All')
    setStatus('All')
    setCategory('All')
  }

  return (
    <ManagerLayout
      title="Notifications"
      subtitle="System alerts and activity updates"
      breadcrumb="Dashboard  /  Notifications"
      searchPlaceholder="Search notifications..."
    >
      <NotificationStatsRow />

      <NotificationFilters
        query={query}
        type={type}
        status={status}
        category={category}
        onQuery={setQuery}
        onType={setType}
        onStatus={setStatus}
        onCategory={setCategory}
      />

      <NotificationFeed items={items} onReset={reset} />
    </ManagerLayout>
  )
}
