import { lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '../shared/components/ProtectedRoute'

const LandingPage = lazy(() => import('../features/landing/pages/LandingPage'))
const LoginPage = lazy(() => import('../auth/Login'))
const SignupPage = lazy(() => import('../auth/Signup'))
const ForgotPasswordPage = lazy(() => import('../auth/ForgotPassword'))
const ResetPasswordPage = lazy(() => import('../auth/ResetPassword'))
const HostProfilePage = lazy(() => import('../pages/HostProfilePage'))
const HostPortalPageNew = lazy(() => import('../pages/HostPortalPageNew'))
const TenantSetupPage = lazy(() => import('../pages/TenantSetup'))
const DashboardPage = lazy(() => import('../pages/DashboardPage'))
const OverallDashboardPage = lazy(() => import('../pages/OverallDashboardPage'))
const PropertyDashboardPage = lazy(() => import('../pages/PropertyDashboardPage'))
const BookingsPage = lazy(() => import('../pages/BookingsPage'))
const RoomsPage = lazy(() => import('../pages/RoomsPage'))
const GuestsPage = lazy(() => import('../pages/GuestsPage'))
const StaffPage = lazy(() => import('../pages/StaffPage'))
const HousekeepingPage = lazy(() => import('../pages/HousekeepingPage'))
const PricingPage = lazy(() => import('../pages/PricingPage'))
const ReportsPage = lazy(() => import('../pages/ReportsPage'))
const SettingsPage = lazy(() => import('../pages/SettingsPage'))
const PaymentMethodsPage = lazy(() => import('../pages/PaymentMethodsPage'))
const IntegrationsPage = lazy(() => import('../pages/IntegrationsPage'))
const HostNotificationsPage = lazy(() => import('../pages/HostNotificationsPage'))
const ActivityLogsPage = lazy(() => import('../pages/ActivityLogsPage'))
const SupportPage = lazy(() => import('../pages/SupportPage'))
const CountryPage = lazy(() => import('../features/search/pages/CountryPage'))
const PropertyDetailPage = lazy(() => import('../features/property/pages/PropertyDetailPage'))
const SearchResultsPage = lazy(() => import('../features/search/pages/SearchResultsPage'))
const ComingSoon = lazy(() => import('../features/misc/pages/ComingSoon'))
const BookingPage = lazy(() => import('../features/booking/pages/BookingDetailsPage'))
const BookingViewPage = lazy(() => import('../features/booking/pages/BookingDetailsView'))
const ReservePage = lazy(() => import('../features/booking/pages/ReservePage'))
const BookingConfirmationPage = lazy(() => import('../features/booking/pages/BookingConfirmationPage'))
const ProfilePage = lazy(() => import('../features/profile/pages/ProfilePage'))
const AboutMe = lazy(() => import('../features/profile/components/AboutMe'))
const Favourites = lazy(() => import('../features/profile/components/Favourites'))
const Bookings = lazy(() => import('../features/profile/components/Bookings'))
const Coupons = lazy(() => import('../features/profile/components/Coupons'))
const Reviews = lazy(() => import('../features/profile/components/Reviews'))
const Notifications = lazy(() => import('../features/profile/components/Notifications'))
const NotFoundPage = lazy(() => import('../features/misc/pages/NotFoundPage'))

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/host/login" element={<LoginPage />} />
      <Route path="/host/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/host/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/*" element={<ResetPasswordPage />} />
      <Route path="/host/reset-password/*" element={<ResetPasswordPage />} />
      <Route path="/host/profile" element={<ProtectedRoute><HostProfilePage /></ProtectedRoute>} />
      <Route path="/host/portal" element={<ProtectedRoute><HostPortalPageNew /></ProtectedRoute>} />
      <Route path="/host/tenant-setup" element={<ProtectedRoute><TenantSetupPage /></ProtectedRoute>} />
      <Route path="/host/overall-dashboard" element={<ProtectedRoute><OverallDashboardPage /></ProtectedRoute>} />
      <Route path="/host/my-properties" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/host/my-properties/dashboard" element={<Navigate to="/host/my-properties" replace />} />
      <Route path="/host/my-properties/dashboard/:propertyId" element={<ProtectedRoute><PropertyDashboardPage /></ProtectedRoute>} />
      <Route path="/host/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
      <Route path="/host/rooms" element={<ProtectedRoute><RoomsPage /></ProtectedRoute>} />
      <Route path="/host/guests" element={<ProtectedRoute><GuestsPage /></ProtectedRoute>} />
      <Route path="/host/staff" element={<ProtectedRoute><StaffPage /></ProtectedRoute>} />
      <Route path="/host/housekeeping" element={<ProtectedRoute><HousekeepingPage /></ProtectedRoute>} />
      <Route path="/host/pricing/*" element={<ProtectedRoute><PricingPage /></ProtectedRoute>} />
      <Route path="/host/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
      <Route path="/host/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/host/payments" element={<ProtectedRoute><PaymentMethodsPage /></ProtectedRoute>} />
      <Route path="/host/integrations" element={<ProtectedRoute><IntegrationsPage /></ProtectedRoute>} />
      <Route path="/host/notifications" element={<ProtectedRoute><HostNotificationsPage /></ProtectedRoute>} />
      <Route path="/host/activity" element={<ProtectedRoute><ActivityLogsPage /></ProtectedRoute>} />
      <Route path="/host/support" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
      <Route path="/country/:code" element={<CountryPage />} />
      <Route path="/hotel/:id" element={<PropertyDetailPage />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}>
        <Route index element={<Navigate to="about" replace />} />
        <Route path="about" element={<AboutMe />} />
        <Route path="favourites" element={<Favourites />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
      <Route path="/notifications" element={<ComingSoon />} />
      <Route path="/account-settings" element={<ComingSoon />} />
      <Route path="/language-currency" element={<ComingSoon />} />
      <Route path="/booking-details/:id" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
      <Route path="/booking-view/:id" element={<ProtectedRoute><BookingViewPage /></ProtectedRoute>} />
      <Route path="/reserve/:id" element={<ProtectedRoute><ReservePage /></ProtectedRoute>} />
      <Route path="/booking-confirmation/:refNumber?" element={<ProtectedRoute><BookingConfirmationPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
