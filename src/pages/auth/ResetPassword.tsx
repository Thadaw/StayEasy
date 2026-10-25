import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { KeyRound } from 'lucide-react'
import bgImage from '@/assets/images/background.png'

export default function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const isHost = location.pathname.startsWith('/host')

  useEffect(() => {
    document.body.style.background = 'transparent'
    document.documentElement.style.background = '#000'
    return () => {
      document.body.style.background = ''
      document.documentElement.style.background = ''
    }
  }, [])

  const loginPath = isHost ? '/host/login' : '/login'
  const forgotPath = isHost ? '/host/forgot-password' : '/forgot-password'

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        fontFamily: "'Segoe UI', sans-serif",
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      />
      <div
        style={{
          width: '100%',
          maxWidth: 460,
          background: '#fff',
          borderRadius: 16,
          display: 'flex',
          flexDirection: 'column',
          padding: '32px 24px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
          zIndex: 1,
          position: 'relative',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#eef2ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
            }}
          >
            <KeyRound size={30} color="#111" />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 6 }}>
            Reset via temporary password
          </div>
          <p style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>
            Password reset links are no longer used. Request a temporary password by email, log in with
            it, then set a new password when prompted.
          </p>
        </div>

        <button
          onClick={() => navigate(forgotPath)}
          style={{
            width: '100%',
            padding: 11,
            background: '#111',
            border: 'none',
            borderRadius: 8,
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Request a temporary password
        </button>

        <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: '#aaa' }}>
          Remembered it?{' '}
          <span
            onClick={() => navigate(loginPath)}
            style={{ color: '#111', fontWeight: 600, cursor: 'pointer' }}
          >
            Back to login
          </span>
        </div>
      </div>
    </div>
  )
}
