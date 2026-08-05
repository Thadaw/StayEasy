import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const items = [
  { image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=60&h=60&fit=crop', name: 'Chicken Pizza', category: 'Pizza', sold: 48, revenue: 'NPR 33,600' },
  { image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=60&h=60&fit=crop', name: 'Cheese Burger', category: 'Burger', sold: 36, revenue: 'NPR 18,000' },
  { image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=60&h=60&fit=crop', name: 'Pasta Alfredo', category: 'Pasta', sold: 29, revenue: 'NPR 14,500' },
  { image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=60&h=60&fit=crop', name: 'Cappuccino', category: 'Beverage', sold: 27, revenue: 'NPR 6,750' },
  { image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=60&h=60&fit=crop', name: 'Chocolate Lava Cake', category: 'Dessert', sold: 22, revenue: 'NPR 7,700' },
]

export default function TopSellingItems() {
  const [period] = useState('This Week')

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Top Selling Items</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: 'var(--foreground)' }}>
          {period}
          <ChevronDown size={14} />
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            <th style={{ textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', padding: '8px 0' }}>ITEM</th>
            <th style={{ textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', padding: '8px 0' }}>CATEGORY</th>
            <th style={{ textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', padding: '8px 0' }}>SOLD</th>
            <th style={{ textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', padding: '8px 0' }}>REVENUE</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.name} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '12px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }}
                />
                <span style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</span>
              </td>
              <td style={{ padding: '12px 0', fontSize: 13 }}>{item.category}</td>
              <td style={{ padding: '12px 0', fontSize: 13 }}>{item.sold}</td>
              <td style={{ padding: '12px 0', fontSize: 13, fontWeight: 600 }}>{item.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
