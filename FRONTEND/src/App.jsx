import { Routes, Route, Navigate } from 'react-router-dom'
import SplashScreen from './pages/SplashScreen.jsx'
import LoginScreen from './pages/LoginScreen.jsx'
import SignupScreen from './pages/SignupScreen.jsx'
import Dashboard from './pages/Dashboard.jsx'
import FindRidePage from './pages/FindRidePage.jsx'
import OfferRidePage from './pages/OfferRidePage.jsx'
import MyTripsPage from './pages/MyTripsPage.jsx'
import RideHistoryPage from './pages/RideHistoryPage.jsx'
import AdminPage from './pages/AdminPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/signup" element={<SignupScreen />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/find-ride" element={<FindRidePage />} />
      <Route path="/offer-ride" element={<OfferRidePage />} />
      <Route path="/my-trips" element={<MyTripsPage />} />
      <Route path="/history" element={<RideHistoryPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
