import { useState } from 'react'
import {
  Image,
  Building2,
  Layers,
  Grid3X3,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Info,
  Upload,
  Eye,
  Pen,
  MoreVertical,
  Headphones,
  ExternalLink,
  Replace,
  Download,
  Trash2,
  Camera,
  ArrowRight,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface RoomTypeCard {
  id: string
  name: string
  rooms: number
  photos: number
  appliesTo: number
  image: string
}

interface Photo {
  id: number
  label?: string
}

interface CustomPhotoRow {
  roomType: string
  totalRooms: number
  customRooms: number
  photos: number
  lastUpdated: string
}

// ─── Data ────────────────────────────────────────────────────────────────────

const roomTypes: RoomTypeCard[] = [
  { id: 'deluxe', name: 'Deluxe Room', rooms: 20, photos: 12, appliesTo: 20, image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop' },
  { id: 'superior', name: 'Superior Room', rooms: 15, photos: 10, appliesTo: 15, image: 'https://images.unsplash.com/photo-1590490360182-c33d955e24ed?w=400&h=300&fit=crop' },
  { id: 'suite', name: 'Suite Room', rooms: 8, photos: 16, appliesTo: 8, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop' },
  { id: 'family', name: 'Family Room', rooms: 5, photos: 9, appliesTo: 5, image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop' },
  { id: 'standard', name: 'Standard Room', rooms: 12, photos: 8, appliesTo: 12, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop' },
]

const defaultGallery: Photo[] = [
  { id: 1, label: 'Cover' },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
  { id: 9 },
  { id: 10 },
  { id: 11 },
  { id: 12 },
]

const customPhotos: CustomPhotoRow[] = [
  { roomType: 'Deluxe Room', totalRooms: 20, customRooms: 1, photos: 8, lastUpdated: 'May 20, 2025' },
]

const galleryTabs = ['Property Gallery', 'Room Type Gallery', 'Individual Room Gallery', 'Bulk Photo Manager'] as const

// ─── Component ───────────────────────────────────────────────────────────────

export default function GallerySettingsTab() {
  const [activeTab, setActiveTab] = useState<string>('Room Type Gallery')
  const [selectedRoomType, setSelectedRoomType] = useState('deluxe')
  const [searchRoom, setSearchRoom] = useState('')

  const selectedRoom = roomTypes.find(r => r.id === selectedRoomType) || roomTypes[0]

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      {/* Left - Main Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Total Photos', sub: 'Across all galleries', value: '1,248', icon: <Image size={22} />, bg: '#EDE9FE', color: 'var(--primary)' },
            { label: 'Property Photos', sub: 'Hotel & facilities', value: '156', icon: <Building2 size={22} />, bg: '#D1FAE5', color: '#059669' },
            { label: 'Room Type Photos', sub: 'Shared by room types', value: '842', icon: <Layers size={22} />, bg: '#DBEAFE', color: '#2563EB' },
            { label: 'Individual Room Photos', sub: 'Custom room galleries', value: '250', icon: <Grid3X3 size={22} />, bg: '#FFF7ED', color: '#EA580C' },
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

        {/* Tab Bar */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #E5E7EB', marginBottom: 20 }}>
          {galleryTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 16px',
                border: 'none',
                background: 'transparent',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                color: activeTab === tab ? 'var(--primary)' : '#6B7280',
                borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                marginBottom: -2,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                whiteSpace: 'nowrap',
              }}
            >
              {tab === 'Property Gallery' && <Building2 size={14} />}
              {tab === 'Room Type Gallery' && <Layers size={14} />}
              {tab === 'Individual Room Gallery' && <Image size={14} />}
              {tab === 'Bulk Photo Manager' && <Grid3X3 size={14} />}
              {tab}
            </button>
          ))}
        </div>

        {/* Info Banner */}
        {activeTab === 'Room Type Gallery' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, marginBottom: 20, fontSize: 13, color: '#1E40AF' }}>
            <Info size={16} style={{ flexShrink: 0 }} />
            <span>Upload photos once for a room type and apply to all rooms of that type. You can still customize photos for individual rooms.</span>
            <button style={{ marginLeft: 'auto', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#2563EB', whiteSpace: 'nowrap' }}>How it works?</button>
          </div>
        )}

        {/* Filter Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 300 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input
              value={searchRoom}
              onChange={e => setSearchRoom(e.target.value)}
              placeholder="Search room type..."
              style={{ width: '100%', padding: '10px 14px 10px 38px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#111827', outline: 'none' }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <select style={{ padding: '10px 32px 10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#374151', background: '#fff', outline: 'none', appearance: 'none' as const }}>
              <option>All Room Types</option>
              {roomTypes.map(r => <option key={r.id}>{r.name}</option>)}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* Room Type Cards */}
        <div style={{ position: 'relative', marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
            {roomTypes.map(room => (
              <div
                key={room.id}
                onClick={() => setSelectedRoomType(room.id)}
                style={{
                  minWidth: 200,
                  background: '#fff',
                  border: selectedRoomType === room.id ? '2px solid var(--primary)' : '1px solid #E5E7EB',
                  borderRadius: 12,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s',
                }}
              >
                <div style={{ position: 'relative', height: 120 }}>
                  <img src={room.image} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {room.id === 'deluxe' && (
                    <span style={{ position: 'absolute', top: 8, left: 8, padding: '3px 8px', background: 'var(--primary)', color: '#fff', fontSize: 10, fontWeight: 600, borderRadius: 4 }}>Default Gallery</span>
                  )}
                </div>
                <div style={{ padding: 12 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#111827', marginBottom: 4 }}>{room.name}</div>
                  <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>{room.rooms} Rooms · {room.photos} Photos</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#059669', fontWeight: 500 }}>
                    <span style={{ fontSize: 10 }}>✓</span> Applies to {room.appliesTo} rooms
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button style={{ position: 'absolute', left: -16, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, borderRadius: '50%', background: '#fff', border: '1px solid #E5E7EB', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
            <ChevronLeft size={16} />
          </button>
          <button style={{ position: 'absolute', right: -16, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, borderRadius: '50%', background: '#fff', border: '1px solid #E5E7EB', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Selected Room Gallery */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>{selectedRoom.name} – Default Gallery</h3>
                <span style={{ padding: '3px 8px', background: '#EDE9FE', color: 'var(--primary)', fontSize: 11, fontWeight: 600, borderRadius: 4 }}>{selectedRoom.photos} Photos</span>
                <span style={{ padding: '3px 8px', background: '#D1FAE5', color: '#059669', fontSize: 11, fontWeight: 600, borderRadius: 4 }}>Applies to {selectedRoom.appliesTo} rooms</span>
              </div>
              <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>These photos are visible in all {selectedRoom.name.replace(' Room', '')} rooms unless customized.</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#fff', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
                <Camera size={14} /> Change Cover
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#fff', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
                <Layers size={14} /> Reorder
              </button>
              <button style={{ width: 34, height: 34, border: '1px solid #E5E7EB', borderRadius: 8, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
                <MoreVertical size={14} />
              </button>
            </div>
          </div>

          {/* Photo Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 16 }}>
            {defaultGallery.map(photo => (
              <div key={photo.id} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 8, overflow: 'hidden', background: '#F3F4F6' }}>
                <img src={`https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop`} alt={`Photo ${photo.id}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 6, left: 6, width: 22, height: 22, borderRadius: 4, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {photo.id}
                </div>
                {photo.label && (
                  <span style={{ position: 'absolute', bottom: 6, left: 6, padding: '2px 6px', background: 'var(--primary)', color: '#fff', fontSize: 10, fontWeight: 600, borderRadius: 3 }}>
                    {photo.label}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Upload Zone */}
          <div style={{ border: '2px dashed #D1D5DB', borderRadius: 8, padding: 24, textAlign: 'center', background: '#FAFAFA', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#D1D5DB'}
          >
            <Upload size={24} color="#9CA3AF" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 14, color: '#374151', marginBottom: 4 }}>
              <span style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>Drag & drop photos here</span> or click to upload
            </div>
            <div style={{ fontSize: 12, color: '#9CA3AF' }}>JPG, PNG. Max up to 10MB each</div>
          </div>
        </div>

        {/* Custom Photos Table */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Room Types with Custom Photos (1)</h3>
            <button style={{ display: 'flex', alignItems: 'center', gap: 4, border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>
              Manage in Individual Room Gallery <ArrowRight size={14} />
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB' }}>
                {['ROOM TYPE', 'TOTAL ROOMS', 'CUSTOM ROOMS', 'PHOTOS', 'LAST UPDATED', 'ACTIONS'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' as const, letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customPhotos.map(row => (
                <tr key={row.roomType} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#111827', fontSize: 14 }}>{row.roomType}</td>
                  <td style={{ padding: '14px 20px', fontSize: 14, color: '#374151' }}>{row.totalRooms}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ padding: '4px 10px', background: '#DBEAFE', color: '#2563EB', fontSize: 12, fontWeight: 600, borderRadius: 4 }}>{row.customRooms} Room</span>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 14, color: '#374151' }}>{row.photos} Photos</td>
                  <td style={{ padding: '14px 20px', fontSize: 14, color: '#6B7280' }}>{row.lastUpdated}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <button style={{ width: 32, height: 32, border: 'none', borderRadius: 6, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}><Eye size={14} /></button>
                      <button style={{ width: 32, height: 32, border: 'none', borderRadius: 6, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}><Pen size={14} /></button>
                      <button style={{ width: 32, height: 32, border: 'none', borderRadius: 6, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}><MoreVertical size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Sidebar */}
      <div style={{ width: 280, flexShrink: 0 }}>
        {/* About */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>About Room Type Gallery</h3>
          <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 10px', lineHeight: 1.5 }}>Photos uploaded here will be used by all rooms of this type. You can still customize photos for individual rooms.</p>
          <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--primary)', padding: 0 }}>Learn more →</button>
        </div>

        {/* Room Summary */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 14px' }}>{selectedRoom.name} Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Total Rooms', value: String(selectedRoom.rooms) },
              { label: 'Using Default Photos', value: String(selectedRoom.appliesTo - 1) },
              { label: 'With Custom Photos', value: '1' },
              { label: 'Total Photos', value: String(selectedRoom.photos) },
              { label: 'Last Updated', value: 'May 20, 2025' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#6B7280' }}>{item.label}</span>
                <span style={{ fontWeight: 600, color: '#111827' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 14px' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { label: 'Add Photos', icon: <Upload size={16} />, color: 'var(--primary)' },
              { label: 'Replace All Photos', icon: <Replace size={16} />, color: '#EA580C' },
              { label: 'Download All Photos', icon: <Download size={16} />, color: '#2563EB' },
              { label: 'Delete All Photos', icon: <Trash2 size={16} />, color: '#DC2626' },
            ].map(action => (
              <button key={action.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px', border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500, color: action.color, width: '100%', textAlign: 'left' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {action.icon} {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Need Help */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Headphones size={18} color="var(--primary)" />
            <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Need Help?</span>
          </div>
          <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 14px', lineHeight: 1.5 }}>Learn more about gallery management and best practices.</p>
          <button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#fff', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
            View Documentation <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
