import { AlertTriangle, ArrowLeftRight } from 'lucide-react'
import { CATEGORY_COLORS, type ApprovalRequest, type SwapPerson } from './demoApprovals'
import { getInitials } from './demoStaff'

const avatarStyle: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: '50%',
  background: '#e8eef7',
  color: '#0f2137',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 12,
  fontWeight: 600,
  flexShrink: 0,
}

const datePillStyle: React.CSSProperties = {
  flex: '1 1 180px',
  padding: '10px 12px',
  borderRadius: 8,
  background: '#f1f5f9',
  fontSize: 13,
  fontWeight: 600,
  color: '#111827',
  textAlign: 'center',
}

const buttonStyle: React.CSSProperties = {
  flex: '1 1 140px',
  padding: '11px 16px',
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
}

function coverageStyle(coverage: string): React.CSSProperties {
  const ok = coverage === 'Coverage OK'
  return {
    padding: '4px 10px',
    borderRadius: 999,
    background: ok ? '#ecfdf5' : '#fff7ed',
    color: ok ? '#059669' : '#c2410c',
    fontSize: 11,
    fontWeight: 600,
    whiteSpace: 'nowrap',
    flexShrink: 0,
  }
}

function PersonBlock({ person }: { person: SwapPerson }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '1 1 0', minWidth: 0 }}>
      <div style={avatarStyle}>{getInitials(person.name)}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{person.name}</div>
        <div style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', marginTop: 1 }}>
          {person.department} · {person.position}
        </div>
      </div>
    </div>
  )
}

interface ApprovalRequestCardProps {
  request: ApprovalRequest
  onDecide: (approved: boolean) => void
}

export default function ApprovalRequestCard({ request, onDecide }: ApprovalRequestCardProps) {
  const approveLabel = request.kind === 'swap' ? 'Approve Swap' : 'Approve'

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 16,
        marginBottom: 14,
      }}
    >
      {request.kind === 'leave' ? (
        <LeaveHeader request={request} />
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <PersonBlock person={request.personA} />
          <ArrowLeftRight size={16} color="#9ca3af" style={{ flexShrink: 0 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '1 1 0', minWidth: 0, justifyContent: 'flex-end' }}>
            <div style={avatarStyle}>{getInitials(request.personB.name)}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{request.personB.name}</div>
              <div style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', marginTop: 1 }}>
                {request.personB.department} · {request.personB.position}
              </div>
            </div>
          </div>
        </div>
      )}

      {request.kind === 'swap' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
          <div style={datePillStyle}>{request.personA.shift}</div>
          <span style={{ color: '#9ca3af', fontSize: 15, flexShrink: 0 }}>→</span>
          <div style={datePillStyle}>{request.personB.shift}</div>
        </div>
      )}

      {request.kind === 'leave' && (
        <div
          style={{
            display: 'inline-block',
            marginTop: 12,
            padding: '4px 10px',
            borderRadius: 999,
            background: (CATEGORY_COLORS[request.category] ?? CATEGORY_COLORS.PERSONAL).background,
            color: (CATEGORY_COLORS[request.category] ?? CATEGORY_COLORS.PERSONAL).color,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        >
          {request.category}
        </div>
      )}

      {request.kind === 'leave' && request.banner && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 10,
            padding: '9px 12px',
            borderRadius: 8,
            background: '#fff7ed',
            border: '1px solid #fed7aa',
            fontSize: 12.5,
            color: '#c2410c',
          }}
        >
          <AlertTriangle size={14} color="#ea580c" style={{ flexShrink: 0 }} />
          {request.banner}
        </div>
      )}

      {request.kind === 'leave' && (
        <p style={{ margin: '12px 0 0', fontSize: 13, color: '#374151', lineHeight: 1.55 }}>
          {request.body}
        </p>
      )}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 10,
          marginTop: 14,
        }}
      >
        <div style={{ fontSize: 12, color: '#9ca3af', minWidth: 0 }}>
          {request.kind === 'leave' ? (
            <>
              <div>
                Reason: <span style={{ color: '#374151', fontWeight: 600 }}>{request.reason}</span>
              </div>
              <div style={{ marginTop: 4 }}>
                Notes: <span style={{ color: '#374151', fontWeight: 600 }}>{request.notes}</span>
              </div>
            </>
          ) : (
            <div>
              Reason: <span style={{ color: '#374151', fontWeight: 600 }}>{request.reason}</span>
            </div>
          )}
        </div>
        <span style={coverageStyle(request.coverage)}>{request.coverage}</span>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <button
          onClick={() => onDecide(false)}
          style={{ ...buttonStyle, background: '#fff', border: '1px solid #111827', color: '#111827' }}
        >
          Reject
        </button>
        <button
          onClick={() => onDecide(true)}
          style={{ ...buttonStyle, background: '#111827', border: '1px solid #111827', color: '#fff' }}
        >
          {approveLabel}
        </button>
      </div>
    </div>
  )
}

function LeaveHeader({ request }: { request: Extract<ApprovalRequest, { kind: 'leave' }> }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={avatarStyle}>{getInitials(request.name)}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{request.name}</div>
          <div style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', marginTop: 1 }}>
            {request.department} · {request.position}
          </div>
        </div>
      </div>
      <div style={{ ...datePillStyle, display: 'block', marginTop: 14 }}>{request.date}</div>
    </>
  )
}
