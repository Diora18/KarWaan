import { Navigate, useLocation } from 'react-router-dom'
import { getStoredSession } from '../lib/auth.js'

export default function AdminRoute({ children }) {
  const location = useLocation()
  const { token, user } = getStoredSession()

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (user?.role !== 'Admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}