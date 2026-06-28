import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import BuildingScene from '../components/BuildingScene'
import api from '../api'

export default function Signup() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isHost = searchParams.get('host') === 'true'
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [pwFocused, setPwFocused] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    setError('')
    setLoading(true)
    try {
      await api.post('/api/v1/auth/users/register', {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      })
      navigate(isHost ? '/host/portal' : '/login')
    } catch {
      setError('Could not create account. Please check your details and try again.')
    } finally {
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
        {/* Form panel — on the LEFT for sign up */}
        <div
          style={{
            width: '50%',
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '36px 32px',
            order: 1,
            flexShrink: 0,
          }}
        >
          {/* Tabs */}
          <div style={{ display: 'flex', marginBottom: 8 }}>
            <div
              onClick={() => navigate(isHost ? '/login?host=true' : '/login')}
              style={{
                padding: '3px 0',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                color: '#ccc',
                borderBottom: '2px solid transparent',
                marginRight: 18,
                cursor: 'pointer',
              }}
            >
              Login
            </div>
            <div
              style={{
                padding: '3px 0',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                color: '#111',
                borderBottom: '2px solid #111',
              }}
            >
              Sign up
            </div>
          </div>

          <div style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 3 }}>
            {isHost ? 'Become a Host' : 'Create account'}
          </div>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 20 }}>
            {isHost ? 'Start listing your property today' : 'Start finding your stay today'}
          </div>

          {/* First + last name */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 13 }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  fontSize: 11, color: '#666', marginBottom: 3, display: 'block',
                  textTransform: 'uppercase', letterSpacing: '0.4px',
                }}
              >
                First name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                onFocus={() => setPwFocused(false)}
                placeholder="Samip"
                autoComplete="off"
                style={{
                  width: '100%', border: 'none', borderBottom: '1.5px solid #ddd',
                  padding: '7px 4px 7px 0', fontSize: 14, color: '#111', outline: 'none', background: 'transparent',
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  fontSize: 11, color: '#666', marginBottom: 3, display: 'block',
                  textTransform: 'uppercase', letterSpacing: '0.4px',
                }}
              >
                Last name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                onFocus={() => setPwFocused(false)}
                placeholder="Khatri"
                autoComplete="off"
                style={{
                  width: '100%', border: 'none', borderBottom: '1.5px solid #ddd',
                  padding: '7px 4px 7px 0', fontSize: 14, color: '#111', outline: 'none', background: 'transparent',
                }}
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ position: 'relative', marginBottom: 13 }}>
            <label
              style={{
                fontSize: 11, color: '#666', marginBottom: 3, display: 'block',
                textTransform: 'uppercase', letterSpacing: '0.4px',
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
                width: '100%', border: 'none', borderBottom: '1.5px solid #ddd',
                padding: '7px 26px 7px 0', fontSize: 14, color: '#111', outline: 'none', background: 'transparent',
              }}
            />
          </div>

          {/* Password */}
          <div style={{ position: 'relative', marginBottom: 13 }}>
            <label
              style={{
                fontSize: 11, color: '#666', marginBottom: 3, display: 'block',
                textTransform: 'uppercase', letterSpacing: '0.4px',
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
                width: '100%', border: 'none', borderBottom: '1.5px solid #ddd',
                padding: '7px 26px 7px 0', fontSize: 14, color: '#111', outline: 'none', background: 'transparent',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPw(p => !p)}
              aria-label="Toggle password visibility"
              style={{
                position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', fontSize: 15, padding: 0,
              }}
            >
              👁
            </button>
          </div>
          <div style={{ fontSize: 11, color: '#bbb', marginTop: -8, marginBottom: 13 }}>
            Must be 8+ characters with a number and a special character.
          </div>

          {error && (
            <p style={{ color: '#e94560', fontSize: 12, marginBottom: 10 }}>{error}</p>
          )}

          <button
            onClick={handleSignup}
            disabled={loading}
            style={{
              width: '100%', padding: 11, background: '#111', border: 'none', borderRadius: 8,
              color: '#fff', fontSize: 14, fontWeight: 600, cursor: loading ? 'default' : 'pointer',
              marginTop: 2, opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <div style={{ textAlign: 'center', marginTop: 11, fontSize: 12, color: '#aaa' }}>
            Already have an account?{' '}
            <span
              onClick={() => navigate(isHost ? '/login?host=true' : '/login')}
              style={{ color: '#111', fontWeight: 600, cursor: 'pointer' }}
            >
              Log in
            </span>
          </div>
        </div>

        {/* Animated scene panel — on the RIGHT for sign up */}
        <div style={{ width: '50%', background: '#dde0ee', order: 2, flexShrink: 0 }}>
          <BuildingScene mode="signup" passwordFocused={pwFocused} passwordVisible={showPw} />
        </div>
      </div>
    </div>
  )
}
