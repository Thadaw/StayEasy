import { useState } from 'react'
import ManagerLayout from '@/admin/components/manager/ManagerLayout'
import SettingsNav from '@/admin/components/manager/settings/SettingsNav'
import ProfileSettingsTab from '@/admin/components/manager/settings/ProfileSettingsTab'
import HotelInformationTab from '@/admin/components/manager/settings/HotelInformationTab'
import NotificationsSettingsTab from '@/admin/components/manager/settings/NotificationsSettingsTab'
import SecuritySettingsTab from '@/admin/components/manager/settings/SecuritySettingsTab'
import PreferencesSettingsTab from '@/admin/components/manager/settings/PreferencesSettingsTab'
import RoleAccessTab from '@/admin/components/manager/settings/RoleAccessTab'
import SystemInformationTab from '@/admin/components/manager/settings/SystemInformationTab'
import ComingSoonCard from '@/admin/components/manager/settings/ComingSoonCard'
import { SETTINGS_TABS } from '@/admin/components/manager/settings/demoSettings'
import '@/styles/manager-settings.css'

export default function ManagerSettingsPage() {
  const [active, setActive] = useState('profile')
  const activeTab = SETTINGS_TABS.find((tab) => tab.id === active) ?? SETTINGS_TABS[0]
  const implemented = ['profile', 'hotel', 'notifications', 'security', 'preferences', 'roles', 'system']

  return (
    <ManagerLayout
      title="Settings"
      subtitle="Manage your account & preferences"
      breadcrumb="Dashboard  /  Settings"
      searchPlaceholder="Search settings..."
    >
      <div className="s-layout">
        <SettingsNav active={active} onChange={setActive} />
        {active === 'profile' && <ProfileSettingsTab />}
        {active === 'hotel' && <HotelInformationTab />}
        {active === 'notifications' && <NotificationsSettingsTab />}
        {active === 'security' && <SecuritySettingsTab />}
        {active === 'preferences' && <PreferencesSettingsTab />}
        {active === 'roles' && <RoleAccessTab />}
        {active === 'system' && <SystemInformationTab />}
        {!implemented.includes(active) && <ComingSoonCard label={activeTab.label} />}
      </div>
    </ManagerLayout>
  )
}
