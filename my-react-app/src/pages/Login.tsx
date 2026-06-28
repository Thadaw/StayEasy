import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import BuildingScene from '../components/BuildingScene'
import api from '../api'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isHost = searchParams.get('host') === 'true'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [pwFocused, setPwFocused] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // true once the businessman should be triggered to walk in
  const [loginClicked, setLoginClicked] = useState(false)

  const fieldsReady = email.trim().length > 0 && password.trim().length > 0

  const handleLogin = async () => {
    setError('')
    setLoading(true)
    setLoginClicked(true) // kick off the door animation immediately

    try {
      const form = new FormData()
      form.append('username', email)
      form.append('password', password)
      const res = await api.post('/api/v1/auth/users/login', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      localStorage.setItem('token', res.data.access_token)
      setTimeout(() => navigate(isHost ? '/host/portal' : '/'), 1700)
    } catch {
      setError('Invalid email or password.')
      setLoginClicked(false) // let him walk back out if login failed
      setLoading(false)
    }
  }

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
          width: 640,
          height: 440,
          background: '#fff',
          borderRadius: 16,
          display: 'flex',
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.13)',
        }}
      >
        {/* Animated scene panel */}
        <div style={{ width: '50%', background: '#dde0ee', order: 1, flexShrink: 0 }}>
          <BuildingScene
            mode="login"
            fieldsReady={fieldsReady}
            loginClicked={loginClicked}
            passwordFocused={pwFocused}
            passwordVisible={showPw}
          />
        </div>

        {/* Form panel */}
        <div
          style={{
            width: '50%',
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '36px 32px',
            order: 2,
            flexShrink: 0,
          }}
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
              onClick={() => navigate(isHost ? '/signup?host=true' : '/signup')}
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
              onFocus={() => setPwFocused(false)}
              placeholder="you@example.com"
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
              onFocus={() => setPwFocused(true)}
              onBlur={() => setPwFocused(false)}
              placeholder="••••••••"
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
              👁
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
              Remember for 30 days
            </label>
            <span style={{ fontSize: 11, color: '#bbb', cursor: 'pointer', marginLeft: 'auto' }}>
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
              onClick={() => navigate(isHost ? '/signup?host=true' : '/signup')}
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
