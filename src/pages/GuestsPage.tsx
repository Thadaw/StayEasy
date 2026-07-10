import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import StatCard from '../components/dashboard/StatCard'
import {
  Users, UserPlus, Star, Heart, Gem, Search, Filter, Plus,
  Eye, MoreHorizontal, ChevronLeft, ChevronRight,
} from 'lucide-react'

interface Guest {
  id: number
  name: string
  email: string
  phone: string
  country: string
  property: string
  location: string
  lastStay: string
  roomType: string
  totalStays: number
  points: number
  pointsLabel: string
  status: 'active' | 'inactive'
  badge?: 'vip' | 'returning'
}

const guests: Guest[] = [
  { id: 1, name: 'John Smith', email: 'john.smith@email.com', phone: '+977 9812345678', country: 'United States', property: 'Hotel Blue Pearl', location: 'Kathmandu', lastStay: 'Jun 10, 2026', roomType: 'Deluxe Room', totalStays: 6, points: 2450, pointsLabel: '2,450 pts', status: 'active', badge: 'vip' },
  { id: 2, name: 'Emily Johnson', email: 'emily.j@email.com', phone: '+977 9823456789', country: 'United Kingdom', property: 'Lake View Resort', location: 'Pokhara', lastStay: 'May 28, 2026', roomType: 'Suite Room', totalStays: 3, points: 1120, pointsLabel: '1,120 pts', status: 'active', badge: 'returning' },
  { id: 3, name: 'Michael Brown', email: 'michael.b@email.com', phone: '+977 9834567890', country: 'Australia', property: 'Mountain Resort', location: 'Chitwan', lastStay: 'Jun 5, 2026', roomType: 'Standard Room', totalStays: 2, points: 560, pointsLabel: '560 pts', status: 'active' },
  { id: 4, name: 'Sarah Taylor', email: 'sarah.t@email.com', phone: '+977 9845678901', country: 'Canada', property: 'Hotel Blue Pearl', location: 'Kathmandu', lastStay: 'Jun 12, 2026', roomType: 'Deluxe Room', totalStays: 7, points: 3890, pointsLabel: '3,890 pts', status: 'active', badge: 'vip' },
  { id: 5, name: 'David Wilson', email: 'david.w@email.com', phone: '+977 9845678901', country: 'India', property: 'Lake View Resort', location: 'Pokhara', lastStay: 'May 30, 2026', roomType: 'Suite Room', totalStays: 4, points: 1780, pointsLabel: '1,780 pts', status: 'active' },
  { id: 6, name: 'Olivia Martinez', email: 'olivia.m@email.com', phone: '+977 9867890123', country: 'Spain', property: 'Mountain Resort', location: 'Chitwan', lastStay: 'Jun 8, 2026', roomType: 'Family Room', totalStays: 3, points: 920, pointsLabel: '920 pts', status: 'inactive', badge: 'returning' },
  { id: 7, name: 'James Anderson', email: 'james.a@email.com', phone: '+977 9878901234', country: 'Germany', property: 'Hotel Blue Pearl', location: 'Kathmandu', lastStay: 'Apr 22, 2026', roomType: 'Standard Room', totalStays: 1, points: 250, pointsLabel: '250 pts', status: 'inactive' },
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

export default function GuestsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; guest: Guest } | null>(null)
  const pageSize = 10
  const navigate = useNavigate()

  const filtered = guests.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.property.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const totalPages = Math.ceil(filtered.length / pageSize)
  const start = (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, filtered.length)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Guests" subtitle="Manage all guest profiles and their information" />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>

          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
            <StatCard icon={<Users size={18} color="#fff" />} iconBg="var(--primary)" label="Total Guests" value="1,248" change="12.6% vs last month" positive={true} />
            <StatCard icon={<UserPlus size={18} color="#fff" />} iconBg="#3B82F6" label="New Guests" value="156" change="8.4% vs last month" positive={true} />
            <StatCard icon={<Star size={18} color="#fff" />} iconBg="#F59E0B" label="Returning Guests" value="482" change="15.3% vs last month" positive={true} />
            <StatCard icon={<Heart size={18} color="#fff" />} iconBg="#10B981" label="Loyal Guests" value="210" change="10.7% vs last month" positive={true} />
            <StatCard icon={<Gem size={18} color="#fff" />} iconBg="#EC4899" label="VIP Guests" value="68" change="6.2% vs last month" positive={true} />
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'var(--secondary)', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, cursor: 'pointer', color: 'var(--foreground)' }}>
                All Properties <ChevronRight size={12} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'var(--secondary)', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, cursor: 'pointer', color: 'var(--foreground)' }}>
                All Guest Type <ChevronRight size={12} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'var(--secondary)', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, cursor: 'pointer', color: 'var(--foreground)' }}>
                All Nationality <ChevronRight size={12} />
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#fff', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, cursor: 'pointer', color: 'var(--foreground)' }}>
                <Filter size={14} /> More Filters
              </button>
            </div>
            <button onClick={() => navigate('/host/guests/add')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600, marginLeft: 'auto', whiteSpace: 'nowrap' }}>
              <Plus size={18} /> Add Guest
            </button>
          </div>

          {/* Table */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--secondary)', borderBottom: '1px solid var(--border)' }}>
                    {['GUEST', 'CONTACT', 'PROPERTY', 'LAST STAY', 'TOTAL STAYS', 'LOYALTY POINTS', 'STATUS', 'ACTIONS'].map(h => (
                      <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--muted-foreground)', letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((g) => (
                    <tr key={g.id} style={{ borderBottom: '1px solid var(--border)' }}>
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
                      {/* Property */}
                      <td style={{ padding: '14px 20px', fontSize: 14, color: 'var(--foreground)' }}>
                        <div>{g.property}</div>
                        <div style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>{g.location}</div>
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
                          <button onClick={() => alert(`Viewing: ${g.name}`)} style={{ width: 32, height: 32, border: 'none', borderRadius: 6, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)' }}>
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
          <div style={{ position: 'fixed', top: contextMenu.y, left: contextMenu.x, background: '#fff', border: '1px solid var(--border)', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 1000, minWidth: 140, padding: '4px 0' }}>
            {[
              { icon: Eye, label: 'View', action: () => alert(`Viewing: ${contextMenu.guest.name}`) },
              { icon: UserPlus, label: 'Edit', action: () => alert(`Editing: ${contextMenu.guest.name}`) },
              { label: 'Send Email', action: () => alert(`Emailing: ${contextMenu.guest.name}`) },
              { label: 'New Booking', action: () => alert(`New booking: ${contextMenu.guest.name}`) },
              { divider: true },
              { label: 'Delete', action: () => { if (confirm(`Delete ${contextMenu.guest.name}?`)) alert('Deleted') }, danger: true },
            ].map((item, i) =>
              'divider' in item ? (
                <div key={i} style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
              ) : (
                <button key={i} onClick={() => { item.action(); setContextMenu(null) }} style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '10px 16px', border: 'none', background: 'none',
                  cursor: 'pointer', fontSize: 14, color: 'danger' in item && item.danger ? '#DC2626' : 'var(--foreground)',
                }}>
                  {'icon' in item && item.icon && <item.icon size={16} />}
                  {item.label}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  )
}
