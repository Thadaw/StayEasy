import type { ActivityModule } from '../../types/activity'

interface ActivityRecentByModuleProps {
  modules: ActivityModule[]
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Calendar: (props: any) => (
    <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke={props.color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>
    </svg>
  ),
  Users: (props: any) => (
    <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke={props.color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Bed: (props: any) => (
    <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke={props.color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>
    </svg>
  ),
  CreditCard: (props: any) => (
    <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke={props.color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>
    </svg>
  ),
  Sparkles: (props: any) => (
    <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke={props.color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  ),
}

export default function ActivityRecentByModule({ modules }: ActivityRecentByModuleProps) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB',
      padding: 20, marginBottom: 16,
    }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>Recent Activities by Module</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {modules.map((mod, idx) => {
          const Icon = iconMap[mod.icon] || iconMap.Calendar
          return (
            <div key={idx} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 0',
              borderBottom: idx < modules.length - 1 ? '1px solid #F3F4F6' : 'none',
            }}>
              <Icon size={16} color={mod.color} />
              <span style={{ fontSize: 14, color: '#374151', flex: 1 }}>{mod.name}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{mod.count}</span>
            </div>
          )
        })}
      </div>

      <button style={{
        width: '100%', marginTop: 16, padding: '10px 16px',
        border: '1px solid #E5E7EB', borderRadius: 8, background: '#fff',
        fontSize: 14, fontWeight: 500, color: 'var(--primary)', cursor: 'pointer',
        textAlign: 'center',
      }}>
        View full report
      </button>
    </div>
  )
}
