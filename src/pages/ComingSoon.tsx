import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function ComingSoon() {
  const location = useLocation()
  const navigate = useNavigate()

  const title = location.pathname
    .replace('/', '')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#e8e8e8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          width: 420,
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 8px 40px rgba(0,0,0,0.13)',
          padding: '48px 32px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: '#dde0ee',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: 28,
          }}
        >
          ⏳
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', margin: '0 0 8px' }}>
          {title || 'Page'}
        </h1>
        <p style={{ fontSize: 14, color: '#999', margin: '0 0 28px' }}>
          This page is coming soon. We're working on it!
        </p>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 24px',
            background: '#111',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={15} />
          Go Back
        </button>
      </div>
    </div>
  )
}
