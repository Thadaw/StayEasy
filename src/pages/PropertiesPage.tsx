import { useState, useMemo } from 'react'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import PropertyStats from '../components/properties/PropertyStats'
import PropertyFilters from '../components/properties/PropertyFilters'
import PropertyTable from '../components/properties/PropertyTable'
import PropertyPagination from '../components/properties/PropertyPagination'
import type { Property } from '../types/properties'

const MOCK_PROPERTIES: Property[] = [
  { id: 1, name: 'Hotel Blue Pearl', code: 'HTL-001', type: 'Hotel', location: 'Kathmandu, Nepal', phone: '+977 1 4567890', rooms: 45, occupancy: 78.6, status: 'Active', manager: 'Ramesh Thapa', managerEmail: 'ramesh.thapa@email.com' },
  { id: 2, name: 'Lake View Resort', code: 'RES-002', type: 'Resort', location: 'Pokhara, Nepal', phone: '+977 61 456789', rooms: 32, occupancy: 63.3, status: 'Active', manager: 'Sunita Shrestha', managerEmail: 'sunita.shrestha@email.com' },
  { id: 3, name: 'Mountain Resort', code: 'RES-003', type: 'Resort', location: 'Chitwan, Nepal', phone: '+977 56 456789', rooms: 28, occupancy: 81.2, status: 'Active', manager: 'Kiran Gurung', managerEmail: 'kiran.gurung@email.com' },
  { id: 4, name: 'City Center Hotel', code: 'HTL-004', type: 'Hotel', location: 'Lalitpur, Nepal', phone: '+977 1 5544332', rooms: 15, occupancy: 56.7, status: 'Inactive', manager: 'Anita Lama', managerEmail: 'anita.lama@email.com' },
  { id: 5, name: 'Boutique Hotel Vista', code: 'HTL-005', type: 'Hotel', location: 'Kathmandu, Nepal', phone: '+977 1 4411223', rooms: 18, occupancy: 69.4, status: 'Active', manager: 'Bikash Maharjan', managerEmail: 'bikash.maharjan@email.com' },
  { id: 6, name: 'Jungle Safari Lodge', code: 'LOD-006', type: 'Lodge', location: 'Bardia, Nepal', phone: '+977 81 456789', rooms: 12, occupancy: 50.0, status: 'Active', manager: 'Dinesh Karki', managerEmail: 'dinesh.karki@email.com' },
]

export default function PropertiesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const filteredProperties = useMemo(() => {
    return MOCK_PROPERTIES.filter(prop => {
      const matchesSearch =
        !search ||
        prop.name.toLowerCase().includes(search.toLowerCase()) ||
        prop.location.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = !statusFilter || prop.status === statusFilter
      const matchesCity = !cityFilter || prop.location.includes(cityFilter)
      const matchesType = !typeFilter || prop.type === typeFilter
      return matchesSearch && matchesStatus && matchesCity && matchesType
    })
  }, [search, statusFilter, cityFilter, typeFilter])

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage)
  const paginatedProperties = filteredProperties.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Properties" subtitle="Manage all your hotel properties and their details" />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>

          <PropertyStats
            stats={{
              totalProperties: 6,
              totalRooms: 126,
              totalBookings: 1248,
              revenue: 1248000,
              occupancyRate: 72.4,
              revenueGrowth: 18.6,
              occupancyGrowth: 10.3,
            }}
          />

          <PropertyFilters
            search={search}
            onSearchChange={setSearch}
            status={statusFilter}
            onStatusChange={setStatusFilter}
            city={cityFilter}
            onCityChange={setCityFilter}
            propertyType={typeFilter}
            onPropertyTypeChange={setTypeFilter}
            onAddProperty={() => {}}
          />

          <PropertyTable properties={paginatedProperties} />

          <PropertyPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredProperties.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(count) => {
              setItemsPerPage(count)
              setCurrentPage(1)
            }}
          />
        </main>
      </div>
    </div>
  )
}
