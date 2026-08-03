import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useUIStore } from '../stores/uiStore'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import PropertyStats from '../components/properties/PropertyStats'
import PropertyFilters from '../components/properties/PropertyFilters'
import PropertyTable from '../components/properties/PropertyTable'
import PropertyPagination from '../components/properties/PropertyPagination'
import { getAllProperties } from '../services/pmsApi'
import { propertyKeys } from '../lib/queryKeys'
import type { GeneralInfoResponse } from '../types/pms'

export default function PropertiesPage() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const { data: apiProperties = [] } = useQuery<GeneralInfoResponse[]>({
    queryKey: propertyKeys.all,
    queryFn: getAllProperties,
  })

  const properties = useMemo(() => {
    return apiProperties.map((p, i) => ({
      id: i + 1,
      name: p.name,
      code: (p as any).code || `PRP-${String(i + 1).padStart(3, '0')}`,
      type: p.type || 'Hotel',
      location: [p.city, p.state, p.country].filter(Boolean).join(', ') || (p as any).address || '',
      phone: (p as any).phone || '',
      rooms: p.total_rooms || 0,
      occupancy: 0,
      status: (p as any).is_active === false ? 'Inactive' as const : 'Active' as const,
      manager: (p as any).manager || '',
      managerEmail: (p as any).manager_email || '',
    }))
  }, [apiProperties])

  const stats = useMemo(() => ({
    totalProperties: properties.length,
    totalRooms: properties.reduce((sum, p) => sum + p.rooms, 0),
    totalBookings: 0,
    revenue: 0,
    occupancyRate: 0,
    revenueGrowth: 0,
    occupancyGrowth: 0,
  }), [properties])

  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
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
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Properties" subtitle="Manage all your hotel properties and their details" />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>

          <PropertyStats stats={stats} />

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
