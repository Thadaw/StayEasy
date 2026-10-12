import { SETTINGS_TABS } from './demoSettings'

interface SettingsNavProps {
  active: string
  onChange: (id: string) => void
}

export default function SettingsNav({ active, onChange }: SettingsNavProps) {
  return (
    <nav className="s-nav">
      <div className="s-nav-label">Settings</div>
      {SETTINGS_TABS.map((tab) => {
        const Icon = tab.icon
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`s-nav-item${isActive ? ' active' : ''}`}
          >
            <Icon size={16} />
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
