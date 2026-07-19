import { Navigate, useLocation } from 'react-router-dom'
import { getStoredSession } from '../lib/auth.js'

export default function ProtectedRoute({ children }) {
  const location = useLocation()
  const { token } = getStoredSession()

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}