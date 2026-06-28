import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import HostLandingPage from './pages/HostLandingPage'
import HostLogin from './pages/HostLogin'
import HostSignup from './pages/HostSignup'
import HostPortalPage from './pages/HostPortalPage'
import CountryPage from './pages/CountryPage'
import HotelDetailPage from './pages/HotelDetailPage'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/become-a-host" element={<HostLandingPage />} />
        <Route path="/host/login" element={<HostLogin />} />
        <Route path="/host/signup" element={<HostSignup />} />
        <Route path="/host" element={<HostLandingPage />} />
        <Route path="/host/portal" element={<HostPortalPage />} />
        <Route path="/country/:code" element={<CountryPage />} />
        <Route path="/hotel/:id" element={<HotelDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
