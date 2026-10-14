import { lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/app/guards/ProtectedRoute'
import { ManagerRoute } from '@/app/guards/ManagerRoute'
import { StaffRedirect } from '@/app/guards/StaffRedirect'
import { RedirectIfLoggedIn } from '@/app/guards/RedirectIfLoggedIn'

const LandingPage = lazy(() => import('@/pages/public/LandingPage'))
const LoginPage = lazy(() => import('@/pages/auth/Login'))
const SignupPage = lazy(() => import('@/pages/auth/Signup'))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPassword'))
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPassword'))
const HostProfilePage = lazy(() => import('@/pages/admin/HostProfilePage'))
const AdminProfilePage = lazy(() => import('@/pages/admin/AdminProfilePage'))
const HostPortalPageNew = lazy(() => import('@/pages/admin/HostPortalPageNew'))
const TenantSetupPage = lazy(() => import('@/pages/admin/TenantSetup'))
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'))
const OverallDashboardPage = lazy(() => import('@/pages/admin/OverallDashboardPage'))
const PropertyDashboardPage = lazy(() => import('@/pages/admin/PropertyDashboardPage'))
const BookingsPage = lazy(() => import('@/pages/admin/BookingsPage'))
const RoomsPage = lazy(() => import('@/pages/admin/RoomsPage'))
const GuestsPage = lazy(() => import('@/pages/admin/GuestsPage'))
const StaffPage = lazy(() => import('@/pages/admin/StaffPage'))
const AddStaffPage = lazy(() => import('@/pages/admin/AddStaffPage'))
const EditStaffPage = lazy(() => import('@/pages/admin/EditStaffPage'))
const StaffPerformancePage = lazy(() => import('@/pages/admin/StaffPerformancePage'))
const StaffShiftsPage = lazy(() => import('@/pages/admin/StaffShiftsPage'))
const ShiftCoveragePage = lazy(() => import('@/pages/admin/ShiftCoveragePage'))
const HousekeepingPage = lazy(() => import('@/pages/admin/HousekeepingPage'))
const PricingPage = lazy(() => import('@/pages/admin/PricingPage'))
const ReportsPage = lazy(() => import('@/pages/admin/ReportsPage'))
const SettingsPage = lazy(() => import('@/pages/admin/SettingsPage'))
const PaymentMethodsPage = lazy(() => import('@/pages/admin/PaymentMethodsPage'))
const IntegrationsPage = lazy(() => import('@/pages/admin/IntegrationsPage'))
const HostNotificationsPage = lazy(() => import('@/pages/admin/HostNotificationsPage'))
const ActivityLogsPage = lazy(() => import('@/pages/admin/ActivityLogsPage'))
const SupportPage = lazy(() => import('@/pages/admin/SupportPage'))
const ManagerDashboardPage = lazy(() => import('@/pages/manager/ManagerDashboardPage'))
const ManagerBookingsPage = lazy(() => import('@/pages/manager/ManagerBookingsPage'))
const ManagerNewBookingPage = lazy(() => import('@/pages/manager/ManagerNewBookingPage'))
const ManagerBookingDetailPage = lazy(() => import('@/pages/manager/ManagerBookingDetailPage'))
const ManagerRoomsPage = lazy(() => import('@/pages/manager/ManagerRoomsPage'))
const ManagerGuestsPage = lazy(() => import('@/pages/manager/ManagerGuestsPage'))
const ManagerStaffPage = lazy(() => import('@/pages/manager/ManagerStaffPage'))
const ManagerStaffApprovalsPage = lazy(() => import('@/pages/manager/ManagerStaffApprovalsPage'))
const ManagerHousekeepingPage = lazy(() => import('@/pages/manager/ManagerHousekeepingPage'))
const ManagerBillingPage = lazy(() => import('@/pages/manager/ManagerBillingPage'))
const ManagerReportsPage = lazy(() => import('@/pages/manager/ManagerReportsPage'))
const ManagerFeedbackPage = lazy(() => import('@/pages/manager/ManagerFeedbackPage'))
const ManagerNotificationsPage = lazy(() => import('@/pages/manager/ManagerNotificationsPage'))
const ManagerSettingsPage = lazy(() => import('@/pages/manager/ManagerSettingsPage'))
const CountryPage = lazy(() => import('@/pages/public/CountryPage'))
const PropertyDetailPage = lazy(() => import('@/pages/public/PropertyDetailPage'))
const SearchResultsPage = lazy(() => import('@/pages/public/SearchResultsPage'))
const ComingSoon = lazy(() => import('@/pages/public/ComingSoon'))
const BookingPage = lazy(() => import('@/pages/bookings/GuestBookingDetailsPage'))
const BookingViewPage = lazy(() => import('@/pages/bookings/BookingSummaryPage'))
const ReservePage = lazy(() => import('@/pages/bookings/ReservePage'))
const KhaltiCallbackPage = lazy(() => import('@/pages/payments/KhaltiCallbackPage'))
const StripeCallbackPage = lazy(() => import('@/pages/payments/StripeCallbackPage'))
const PaymentSuccessPage = lazy(() => import('@/pages/payments/PaymentSuccessPage'))
const BookingConfirmationPage = lazy(() => import('@/pages/bookings/BookingConfirmationPage'))
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'))
const AboutMe = lazy(() => import('@/pages/profile/AboutMe'))
const Favourites = lazy(() => import('@/pages/profile/Favourites'))
const Bookings = lazy(() => import('@/pages/profile/Bookings'))
const Reviews = lazy(() => import('@/pages/profile/Reviews'))
const Notifications = lazy(() => import('@/pages/profile/Notifications'))
const FrontDeskPage = lazy(() => import('@/pages/frontdesk/FrontDeskPage').then((m) => ({ default: m.FrontDeskPage })))
const StaffAccountPage = lazy(() => import('@/pages/frontdesk/StaffAccountPage').then((m) => ({ default: m.StaffAccountPage })))
const ChangePasswordPage = lazy(() => import('@/pages/frontdesk/ChangePassword'))
const FrontdeskBookingsPage = lazy(() => import('@/pages/frontdesk/FrontdeskBookingsPage'))
const CheckInListPage = lazy(() => import('@/pages/frontdesk/CheckInListPage'))
const CheckOutListPage = lazy(() => import('@/pages/frontdesk/CheckOutListPage'))
const CheckoutPage = lazy(() => import('@/pages/frontdesk/CheckoutPage'))
const EditBookingPage = lazy(() => import('@/pages/frontdesk/EditBookingPage'))
const CheckoutReceiptPage = lazy(() => import('@/pages/frontdesk/CheckoutReceiptPage'))
const FrontDeskPaymentsPage = lazy(() => import('@/pages/frontdesk/FrontDeskPaymentsPage'))
const FrontDeskRoomStatusPage = lazy(() => import('@/pages/frontdesk/FrontDeskRoomStatusPage'))
const FrontDeskGuestsPage = lazy(() => import('@/pages/frontdesk/FrontDeskGuestsPage'))
const FrontDeskActivitiesPage = lazy(() => import('@/pages/frontdesk/FrontDeskActivitiesPage'))
const FrontDeskFoliosPage = lazy(() => import('@/pages/frontdesk/FrontDeskFoliosPage'))
const FolioInvoicePage = lazy(() => import('@/pages/frontdesk/FolioInvoicePage'))
const FrontDeskNotificationsPage = lazy(() => import('@/pages/frontdesk/FrontDeskNotificationsPage'))
const InHousePage = lazy(() => import('@/pages/frontdesk/InHousePage'))
const NotFoundPage = lazy(() => import('@/pages/public/NotFoundPage'))
const FooterPage = lazy(() => import('@/pages/public/FooterPage'))
const RestaurantPosPage = lazy(() => import('@/pages/admin/RestaurantPosPage'))

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StaffRedirect><LandingPage /></StaffRedirect>} />
      <Route path="/login" element={<RedirectIfLoggedIn><LoginPage /></RedirectIfLoggedIn>} />
      <Route path="/signup" element={<RedirectIfLoggedIn><SignupPage /></RedirectIfLoggedIn>} />
      <Route path="/host/login" element={<RedirectIfLoggedIn><LoginPage /></RedirectIfLoggedIn>} />
      <Route path="/host/signup" element={<RedirectIfLoggedIn><SignupPage /></RedirectIfLoggedIn>} />
      {/* /staff/* auth pages are a trap: Login/Signup treat any non-/host path
          as guest mode (posts ?role=guest) and can never authenticate
          users-table staff. Redirect them to the host section instead. */}
      <Route path="/staff/login" element={<Navigate to="/host/login" replace />} />
      <Route path="/staff/signup" element={<Navigate to="/host/signup" replace />} />
      <Route path="/forgot-password" element={<RedirectIfLoggedIn><ForgotPasswordPage /></RedirectIfLoggedIn>} />
      <Route path="/host/forgot-password" element={<RedirectIfLoggedIn><ForgotPasswordPage /></RedirectIfLoggedIn>} />
      <Route path="/reset-password/*" element={<ResetPasswordPage />} />
      <Route path="/host/reset-password/*" element={<ResetPasswordPage />} />
      <Route path="/host/profile" element={<ProtectedRoute allowedRoles={['host']}><HostProfilePage /></ProtectedRoute>} />
      <Route path="/host/admin-profile" element={<ProtectedRoute allowedRoles={['host']}><AdminProfilePage /></ProtectedRoute>} />
      <Route path="/host/portal" element={<ProtectedRoute allowedRoles={['host']}><HostPortalPageNew /></ProtectedRoute>} />
      <Route path="/host/tenant-setup" element={<ProtectedRoute allowedRoles={['host']}><TenantSetupPage /></ProtectedRoute>} />
      <Route path="/host/overall-dashboard" element={<ProtectedRoute allowedRoles={['host']}><OverallDashboardPage /></ProtectedRoute>} />
      <Route path="/host/my-properties" element={<ProtectedRoute allowedRoles={['host']}><DashboardPage /></ProtectedRoute>} />
      <Route path="/host/my-properties/dashboard" element={<Navigate to="/host/my-properties" replace />} />
      <Route path="/host/my-properties/dashboard/:propertyId" element={<ProtectedRoute allowedRoles={['host']}><PropertyDashboardPage /></ProtectedRoute>} />
      <Route path="/host/bookings" element={<ProtectedRoute allowedRoles={['host']}><BookingsPage /></ProtectedRoute>} />
      <Route path="/host/bookings/new" element={<Navigate to="/host/bookings" replace />} />
      <Route path="/host/bookings/:id" element={<Navigate to="/host/bookings" replace />} />
      <Route path="/host/rooms" element={<ProtectedRoute allowedRoles={['host']}><RoomsPage /></ProtectedRoute>} />
      <Route path="/host/guests" element={<ProtectedRoute allowedRoles={['host']}><GuestsPage /></ProtectedRoute>} />
      <Route path="/host/staff" element={<ProtectedRoute allowedRoles={['host']}><StaffPage /></ProtectedRoute>} />
      <Route path="/host/staff/add" element={<ProtectedRoute allowedRoles={['host']}><AddStaffPage /></ProtectedRoute>} />
      <Route path="/host/staff/edit/:id" element={<ProtectedRoute allowedRoles={['host']}><EditStaffPage /></ProtectedRoute>} />
      <Route path="/host/staff/performance" element={<ProtectedRoute allowedRoles={['host']}><StaffPerformancePage /></ProtectedRoute>} />
      <Route path="/host/staff/shifts" element={<ProtectedRoute allowedRoles={['host']}><StaffShiftsPage /></ProtectedRoute>} />
      <Route path="/host/staff/shift-coverage" element={<ProtectedRoute allowedRoles={['host']}><ShiftCoveragePage /></ProtectedRoute>} />
      <Route path="/host/housekeeping" element={<ProtectedRoute allowedRoles={['host']}><HousekeepingPage /></ProtectedRoute>} />
      <Route path="/host/pricing/*" element={<ProtectedRoute allowedRoles={['host']}><PricingPage /></ProtectedRoute>} />
      <Route path="/host/reports" element={<ProtectedRoute allowedRoles={['host']}><ReportsPage /></ProtectedRoute>} />
      <Route path="/host/settings" element={<ProtectedRoute allowedRoles={['host']}><SettingsPage /></ProtectedRoute>} />
      <Route path="/host/payments" element={<ProtectedRoute allowedRoles={['host']}><PaymentMethodsPage /></ProtectedRoute>} />
      <Route path="/host/integrations" element={<ProtectedRoute allowedRoles={['host']}><IntegrationsPage /></ProtectedRoute>} />
      <Route path="/host/notifications" element={<ProtectedRoute allowedRoles={['host']}><HostNotificationsPage /></ProtectedRoute>} />
      <Route path="/host/activity" element={<ProtectedRoute allowedRoles={['host']}><ActivityLogsPage /></ProtectedRoute>} />
      <Route path="/host/support" element={<ProtectedRoute allowedRoles={['host']}><SupportPage /></ProtectedRoute>} />
      <Route path="/host/admin-profile" element={<ProtectedRoute allowedRoles={['host']}><AdminProfilePage /></ProtectedRoute>} />
      <Route path="/host/restaurant" element={<ProtectedRoute allowedRoles={['host']}><RestaurantPosPage /></ProtectedRoute>} />
      <Route path="/host/restaurant/orders" element={<ProtectedRoute allowedRoles={['host']}><RestaurantPosPage /></ProtectedRoute>} />
      <Route path="/host/restaurant/tables" element={<ProtectedRoute allowedRoles={['host']}><RestaurantPosPage /></ProtectedRoute>} />
      <Route path="/manager/login" element={<LoginPage />} />
      <Route path="/manager/dashboard" element={<ManagerRoute><ManagerDashboardPage /></ManagerRoute>} />
      <Route path="/manager/bookings" element={<ManagerRoute><ManagerBookingsPage /></ManagerRoute>} />
      <Route path="/manager/bookings/new" element={<ManagerRoute><ManagerNewBookingPage /></ManagerRoute>} />
      <Route path="/manager/bookings/:id" element={<ManagerRoute><ManagerBookingDetailPage /></ManagerRoute>} />
      <Route path="/manager/rooms" element={<ManagerRoute><ManagerRoomsPage /></ManagerRoute>} />
      <Route path="/manager/guests" element={<ManagerRoute><ManagerGuestsPage /></ManagerRoute>} />
      <Route path="/manager/staff" element={<ManagerRoute><ManagerStaffPage /></ManagerRoute>} />
      <Route path="/manager/staff/approvals" element={<ManagerRoute><ManagerStaffApprovalsPage /></ManagerRoute>} />
      <Route path="/manager/housekeeping" element={<ManagerRoute><ManagerHousekeepingPage /></ManagerRoute>} />
      <Route path="/manager/billing" element={<ManagerRoute><ManagerBillingPage /></ManagerRoute>} />
      <Route path="/manager/billing/payments" element={<ManagerRoute><ManagerBillingPage /></ManagerRoute>} />
      <Route path="/manager/billing/refunds" element={<ManagerRoute><ManagerBillingPage /></ManagerRoute>} />
      <Route path="/manager/reports" element={<ManagerRoute><ManagerReportsPage /></ManagerRoute>} />
      <Route path="/manager/feedback" element={<ManagerRoute><ManagerFeedbackPage /></ManagerRoute>} />
      <Route path="/manager/notifications" element={<ManagerRoute><ManagerNotificationsPage /></ManagerRoute>} />
      <Route path="/manager/settings" element={<ManagerRoute><ManagerSettingsPage /></ManagerRoute>} />
      <Route path="/manager/change-password" element={<ProtectedRoute allowedRoles={['manager']}><ChangePasswordPage /></ProtectedRoute>} />
      <Route path="/manager/*" element={<ManagerRoute><ManagerDashboardPage /></ManagerRoute>} />
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
