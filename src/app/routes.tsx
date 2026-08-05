import { lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '../shared/components/ProtectedRoute'

const LandingPage = lazy(() => import('../features/landing/pages/LandingPage'))
const LoginPage = lazy(() => import('../features/auth/pages/Login'))
const SignupPage = lazy(() => import('../features/auth/pages/Signup'))
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
