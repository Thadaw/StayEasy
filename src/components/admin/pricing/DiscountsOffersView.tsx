import { useEffect, useMemo, useState } from 'react'
import { Search, ChevronDown, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, Tag, CheckCircle2, Clock, Ban } from 'lucide-react'
import { isAxiosError } from 'axios'
import toast from 'react-hot-toast'
import DiscountDetailPanel from '@/components/admin/pricing/DiscountDetailPanel'
import OfferFormModal from '@/components/admin/pricing/OfferFormModal'
import { useCreateSpecialOffers, useDeleteSpecialOffer, useUpdateSpecialOffer } from '@/services/mutations/admin/pricingMutations'
import type { DiscountOffer, OfferStatus } from '@/types/pricing'
import type { SpecialOfferResponse, SpecialOfferUpdatePayload } from '@/types/pms'
import { todayISO, type SpecialOfferFormData } from '@/schemas/admin/specialOfferSchema'

interface DiscountsOffersViewProps {
  propertyId?: string | null
  offers: SpecialOfferResponse[]
  isLoading?: boolean
  isError?: boolean
}

const statusColors: Record<OfferStatus, { bg: string; text: string }> = {
  Active: { bg: '#D1FAE5', text: '#065F46' },
  Upcoming: { bg: '#DBEAFE', text: '#1E40AF' },
  Expired: { bg: '#F3F4F6', text: '#6B7280' },
  Inactive: { bg: '#FEF3C7', text: '#92400E' },
}

const selectStyle: React.CSSProperties = {
  appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
  background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8,
  padding: '10px 36px 10px 14px', fontSize: 14, color: '#374151',
  fontWeight: 500, cursor: 'pointer', outline: 'none', backgroundImage: 'none', minWidth: 130,
}

function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as { error?: string; message?: string; detail?: string } | undefined
    const detail = typeof data?.detail === 'string' ? data.detail : undefined
    return data?.error || data?.message || detail || error.message
  }
  return error instanceof Error ? error.message : 'Unknown error'
}

function deriveStatus(offer: SpecialOfferResponse): OfferStatus {
  const today = todayISO()
  if (offer.end_date < today) return 'Expired'
  if (offer.start_date > today) return 'Upcoming'
  return offer.is_active ? 'Active' : 'Inactive'
}

function mapOffer(offer: SpecialOfferResponse): DiscountOffer {
  return {
    id: offer.id,
    name: offer.title,
    description: offer.description ?? '',
    type: 'Percentage',
    applicableTo: 'All Room Types',
    discount: `${offer.discount_percentage}%`,
    discountPercentage: offer.discount_percentage,
    validity: `${offer.start_date} – ${offer.end_date}`,
    status: deriveStatus(offer),
    isActive: offer.is_active,
    isCustom: offer.is_custom,
    startDate: offer.start_date,
    endDate: offer.end_date,
    iconBg: '#D1FAE5',
    iconColor: '#059669',
    icon: '🏷️',
  }
}

export default function DiscountsOffersView({ propertyId, offers: rawOffers, isLoading, isError }: DiscountsOffersViewProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [activeTab, setActiveTab] = useState('All Offers')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOffer, setSelectedOffer] = useState<DiscountOffer | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingOffer, setEditingOffer] = useState<DiscountOffer | null>(null)
  const itemsPerPage = 7

  const { createSpecialOffers, isCreating } = useCreateSpecialOffers(propertyId)
  const { updateSpecialOffer, isUpdating } = useUpdateSpecialOffer(propertyId)
  const { deleteSpecialOffer, isDeleting } = useDeleteSpecialOffer(propertyId)
  const isMutating = isCreating || isUpdating || isDeleting

  const offers = useMemo(() => rawOffers.map(mapOffer), [rawOffers])

  const stats = useMemo(() => ({
    total: offers.length,
    active: offers.filter((o) => o.status === 'Active').length,
    upcoming: offers.filter((o) => o.status === 'Upcoming').length,
    inactive: offers.filter((o) => o.status === 'Expired' || o.status === 'Inactive').length,
  }), [offers])

  const tabs = ['All Offers', 'Active', 'Upcoming', 'Expired']

  const filteredOffers = useMemo(() => {
    const term = search.trim().toLowerCase()
    return offers.filter((offer) => {
      const matchSearch = !term || offer.name.toLowerCase().includes(term)
      const matchTab = activeTab === 'All Offers' || offer.status === activeTab
      const matchStatus = !statusFilter || statusFilter === 'All' || offer.status === statusFilter
      return matchSearch && matchTab && matchStatus
    })
  }, [offers, search, activeTab, statusFilter])

  useEffect(() => { setCurrentPage(1) }, [search, activeTab, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredOffers.length / itemsPerPage))
  const safePage = Math.min(currentPage, totalPages)
  const paginatedOffers = filteredOffers.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage)
  const startItem = filteredOffers.length === 0 ? 0 : (safePage - 1) * itemsPerPage + 1
  const endItem = Math.min(safePage * itemsPerPage, filteredOffers.length)
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  const openCreate = () => { setEditingOffer(null); setFormOpen(true) }
  const openEdit = (offer: DiscountOffer) => { setEditingOffer(offer); setFormOpen(true); setSelectedOffer(null) }
  const closeForm = () => { setFormOpen(false); setEditingOffer(null) }

  const handleSave = async (values: SpecialOfferFormData) => {
    const discount = Number(values.discountPercentage)
    const description = values.description?.trim() ?? ''
    try {
      if (editingOffer) {
        const payload: SpecialOfferUpdatePayload = {}
        if (values.title.trim() !== editingOffer.name) payload.title = values.title.trim()
        if (description !== editingOffer.description) payload.description = description
        if (discount !== editingOffer.discountPercentage) payload.discount_percentage = discount
        if (values.startDate !== editingOffer.startDate) payload.start_date = values.startDate
        if (values.endDate !== editingOffer.endDate) payload.end_date = values.endDate
        if (values.isActive !== editingOffer.isActive) payload.is_active = values.isActive

        if (Object.keys(payload).length === 0) {
          toast('No changes to save')
          closeForm()
          return
        }
        await updateSpecialOffer(editingOffer.id, payload)
        toast.success('Offer updated')
      } else {
        if (values.startDate < todayISO()) {
          toast.error('Start date cannot be in the past')
          return
        }
        await createSpecialOffers([{
          title: values.title.trim(),
          description,
          discount_percentage: discount,
          start_date: values.startDate,
          end_date: values.endDate,
          is_active: values.isActive,
          is_custom: false,
        }])
        toast.success('Offer created')
      }
      closeForm()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleDelete = async (offer: DiscountOffer) => {
    if (!window.confirm(`Delete the offer "${offer.name}"? This action cannot be undone.`)) return
    try {
      await deleteSpecialOffer(offer.id)
      toast.success('Offer deleted')
      setSelectedOffer(null)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleToggleActive = async (offer: DiscountOffer) => {
    try {
      await updateSpecialOffer(offer.id, { is_active: !offer.isActive })
      toast.success(offer.isActive ? 'Offer deactivated' : 'Offer activated')
      setSelectedOffer((prev) => {
        if (!prev) return prev
        const isActive = !prev.isActive
        let status: OfferStatus
        const today = todayISO()
        if (prev.endDate < today) status = 'Expired'
        else if (prev.startDate > today) status = 'Upcoming'
        else status = isActive ? 'Active' : 'Inactive'
        return { ...prev, isActive, status }
      })
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const statCards = [
    { label: 'Total Offers', value: stats.total, subtitle: 'All created offers', bg: '#F3E8FF', color: '#7C3AED', Icon: Tag },
    { label: 'Active Offers', value: stats.active, subtitle: 'Currently running', bg: '#D1FAE5', color: '#059669', Icon: CheckCircle2 },
    { label: 'Upcoming Offers', value: stats.upcoming, subtitle: 'Starting soon', bg: '#FEF3C7', color: '#D97706', Icon: Clock },
    { label: 'Expired / Inactive', value: stats.inactive, subtitle: 'No longer running', bg: '#FCE7F3', color: '#DB2777', Icon: Ban },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0 }}>Discounts & Offers</h2>
          <p style={{ fontSize: 14, color: '#6B7280', margin: '4px 0 0' }}>Create and manage special discounts, offers and promotional deals.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search offers..."
              style={{
                padding: '10px 14px 10px 38px', border: '1px solid #E5E7EB', borderRadius: 8,
                fontSize: 14, color: '#374151', outline: 'none', background: '#fff', width: 240,
              }}
            />
          </div>
          <button
            onClick={openCreate}
            disabled={!propertyId}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px',
              border: 'none', borderRadius: 8, background: 'var(--primary)',
              fontSize: 14, fontWeight: 600, color: '#fff',
              cursor: propertyId ? 'pointer' : 'not-allowed', opacity: propertyId ? 1 : 0.6,
            }}
          >
            + Create New Offer
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {statCards.map((s) => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <s.Icon size={18} color={s.color} />
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
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by offer name..."
            style={{
              width: '100%', padding: '10px 14px 10px 38px', border: '1px solid #E5E7EB',
              borderRadius: 8, fontSize: 14, color: '#374151', outline: 'none', background: '#fff',
            }}
          />
        </div>
        <div style={{ position: 'relative' }}>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
            <option value="">Status</option>
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Expired">Expired</option>
            <option value="Inactive">Inactive</option>
          </select>
          <ChevronDown size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9CA3AF' }} />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', marginBottom: 0 }}>
        <div style={{ display: 'flex', gap: 0 }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
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
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '0 0 12px 12px', border: '1px solid #E5E7EB', borderTop: 'none', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
              {['Offer Name', 'Discount', 'Type', 'Applicable To', 'Validity', 'Status', 'Actions'].map((col) => (
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
            {isLoading && (
              <tr><td colSpan={7} style={{ padding: '32px 14px', textAlign: 'center', color: '#6B7280', fontSize: 14 }}>Loading offers...</td></tr>
            )}
            {!isLoading && isError && (
              <tr><td colSpan={7} style={{ padding: '32px 14px', textAlign: 'center', color: '#DC2626', fontSize: 14 }}>Failed to load special offers. Please try again.</td></tr>
            )}
            {!isLoading && !isError && paginatedOffers.length === 0 && (
              <tr><td colSpan={7} style={{ padding: '32px 14px', textAlign: 'center', color: '#6B7280', fontSize: 14 }}>No special offers found. Create one to get started.</td></tr>
            )}
            {paginatedOffers.map((offer) => {
              const sc = statusColors[offer.status] || statusColors.Active
              return (
                <tr key={offer.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 8, background: offer.iconBg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16,
                      }}>
                        {offer.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{offer.name}</div>
                        <div style={{ fontSize: 12, color: '#9CA3AF' }}>{offer.description}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 14, fontWeight: 600, color: '#059669' }}>{offer.discount}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151' }}>{offer.type}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151' }}>{offer.applicableTo}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151', whiteSpace: 'nowrap' }}>{offer.validity}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.text }}>
                      {offer.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      <button onClick={() => setSelectedOffer(offer)} title="View" style={{ width: 30, height: 30, border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
                        <Eye size={15} />
                      </button>
                      <button onClick={() => openEdit(offer)} title="Edit" style={{ width: 30, height: 30, border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(offer)} disabled={isMutating} title="Delete" style={{ width: 30, height: 30, border: 'none', background: 'transparent', borderRadius: 6, cursor: isMutating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}>
                        <Trash2 size={15} />
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
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={safePage === 1} style={{ width: 32, height: 32, border: '1px solid #E5E7EB', borderRadius: 6, background: '#fff', cursor: safePage === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: safePage === 1 ? '#D1D5DB' : '#6B7280' }}>
              <ChevronLeft size={14} />
            </button>
            {pageNumbers.map((page) => (
              <button key={page} onClick={() => setCurrentPage(page)} style={{ width: 32, height: 32, border: page === safePage ? '1px solid var(--primary)' : '1px solid #E5E7EB', borderRadius: 6, background: page === safePage ? 'var(--primary)' : '#fff', color: page === safePage ? '#fff' : '#374151', fontWeight: page === safePage ? 600 : 400, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {page}
              </button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} style={{ width: 32, height: 32, border: '1px solid #E5E7EB', borderRadius: 6, background: '#fff', cursor: safePage === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: safePage === totalPages ? '#D1D5DB' : '#6B7280' }}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedOffer && (
        <DiscountDetailPanel
          offer={selectedOffer}
          onClose={() => setSelectedOffer(null)}
          onEdit={() => openEdit(selectedOffer)}
          onToggleActive={() => handleToggleActive(selectedOffer)}
          onDelete={() => handleDelete(selectedOffer)}
          isMutating={isMutating}
        />
      )}

      {/* Create / Edit Modal */}
      <OfferFormModal
        open={formOpen}
        initial={editingOffer}
        isSaving={isMutating}
        onClose={closeForm}
        onSubmit={handleSave}
      />
    </div>
  )
}
