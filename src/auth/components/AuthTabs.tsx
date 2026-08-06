interface AuthTabsProps {
  activeTab: 'login' | 'signup'
  onTabChange: (tab: 'login' | 'signup') => void
}

export function AuthTabs({ activeTab, onTabChange }: AuthTabsProps) {
  return (
    <div className="flex mb-2">
      <button
        onClick={() => onTabChange('login')}
        className={`py-[3px] text-[11px] font-bold tracking-[0.8px] uppercase border-b-2 mr-[18px] bg-transparent cursor-pointer ${
          activeTab === 'login'
            ? 'text-black border-black'
            : 'text-[#ccc] border-transparent'
        }`}
      >
        Login
      </button>
      <button
        onClick={() => onTabChange('signup')}
        className={`py-[3px] text-[11px] font-bold tracking-[0.8px] uppercase border-b-2 bg-transparent cursor-pointer ${
          activeTab === 'signup'
            ? 'text-black border-black'
            : 'text-[#ccc] border-transparent'
        }`}
      >
        Sign up
      </button>
    </div>
  )
}
