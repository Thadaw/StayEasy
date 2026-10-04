import { useEffect, useState } from 'react'
import { NATIONALITY_OPTIONS, GUEST_TYPE_OPTIONS, type GuestRow } from './demoGuests'

export interface NewGuestInput {
  name: string
  phone: string
  email: string
  nationality: string
  guestType: GuestRow['type']
  idPassport: string
  dob: string
  specialRequests: string
  internalNote: string
}

interface AddGuestModalProps {
  onClose: () => void
  onSave: (values: NewGuestInput) => void
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #e5e7eb',
  background: '#fff',
  fontSize: 13,
  color: '#374151',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 500,
  color: '#6b7280',
  marginBottom: 6,
  display: 'block',
}

const fieldStyle: React.CSSProperties = {
  minWidth: 0,
}

const nationalityOptions = NATIONALITY_OPTIONS.filter((n) => n !== 'All Nationalities')
const guestTypeOptions = GUEST_TYPE_OPTIONS.filter((t) => t !== 'All Guest Types')
const dobOptions = ['12 Aug 1991', '04 Mar 1988', '22 Nov 1994', '15 Jun 1979', '30 Jan 2001']

export default function AddGuestModal({ onClose, onSave }: AddGuestModalProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [nationality, setNationality] = useState(nationalityOptions[0] ?? 'United States')
  const [guestType, setGuestType] = useState(guestTypeOptions[0] ?? 'Regular')
  const [idPassport, setIdPassport] = useState('')
  const [dob, setDob] = useState(dobOptions[0] ?? '')
  const [specialRequests, setSpecialRequests] = useState('')
  const [internalNote, setInternalNote] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const submit = () => {
    if (!firstName.trim() || !lastName.trim()) {
      return setError('First name and last name are required.')
    }
    onSave({
      name: `${firstName.trim()} ${lastName.trim()}`,
      phone: phone.trim() || '—',
      email: email.trim() || '—',
      nationality,
      guestType: guestType as GuestRow['type'],
      idPassport: idPassport.trim(),
      dob,
      specialRequests: specialRequests.trim(),
      internalNote: internalNote.trim(),
    })
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: 28,
          width: 560,
          maxWidth: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}
      >
        <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px', color: '#111827' }}>
          Add New Guest
        </h3>
        <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 20px' }}>
          Create a guest profile for future and current stays.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 14,
          }}
        >
          <div style={fieldStyle}>
            <label style={labelStyle}>First Name</label>
            <input
              style={inputStyle}
              placeholder="John"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value)
                setError('')
              }}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Last Name</label>
            <input
              style={inputStyle}
              placeholder="Smith"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value)
                setError('')
              }}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Phone</label>
            <input
              style={inputStyle}
              placeholder="+1 415 832 5682"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Email</label>
            <input
              style={inputStyle}
              type="email"
              placeholder="john.smith@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Nationality</label>
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
            >
              {nationalityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Guest Type</label>
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={guestType}
              onChange={(e) => setGuestType(e.target.value)}
            >
              {guestTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>ID / Passport</label>
            <input
              style={inputStyle}
              placeholder="P-8824192"
              value={idPassport}
              onChange={(e) => setIdPassport(e.target.value)}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Date of Birth</label>
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            >
              {dobOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Special Requests</label>
            <input
              style={inputStyle}
              placeholder="Airport pickup, high floor, dietary preferences…"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
            />
          </div>

          <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Internal Note</label>
            <input
              style={inputStyle}
              placeholder="Optional note visible to hotel staff only"
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
            />
          </div>

          {error && (
            <div
              style={{
                gridColumn: '1 / -1',
                fontSize: 13,
                color: '#dc2626',
                background: '#fef2f2',
                padding: '10px 12px',
                borderRadius: 8,
              }}
            >
              {error}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 22px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              background: '#fff',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              color: '#374151',
            }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            style={{
              padding: '10px 22px',
              borderRadius: 8,
              border: 'none',
              background: '#111827',
              color: '#fff',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Add Guest
          </button>
        </div>
      </div>
    </div>
  )
}
