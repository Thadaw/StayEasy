import { useState } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { AxiosError } from 'axios'
import { Eye, EyeOff } from 'lucide-react'
import api from '../services/axios'
import { useAuth } from './AuthContext'
import { usePropertyStore } from '../stores/propertyStore'
import loginAni from '../assets/login.mp4'
import bgImage from '../assets/background.png'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function extractError(err: unknown): string {
  if (err instanceof AxiosError && err.response?.data) {
    const data = err.response.data as Record<string, unknown>
    if (typeof data.detail === 'string') return data.detail
    if (typeof data.message === 'string') return data.message
  }
  return 'Invalid email or password.'
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const { login: authLogin } = useAuth()
  const { setCurrentPropertyId } = usePropertyStore()
  const isHost = location.pathname.startsWith('/host') || searchParams.get('host') === 'true'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(true)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setError('')

    if (!email.trim()) { setError('Email is required.'); return }
    if (!password.trim()) { setError('Password is required.'); return }
    if (!EMAIL_RE.test(email)) { setError('Please enter a valid email address.'); return }

    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('grant_type', 'password')
      params.append('username', email)
      params.append('password', password)
      const res = await api.post('/auth/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })

      const responseRole = res.data.role
      const isStaff = responseRole === 'front_desk'
      const userRole = isStaff ? 'staff' : isHost ? 'host' : 'guest'

      await authLogin(res.data.access_token, isStaff ? true : remember, userRole, res.data.refresh_token, res.data.must_change_password, res.data.temp_password)

      if (isStaff && res.data.property?.id) {
        setCurrentPropertyId(res.data.property.id)
      }

      const redirectTo = searchParams.get('redirect')
      const isAuthPage =
        redirectTo === '/login' || redirectTo === '/signup' || redirectTo === '/host/login' || redirectTo === '/host/signup'
      const isValidRedirect = redirectTo
        && redirectTo.startsWith('/')
        && !redirectTo.startsWith('//')
        && !redirectTo.includes('://')
        && !isAuthPage
        && (redirectTo.startsWith('/host') === isHost)
      if (isValidRedirect) {
        setTimeout(() => navigate(redirectTo), 800)
        return
      }
      if (isStaff) {
        setTimeout(() => navigate('/frontdesk'), 800)
      } else {
        setTimeout(() => navigate(isHost ? '/host/overall-dashboard' : '/'), 800)
      }
    } catch (err) {
      setError(extractError(err))
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
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
          maxWidth: 820,
          background: '#fff',
          borderRadius: 16,
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
          zIndex: 1,
          position: 'relative',
          flexWrap: 'wrap',
        }}
      >
        {/* Animated video panel — on the LEFT for login, hidden on mobile */}
        <div
          style={{
            background: '#000',
            order: 1,
            flexShrink: 0,
            overflow: 'hidden',
          }}
          className="hidden sm:block sm:w-1/2"
        >
          <video
            src={loginAni}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: 280 }}
          />
        </div>

        {/* Form panel */}
        <div
          style={{
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '28px 24px 32px',
            order: 2,
            flexShrink: 0,
            boxSizing: 'border-box',
          }}
          className="w-full sm:w-1/2"
        >
          {/* Tabs */}
          <div style={{ display: 'flex', marginBottom: 8 }}>
            <div
              style={{
                padding: '3px 0',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                color: '#111',
                borderBottom: '2px solid #111',
                marginRight: 18,
              }}
            >
              Login
            </div>
            <div
              onClick={() => navigate(isHost ? '/host/signup' : '/signup')}
              style={{
                padding: '3px 0',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                color: '#ccc',
                borderBottom: '2px solid transparent',
                cursor: 'pointer',
              }}
            >
              Sign up
            </div>
          </div>

          <div style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 3 }}>
            {isHost ? 'Welcome Back, Host' : 'Welcome back!'}
          </div>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 20 }}>
            {isHost ? 'Manage your properties' : 'Please enter your details'}
          </div>

          {/* Email */}
          <div style={{ position: 'relative', marginBottom: 13 }}>
            <label
              style={{
                fontSize: 11,
                color: '#666',
                marginBottom: 3,
                display: 'block',
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="Enter your email"
              autoComplete="off"
              style={{
                width: '100%',
                border: 'none',
                borderBottom: '1.5px solid #ddd',
                padding: '7px 26px 7px 0',
                fontSize: 14,
                color: '#111',
                outline: 'none',
                background: 'transparent',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Password */}
          <div style={{ position: 'relative', marginBottom: 13 }}>
            <label
              style={{
                fontSize: 11,
                color: '#666',
                marginBottom: 3,
                display: 'block',
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
              }}
            >
              Password
            </label>
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="Set your password"
              autoComplete="off"
              style={{
                width: '100%',
                border: 'none',
                borderBottom: '1.5px solid #ddd',
                padding: '7px 26px 7px 0',
                fontSize: 14,
                color: '#111',
                outline: 'none',
                background: 'transparent',
                boxSizing: 'border-box',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPw(p => !p)}
              aria-label="Toggle password visibility"
              style={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#bbb',
                fontSize: 15,
                padding: 0,
              }}
            >
              {showPw ? <Eye size={15} /> : <EyeOff size={15} />}
            </button>
          </div>

          {/* Remember / forgot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 13 }}>
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              style={{ width: 12, height: 12, accentColor: '#111' }}
            />
            <label htmlFor="remember" style={{ fontSize: 11, color: '#999' }}>
              Remember me
            </label>
            <span
              onClick={() => navigate(isHost ? '/host/forgot-password' : '/forgot-password')}
              style={{ fontSize: 11, color: '#bbb', cursor: 'pointer', marginLeft: 'auto' }}
            >
              Forgot password?
            </span>
          </div>

          {error && (
            <p style={{ color: '#e94560', fontSize: 12, marginBottom: 10 }}>{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: 11,
              background: '#111',
              border: 'none',
              borderRadius: 8,
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? 'default' : 'pointer',
              marginTop: 2,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Signing in...' : 'Log In'}
          </button>

          <div style={{ textAlign: 'center', marginTop: 11, fontSize: 12, color: '#aaa' }}>
            Don't have an account?{' '}
            <span
              onClick={() => navigate(isHost ? '/host/signup' : '/signup')}
              style={{ color: '#111', fontWeight: 600, cursor: 'pointer' }}
            >
              Sign up
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
