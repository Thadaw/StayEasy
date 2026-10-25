import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Save } from 'lucide-react'
import { useUIStore } from '@/store/ui/uiStore'
import { usePropertyStore } from '@/store/properties/propertyStore'
import Sidebar from '@/components/admin/dashboard/Sidebar'
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader'
import CompanyProfileForm from '@/components/admin/settings/CompanyProfileForm'
import LogoBranding from '@/components/admin/settings/LogoBranding'
import BusinessInfo from '@/components/admin/settings/BusinessInfo'
import ContactPerson from '@/components/admin/settings/ContactPerson'
import GeneralSettingsForm from '@/components/admin/settings/GeneralSettingsForm'
import BookingSettingsForm from '@/components/admin/settings/BookingSettingsForm'
import RoomRateSettingsForm from '@/components/admin/settings/RoomRateSettingsForm'
import TaxesSettingsTab from '@/components/admin/settings/TaxesSettingsTab'
import AmenitiesSettingsTab from '@/components/admin/settings/AmenitiesSettingsTab'
import GallerySettingsTab from '@/components/admin/settings/GallerySettingsTab'
import { useSettingsStore } from '@/store/admin/settingsStore'
import { useSettingsPropertiesQuery } from '@/services/queries/admin/settingsQueries'
import { useSaveSettingsMutation } from '@/services/mutations/admin/settingsMutations'

export default function SettingsPage() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'company')

  const companyData = useSettingsStore((s) => s.companyData)
  const logoData = useSettingsStore((s) => s.logoData)
  const businessData = useSettingsStore((s) => s.businessData)
  const contactData = useSettingsStore((s) => s.contactData)
  const generalData = useSettingsStore((s) => s.generalData)
  const bookingData = useSettingsStore((s) => s.bookingData)
  const roomRateData = useSettingsStore((s) => s.roomRateData)
  const patchCompany = useSettingsStore((s) => s.patchCompany)
  const patchLogo = useSettingsStore((s) => s.patchLogo)
  const patchBusiness = useSettingsStore((s) => s.patchBusiness)
  const patchContact = useSettingsStore((s) => s.patchContact)
  const patchGeneral = useSettingsStore((s) => s.patchGeneral)
  const patchBooking = useSettingsStore((s) => s.patchBooking)
  const patchRoomRate = useSettingsStore((s) => s.patchRoomRate)
  const saveSettings = useSaveSettingsMutation()

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) setActiveTab(tab)
  }, [searchParams])

  const { data: properties = [] } = useSettingsPropertiesQuery()

  const currentPropertyId = usePropertyStore((s) => s.currentPropertyId)
  const selectedProperty = properties.find((p) => p.id === currentPropertyId) ?? properties[0]
  const propertyId = selectedProperty?.id ?? ''

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Settings" subtitle="Manage your system preferences and configurations" />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 24 }}>
            <button
              onClick={() => saveSettings.mutate()}
              disabled={saveSettings.isPending}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                border: 'none',
                borderRadius: 8,
                background: 'var(--primary)',
                fontSize: 14,
                fontWeight: 600,
                color: '#fff',
                cursor: saveSettings.isPending ? 'default' : 'pointer',
                opacity: saveSettings.isPending ? 0.7 : 1,
              }}
            >
              <Save size={16} />
              {saveSettings.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
              {activeTab === 'company' ? (
                <>
                  <div style={{ flex: '1 1 0', background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 24 }}>
                    <CompanyProfileForm data={companyData} onChange={patchCompany} />
                  </div>
                  <div style={{ width: 320, flexShrink: 0 }}>
                    <LogoBranding data={logoData} onChange={patchLogo} />
                    <BusinessInfo data={businessData} onChange={patchBusiness} />
                    <ContactPerson data={contactData} onChange={patchContact} />
                  </div>
                </>
              ) : activeTab === 'general' ? (
                <div style={{ flex: '1 1 0' }}>
                  <GeneralSettingsForm data={generalData} onChange={patchGeneral} propertyId={propertyId} propertyName={selectedProperty?.name} />
                </div>
              ) : activeTab === 'booking' ? (
                <div style={{ flex: '1 1 0' }}>
                  <BookingSettingsForm data={bookingData} onChange={patchBooking} />
                </div>
              ) : activeTab === 'room' ? (
                <div style={{ flex: '1 1 0' }}>
                  <RoomRateSettingsForm data={roomRateData} onChange={patchRoomRate} />
                </div>
              ) : activeTab === 'taxes' ? (
                <div style={{ flex: '1 1 0' }}>
                  <TaxesSettingsTab />
                </div>
              ) : activeTab === 'amenities' ? (
                <div style={{ flex: '1 1 0' }}>
                  <AmenitiesSettingsTab />
                </div>
              ) : activeTab === 'gallery' ? (
                <div style={{ flex: '1 1 0' }}>
                  <GallerySettingsTab />
                </div>
              ) : (
                <div style={{ flex: '1 1 0', background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 40, textAlign: 'center' }}>
                  <p style={{ fontSize: 14, color: '#6B7280' }}>This settings section is coming soon.</p>
                </div>
              )}
            </div>
        </main>
      </div>
    </div>
  )
}
