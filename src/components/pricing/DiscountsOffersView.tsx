import { useState, useMemo } from 'react'
import { Search, ChevronDown, Download, Eye, Pencil, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react'
import DiscountDetailPanel from './DiscountDetailPanel'
import type { DiscountOffer, OfferDetail } from '../../types/pricing'

interface DiscountsOffersViewProps {
  offers: DiscountOffer[]
  offerDetails: OfferDetail[]
}

const statusColors: Record<string, { bg: string; text: string }> = {
  Active: { bg: '#D1FAE5', text: '#065F46' },
  Upcoming: { bg: '#DBEAFE', text: '#1E40AF' },
  Expired: { bg: '#F3F4F6', text: '#6B7280' },
}

const selectStyle: React.CSSProperties = {
  appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
  background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8,
  padding: '10px 36px 10px 14px', fontSize: 14, color: '#374151',
  fontWeight: 500, cursor: 'pointer', outline: 'none', backgroundImage: 'none', minWidth: 130,
}

export default function DiscountsOffersView({ offers, offerDetails }: DiscountsOffersViewProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [activeTab, setActiveTab] = useState('All Offers')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOffer, setSelectedOffer] = useState<OfferDetail | null>(null)
  const itemsPerPage = 7

  const tabs = ['All Offers', 'Active', 'Upcoming', 'Expired']

  const filteredOffers = useMemo(() => {
    return offers.filter(offer => {
      const matchSearch = !search || offer.name.toLowerCase().includes(search.toLowerCase()) || offer.code.toLowerCase().includes(search.toLowerCase())
      const matchTab = activeTab === 'All Offers' || offer.status === activeTab
      return matchSearch && matchTab
    })
  }, [offers, search, activeTab])

  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage)
  const paginatedOffers = filteredOffers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, filteredOffers.length)

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0 }}>Discounts & Offers</h2>
          <p style={{ fontSize: 14, color: '#6B7280', margin: '4px 0 0' }}>Create and manage special discounts, offers and promotional deals.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search offers..."
              style={{
                padding: '10px 14px 10px 38px', border: '1px solid #E5E7EB', borderRadius: 8,
                fontSize: 14, color: '#374151', outline: 'none', background: '#fff', width: 240,
              }}
            />
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px',
            border: 'none', borderRadius: 8, background: 'var(--primary)',
            fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer',
          }}>
            + Create New Offer
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Offers', value: 15, subtitle: 'All created offers', bg: '#F3E8FF', color: 'var(--primary)' },
          { label: 'Active Offers', value: 7, subtitle: 'Currently running', bg: '#D1FAE5', color: '#059669' },
          { label: 'Upcoming Offers', value: 3, subtitle: 'Starting soon', bg: '#FEF3C7', color: '#D97706' },
          { label: 'Total Usage', value: '1,248', subtitle: 'Times used', bg: '#FCE7F3', color: '#DB2777' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 18, color: s.color }}>📊</span>
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
            placeholder="Search by offer name or code..."
            style={{
              width: '100%', padding: '10px 14px 10px 38px', border: '1px solid #E5E7EB',
              borderRadius: 8, fontSize: 14, color: '#374151', outline: 'none', background: '#fff',
            }}
          />
        </div>
        <div style={{ position: 'relative' }}>
          <select style={selectStyle}>
            <option>Offer Type</option>
            <option>All</option>
            <option>Percentage</option>
            <option>Fixed Benefit</option>
          </select>
          <ChevronDown size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9CA3AF' }} />
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
            <option>Applicable To</option>
            <option>All</option>
            <option>All Rooms</option>
            <option>Deluxe</option>
            <option>Suite</option>
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', marginBottom: 0 }}>
        <div style={{ display: 'flex', gap: 0 }}>
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
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
          border: '1px solid #E5E7EB', borderRadius: 8, background: '#fff',
          fontSize: 13, fontWeight: 500, color: '#374151', cursor: 'pointer',
        }}>
          <Download size={14} /> Export
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '0 0 12px 12px', border: '1px solid #E5E7EB', borderTop: 'none', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
              {['Offer Name', 'Offer Code', 'Type', 'Applicable To', 'Discount', 'Validity', 'Status', 'Usage', 'Actions'].map(col => (
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
            {paginatedOffers.map(offer => {
              const sc = statusColors[offer.status] || statusColors.Active
              return (
                <tr key={offer.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 8,
                        background: offer.iconBg, display: 'flex',
                        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <span style={{ fontSize: 16 }}>{offer.icon}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{offer.name}</div>
                        <div style={{ fontSize: 12, color: '#9CA3AF' }}>{offer.description}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      padding: '3px 8px', borderRadius: 6, fontSize: 12,
                      fontWeight: 600, background: '#D1FAE5', color: '#065F46',
                      fontFamily: 'monospace',
                    }}>
                      {offer.code}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151' }}>{offer.type}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151' }}>{offer.applicableTo}</td>
                  <td style={{ padding: '12px 14px', fontSize: 14, fontWeight: 600, color: '#059669' }}>{offer.discount}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151', whiteSpace: 'nowrap' }}>{offer.validity}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.text }}>
                      {offer.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151', textAlign: 'center' }}>{offer.usage}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      <button onClick={() => setSelectedOffer(offerDetails.find(d => d.id === offer.id) || null)} style={{ width: 30, height: 30, border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
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
            Showing {startItem} to {endItem} of {filteredOffers.length} entries
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
      {selectedOffer && <DiscountDetailPanel offer={selectedOffer} onClose={() => setSelectedOffer(null)} />}
    </div>
  )
}
