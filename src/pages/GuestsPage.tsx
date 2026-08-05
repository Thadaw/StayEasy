import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUIStore } from '../stores/uiStore'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import StatCard from '../components/dashboard/StatCard'
import {
  Users, UserPlus, Star, Heart, Gem, Search, Plus,
  Eye, MoreHorizontal, ChevronLeft, ChevronRight, X,
} from 'lucide-react'

export interface Guest {
  id: number
  name: string
  email: string
  phone: string
  country: string
  location: string
  lastStay: string
  roomType: string
  totalStays: number
  points: number
  pointsLabel: string
  status: 'active' | 'inactive'
  badge?: 'vip' | 'returning'
}

export const initialGuests: Guest[] = [
  { id: 1, name: 'John Smith', email: 'john.smith@email.com', phone: '+977 9812345678', country: 'United States', location: 'Kathmandu', lastStay: 'Jun 10, 2026', roomType: 'Deluxe Room', totalStays: 6, points: 2450, pointsLabel: '2,450 pts', status: 'active', badge: 'vip' },
  { id: 2, name: 'Emily Johnson', email: 'emily.j@email.com', phone: '+977 9823456789', country: 'United Kingdom', location: 'Pokhara', lastStay: 'May 28, 2026', roomType: 'Suite Room', totalStays: 3, points: 1120, pointsLabel: '1,120 pts', status: 'active', badge: 'returning' },
  { id: 3, name: 'Michael Brown', email: 'michael.b@email.com', phone: '+977 9834567890', country: 'Australia', location: 'Chitwan', lastStay: 'Jun 5, 2026', roomType: 'Standard Room', totalStays: 2, points: 560, pointsLabel: '560 pts', status: 'active' },
  { id: 4, name: 'Sarah Taylor', email: 'sarah.t@email.com', phone: '+977 9845678901', country: 'Canada', location: 'Kathmandu', lastStay: 'Jun 12, 2026', roomType: 'Deluxe Room', totalStays: 7, points: 3890, pointsLabel: '3,890 pts', status: 'active', badge: 'vip' },
  { id: 5, name: 'David Wilson', email: 'david.w@email.com', phone: '+977 9845678901', country: 'India', location: 'Pokhara', lastStay: 'May 30, 2026', roomType: 'Suite Room', totalStays: 4, points: 1780, pointsLabel: '1,780 pts', status: 'active' },
  { id: 6, name: 'Olivia Martinez', email: 'olivia.m@email.com', phone: '+977 9867890123', country: 'Spain', location: 'Chitwan', lastStay: 'Jun 8, 2026', roomType: 'Family Room', totalStays: 3, points: 920, pointsLabel: '920 pts', status: 'inactive', badge: 'returning' },
  { id: 7, name: 'James Anderson', email: 'james.a@email.com', phone: '+977 9878901234', country: 'Germany', location: 'Kathmandu', lastStay: 'Apr 22, 2026', roomType: 'Standard Room', totalStays: 1, points: 250, pointsLabel: '250 pts', status: 'inactive' },
]

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

function colorFromName(name: string) {
  const colors = ['#2E86AB', '#1A3C5E', '#27AE60', '#F39C12', '#8E44AD', '#E74C3C', '#16A085']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

const emptyForm = { name: '', email: '', phone: '', country: '', location: 'Kathmandu', roomType: 'Standard Room' }

export default function GuestsPage() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; guest: Guest } | null>(null)
  const [filterType, setFilterType] = useState('All')
  const [filterNationality, setFilterNationality] = useState('All')
  const [guests, setGuests] = useState<Guest[]>(initialGuests)
  const [showModal, setShowModal] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [viewingGuest, setViewingGuest] = useState<Guest | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Guest | null>(null)
  const [form, setForm] = useState(emptyForm)
  const pageSize = 10
  const navigate = useNavigate()

  const nationalities = ['All', ...Array.from(new Set(guests.map(g => g.country)))]

  const hasFilters = filterType !== 'All' || filterNationality !== 'All'

  const filtered = guests.filter(g => {
    const matchesSearch = !searchTerm || g.name.toLowerCase().includes(searchTerm.toLowerCase()) || g.email.toLowerCase().includes(searchTerm.toLowerCase()) || g.phone.includes(searchTerm)
    const matchesType = filterType === 'All' || g.status === filterType
    const matchesNationality = filterNationality === 'All' || g.country === filterNationality
    return matchesSearch && matchesType && matchesNationality
  })
  const totalPages = Math.ceil(filtered.length / pageSize)
  const start = filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, filtered.length)

  const clearFilters = () => {
    setFilterType('All')
    setFilterNationality('All')
    setSearchTerm('')
    setCurrentPage(1)
  }

  const openAddModal = () => {
    setEditingGuest(null)
    setForm({ ...emptyForm })
    setShowModal(true)
  }

  const openEditModal = (guest: Guest) => {
    setEditingGuest(guest)
    setForm({ name: guest.name, email: guest.email, phone: guest.phone, country: guest.country, location: guest.location, roomType: guest.roomType })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.name || !form.email) return
    if (editingGuest) {
      setGuests(prev => prev.map(g => g.id === editingGuest.id ? { ...g, ...form } : g))
    } else {
      const newId = Math.max(0, ...guests.map(g => g.id)) + 1
      setGuests(prev => [{ id: newId, ...form, lastStay: 'N/A', totalStays: 0, points: 0, pointsLabel: '0 pts', status: 'active' as const }, ...prev])
    }
    setShowModal(false)
  }

  const handleDelete = (guest: Guest) => {
    setConfirmDelete(guest)
  }

  const confirmDeleteGuest = () => {
    if (confirmDelete) {
      setGuests(prev => prev.filter(g => g.id !== confirmDelete.id))
      setConfirmDelete(null)
    }
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', fontSize: 13, color: 'var(--foreground)', outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', marginBottom: 4, display: 'block' }

  const viewModalGuest = viewingGuest

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Guests" subtitle="Manage all guest profiles and their information" />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>

          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
            <StatCard icon={<Users size={18} color="#fff" />} iconBg="var(--primary)" label="Total Guests" value={String(guests.length).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} change="12.6% vs last month" positive={true} />
            <StatCard icon={<UserPlus size={18} color="#fff" />} iconBg="#3B82F6" label="New Guests" value={String(guests.filter(g => g.status === 'active').length)} change="8.4% vs last month" positive={true} />
            <StatCard icon={<Star size={18} color="#fff" />} iconBg="#F59E0B" label="Returning Guests" value={String(guests.filter(g => g.badge === 'returning').length)} change="15.3% vs last month" positive={true} />
            <StatCard icon={<Heart size={18} color="#fff" />} iconBg="#10B981" label="Loyal Guests" value={String(guests.filter(g => g.totalStays >= 3).length)} change="10.7% vs last month" positive={true} />
            <StatCard icon={<Gem size={18} color="#fff" />} iconBg="#EC4899" label="VIP Guests" value={String(guests.filter(g => g.badge === 'vip').length)} change="6.2% vs last month" positive={true} />
          </div>

          {/* Filters Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', padding: '16px 20px', borderRadius: 12, border: '1px solid var(--border)', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, maxWidth: 340, padding: '8px 14px', background: 'var(--secondary)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <Search size={16} color="var(--muted-foreground)" />
              <input
                placeholder="Search by guest name, email or phone..."
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1) }}
                style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 14, outline: 'none', color: 'var(--foreground)' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <select value={filterType} onChange={e => { setFilterType(e.target.value); setCurrentPage(1) }} style={{ padding: '8px 32px 8px 14px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', fontSize: 13, cursor: 'pointer', color: 'var(--foreground)', appearance: 'none', outline: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235D6D7E' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}>
                <option value="All">All Guest Type</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <select value={filterNationality} onChange={e => { setFilterNationality(e.target.value); setCurrentPage(1) }} style={{ padding: '8px 32px 8px 14px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', fontSize: 13, cursor: 'pointer', color: 'var(--foreground)', appearance: 'none', outline: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235D6D7E' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}>
                {nationalities.map(n => <option key={n} value={n}>{n === 'All' ? 'All Nationality' : n}</option>)}
              </select>
              {hasFilters && (
                <button onClick={clearFilters} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#fff', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, cursor: 'pointer', color: 'var(--muted-foreground)' }}>
                  <X size={14} /> Clear
                </button>
              )}
            </div>
            <button onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600, marginLeft: 'auto', whiteSpace: 'nowrap' }}>
              <Plus size={18} /> Add Guest
            </button>
          </div>

          {/* Table */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--secondary)', borderBottom: '1px solid var(--border)' }}>
                    {['GUEST', 'CONTACT', 'LAST STAY', 'TOTAL STAYS', 'LOYALTY POINTS', 'STATUS', 'ACTIONS'].map(h => (
                      <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--muted-foreground)', letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((g) => (
                    <tr key={g.id} onClick={() => setViewingGuest(g)} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--muted)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      {/* Guest */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: colorFromName(g.name), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 600, flexShrink: 0 }}>
                            {getInitials(g.name)}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>{g.name}</span>
                              {g.badge === 'vip' && <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 4, background: '#3B82F6', color: '#fff' }}>VIP</span>}
                              {g.badge === 'returning' && <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 4, background: '#059669', color: '#fff' }}>Returning</span>}
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>{g.email}</div>
                          </div>
                        </div>
                      </td>
                      {/* Contact */}
                      <td style={{ padding: '14px 20px', fontSize: 14, color: 'var(--foreground)' }}>
                        <div>{g.phone}</div>
                        <div style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>{g.country}</div>
                      </td>
                      {/* Last Stay */}
                      <td style={{ padding: '14px 20px', fontSize: 14, color: 'var(--foreground)' }}>
                        <div>{g.lastStay}</div>
                        <div style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>{g.roomType}</div>
                      </td>
                      {/* Total Stays */}
                      <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>{g.totalStays}</td>
                      {/* Loyalty Points */}
                      <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 600, color: 'var(--primary)' }}>{g.pointsLabel}</td>
                      {/* Status */}
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          display: 'inline-block', padding: '4px 12px', fontSize: 12, fontWeight: 600, borderRadius: 20,
                          background: g.status === 'active' ? '#D1FAE5' : '#FEE2E2',
                          color: g.status === 'active' ? '#059669' : '#DC2626',
                        }}>
                          {g.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      {/* Actions */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <button onClick={(e) => { e.stopPropagation(); setViewingGuest(g) }} style={{ width: 32, height: 32, border: 'none', borderRadius: 6, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)' }}>
                            <Eye size={16} />
                          </button>
                          <button onClick={(e) => {
                            e.stopPropagation()
                            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                            setContextMenu(contextMenu?.guest.id === g.id ? null : { x: rect.left - 120, y: rect.bottom + 4, guest: g })
                          }} style={{ width: 32, height: 32, border: 'none', borderRadius: 6, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)' }}>
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 14 }}>
                        No guests found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 14, color: 'var(--muted-foreground)' }}>
                Showing {start} to {end} of {filtered.length} guests
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={{ width: 36, height: 36, border: '1px solid var(--border)', borderRadius: 6, background: '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: currentPage === 1 ? 0.5 : 1 }}>
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)} style={{
                    width: 36, height: 36, borderRadius: 6,
                    border: p === currentPage ? 'none' : '1px solid var(--border)',
                    background: p === currentPage ? 'var(--primary)' : '#fff',
                    color: p === currentPage ? '#fff' : 'var(--foreground)',
                    cursor: 'pointer', fontSize: 14, fontWeight: 500,
                  }}>
                    {p}
                  </button>
                ))}
                {totalPages > 5 && <span style={{ color: 'var(--muted-foreground)', padding: '0 4px' }}>...</span>}
                {totalPages > 5 && <button onClick={() => setCurrentPage(totalPages)} style={{ width: 36, height: 36, borderRadius: 6, border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: 'var(--foreground)' }}>{totalPages}</button>}
                <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} style={{ width: 36, height: 36, border: '1px solid var(--border)', borderRadius: 6, background: '#fff', cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (currentPage === totalPages || totalPages === 0) ? 0.5 : 1 }}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

        </main>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 999 }} onClick={() => setContextMenu(null)} />
          <div style={{ position: 'fixed', top: contextMenu.y, left: contextMenu.x, background: '#fff', border: '1px solid var(--border)', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 1000, minWidth: 160, padding: '4px 0' }}>
            {[
              { icon: Eye, label: 'View', action: () => { setViewingGuest(contextMenu.guest) } },
              { icon: UserPlus, label: 'Edit', action: () => { openEditModal(contextMenu.guest) } },
              { label: 'Send Email', action: () => { window.open(`mailto:${contextMenu.guest.email}`, '_blank') } },
              { label: 'New Booking', action: () => { navigate('/host/bookings') } },
              { divider: true },
              { label: 'Delete', action: () => { handleDelete(contextMenu.guest) }, danger: true },
            ].map((item, i) =>
              'divider' in item ? (
                <div key={i} style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
              ) : (
                <button key={i} onClick={() => { item.action(); setContextMenu(null) }} style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '10px 16px', border: 'none', background: 'none',
                  cursor: 'pointer', fontSize: 14, color: 'danger' in item && item.danger ? '#DC2626' : 'var(--foreground)',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--muted)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  {'icon' in item && item.icon && <item.icon size={16} />}
                  {item.label}
                </button>
              )
            )}
          </div>
        </>
      )}

      {/* View Guest Modal */}
      {viewModalGuest && (
        <div onClick={() => setViewingGuest(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, padding: 28, width: 520, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Guest Details</h3>
              <button onClick={() => setViewingGuest(null)} style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, padding: 16, background: 'var(--muted)', borderRadius: 10 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: colorFromName(viewModalGuest.name), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 700 }}>
                {getInitials(viewModalGuest.name)}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>{viewModalGuest.name}</span>
                  {viewModalGuest.badge === 'vip' && <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: '#3B82F6', color: '#fff' }}>VIP</span>}
                  {viewModalGuest.badge === 'returning' && <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: '#059669', color: '#fff' }}>Returning</span>}
                </div>
                <span style={{ display: 'inline-block', padding: '3px 10px', fontSize: 11, fontWeight: 600, borderRadius: 20, marginTop: 4, background: viewModalGuest.status === 'active' ? '#D1FAE5' : '#FEE2E2', color: viewModalGuest.status === 'active' ? '#059669' : '#DC2626' }}>
                  {viewModalGuest.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: 'Email', value: viewModalGuest.email },
                { label: 'Phone', value: viewModalGuest.phone },
                { label: 'Country', value: viewModalGuest.country },
                { label: 'Location', value: viewModalGuest.location },
                { label: 'Room Type', value: viewModalGuest.roomType },
                { label: 'Last Stay', value: viewModalGuest.lastStay },
                { label: 'Total Stays', value: String(viewModalGuest.totalStays) },
                { label: 'Loyalty Points', value: viewModalGuest.pointsLabel },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{item.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button onClick={() => { setViewingGuest(null); openEditModal(viewModalGuest) }} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Edit Guest</button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Guest Modal */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, padding: 28, width: 500, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px' }}>{editingGuest ? 'Edit Guest' : 'Add Guest'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input style={inputStyle} placeholder="e.g. John Smith" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input style={inputStyle} type="email" placeholder="guest@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input style={inputStyle} placeholder="+977 9812345678" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Country</label>
                  <input style={inputStyle} placeholder="e.g. United States" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Room Type</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.roomType} onChange={e => setForm({ ...form, roomType: e.target.value })}>
                    <option>Standard Room</option>
                    <option>Deluxe Room</option>
                    <option>Suite Room</option>
                    <option>Family Room</option>
                    <option>Presidential Suite</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Location</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}>
                    <option>Kathmandu</option>
                    <option>Pokhara</option>
                    <option>Chitwan</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>Cancel</button>
              <button onClick={handleSave} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>{editingGuest ? 'Save Changes' : 'Add Guest'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div onClick={() => setConfirmDelete(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, padding: 28, width: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 12px' }}>Delete Guest</h3>
            <p style={{ fontSize: 14, color: 'var(--muted-foreground)', margin: 0, lineHeight: 1.5 }}>Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This action cannot be undone.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button onClick={() => setConfirmDelete(null)} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>Cancel</button>
              <button onClick={confirmDeleteGuest} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#DC2626', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
