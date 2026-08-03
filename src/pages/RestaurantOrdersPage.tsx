import { useState, useEffect } from 'react'
import { useUIStore } from '../stores/uiStore'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import OrdersTabs from '../components/restaurant/orders/OrdersTabs'
import OrdersFilters from '../components/restaurant/orders/OrdersFilters'
import OrdersTable, { Order } from '../components/restaurant/orders/OrdersTable'
import OrderDetailPanel, { OrderDetail } from '../components/restaurant/orders/OrderDetailPanel'
import OrdersPagination from '../components/restaurant/orders/OrdersPagination'

const sampleOrders: Order[] = [
  {
    id: '#ORD-1058',
    items: 3,
    type: 'Dine In',
    typeColor: '#7c3aed',
    typeBg: '#ede9fe',
    typeIcon: '🍽️',
    customer: 'John Doe',
    table: 'Table 05',
    status: 'Preparing',
    statusColor: '#d97706',
    statusBg: '#fef3c7',
    time: '10:24 AM',
    timeAgo: '2 min ago',
    amount: 'NPR 1,250',
  },
  {
    id: '#ORD-1057',
    items: 2,
    type: 'Takeaway',
    typeColor: '#d97706',
    typeBg: '#fef3c7',
    typeIcon: '📦',
    customer: 'Walk-in Customer',
    status: 'Ready',
    statusColor: '#16a34a',
    statusBg: '#dcfce7',
    time: '10:18 AM',
    timeAgo: '8 min ago',
    amount: 'NPR 780',
  },
  {
    id: '#ORD-1056',
    items: 4,
    type: 'Delivery',
    typeColor: '#2563eb',
    typeBg: '#dbeafe',
    typeIcon: '🚗',
    customer: 'Sita Maharjan',
    phone: '9801234567',
    status: 'On Delivery',
    statusColor: '#7c3aed',
    statusBg: '#ede9fe',
    time: '10:15 AM',
    timeAgo: '11 min ago',
    amount: 'NPR 2,450',
  },
  {
    id: '#ORD-1055',
    items: 2,
    type: 'Dine In',
    typeColor: '#7c3aed',
    typeBg: '#ede9fe',
    typeIcon: '🍽️',
    customer: 'Rahul Sharma',
    table: 'Table 08',
    status: 'Ready',
    statusColor: '#16a34a',
    statusBg: '#dcfce7',
    time: '10:10 AM',
    timeAgo: '16 min ago',
    amount: 'NPR 1,650',
  },
  {
    id: '#ORD-1054',
    items: 1,
    type: 'Takeaway',
    typeColor: '#d97706',
    typeBg: '#fef3c7',
    typeIcon: '📦',
    customer: 'Walk-in Customer',
    status: 'Confirmed',
    statusColor: '#2563eb',
    statusBg: '#dbeafe',
    time: '10:08 AM',
    timeAgo: '18 min ago',
    amount: 'NPR 320',
  },
  {
    id: '#ORD-1053',
    items: 5,
    type: 'Delivery',
    typeColor: '#2563eb',
    typeBg: '#dbeafe',
    typeIcon: '🚗',
    customer: 'Bikash Thapa',
    phone: '9812345678',
    status: 'Preparing',
    statusColor: '#d97706',
    statusBg: '#fef3c7',
    time: '10:05 AM',
    timeAgo: '21 min ago',
    amount: 'NPR 1,980',
  },
  {
    id: '#ORD-1052',
    items: 2,
    type: 'Dine In',
    typeColor: '#7c3aed',
    typeBg: '#ede9fe',
    typeIcon: '🍽️',
    customer: 'Anita Gurung',
    table: 'Table 03',
    status: 'Completed',
    statusColor: '#5D6D7E',
    statusBg: '#f2f3f4',
    time: '09:55 AM',
    timeAgo: '31 min ago',
    amount: 'NPR 950',
  },
  {
    id: '#ORD-1051',
    items: 3,
    type: 'Takeaway',
    typeColor: '#d97706',
    typeBg: '#fef3c7',
    typeIcon: '📦',
    customer: 'Walk-in Customer',
    status: 'Completed',
    statusColor: '#5D6D7E',
    statusBg: '#f2f3f4',
    time: '09:45 AM',
    timeAgo: '41 min ago',
    amount: 'NPR 1,350',
  },
  {
    id: '#ORD-1050',
    items: 4,
    type: 'Delivery',
    typeColor: '#2563eb',
    typeBg: '#dbeafe',
    typeIcon: '🚗',
    customer: 'Ramesh Karki',
    phone: '980556677',
    status: 'Cancelled',
    statusColor: '#C0392B',
    statusBg: '#fde8e8',
    time: '09:40 AM',
    timeAgo: '46 min ago',
    amount: 'NPR 700',
  },
  {
    id: '#ORD-1049',
    items: 5,
    type: 'Dine In',
    typeColor: '#7c3aed',
    typeBg: '#ede9fe',
    typeIcon: '🍽️',
    customer: 'Priya Singh',
    table: 'Table 11',
    status: 'Completed',
    statusColor: '#5D6D7E',
    statusBg: '#f2f3f4',
    time: '09:30 AM',
    timeAgo: '56 min ago',
    amount: 'NPR 2,150',
  },
]

const orderDetails: Record<string, OrderDetail> = {
  '#ORD-1058': {
    id: '#ORD-1058',
    status: 'Preparing',
    statusColor: '#d97706',
    statusBg: '#fef3c7',
    type: 'Dine In',
    typeIcon: '🍽️',
    table: 'Table 05',
    time: '10:24 AM',
    timeAgo: '2 min ago',
    customer: { name: 'John Doe', phone: '+977 9812345678', partySize: 2 },
    items: [
      { id: '1', name: 'Chicken Pizza', description: 'Regular', quantity: 1, price: 'NPR 700', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&h=100&fit=crop' },
      { id: '2', name: 'Caesar Salad', description: 'No Croutons', quantity: 1, price: 'NPR 350', image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=100&h=100&fit=crop' },
      { id: '3', name: 'Fresh Lime Soda', description: 'Sweet', quantity: 2, price: 'NPR 200', unitPrice: 'NPR 100 each', image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=100&h=100&fit=crop' },
    ],
    subtotal: 'NPR 1,250', discount: 'NPR 0', tax: 'NPR 150', total: 'NPR 1,250',
  },
  '#ORD-1057': {
    id: '#ORD-1057',
    status: 'Ready',
    statusColor: '#16a34a',
    statusBg: '#dcfce7',
    type: 'Takeaway',
    typeIcon: '📦',
    table: '',
    time: '10:18 AM',
    timeAgo: '8 min ago',
    customer: { name: 'Walk-in Customer', phone: '-', partySize: 1 },
    items: [
      { id: '1', name: 'Veg Momo', description: 'Steamed, 10 pcs', quantity: 2, price: 'NPR 480', image: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=100&h=100&fit=crop' },
      { id: '2', name: 'Masala Tea', description: 'Regular', quantity: 1, price: 'NPR 80', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6201f?w=100&h=100&fit=crop' },
    ],
    subtotal: 'NPR 560', discount: 'NPR 0', tax: 'NPR 73', total: 'NPR 780',
  },
  '#ORD-1056': {
    id: '#ORD-1056',
    status: 'On Delivery',
    statusColor: '#7c3aed',
    statusBg: '#ede9fe',
    type: 'Delivery',
    typeIcon: '🚗',
    table: '',
    time: '10:15 AM',
    timeAgo: '11 min ago',
    customer: { name: 'Sita Maharjan', phone: '+977 9801234567', partySize: 1 },
    items: [
      { id: '1', name: 'Butter Chicken', description: 'Spicy, Full', quantity: 1, price: 'NPR 850', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=100&h=100&fit=crop' },
      { id: '2', name: 'Garlic Naan', description: '2 pcs', quantity: 2, price: 'NPR 200', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=100&h=100&fit=crop' },
      { id: '3', name: 'Jeera Rice', description: 'Regular', quantity: 1, price: 'NPR 250', image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=100&h=100&fit=crop' },
      { id: '4', name: 'Mango Lassi', description: 'Large', quantity: 1, price: 'NPR 180', image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=100&h=100&fit=crop' },
    ],
    subtotal: 'NPR 1,480', discount: 'NPR 0', tax: 'NPR 192', total: 'NPR 2,450',
  },
  '#ORD-1055': {
    id: '#ORD-1055',
    status: 'Ready',
    statusColor: '#16a34a',
    statusBg: '#dcfce7',
    type: 'Dine In',
    typeIcon: '🍽️',
    table: 'Table 08',
    time: '10:10 AM',
    timeAgo: '16 min ago',
    customer: { name: 'Rahul Sharma', phone: '+977 9845123678', partySize: 3 },
    items: [
      { id: '1', name: 'Club Sandwich', description: 'Triple layer', quantity: 1, price: 'NPR 450', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=100&h=100&fit=crop' },
      { id: '2', name: 'French Fries', description: 'Large', quantity: 1, price: 'NPR 250', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=100&h=100&fit=crop' },
    ],
    subtotal: 'NPR 700', discount: 'NPR 50', tax: 'NPR 85', total: 'NPR 1,650',
  },
}

export default function RestaurantOrdersPage() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)
  const [activeTab, setActiveTab] = useState('All Orders')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [tableFilter, setTableFilter] = useState('all')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>('#ORD-1058')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const selectedOrder = selectedOrderId ? orderDetails[selectedOrderId] || null : null
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Orders" subtitle="Manage and track all restaurant orders." />
        <main style={{ flex: 1, overflow: 'hidden', background: '#f5f6fa', display: 'flex', flexDirection: 'column' }}>

          <div style={{ background: '#fff', borderBottom: '1px solid var(--border)' }}>
            <div style={{ padding: '0 24px' }}>
              <OrdersTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
              <div style={{ padding: '16px 24px', background: '#fff' }}>
                <OrdersFilters
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  statusFilter={statusFilter}
                  onStatusChange={setStatusFilter}
                  typeFilter={typeFilter}
                  onTypeChange={setTypeFilter}
                  tableFilter={tableFilter}
                  onTableChange={setTableFilter}
                />
              </div>

              <div style={{ flex: 1, overflow: 'auto', background: '#fff', margin: '0 24px', borderRadius: 8, border: '1px solid var(--border)' }}>
                <OrdersTable
                  orders={sampleOrders}
                  selectedOrderId={selectedOrderId}
                  onOrderSelect={setSelectedOrderId}
                />
              </div>

              <div style={{ padding: '0 24px', background: '#fff' }}>
                <OrdersPagination
                  currentPage={currentPage}
                  totalPages={9}
                  totalItems={86}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={(items) => {
                    setItemsPerPage(items)
                    setCurrentPage(1)
                  }}
                />
              </div>
            </div>

            {selectedOrder && !isMobile && (
              <OrderDetailPanel
                order={selectedOrder}
                onClose={() => setSelectedOrderId(null)}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
