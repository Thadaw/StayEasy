import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import * as pmsApi from '../services/pmsApi'

export default function TenantSetup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const tenant = await pmsApi.getTenant()
        if (tenant && tenant.name) {
          navigate('/', { replace: true })
          return
        }
      } catch {
        // no tenant yet — show form
      }
      setChecking(false)
    })()
  }, [navigate])

  const validate = (value: string): string | null => {
    const trimmed = value.trim()

    if (!trimmed) {
      return 'Tenant / brand name is required.'
    }

    if (/^\d+$/.test(trimmed)) {
      return 'Tenant name cannot contain only numbers.'
    }

    if (trimmed.length < 2) {
      return 'Tenant name must be at least 2 characters.'
    }

    if (trimmed.length > 50) {
      return 'Tenant name must be 50 characters or less.'
    }

    return null
  }

  const handleSubmit = async () => {
    const trimmed = name.trim()
    const validationError = validate(trimmed)
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError('')

    try {
      await pmsApi.createTenant(trimmed)
      navigate('/host/portal', { state: { skipAuth: true } })
    } catch (err) {
      let message = 'Something went wrong. Please try again.'

      if (err instanceof AxiosError && err.response) {
        const status = err.response.status
        const raw = err.response.data

        console.error('Tenant API error:', status, raw)

        const extractMsg = (obj: unknown): string | null => {
          if (typeof obj === 'string') return obj
          if (Array.isArray(obj) && obj.length > 0) return extractMsg(obj[0])
          if (obj && typeof obj === 'object') {
            for (const key of ['detail', 'message', 'error', 'name', 'non_field_errors']) {
              if (key in obj) {
                const val = (obj as Record<string, unknown>)[key]
                const found = extractMsg(val)
                if (found) return found
              }
            }
            const vals = Object.values(obj)
            for (const v of vals) {
              const found = extractMsg(v)
              if (found) return found
            }
          }
          return null
        }

        if (status === 400 || status === 409) {
          const serverMsg = extractMsg(raw)
          const lower = (serverMsg || '').toLowerCase()

          if (lower.includes('already exist') || lower.includes('already taken') || lower.includes('unique')) {
            message = 'This tenant name is already taken. Please choose another.'
          } else if (serverMsg) {
            message = serverMsg
          } else {
            message = 'Invalid tenant name. Please check and try again.'
          }
        } else if (status === 401) {
          message = 'Your session has expired. Please log in again.'
        } else if (status >= 500) {
          message = 'Server error. Please try again later.'
        }
      }

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--background)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 24,
            height: 24,
            border: '2px solid var(--border)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 12px',
          }} />
          <p style={{ fontSize: 14, color: 'var(--muted-foreground)' }}>Checking account...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--background)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        width: 420,
        background: '#fff',
        borderRadius: 16,
        padding: '36px 32px 42px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.13)',
      }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--foreground)', marginBottom: 3 }}>
          Name your brand
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 20 }}>
          This will be your tenant name for managing properties
        </div>

        <div style={{ marginBottom: 13 }}>
          <label style={{
            fontSize: 11,
            color: 'var(--muted-foreground)',
            marginBottom: 3,
            display: 'block',
            textTransform: 'uppercase',
            letterSpacing: '0.4px',
          }}>
            Tenant / Brand name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => {
              setName(e.target.value)
              if (error) setError('')
            }}
            placeholder="e.g. Sunset Hospitality"
            autoComplete="off"
            disabled={loading}
            style={{
              width: '100%',
              border: 'none',
              borderBottom: error ? '1.5px solid var(--destructive)' : '1.5px solid var(--border)',
              padding: '7px 4px 7px 0',
              fontSize: 14,
              color: 'var(--foreground)',
              outline: 'none',
              background: 'transparent',
            }}
          />
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 8,
            marginBottom: 12,
          }}>
            <span style={{ color: '#991b1b', fontSize: 14 }}>&#9888;</span>
            <p style={{ color: '#991b1b', fontSize: 12, margin: 0 }}>{error}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            padding: 11,
            background: loading ? 'var(--muted)' : 'var(--foreground)',
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
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span style={{
                width: 14,
                height: 14,
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                display: 'inline-block',
              }} />
              Setting up...
            </span>
          ) : (
            'Continue'
          )}
        </button>
      </div>
    </div>
  )
}
