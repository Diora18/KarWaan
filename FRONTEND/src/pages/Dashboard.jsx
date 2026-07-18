import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStoredSession } from '../lib/auth.js'
import { getProfile, getMyTrips } from '../lib/api.js'

const quickActions = [
  { title: 'Find a Ride', path: '/find-ride', icon: '🧭' },
  { title: 'Offer a Ride', path: '/offer-ride', icon: '🚘' },
  { title: 'My Vehicles', path: '/vehicles', icon: '🚙' },
  { title: 'My Trips', path: '/my-trips', icon: '🗓️' },
]

export default function Dashboard() {
  const { user: initialUser } = getStoredSession() || {}
  const [user, setUser] = useState(initialUser || {})
  const [activeRides, setActiveRides] = useState(0)
  
  useEffect(() => {
    let alive = true
    
    // Fetch profile to get real wallet balance
    getProfile().then(data => {
      if (alive && data.user) {
        setUser(data.user)
        // Update local storage so other components have fresh data
        localStorage.setItem('karwaan_user', JSON.stringify(data.user))
      }
    }).catch(console.error)

    // Fetch trips to get count of today's rides
    getMyTrips().then(trips => {
      if (alive) {
        // Count trips that are not completed/cancelled
        const active = trips.filter(t => !['Trip Completed', 'Cancelled'].includes(t.status))
        setActiveRides(active.length)
      }
    }).catch(console.error)
    
    return () => { alive = false }
  }, [])

  return (
    <div className="app-shell">
      <div className="hero-card">
        <div className="topbar">
          <div className="brand"><span>🚗</span><span>KarWaan</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="badge">Employee dashboard</span>
            <button 
              className="secondary-btn" 
              style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem' }}
              onClick={() => {
                localStorage.removeItem('karwaan_token')
                localStorage.removeItem('karwaan_user')
                window.location.href = '/login'
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-2">
          <div className="panel">
            <div className="space-between" style={{ alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h2 className="title" style={{ fontSize: '1.8rem', margin: 0 }}>Good morning, {user?.name?.split(' ')[0] || 'User'}</h2>
                <p className="subtitle" style={{ margin: '0.5rem 0 0 0' }}>Plan your commute, discover rides, and keep your wallet ready.</p>
              </div>
              {user?.role === 'Admin' && (
                <Link 
                  to="/admin" 
                  className="primary-btn" 
                  style={{ background: '#3b82f6', padding: '0.5rem 1rem', fontSize: '0.9rem', textDecoration: 'none', display: 'inline-block' }}
                >
                  🛡️ Admin Console
                </Link>
              )}
            </div>
            <div className="grid grid-2">
              {quickActions.map((item) => (
                <Link to={item.path} key={item.title}>
                  <div className="card">
                    <div style={{ fontSize: '1.8rem' }}>{item.icon}</div>
                    <strong>{item.title}</strong>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="panel">
            <h3>Commute snapshot</h3>
            <div className="grid grid-3">
              <Link to="/wallet" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="muted">Wallet</div>
                <strong>₹ {user?.walletBalance || 0}</strong>
              </Link>
              <div className="card">
                <div className="muted">Active trips</div>
                <strong>{activeRides}</strong>
              </div>
              <div className="card">
                <div className="muted">Saved places</div>
                <strong>{user?.savedPlaces ? Object.keys(user.savedPlaces).length : 0}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
