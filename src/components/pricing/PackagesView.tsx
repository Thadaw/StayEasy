import { useState, useMemo } from 'react'
import { Search, ChevronDown, Eye, Pencil, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react'
import PackageDetailPanel from './PackageDetailPanel'
import type { Package, PackageDetail } from '../../types/pricing'

interface PackagesViewProps {
  packages: Package[]
  packageDetails: PackageDetail[]
}

const statusColors: Record<string, { bg: string; text: string }> = {
  Active: { bg: '#D1FAE5', text: '#065F46' },
  Upcoming: { bg: '#DBEAFE', text: '#1E40AF' },
  Expired: { bg: '#F3F4F6', text: '#6B7280' },
}

const typeColors: Record<string, { bg: string; text: string }> = {
  Romantic: { bg: '#FCE7F3', text: '#BE185D' },
  Family: { bg: '#D1FAE5', text: '#065F46' },
  Weekend: { bg: '#DBEAFE', text: '#1E40AF' },
  Business: { bg: '#FEF3C7', text: '#92400E' },
  Adventure: { bg: '#FEE2E2', text: '#991B1B' },
  Event: { bg: '#EDE9FE', text: '#5B21B6' },
}

const selectStyle: React.CSSProperties = {
  appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
  background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8,
  padding: '10px 36px 10px 14px', fontSize: 14, color: '#374151',
  fontWeight: 500, cursor: 'pointer', outline: 'none', backgroundImage: 'none', minWidth: 130,
}

const packageImages = [
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&h=120&fit=crop',
  'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=300&h=120&fit=crop',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&h=120&fit=crop',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=300&h=120&fit=crop',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300&h=120&fit=crop',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=300&h=120&fit=crop',
]

export default function PackagesView({ packages, packageDetails }: PackagesViewProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [activeTab, setActiveTab] = useState('All Packages')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPkg, setSelectedPkg] = useState<PackageDetail | null>(null)
  const itemsPerPage = 6

  const tabs = ['All Packages', 'Active', 'Upcoming', 'Expired']

  const filteredPackages = useMemo(() => {
    return packages.filter(pkg => {
      const matchSearch = !search || pkg.name.toLowerCase().includes(search.toLowerCase())
      const matchTab = activeTab === 'All Packages' || pkg.status === activeTab
      return matchSearch && matchTab
    })
  }, [packages, search, activeTab])

  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage)
  const paginatedPackages = filteredPackages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, filteredPackages.length)

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0 }}>Packages</h2>
          <p style={{ fontSize: 14, color: '#6B7280', margin: '4px 0 0' }}>Create and manage room packages and special bundled offers.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#fff', fontSize: 13, color: '#374151' }}>
            📅 May 24, 2025 - Jun 24, 2025 <ChevronDown size={14} color="#9CA3AF" />
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search packages..."
              style={{
                padding: '10px 14px 10px 38px', border: '1px solid #E5E7EB', borderRadius: 8,
                fontSize: 14, color: '#374151', outline: 'none', background: '#fff', width: 220,
              }}
            />
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px',
            border: 'none', borderRadius: 8, background: 'var(--primary)',
            fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer',
          }}>
            + Create New Package
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Packages', value: 12, subtitle: 'All created packages', bg: '#F3E8FF', color: 'var(--primary)' },
          { label: 'Active Packages', value: 6, subtitle: 'Currently running', bg: '#D1FAE5', color: '#059669' },
          { label: 'Upcoming Packages', value: 3, subtitle: 'Starting soon', bg: '#FEF3C7', color: '#D97706' },
          { label: 'Total Bookings', value: 248, subtitle: 'From packages', bg: '#FCE7F3', color: '#DB2777' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 18, color: s.color }}>📦</span>
            </div>
            <p style={{ fontSize: 13, color: '#6B7280', margin: 0, fontWeight: 500 }}>{s.label}</p>
            <p style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: '4px 0 2px' }}>{s.value}</p>
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>{s.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: 320 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search packages..."
            style={{
              width: '100%', padding: '10px 14px 10px 38px', border: '1px solid #E5E7EB',
              borderRadius: 8, fontSize: 14, color: '#374151', outline: 'none', background: '#fff',
            }}
          />
        </div>
        <div style={{ position: 'relative' }}>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
            <option value="">Status</option>
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Expired">Expired</option>
          </select>
          <ChevronDown size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9CA3AF' }} />
        </div>
        <div style={{ position: 'relative' }}>
          <select style={selectStyle}>
            <option>Package Type</option>
            <option>All</option>
            <option>Romantic</option>
            <option>Family</option>
            <option>Weekend</option>
            <option>Business</option>
          </select>
          <ChevronDown size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9CA3AF' }} />
        </div>
        <div style={{ position: 'relative' }}>
          <select style={selectStyle}>
            <option>Applicable To</option>
            <option>All</option>
            <option>Couples</option>
            <option>Families</option>
            <option>All Guests</option>
          </select>
          <ChevronDown size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9CA3AF' }} />
        </div>
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          <input type="text" placeholder="Select date range" style={{
            padding: '10px 14px 10px 36px', border: '1px solid #E5E7EB', borderRadius: 8,
            fontSize: 14, color: '#374151', outline: 'none', background: '#fff', minWidth: 170,
          }} />
          <span style={{ position: 'absolute', left: 12, pointerEvents: 'none', color: '#9CA3AF', fontSize: 14 }}>📅</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #E5E7EB', marginBottom: 0 }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setCurrentPage(1) }}
            style={{
              padding: '12px 16px', border: 'none', background: 'transparent',
              fontSize: 14, fontWeight: 500,
              color: activeTab === tab ? 'var(--primary)' : '#6B7280',
              cursor: 'pointer',
              borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
              marginBottom: -1,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '0 0 12px 12px', border: '1px solid #E5E7EB', borderTop: 'none', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
              {['Package Name', 'Type', 'Applicable To', 'Price', 'Validity', 'Status', 'Bookings', 'Actions'].map(col => (
                <th key={col} style={{
                  padding: '12px 14px', fontSize: 11, fontWeight: 600,
                  color: '#6B7280', textTransform: 'uppercase' as const,
                  letterSpacing: '0.05em', textAlign: col === 'Actions' ? 'center' : 'left', whiteSpace: 'nowrap',
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedPackages.map((pkg, idx) => {
              const sc = statusColors[pkg.status] || statusColors.Active
              const tc = typeColors[pkg.type] || { bg: '#F3F4F6', text: '#374151' }
              return (
                <tr key={pkg.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 56, height: 40, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: '#F3F4F6' }}>
                        <img src={packageImages[idx % packageImages.length]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{pkg.name}</div>
                        <div style={{ fontSize: 12, color: '#9CA3AF' }}>{pkg.description}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: tc.bg, color: tc.text }}>
                      {pkg.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 14 }}>👤</span> {pkg.applicableTo}
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>NPR {pkg.price.toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>per package</div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151', whiteSpace: 'nowrap' }}>{pkg.validity}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.text }}>
                      {pkg.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 14, fontWeight: 600, color: '#111827', textAlign: 'center' }}>{pkg.bookings}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      <button onClick={() => setSelectedPkg(packageDetails.find(d => d.id === pkg.id) || null)} style={{ width: 30, height: 30, border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
                        <Eye size={15} />
                      </button>
                      <button style={{ width: 30, height: 30, border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
                        <Pencil size={15} />
                      </button>
                      <button style={{ width: 30, height: 30, border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
                        <MoreVertical size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
            Showing {startItem} to {endItem} of {filteredPackages.length} entries
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ width: 32, height: 32, border: '1px solid #E5E7EB', borderRadius: 6, background: '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: currentPage === 1 ? '#D1D5DB' : '#6B7280' }}>
              <ChevronLeft size={14} />
            </button>
            {[1, 2].map(page => (
              <button key={page} onClick={() => setCurrentPage(page)} style={{ width: 32, height: 32, border: page === currentPage ? '1px solid var(--primary)' : '1px solid #E5E7EB', borderRadius: 6, background: page === currentPage ? 'var(--primary)' : '#fff', color: page === currentPage ? '#fff' : '#374151', fontWeight: page === currentPage ? 600 : 400, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {page}
              </button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ width: 32, height: 32, border: '1px solid #E5E7EB', borderRadius: 6, background: '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: currentPage === totalPages ? '#D1D5DB' : '#6B7280' }}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedPkg && <PackageDetailPanel pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />}
    </div>
  )
}
