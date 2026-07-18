import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import SplashScreen from './pages/SplashScreen.jsx'
import LoginScreen from './pages/LoginScreen.jsx'
import SignupScreen from './pages/SignupScreen.jsx'
import Dashboard from './pages/Dashboard.jsx'
import FindRidePage from './pages/FindRidePage.jsx'
import OfferRidePage from './pages/OfferRidePage.jsx'
import MyTripsPage from './pages/MyTripsPage.jsx'
import RideHistoryPage from './pages/RideHistoryPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import VehiclesPage from './pages/VehiclesPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import WalletPage from './pages/WalletPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import LiveTrackingPage from './pages/LiveTrackingPage.jsx'
import Navbar from './components/Navbar.jsx'

const noNavbarRoutes = ['/', '/login', '/signup']

function AppLayout({ children }) {
  const location = useLocation()
  const showNavbar = !noNavbarRoutes.includes(location.pathname)

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  )
}

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignupScreen />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/find-ride" element={<ProtectedRoute><FindRidePage /></ProtectedRoute>} />
        <Route path="/offer-ride" element={<ProtectedRoute><OfferRidePage /></ProtectedRoute>} />
        <Route path="/vehicles" element={<ProtectedRoute><VehiclesPage /></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
        <Route path="/chat/:rideId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/track/:rideId" element={<ProtectedRoute><LiveTrackingPage /></ProtectedRoute>} />
        <Route path="/my-trips" element={<ProtectedRoute><MyTripsPage /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><RideHistoryPage /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  )
}

export default App
