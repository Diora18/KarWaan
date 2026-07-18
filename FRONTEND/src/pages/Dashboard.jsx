import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStoredSession } from '../lib/auth.js'
import { getProfile, getMyTrips } from '../lib/api.js'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const { user: initialUser } = getStoredSession() || {}
  const [user, setUser] = useState(initialUser || {})
  const [activeRides, setActiveRides] = useState(0)
  
  useEffect(() => {
    let alive = true
    
    getProfile().then(data => {
      if (alive && data.user) {
        setUser(data.user)
        localStorage.setItem('karwaan_user', JSON.stringify(data.user))
      }
    }).catch(console.error)

    getMyTrips().then(trips => {
      if (alive) {
        const active = trips.filter(t => !['Completed', 'Cancelled'].includes(t.status))
        setActiveRides(active.length)
      }
    }).catch(console.error)
    
    return () => { alive = false }
  }, [])

  return (
    <div className="app-shell">
      <header className="page-header">
        <div className="page-header-row">
          <div>
            <p className="page-eyebrow">Dashboard</p>
            <h1>{getGreeting()}, {user?.name?.split(' ')[0] || 'User'}</h1>
            <p className="page-subtitle">Where are we going today?</p>
          </div>
          {user?.role === 'Admin' && (
            <Link to="/admin" className="secondary-btn" style={{ textDecoration: 'none' }}>
              Admin Console
            </Link>
          )}
        </div>
      </header>

      <div className="grid grid-2 mb-lg">
        <Link to="/find-ride" className="card card--interactive action-card action-card--primary">
          <div className="action-card-icon">🧭</div>
          <div>
            <h2>Find a Ride</h2>
            <p>Search for available carpools matching your commute.</p>
          </div>
        </Link>
        
        <Link to="/offer-ride" className="card card--interactive action-card action-card--secondary">
          <div className="action-card-icon">🚘</div>
          <div>
            <h2>Offer a Ride</h2>
            <p className="muted">Driving somewhere? Share your empty seats and earn.</p>
          </div>
        </Link>
      </div>

      <h3 className="section-title">Overview</h3>
      <div className="grid grid-3">
        <Link to="/wallet" className="card card--interactive stat-card">
          <div className="stat-card-icon">💳</div>
          <div>
            <div className="stat-card-label">Wallet Balance</div>
            <div className="stat-card-value">₹ {user?.walletBalance || 0}</div>
          </div>
        </Link>

        <Link to="/my-trips" className="card card--interactive stat-card">
          <div className="stat-card-icon">🗓️</div>
          <div>
            <div className="stat-card-label">Active Trips</div>
            <div className="stat-card-value">{activeRides}</div>
          </div>
        </Link>

        <Link to="/vehicles" className="card card--interactive stat-card">
          <div className="stat-card-icon">🚙</div>
          <div>
            <div className="stat-card-label">My Vehicles</div>
            <div className="stat-card-value">Manage</div>
          </div>
        </Link>
      </div>
    </div>
  )
}
