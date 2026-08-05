import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import HostLandingPage from './pages/HostLandingPage'
import HostPortalPage from './pages/HostPortalPage'
import HostPortalPageNew from './pages/HostPortalPageNew'
import HostProfilePage from './pages/HostProfilePage'
import DashboardPage from './pages/DashboardPage'
import BookingsPage from './pages/BookingsPage'
import BookingDetailPage from './pages/BookingDetailPage'
import RoomsPage from './pages/RoomsPage'
import RestaurantPosPage from './pages/RestaurantPosPage'
import RestaurantOrdersPage from './pages/RestaurantOrdersPage'
import PropertyDashboardPage from './pages/PropertyDashboardPage'
import GuestsPage from './pages/GuestsPage'
import CountryPage from './pages/CountryPage'
import HotelDetailPage from './pages/HotelDetailPage'
import ProfilePage from './pages/ProfilePage'
import StaffPage from './pages/StaffPage'
import HousekeepingPage from './pages/HousekeepingPage'
import PricingPage from './pages/PricingPage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'
import TaxesPage from './pages/TaxesPage'
import PaymentMethodsPage from './pages/PaymentMethodsPage'
import IntegrationsPage from './pages/IntegrationsPage'
import HostNotificationsPage from './pages/HostNotificationsPage'
import ActivityLogsPage from './pages/ActivityLogsPage'
import SupportPage from './pages/SupportPage'
import ComingSoon from './pages/ComingSoon'
import NotificationsPage from './pages/NotificationsPage'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/become-a-host" element={<HostLandingPage />} />
        <Route path="/host/login" element={<Login />} />
        <Route path="/host/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/host/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/*" element={<ResetPassword />} />
        <Route path="/host/reset-password/*" element={<ResetPassword />} />
        <Route path="/host" element={<HostLandingPage />} />
        <Route path="/host/portal" element={<HostPortalPageNew />} />
        <Route path="/host/portal-old" element={<HostPortalPage />} />
        <Route path="/host/profile" element={<HostProfilePage />} />
        <Route path="/host/my-properties" element={<DashboardPage />} />
        <Route path="/host/guests" element={<GuestsPage />} />
        <Route path="/host/bookings" element={<BookingsPage />} />
        <Route path="/host/bookings/:id" element={<BookingDetailPage />} />
        <Route path="/host/rooms" element={<RoomsPage />} />
        <Route path="/host/restaurant" element={<RestaurantPosPage />} />
        <Route path="/host/restaurant/orders" element={<RestaurantOrdersPage />} />
        <Route path="/host/staff" element={<StaffPage />} />
        <Route path="/host/housekeeping" element={<HousekeepingPage />} />
        <Route path="/host/pricing" element={<PricingPage />} />
        <Route path="/host/pricing/seasonal" element={<PricingPage />} />
        <Route path="/host/pricing/discounts" element={<PricingPage />} />
        <Route path="/host/pricing/packages" element={<PricingPage />} />
        <Route path="/host/reports" element={<ReportsPage />} />
        <Route path="/host/settings" element={<SettingsPage />} />
        <Route path="/host/taxes" element={<TaxesPage />} />
        <Route path="/host/payments" element={<PaymentMethodsPage />} />
        <Route path="/host/integrations" element={<IntegrationsPage />} />
        <Route path="/host/notifications" element={<HostNotificationsPage />} />
        <Route path="/host/activity" element={<ActivityLogsPage />} />
        <Route path="/host/support" element={<SupportPage />} />
        <Route path="/host/my-properties/dashboard" element={<Navigate to="/host/my-properties" replace />} />
        <Route path="/host/my-properties/dashboard/:propertyId" element={<PropertyDashboardPage />} />
        <Route path="/country/:code" element={<CountryPage />} />
        <Route path="/hotel/:id" element={<HotelDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/account-settings" element={<ComingSoon />} />
        <Route path="/language-currency" element={<ComingSoon />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
