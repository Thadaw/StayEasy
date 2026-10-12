import { ChevronLeft, ChevronRight } from 'lucide-react'

function getPageItems(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set<number>([1, total, current, current - 1, current + 1])
  if (current <= 3) [2, 3].forEach((p) => pages.add(p))
  if (current >= total - 2) [total - 2, total - 1].forEach((p) => pages.add(p))
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const items: (number | '…')[] = []
  let prev = 0
  for (const p of sorted) {
    if (prev && p - prev > 1) items.push('…')
    items.push(p)
    prev = p
  }
  return items
}

const pageButtonStyle = (active: boolean): React.CSSProperties => ({
  minWidth: 32,
  height: 32,
  padding: '0 8px',
  borderRadius: 6,
  border: 'none',
  background: active ? '#111827' : 'transparent',
  color: active ? '#fff' : '#374151',
  fontSize: 13,
  fontWeight: active ? 600 : 500,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

interface TableFooterProps {
  from: number
  to: number
  total: number
  unit: string
  page: number
  pageCount: number
  onPage: (page: number) => void
}

export default function TableFooter({ from, to, total, unit, page, pageCount, onPage }: TableFooterProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        padding: '14px 20px',
      }}
    >
      <div style={{ fontSize: 13, color: '#6b7280' }}>
        Showing {from} to {to} of {total} {unit}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button
          onClick={() => onPage(Math.max(1, page - 1))}
          disabled={page <= 1}
          style={{ ...pageButtonStyle(false), opacity: page <= 1 ? 0.4 : 1 }}
        >
          <ChevronLeft size={15} />
        </button>
        {getPageItems(page, pageCount).map((item, index) =>
          item === '…' ? (
            <span key={`gap-${index}`} style={{ padding: '0 4px', fontSize: 13, color: '#9ca3af' }}>
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPage(item)}
              style={pageButtonStyle(item === page)}
              onMouseEnter={(e) => {
                if (item !== page) e.currentTarget.style.background = '#f3f4f6'
              }}
              onMouseLeave={(e) => {
                if (item !== page) e.currentTarget.style.background = 'transparent'
              }}
            >
              {item}
            </button>
          ),
        )}
        <button
          onClick={() => onPage(Math.min(pageCount, page + 1))}
          disabled={page >= pageCount}
          style={{ ...pageButtonStyle(false), opacity: page >= pageCount ? 0.4 : 1 }}
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}
