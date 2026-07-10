import { useState } from 'react'
import { Save } from 'lucide-react'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import SettingsSidebar from '../components/settings/SettingsSidebar'
import CompanyProfileForm from '../components/settings/CompanyProfileForm'
import LogoBranding from '../components/settings/LogoBranding'
import BusinessInfo from '../components/settings/BusinessInfo'
import ContactPerson from '../components/settings/ContactPerson'
import GeneralSettingsForm from '../components/settings/GeneralSettingsForm'
import BookingSettingsForm from '../components/settings/BookingSettingsForm'
import RoomRateSettingsForm from '../components/settings/RoomRateSettingsForm'
import type {
  CompanyProfile,
  LogoBranding as LogoBrandingType,
  BusinessInfo as BusinessInfoType,
  ContactPerson as ContactPersonType,
  GeneralSettings,
  BookingSettings,
  RoomRateSettings
} from '../types/settings'

export default function SettingsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('company')

  const [companyData, setCompanyData] = useState<CompanyProfile>({
    propertyName: 'Hotel Blue Pearl',
    propertyType: 'Hotel',
    tagline: 'Experience Comfort, Feel at Home',
    phone: '+977 1 4567890',
    email: 'info@bluepearlhotel.com',
    website: 'https://www.bluepearlhotel.com',
    vatPan: '604123456',
    address: 'Lazimpat, Kathmandu, Bagmati Province, Nepal',
    city: 'Kathmandu',
    state: 'Bagmati Province',
    postalCode: '44600',
    country: 'Nepal',
    currency: 'NPR (Nepalese Rupee)',
    timeZone: '(GMT+05:45) Kathmandu',
    language: 'English',
    dateFormat: 'Jun 1, 2026',
    timeFormat: '12 Hours (hh:mm AM/PM)',
  })

  const [logoData, setLogoData] = useState<LogoBrandingType>({
    logoUrl: '',
    logoName: 'bluepearl-logo.png',
    primaryColor: '#6C3AED',
    secondaryColor: '#1F2937',
  })

  const [businessData, setBusinessData] = useState<BusinessInfoType>({
    registrationNumber: '123456/078/079',
    licenseNumber: 'HOTEL/KTM/2024/1234',
    establishedYear: '2018',
  })

  const [contactData, setContactData] = useState<ContactPersonType>({
    name: 'Ramesh Thapa',
    designation: 'General Manager',
    phone: '+977 9812345678',
    email: 'ramesh.thapa@bluepearl.com',
  })

  const [generalData, setGeneralData] = useState<GeneralSettings>({
    timeZone: '(GMT+05:45) Kathmandu',
    dateFormat: 'Jun 1, 2026',
    timeFormat: '12 Hours (hh:mm AM/PM)',
    currency: 'NPR (Nepalese Rupee)',
    language: 'English',
    maintenanceMode: false,
    allowMultipleLogin: true,
    showTips: true,
    autoLogout: '30',
    defaultDashboard: 'Dashboard v1',
    itemsPerPage: '10',
  })

  const [bookingData, setBookingData] = useState<BookingSettings>({
    enableOnlineBooking: true,
    autoConfirmBooking: true,
    bookingConfirmation: 'Email',
    defaultBookingStatus: 'Confirmed',
    holdBookingMinutes: '15 Minutes',
    allowWalkinBooking: true,
    minimumStayNights: '1',
    maximumStayNights: '30',
    applyMaximumStayTo: 'All Bookings',
    checkinTime: '14:00',
    checkoutTime: '12:00',
    earlyCheckin: 'On Request',
    lateCheckout: 'On Request',
    cancellationAllowed: true,
    cancellationCharge: '100% of Total Amount',
    cancellationDeadline: '24 Hours Before Check-in',
    requireAdvancePayment: true,
    advancePaymentType: 'Percentage',
    advancePercentage: '20',
  })

  const [roomRateData, setRoomRateData] = useState<RoomRateSettings>({
    autoRoomNumber: true,
    roomStatus: true,
    displayRoomFloor: true,
    defaultRoomView: 'Grid View',
    roomImageUpload: true,
    maxImagesPerRoom: '5 Images',
    baseRateType: 'Rack Rate',
    rateDisplay: 'Inclusive of Tax',
    allowRateOverride: true,
    rateRounding: '1',
    currency: 'NPR (Nepalese Rupee)',
    overbooking: false,
    inventoryUpdate: true,
    releaseUnusedRooms: '23:00',
    minimumSellableRate: '1000',
    maxRoomsPerBooking: '10 Rooms',
    closeRoomForCheckinAfter: '22:00',
    ratePlans: [],
    seasonalRates: [],
  })

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Settings" subtitle="Manage your system preferences and configurations" />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 24 }}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                border: 'none',
                borderRadius: 8,
                background: '#7C3AED',
                fontSize: 14,
                fontWeight: 600,
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>

          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

            <div style={{ flex: 1, display: 'flex', gap: 24, alignItems: 'flex-start' }}>
              {activeTab === 'company' ? (
                <>
                  <div style={{ flex: '1 1 0', background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 24 }}>
                    <CompanyProfileForm data={companyData} onChange={d => setCompanyData(prev => ({ ...prev, ...d }))} />
                  </div>
                  <div style={{ width: 320, flexShrink: 0 }}>
                    <LogoBranding data={logoData} onChange={d => setLogoData(prev => ({ ...prev, ...d }))} />
                    <BusinessInfo data={businessData} onChange={d => setBusinessData(prev => ({ ...prev, ...d }))} />
                    <ContactPerson data={contactData} onChange={d => setContactData(prev => ({ ...prev, ...d }))} />
                  </div>
                </>
              ) : activeTab === 'general' ? (
                <div style={{ flex: '1 1 0' }}>
                  <GeneralSettingsForm data={generalData} onChange={d => setGeneralData(prev => ({ ...prev, ...d }))} />
                </div>
              ) : activeTab === 'booking' ? (
                <div style={{ flex: '1 1 0' }}>
                  <BookingSettingsForm data={bookingData} onChange={d => setBookingData(prev => ({ ...prev, ...d }))} />
                </div>
              ) : activeTab === 'room' ? (
                <div style={{ flex: '1 1 0' }}>
                  <RoomRateSettingsForm data={roomRateData} onChange={d => setRoomRateData(prev => ({ ...prev, ...d }))} />
                </div>
              ) : (
                <div style={{ flex: '1 1 0', background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 40, textAlign: 'center' }}>
                  <p style={{ fontSize: 14, color: '#6B7280' }}>This settings section is coming soon.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
