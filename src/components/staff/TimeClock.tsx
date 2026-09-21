import { useState, useEffect } from 'react'

export default function TimeClock() {
  const [time, setTime] = useState(new Date())
  const [isClockedIn, setIsClockedIn] = useState(false)
  const [clockInTime, setClockInTime] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const hours = time.getHours()
  const minutes = time.getMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const formatTime = (date: Date) => {
    const h = date.getHours()
    const m = date.getMinutes().toString().padStart(2, '0')
    const s = date.getSeconds().toString().padStart(2, '0')
    const ap = h >= 12 ? 'PM' : 'AM'
    const dh = h % 12 || 12
    return `${dh}:${m}:${s} ${ap}`
  }

  const showToastMessage = (msg: string) => {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleCheckIn = () => {
    setIsClockedIn(true)
    setClockInTime(formatTime(time))
    showToastMessage(`Clocked in at ${formatTime(time)}`)
  }

  const handleCheckOut = () => {
    setIsClockedIn(false)
    showToastMessage(`Clocked out at ${formatTime(time)}`)
    setClockInTime(null)
  }

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
        padding: 20,
        textAlign: 'center',
        position: 'relative',
      }}
    >
      {/* Toast Notification */}
      {showToast && (
        <div
          style={{
            position: 'absolute',
            top: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#10B981',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            zIndex: 10,
            whiteSpace: 'nowrap',
          }}
        >
          {toastMessage}
        </div>
      )}

      <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
        TIME CLOCK
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4, marginBottom: 4 }}>
        <span style={{ fontSize: 42, fontWeight: 700, color: '#111827', lineHeight: 1 }}>
          {displayHours}:{minutes}
        </span>
        <span style={{ fontSize: 18, fontWeight: 600, color: '#6B7280' }}>
          {ampm}
        </span>
      </div>

      <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 20 }}>
        {days[time.getDay()]}, {months[time.getMonth()]} {time.getDate()}, {time.getFullYear()}
      </div>

      {/* Status Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          borderRadius: 20,
          background: isClockedIn ? '#D1FAE5' : '#F3F4F6',
          color: isClockedIn ? '#065F46' : '#6B7280',
          fontSize: 12,
          fontWeight: 600,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: isClockedIn ? '#10B981' : '#9CA3AF',
          }}
        />
        {isClockedIn ? 'Clocked In' : 'Not Clocked In'}
      </div>

      {/* Clock In Time Display */}
      {isClockedIn && clockInTime && (
        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 16 }}>
          Clocked in at {clockInTime}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={handleCheckIn}
          disabled={isClockedIn}
          style={{
            flex: 1,
            padding: '10px 0',
            borderRadius: 8,
            border: 'none',
            background: isClockedIn ? '#D1FAE5' : '#10B981',
            color: isClockedIn ? '#065F46' : '#fff',
            fontSize: 13,
            fontWeight: 600,
            cursor: isClockedIn ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s',
            opacity: isClockedIn ? 0.7 : 1,
          }}
          onMouseEnter={(e) => { if (!isClockedIn) e.currentTarget.style.background = '#059669' }}
          onMouseLeave={(e) => { if (!isClockedIn) e.currentTarget.style.background = '#10B981' }}
        >
          {isClockedIn ? 'Checked In' : 'Check In'}
        </button>
        <button
          onClick={handleCheckOut}
          disabled={!isClockedIn}
          style={{
            flex: 1,
            padding: '10px 0',
            borderRadius: 8,
            border: isClockedIn ? '1px solid #FEE2E2' : '1px solid #E5E7EB',
            background: isClockedIn ? '#FEE2E2' : '#F3F4F6',
            color: isClockedIn ? '#DC2626' : '#9CA3AF',
            fontSize: 13,
            fontWeight: 600,
            cursor: isClockedIn ? 'pointer' : 'not-allowed',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => { if (isClockedIn) e.currentTarget.style.background = '#FECACA' }}
          onMouseLeave={(e) => { if (isClockedIn) e.currentTarget.style.background = '#FEE2E2' }}
        >
          Clock Out
        </button>
      </div>
    </div>
  )
}
