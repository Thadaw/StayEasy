import { useState } from 'react'
import ManagerLayout from '../../components/manager/ManagerLayout'
import SettingsNav from '../../components/manager/settings/SettingsNav'
import ProfileSettingsTab from '../../components/manager/settings/ProfileSettingsTab'
import HotelInformationTab from '../../components/manager/settings/HotelInformationTab'
import NotificationsSettingsTab from '../../components/manager/settings/NotificationsSettingsTab'
import SecuritySettingsTab from '../../components/manager/settings/SecuritySettingsTab'
import PreferencesSettingsTab from '../../components/manager/settings/PreferencesSettingsTab'
import RoleAccessTab from '../../components/manager/settings/RoleAccessTab'
import SystemInformationTab from '../../components/manager/settings/SystemInformationTab'
import ComingSoonCard from '../../components/manager/settings/ComingSoonCard'
import { SETTINGS_TABS } from '../../components/manager/settings/demoSettings'
import '../../styles/manager-settings.css'

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
