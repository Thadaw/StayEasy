import { lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '../shared/components/ProtectedRoute'
import { StaffRedirect } from '../shared/components/StaffRedirect'

const LandingPage = lazy(() => import('../guestfeatures/landing/pages/LandingPage'))
const LoginPage = lazy(() => import('../auth/Login'))
const SignupPage = lazy(() => import('../auth/Signup'))
const ForgotPasswordPage = lazy(() => import('../auth/ForgotPassword'))
const ResetPasswordPage = lazy(() => import('../auth/ResetPassword'))
const HostProfilePage = lazy(() => import('../pages/HostProfilePage'))
const AdminProfilePage = lazy(() => import('../pages/AdminProfilePage'))
const HostPortalPageNew = lazy(() => import('../pages/HostPortalPageNew'))
const TenantSetupPage = lazy(() => import('../pages/TenantSetup'))
const DashboardPage = lazy(() => import('../pages/DashboardPage'))
const OverallDashboardPage = lazy(() => import('../pages/OverallDashboardPage'))
const PropertyDashboardPage = lazy(() => import('../pages/PropertyDashboardPage'))
const BookingsPage = lazy(() => import('../pages/BookingsPage'))
const RoomsPage = lazy(() => import('../pages/RoomsPage'))
const GuestsPage = lazy(() => import('../pages/GuestsPage'))
const StaffPage = lazy(() => import('../pages/StaffPage'))
const AddStaffPage = lazy(() => import('../pages/AddStaffPage'))
const EditStaffPage = lazy(() => import('../pages/EditStaffPage'))
const StaffPerformancePage = lazy(() => import('../pages/StaffPerformancePage'))
const StaffShiftsPage = lazy(() => import('../pages/StaffShiftsPage'))
const ShiftCoveragePage = lazy(() => import('../pages/ShiftCoveragePage'))
const HousekeepingPage = lazy(() => import('../pages/HousekeepingPage'))
const PricingPage = lazy(() => import('../pages/PricingPage'))
const ReportsPage = lazy(() => import('../pages/ReportsPage'))
const SettingsPage = lazy(() => import('../pages/SettingsPage'))
const PaymentMethodsPage = lazy(() => import('../pages/PaymentMethodsPage'))
const IntegrationsPage = lazy(() => import('../pages/IntegrationsPage'))
const HostNotificationsPage = lazy(() => import('../pages/HostNotificationsPage'))
const ActivityLogsPage = lazy(() => import('../pages/ActivityLogsPage'))
const SupportPage = lazy(() => import('../pages/SupportPage'))
const CountryPage = lazy(() => import('../guestfeatures/search/pages/CountryPage'))
const PropertyDetailPage = lazy(() => import('../guestfeatures/property/pages/PropertyDetailPage'))
const SearchResultsPage = lazy(() => import('../guestfeatures/search/pages/SearchResultsPage'))
const ComingSoon = lazy(() => import('../guestfeatures/extraPage/pages/ComingSoon'))
const BookingPage = lazy(() => import('../guestfeatures/booking/pages/GuestBookingDetailsPage'))
const BookingViewPage = lazy(() => import('../guestfeatures/booking/pages/BookingSummaryPage'))
const ReservePage = lazy(() => import('../guestfeatures/booking/pages/ReservePage'))
const KhaltiCallbackPage = lazy(() => import('../guestfeatures/booking/pages/KhaltiCallbackPage'))
const StripeCallbackPage = lazy(() => import('../guestfeatures/booking/pages/StripeCallbackPage'))
const PaymentSuccessPage = lazy(() => import('../guestfeatures/booking/pages/PaymentSuccessPage'))
const BookingConfirmationPage = lazy(() => import('../guestfeatures/booking/pages/BookingConfirmationPage'))
const ProfilePage = lazy(() => import('../guestfeatures/profile/pages/ProfilePage'))
const AboutMe = lazy(() => import('../guestfeatures/profile/components/AboutMe'))
const Favourites = lazy(() => import('../guestfeatures/profile/components/Favourites'))
const Bookings = lazy(() => import('../guestfeatures/profile/components/Bookings'))
const Reviews = lazy(() => import('../guestfeatures/profile/components/Reviews'))
const Notifications = lazy(() => import('../guestfeatures/profile/components/Notifications'))
const FrontDeskPage = lazy(() => import('../frontdesk/pages/FrontDeskPage'))
const StaffAccountPage = lazy(() => import('../frontdesk/pages/StaffAccountPage'))
const ChangePasswordPage = lazy(() => import('../frontdesk/pages/ChangePassword'))
const FrontdeskBookingsPage = lazy(() => import('../frontdesk/pages/FrontdeskBookingsPage'))
const CheckInListPage = lazy(() => import('../frontdesk/pages/CheckInListPage'))
const CheckOutListPage = lazy(() => import('../frontdesk/pages/CheckOutListPage'))
const CheckoutPage = lazy(() => import('../frontdesk/pages/CheckoutPage'))
const EditBookingPage = lazy(() => import('../frontdesk/pages/EditBookingPage'))
const CheckoutReceiptPage = lazy(() => import('../frontdesk/pages/CheckoutReceiptPage'))
const FrontDeskPaymentsPage = lazy(() => import('../frontdesk/pages/FrontDeskPaymentsPage'))
const FrontDeskRoomStatusPage = lazy(() => import('../frontdesk/pages/FrontDeskRoomStatusPage'))
const FrontDeskGuestsPage = lazy(() => import('../frontdesk/pages/FrontDeskGuestsPage'))
const FrontDeskActivitiesPage = lazy(() => import('../frontdesk/pages/FrontDeskActivitiesPage'))
const FrontDeskFoliosPage = lazy(() => import('../frontdesk/pages/FrontDeskFoliosPage'))
const FolioInvoicePage = lazy(() => import('../frontdesk/pages/FolioInvoicePage'))
const FrontDeskNotificationsPage = lazy(() => import('../frontdesk/pages/FrontDeskNotificationsPage'))
const InHousePage = lazy(() => import('../frontdesk/pages/InHousePage'))
const NotFoundPage = lazy(() => import('../guestfeatures/extraPage/pages/NotFoundPage'))
const FooterPage = lazy(() => import('../guestfeatures/extraPage/pages/FooterPage'))

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StaffRedirect><LandingPage /></StaffRedirect>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/host/login" element={<LoginPage />} />
      <Route path="/host/signup" element={<SignupPage />} />
      <Route path="/staff/login" element={<LoginPage />} />
      <Route path="/staff/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/host/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/*" element={<ResetPasswordPage />} />
      <Route path="/host/reset-password/*" element={<ResetPasswordPage />} />
      <Route path="/host/profile" element={<ProtectedRoute allowedRoles={['host']}><HostProfilePage /></ProtectedRoute>} />
      <Route path="/host/portal" element={<ProtectedRoute allowedRoles={['host']}><HostPortalPageNew /></ProtectedRoute>} />
      <Route path="/host/tenant-setup" element={<ProtectedRoute allowedRoles={['host']}><TenantSetupPage /></ProtectedRoute>} />
      <Route path="/host/overall-dashboard" element={<ProtectedRoute allowedRoles={['host']}><OverallDashboardPage /></ProtectedRoute>} />
      <Route path="/host/my-properties" element={<ProtectedRoute allowedRoles={['host']}><DashboardPage /></ProtectedRoute>} />
      <Route path="/host/my-properties/dashboard" element={<Navigate to="/host/my-properties" replace />} />
      <Route path="/host/my-properties/dashboard/:propertyId" element={<ProtectedRoute allowedRoles={['host']}><PropertyDashboardPage /></ProtectedRoute>} />
      <Route path="/host/bookings" element={<ProtectedRoute allowedRoles={['host']}><BookingsPage /></ProtectedRoute>} />
      <Route path="/host/rooms" element={<ProtectedRoute allowedRoles={['host']}><RoomsPage /></ProtectedRoute>} />
      <Route path="/host/guests" element={<ProtectedRoute allowedRoles={['host']}><GuestsPage /></ProtectedRoute>} />
      <Route path="/host/staff" element={<ProtectedRoute allowedRoles={['host']}><StaffPage /></ProtectedRoute>} />
      <Route path="/host/housekeeping" element={<ProtectedRoute allowedRoles={['host']}><HousekeepingPage /></ProtectedRoute>} />
      <Route path="/host/pricing/*" element={<ProtectedRoute allowedRoles={['host']}><PricingPage /></ProtectedRoute>} />
      <Route path="/host/reports" element={<ProtectedRoute allowedRoles={['host']}><ReportsPage /></ProtectedRoute>} />
      <Route path="/host/settings" element={<ProtectedRoute allowedRoles={['host']}><SettingsPage /></ProtectedRoute>} />
      <Route path="/host/payments" element={<ProtectedRoute allowedRoles={['host']}><PaymentMethodsPage /></ProtectedRoute>} />
      <Route path="/host/integrations" element={<ProtectedRoute allowedRoles={['host']}><IntegrationsPage /></ProtectedRoute>} />
      <Route path="/host/notifications" element={<ProtectedRoute allowedRoles={['host']}><HostNotificationsPage /></ProtectedRoute>} />
      <Route path="/host/activity" element={<ProtectedRoute allowedRoles={['host']}><ActivityLogsPage /></ProtectedRoute>} />
      <Route path="/host/support" element={<ProtectedRoute allowedRoles={['host']}><SupportPage /></ProtectedRoute>} />
      <Route path="/frontdesk" element={<ProtectedRoute allowedRoles={['staff']}><FrontDeskPage /></ProtectedRoute>} />
      <Route path="/frontdesk/bookings" element={<ProtectedRoute allowedRoles={['staff']}><FrontdeskBookingsPage /></ProtectedRoute>} />
      <Route path="/frontdesk/payments" element={<ProtectedRoute allowedRoles={['staff']}><FrontDeskPaymentsPage /></ProtectedRoute>} />
      <Route path="/frontdesk/folios" element={<ProtectedRoute allowedRoles={['staff']}><FrontDeskFoliosPage /></ProtectedRoute>} />
      <Route path="/frontdesk/folio/:id/invoice" element={<ProtectedRoute allowedRoles={['staff']}><FolioInvoicePage /></ProtectedRoute>} />
      <Route path="/frontdesk/room-status" element={<ProtectedRoute allowedRoles={['staff']}><FrontDeskRoomStatusPage /></ProtectedRoute>} />
      <Route path="/frontdesk/guests" element={<ProtectedRoute allowedRoles={['staff']}><FrontDeskGuestsPage /></ProtectedRoute>} />
      <Route path="/frontdesk/tasks" element={<ProtectedRoute allowedRoles={['staff']}><FrontDeskActivitiesPage /></ProtectedRoute>} />
      <Route path="/frontdesk/notifications" element={<ProtectedRoute allowedRoles={['staff']}><FrontDeskNotificationsPage /></ProtectedRoute>} />
      <Route path="/frontdesk/check-in" element={<ProtectedRoute allowedRoles={['staff']}><CheckInListPage /></ProtectedRoute>} />
      <Route path="/frontdesk/check-out" element={<ProtectedRoute allowedRoles={['staff']}><CheckOutListPage /></ProtectedRoute>} />
      <Route path="/frontdesk/in-house" element={<ProtectedRoute allowedRoles={['staff']}><InHousePage /></ProtectedRoute>} />
      <Route path="/frontdesk/booking/:id" element={<ProtectedRoute allowedRoles={['staff']}><CheckoutPage /></ProtectedRoute>} />
      <Route path="/frontdesk/booking/:id/edit" element={<ProtectedRoute allowedRoles={['staff']}><EditBookingPage /></ProtectedRoute>} />
      <Route path="/frontdesk/checkout/:id" element={<ProtectedRoute allowedRoles={['staff']}><CheckoutPage /></ProtectedRoute>} />
      <Route path="/frontdesk/checkout/:id/receipt" element={<ProtectedRoute allowedRoles={['staff']}><CheckoutReceiptPage /></ProtectedRoute>} />
      <Route path="/frontdesk/account" element={<ProtectedRoute allowedRoles={['staff']}><StaffAccountPage /></ProtectedRoute>} />
      <Route path="/frontdesk/change-password" element={<ProtectedRoute allowedRoles={['staff']}><ChangePasswordPage /></ProtectedRoute>} />
      <Route path="/country/:code" element={<CountryPage />} />
      <Route path="/hotel/:id" element={<PropertyDetailPage />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}>
        <Route index element={<Navigate to="about" replace />} />
        <Route path="about" element={<AboutMe />} />
        <Route path="favourites" element={<Favourites />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
      <Route path="/notifications" element={<ComingSoon />} />
      <Route path="/account-settings" element={<ComingSoon />} />
      <Route path="/language-currency" element={<ComingSoon />} />
      <Route path="/booking-details/:id" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
      <Route path="/booking-view/:id" element={<ProtectedRoute><BookingViewPage /></ProtectedRoute>} />
      <Route path="/reserve" element={<KhaltiCallbackPage />} />
      <Route path="/reserve/:id" element={<ProtectedRoute><ReservePage /></ProtectedRoute>} />
      <Route path="/payment/khalti/callback" element={<KhaltiCallbackPage />} />
      <Route path="/payment/stripe/callback" element={<StripeCallbackPage />} />
      <Route path="/payment/success" element={<PaymentSuccessPage />} />
      <Route path="/booking-confirmation/:refNumber?" element={<ProtectedRoute><BookingConfirmationPage /></ProtectedRoute>} />
      <Route path="/help-center" element={<FooterPage />} />
      <Route path="/contact" element={<FooterPage />} />
      <Route path="/booking-help" element={<FooterPage />} />
      <Route path="/cancellation-refund" element={<FooterPage />} />
      <Route path="/payment-security" element={<FooterPage />} />
      <Route path="/safety" element={<FooterPage />} />
      <Route path="/accessibility" element={<FooterPage />} />
      <Route path="/destinations" element={<FooterPage />} />
      <Route path="/hotels-stays" element={<FooterPage />} />
      <Route path="/offers" element={<FooterPage />} />
      <Route path="/nearby-stays" element={<FooterPage />} />
      <Route path="/hosting-guide" element={<FooterPage />} />
      <Route path="/host-resources" element={<FooterPage />} />
      <Route path="/host-safety" element={<FooterPage />} />
      <Route path="/about" element={<FooterPage />} />
      <Route path="/features" element={<FooterPage />} />
      <Route path="/careers" element={<FooterPage />} />
      <Route path="/privacy" element={<FooterPage />} />
      <Route path="/terms" element={<FooterPage />} />
      <Route path="/cancellation-policy" element={<FooterPage />} />
      <Route path="/refund-policy" element={<FooterPage />} />
      <Route path="/cookie-policy" element={<FooterPage />} />
      <Route path="/sitemap" element={<FooterPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
