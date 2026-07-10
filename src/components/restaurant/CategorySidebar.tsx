import { LayoutGrid, Soup, Salad, Beef, Sandwich, Pizza, Cake, Coffee, UtensilsCrossed } from 'lucide-react'

interface CategorySidebarProps {
  activeCategory: string
  onCategoryChange: (c: string) => void
}

const categories = [
  { id: 'all', label: 'All Items', icon: LayoutGrid },
  { id: 'starters', label: 'Starters', icon: UtensilsCrossed },
  { id: 'soups', label: 'Soups', icon: Soup },
  { id: 'salads', label: 'Salads', icon: Salad },
  { id: 'mains', label: 'Main Course', icon: Beef },
  { id: 'burgers', label: 'Burgers & Sandwiches', icon: Sandwich },
  { id: 'pasta', label: 'Pasta', icon: UtensilsCrossed },
  { id: 'pizza', label: 'Pizza', icon: Pizza },
  { id: 'desserts', label: 'Desserts', icon: Cake },
  { id: 'beverages', label: 'Beverages', icon: Coffee },
]

export default function CategorySidebar({ activeCategory, onCategoryChange }: CategorySidebarProps) {
  return (
    <div style={{ width: 180, flexShrink: 0, background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: '16px 0' }}>
      <div style={{ fontSize: 14, fontWeight: 600, padding: '0 16px', marginBottom: 8 }}>Categories</div>
      {categories.map((c) => {
        const active = activeCategory === c.id
        return (
          <button
            key={c.id}
            onClick={() => onCategoryChange(c.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%',
              padding: '10px 16px', border: 'none', cursor: 'pointer', fontSize: 13,
              background: active ? 'var(--accent)' : 'transparent',
              color: active ? 'var(--primary)' : 'var(--foreground)',
              fontWeight: active ? 600 : 400,
              textAlign: 'left',
            }}
          >
            <c.icon size={16} />
            {c.label}
          </button>
        )
      })}
    </div>
  )
}
