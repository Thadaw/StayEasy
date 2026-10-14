import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Sidebar from '@/components/admin/dashboard/Sidebar'
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader'
import PropertyCard from '@/components/admin/dashboard/PropertyCard'
import ExpandPortfolio from '@/components/admin/dashboard/ExpandPortfolio'
import { Plus, Loader2 } from 'lucide-react'
import { getAllProperties, updatePropertyActivation } from '@/api/pms/pmsApi'
import '@/styles/portal.css'
import { propertyKeys } from '@/lib/queryKeys'
import type { GeneralInfoResponse } from '@/types/pms'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop'

export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { user } = useAuth()

  const { data: properties = [], isLoading: loading } = useQuery<GeneralInfoResponse[]>({
    queryKey: propertyKeys.all,
    queryFn: getAllProperties,
    select: (data) => Array.isArray(data) ? data : [],
  })

  const toggleActivationMutation = useMutation({
    mutationFn: (propertyId: string) => updatePropertyActivation(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.all })
    },
  })

  const handleToggleActivation = (propertyId: string) => {
    toggleActivationMutation.mutate(propertyId)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader title="Manage Properties" subtitle="Overview of your real estate portfolio performance and availability." hideControls />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
            <button onClick={() => {
              try {
                const draftKey = `serveIQDraft_${user?.id || user?.email || 'anon'}`
                localStorage.removeItem(draftKey)
              } catch {
                // ignore
              }
              navigate('/host/portal')
            }} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 8, border: 'none',
              background: 'var(--primary)', color: '#fff',
              cursor: 'pointer', fontSize: 14, fontWeight: 600,
            }}>
              <Plus size={18} /> Add New Property
            </button>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
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

          {/* Property Cards Grid */}
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60, color: 'var(--muted-foreground)' }}>
              <Loader2 size={24} style={{ marginRight: 8, animation: 'spin 1s linear infinite' }} /> Loading properties...
            </div>
          ) : properties.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: 60, background: '#fff', borderRadius: 12, border: '1px dashed var(--border)',
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🏨</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 8px' }}>No properties yet</h3>
              <p style={{ fontSize: 14, color: 'var(--muted-foreground)', margin: '0 0 20px', textAlign: 'center' }}>
                Create your first property to get started.
              </p>
            <button onClick={() => navigate('/host/portal', { state: { fresh: true } })} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 24px', borderRadius: 8, border: 'none',
                background: 'var(--primary)', color: '#fff',
                cursor: 'pointer', fontSize: 14, fontWeight: 600,
              }}>
                <Plus size={18} /> Create Property
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
              {properties.map((p) => (
                <PropertyCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  location={[p.city, p.state, p.country].filter(Boolean).join(', ') || p.address || 'Location not set'}
                  image={p.cover_image || p.photos?.cover || FALLBACK_IMAGE}
                  type={p.type}
                  units={`${p.total_rooms} Room${p.total_rooms !== 1 ? 's' : ''}`}
                  status={p.is_active === false ? 'Inactive' as const : 'Active' as const}
                  is_active={p.is_active !== false}
                  onToggleActivation={handleToggleActivation}
                  teamCount={2}
                />
              ))}
              <ExpandPortfolio />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
