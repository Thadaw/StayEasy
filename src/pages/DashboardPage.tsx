import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import PropertyCard from '../components/dashboard/PropertyCard'
import ExpandPortfolio from '../components/dashboard/ExpandPortfolio'
import PortfolioHealth from '../components/dashboard/PortfolioHealth'
import { Plus } from 'lucide-react'

const properties = [
  {
    id: '1',
    name: 'The Heights Residences',
    location: 'Downtown Seattle, WA',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop',
    type: 'Apartment Complex',
    units: '12 Units',
    status: 'Active' as const,
    teamCount: 3,
  },
  {
    id: '2',
    name: 'Brick Lane Studios',
    location: 'East London, UK',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
    type: 'Commercial Office',
    units: '5 Units',
    status: 'Active' as const,
    teamCount: 2,
  },
  {
    id: '3',
    name: 'Oakwood Manor',
    location: 'Portland, OR',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop',
    type: 'Single Family',
    units: '1 Unit',
    status: 'Maintenance' as const,
    nextInspection: 'Oct 12',
    teamCount: 2,
  },
]

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} simplified />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Manage Properties" subtitle="Overview of your real estate portfolio performance and availability." />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
            <button onClick={() => navigate('/host/portal')} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 8, border: 'none',
              background: 'var(--primary)', color: '#fff',
              cursor: 'pointer', fontSize: 14, fontWeight: 600,
            }}>
              <Plus size={18} /> Add New Property
            </button>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setActiveFilter('all')}
                style={{
                  padding: '6px 16px', borderRadius: 20, border: '1px solid',
                  borderColor: activeFilter === 'all' ? 'var(--primary)' : 'var(--border)',
                  background: activeFilter === 'all' ? 'var(--accent)' : '#fff',
                  color: activeFilter === 'all' ? 'var(--primary)' : 'var(--foreground)',
                  cursor: 'pointer', fontSize: 13, fontWeight: 500,
                }}
              >
                All Properties ({properties.length})
              </button>
            </div>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border)',
              background: '#fff', cursor: 'pointer', fontSize: 13, color: 'var(--foreground)',
            }}>
              <span style={{ fontSize: 14 }}>⚙</span> Advanced Filters
            </button>
          </div>

          {/* Property Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
            {properties.map((p) => (
              <PropertyCard key={p.id} {...p} />
            ))}
            <ExpandPortfolio />
          </div>

          {/* Portfolio Health */}
          <PortfolioHealth />
        </main>
      </div>
    </div>
  )
}
