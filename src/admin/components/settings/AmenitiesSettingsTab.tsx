import { useState } from 'react'
import {
  Building2,
  CheckCircle,
  PauseCircle,
  LayoutGrid,
  Search,
  ChevronDown,
  Plus,
  Pen,
  MoreVertical,
  Star,
  Headphones,
  ExternalLink,
  Wifi,
  Snowflake,
  Tv,
  ParkingCircle,
  Coffee,
  Waves,
  Dumbbell,
  Wine,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Amenity {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  category: string
  categoryColor: string
  status: 'Active' | 'Inactive'
  featured: boolean
  assignedRooms: number
  assignedProperties: number
}

interface CategoryItem {
  name: string
  count: number
  icon: React.ReactNode
  color: string
}

// ─── Data ────────────────────────────────────────────────────────────────────

const amenities: Amenity[] = [
  { id: 'wifi', name: 'Free WiFi', description: 'High speed internet access', icon: <Wifi size={18} />, iconBg: '#EDE9FE', iconColor: 'var(--primary)', category: 'Internet', categoryColor: 'var(--primary)', status: 'Active', featured: true, assignedRooms: 15, assignedProperties: 3 },
  { id: 'ac', name: 'Air Conditioning', description: 'Centralized air conditioning', icon: <Snowflake size={18} />, iconBg: '#DBEAFE', iconColor: '#2563EB', category: 'Comfort', categoryColor: '#2563EB', status: 'Active', featured: true, assignedRooms: 18, assignedProperties: 4 },
  { id: 'tv', name: 'Smart TV', description: 'LED TV with satellite channels', icon: <Tv size={18} />, iconBg: '#FEF3C7', iconColor: '#D97706', category: 'Entertainment', categoryColor: '#D97706', status: 'Active', featured: false, assignedRooms: 14, assignedProperties: 3 },
  { id: 'parking', name: 'Free Parking', description: 'Complimentary parking space', icon: <ParkingCircle size={18} />, iconBg: '#D1FAE5', iconColor: '#059669', category: 'Facility', categoryColor: '#059669', status: 'Active', featured: true, assignedRooms: 0, assignedProperties: 2 },
  { id: 'breakfast', name: 'Breakfast Included', description: 'Daily complimentary breakfast', icon: <Coffee size={18} />, iconBg: '#FEE2E2', iconColor: '#DC2626', category: 'Dining', categoryColor: '#DC2626', status: 'Active', featured: true, assignedRooms: 12, assignedProperties: 2 },
  { id: 'pool', name: 'Swimming Pool', description: 'Outdoor swimming pool', icon: <Waves size={18} />, iconBg: '#DBEAFE', iconColor: '#2563EB', category: 'Recreation', categoryColor: '#2563EB', status: 'Inactive', featured: false, assignedRooms: 0, assignedProperties: 1 },
  { id: 'gym', name: 'Fitness Center', description: 'Well equipped gym', icon: <Dumbbell size={18} />, iconBg: '#EDE9FE', iconColor: 'var(--primary)', category: 'Wellness', categoryColor: 'var(--primary)', status: 'Active', featured: false, assignedRooms: 8, assignedProperties: 2 },
  { id: 'minibar', name: 'Mini Bar', description: 'In-room mini bar', icon: <Wine size={18} />, iconBg: '#FCE7F3', iconColor: '#DB2777', category: 'Comfort', categoryColor: '#2563EB', status: 'Inactive', featured: false, assignedRooms: 6, assignedProperties: 1 },
  { id: 'safe', name: 'In-Room Safe', description: 'Electronic room safe', icon: <Building2 size={18} />, iconBg: '#D1FAE5', iconColor: '#059669', category: 'Facility', categoryColor: '#059669', status: 'Active', featured: false, assignedRooms: 10, assignedProperties: 3 },
  { id: 'spa', name: 'Spa Services', description: 'Full service spa and wellness', icon: <Star size={18} />, iconBg: '#FCE7F3', iconColor: '#DB2777', category: 'Wellness', categoryColor: 'var(--primary)', status: 'Active', featured: false, assignedRooms: 0, assignedProperties: 2 },
  { id: 'laundry', name: 'Laundry Service', description: 'Same-day laundry and dry cleaning', icon: <Building2 size={18} />, iconBg: '#FEF3C7', iconColor: '#D97706', category: 'Service', categoryColor: '#EA580C', status: 'Active', featured: false, assignedRooms: 0, assignedProperties: 4 },
  { id: 'roomservice', name: 'Room Service', description: '24-hour in-room dining', icon: <Coffee size={18} />, iconBg: '#FEE2E2', iconColor: '#DC2626', category: 'Dining', categoryColor: '#DC2626', status: 'Active', featured: false, assignedRooms: 0, assignedProperties: 3 },
  { id: 'concierge', name: 'Concierge', description: 'Dedicated concierge service', icon: <Building2 size={18} />, iconBg: '#EDE9FE', iconColor: 'var(--primary)', category: 'Service', categoryColor: '#EA580C', status: 'Active', featured: false, assignedRooms: 0, assignedProperties: 2 },
  { id: 'shuttle', name: 'Airport Shuttle', description: 'Complimentary airport transfers', icon: <ParkingCircle size={18} />, iconBg: '#D1FAE5', iconColor: '#059669', category: 'Transport', categoryColor: '#059669', status: 'Active', featured: false, assignedRooms: 0, assignedProperties: 1 },
  { id: 'garden', name: 'Garden View', description: 'Rooms with garden view', icon: <Wifi size={18} />, iconBg: '#D1FAE5', iconColor: '#059669', category: 'Room Feature', categoryColor: '#059669', status: 'Active', featured: false, assignedRooms: 8, assignedProperties: 2 },
  { id: 'balcony', name: 'Private Balcony', description: 'Rooms with private balcony', icon: <Wifi size={18} />, iconBg: '#DBEAFE', iconColor: '#2563EB', category: 'Room Feature', categoryColor: '#2563EB', status: 'Active', featured: false, assignedRooms: 6, assignedProperties: 2 },
  { id: 'bathtub', name: 'Bathtub', description: 'Premium bathtub in bathroom', icon: <Waves size={18} />, iconBg: '#DBEAFE', iconColor: '#2563EB', category: 'Comfort', categoryColor: '#2563EB', status: 'Active', featured: false, assignedRooms: 4, assignedProperties: 1 },
  { id: 'kettle', name: 'Electric Kettle', description: 'Complimentary tea and coffee', icon: <Coffee size={18} />, iconBg: '#FEF3C7', iconColor: '#D97706', category: 'Comfort', categoryColor: '#2563EB', status: 'Active', featured: false, assignedRooms: 20, assignedProperties: 4 },
  { id: 'iron', name: 'Iron & Board', description: 'Iron and ironing board available', icon: <Building2 size={18} />, iconBg: '#E0E7FF', iconColor: '#4F46E5', category: 'Facility', categoryColor: '#059669', status: 'Active', featured: false, assignedRooms: 12, assignedProperties: 3 },
  { id: 'hairdryer', name: 'Hair Dryer', description: 'In-room hair dryer', icon: <Wind size={18} />, iconBg: '#FCE7F3', iconColor: '#DB2777', category: 'Comfort', categoryColor: '#2563EB', status: 'Active', featured: false, assignedRooms: 16, assignedProperties: 4 },
  { id: 'beach', name: 'Beach Access', description: 'Direct beach access', icon: <Waves size={18} />, iconBg: '#DBEAFE', iconColor: '#2563EB', category: 'Recreation', categoryColor: '#2563EB', status: 'Inactive', featured: false, assignedRooms: 0, assignedProperties: 1 },
  { id: 'bar', name: 'Mini Bar Stocked', description: 'Fully stocked mini bar', icon: <Wine size={18} />, iconBg: '#FCE7F3', iconColor: '#DB2777', category: 'Dining', categoryColor: '#DC2626', status: 'Inactive', featured: false, assignedRooms: 0, assignedProperties: 1 },
  { id: 'business', name: 'Business Center', description: 'Fully equipped business center', icon: <Building2 size={18} />, iconBg: '#EDE9FE', iconColor: 'var(--primary)', category: 'Facility', categoryColor: '#059669', status: 'Active', featured: false, assignedRooms: 0, assignedProperties: 2 },
  { id: 'playground', name: 'Kids Playground', description: 'Dedicated kids play area', icon: <Star size={18} />, iconBg: '#FEF3C7', iconColor: '#D97706', category: 'Recreation', categoryColor: '#2563EB', status: 'Active', featured: false, assignedRooms: 0, assignedProperties: 1 },
]

const categories: CategoryItem[] = [
  { name: 'Internet', count: 3, icon: <Wifi size={16} />, color: 'var(--primary)' },
  { name: 'Comfort', count: 5, icon: <Snowflake size={16} />, color: '#2563EB' },
  { name: 'Entertainment', count: 4, icon: <Tv size={16} />, color: '#D97706' },
  { name: 'Facility', count: 4, icon: <Building2 size={16} />, color: '#059669' },
  { name: 'Dining', count: 3, icon: <Coffee size={16} />, color: '#DC2626' },
  { name: 'Wellness', count: 3, icon: <Dumbbell size={16} />, color: 'var(--primary)' },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function AmenitiesSettingsTab() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [sortBy, setSortBy] = useState('Name (A - Z)')

  const activeCount = amenities.filter(a => a.status === 'Active').length
  const inactiveCount = amenities.filter(a => a.status === 'Inactive').length

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      {/* Left - Main Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Total Amenities', sub: 'All amenities in system', value: '24', icon: <Building2 size={22} />, bg: '#EDE9FE', color: 'var(--primary)' },
            { label: 'Active Amenities', sub: 'Currently enabled', value: String(activeCount), icon: <CheckCircle size={22} />, bg: '#D1FAE5', color: '#059669' },
            { label: 'Inactive Amenities', sub: 'Currently disabled', value: String(inactiveCount), icon: <PauseCircle size={22} />, bg: '#FFF7ED', color: '#EA580C' },
            { label: 'Categories', sub: 'Amenity categories', value: String(categories.length), icon: <LayoutGrid size={22} />, bg: '#DBEAFE', color: '#2563EB' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: '#9CA3AF' }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 200 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search amenities..."
              style={{ width: '100%', padding: '10px 14px 10px 38px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#111827', outline: 'none' }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={{ padding: '10px 32px 10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#374151', background: '#fff', outline: 'none', appearance: 'none' as const }}>
              <option>All Categories</option>
              {categories.map(c => <option key={c.name}>{c.name}</option>)}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
          </div>
          <div style={{ position: 'relative' }}>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '10px 32px 10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#374151', background: '#fff', outline: 'none', appearance: 'none' as const }}>
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
          </div>
          <div style={{ position: 'relative' }}>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '10px 32px 10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#374151', background: '#fff', outline: 'none', appearance: 'none' as const }}>
              <option>Name (A - Z)</option>
              <option>Name (Z - A)</option>
              <option>Status</option>
              <option>Category</option>
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* Amenities Table */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  {['AMENITY', 'CATEGORY', 'STATUS', 'FEATURED', 'ASSIGNED TO', 'ACTIONS'].map(h => (
                    <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' as const, letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {amenities.slice(0, 8).map(amenity => (
                  <tr key={amenity.id} style={{ borderBottom: '1px solid #F3F4F6' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: amenity.iconBg, color: amenity.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {amenity.icon}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#111827', fontSize: 14 }}>{amenity.name}</div>
                          <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{amenity.description}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        display: 'inline-block', padding: '4px 10px', fontSize: 12, fontWeight: 600, borderRadius: 6,
                        background: amenity.categoryColor + '15', color: amenity.categoryColor,
                      }}>{amenity.category}</span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        display: 'inline-block', padding: '4px 12px', fontSize: 12, fontWeight: 600, borderRadius: 20,
                        background: amenity.status === 'Active' ? '#D1FAE5' : '#FEE2E2',
                        color: amenity.status === 'Active' ? '#059669' : '#DC2626',
                      }}>{amenity.status}</span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <Star size={18} fill={amenity.featured ? 'var(--primary)' : 'none'} color={amenity.featured ? 'var(--primary)' : '#D1D5DB'} style={{ cursor: 'pointer' }} />
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontSize: 13, color: '#374151' }}>
                        {amenity.assignedRooms > 0 && <div>{amenity.assignedRooms} Rooms</div>}
                        {amenity.assignedProperties > 0 && <div>{amenity.assignedProperties} Properties</div>}
                        {amenity.assignedRooms === 0 && amenity.assignedProperties === 0 && <span style={{ color: '#9CA3AF' }}>—</span>}
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <button style={{ width: 32, height: 32, border: 'none', borderRadius: 6, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}><Pen size={14} /></button>
                        <button style={{ width: 32, height: 32, border: 'none', borderRadius: 6, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}><MoreVertical size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid #E5E7EB' }}>
            <span style={{ fontSize: 13, color: '#6B7280' }}>Showing 1 to 8 of 24 entries</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button style={{ width: 32, height: 32, border: '1px solid #E5E7EB', borderRadius: 6, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}><span style={{ fontSize: 12 }}>‹</span></button>
              <button style={{ width: 32, height: 32, border: '1px solid var(--primary)', borderRadius: 6, background: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 13 }}>1</button>
              <button style={{ width: 32, height: 32, border: '1px solid #E5E7EB', borderRadius: 6, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151', fontWeight: 500, fontSize: 13 }}>2</button>
              <button style={{ width: 32, height: 32, border: '1px solid #E5E7EB', borderRadius: 6, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151', fontWeight: 500, fontSize: 13 }}>3</button>
              <button style={{ width: 32, height: 32, border: '1px solid #E5E7EB', borderRadius: 6, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}><span style={{ fontSize: 12 }}>›</span></button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div style={{ width: 280, flexShrink: 0 }}>
        {/* Categories */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Categories</h3>
            <button style={{ display: 'flex', alignItems: 'center', gap: 4, border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>
              <Plus size={14} /> Add Category
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {categories.map(cat => (
              <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px', borderRadius: 8, cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ width: 32, height: 32, borderRadius: 8, background: cat.color + '15', color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {cat.icon}
                </div>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#374151' }}>{cat.name}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#6B7280' }}>{cat.count}</span>
              </div>
            ))}
          </div>
          <button style={{ width: '100%', marginTop: 12, padding: '8px 0', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--primary)', textAlign: 'center' }}>
            View All Categories →
          </button>
        </div>

        {/* Tips */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 15 }}>💡</span>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Tips</h3>
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#6B7280', lineHeight: 1.8 }}>
            <li>Amenities can be assigned while adding or editing rooms.</li>
            <li>Use featured amenities to highlight important features.</li>
            <li>Inactive amenities won't be shown in room listing.</li>
          </ul>
        </div>

        {/* Need Help */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Headphones size={18} color="var(--primary)" />
            <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Need Help?</span>
          </div>
          <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 14px', lineHeight: 1.5 }}>Learn more about managing amenities in our documentation.</p>
          <button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#fff', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
            View Documentation <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

// Need Wind icon for hairdryer
function Wind(props: { size: number }) {
  return (
    <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
      <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
      <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
    </svg>
  )
}
