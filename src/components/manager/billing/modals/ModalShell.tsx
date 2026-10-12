import { useEffect } from 'react'

interface ModalShellProps {
  title: string
  subtitle: string
  onClose: () => void
  width?: number
  children: React.ReactNode
  footer?: React.ReactNode
}

export default function ModalShell({ title, subtitle, onClose, width = 460, children, footer }: ModalShellProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
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
          borderRadius: 16,
          width,
          maxWidth: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: 24,
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}
      >
        <h3 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: '#111827' }}>{title}</h3>
        <p style={{ margin: '0 0 20px', fontSize: 13, color: '#9ca3af' }}>{subtitle}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>

        {footer}
      </div>
    </div>
  )
}
