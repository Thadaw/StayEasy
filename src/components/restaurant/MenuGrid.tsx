import { Plus } from 'lucide-react'

export interface MenuItem {
  id: string
  name: string
  price: number
  category: string
  image: string
}

interface MenuGridProps {
  items: MenuItem[]
  onAdd: (item: MenuItem) => void
}

export default function MenuGrid({ items, onAdd }: MenuGridProps) {
  return (
    <div style={{ flex: 1, background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 16, overflow: 'auto' }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>All Items</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {items.map((item) => (
          <div key={item.id} style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
            <img src={item.image} alt={item.name} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
            <div style={{ padding: '10px 12px' }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{item.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>NPR {item.price.toLocaleString()}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); onAdd(item) }}
                  style={{
                    width: 28, height: 28, borderRadius: 6, border: '1px solid var(--primary)',
                    background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Plus size={14} color="var(--primary)" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
