import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStoredSession } from '../lib/auth.js'
import { getProfile, getMyTrips } from '../lib/api.js'

const quickActions = [
  { title: 'Find a Ride', path: '/find-ride', icon: '🧭', desc: 'Discover rides near you' },
  { title: 'Offer a Ride', path: '/offer-ride', icon: '🚘', desc: 'Share your commute' },
  { title: 'My Vehicles', path: '/vehicles', icon: '🚙', desc: 'Manage your fleet' },
  { title: 'My Trips', path: '/my-trips', icon: '🗓️', desc: 'View active bookings' },
]

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
      <div className="hero-card">
        <div style={{ marginBottom: '2rem' }}>
          <div className="space-between" style={{ alignItems: 'flex-start' }}>
            <div>
              <h2 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '2rem',
                fontWeight: 800,
                margin: '0 0 0.3rem 0',
                letterSpacing: '-0.03em'
              }}>
                {getGreeting()}, {user?.name?.split(' ')[0] || 'User'} 👋
              </h2>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                Plan your commute, discover rides, and keep your wallet ready.
              </p>
            </div>
            {user?.role === 'Admin' && (
              <Link 
                to="/admin" 
                className="primary-btn" 
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                🛡️ Admin
              </Link>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
          <Link to="/wallet" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="muted" style={{ marginBottom: 4 }}>💳 Wallet Balance</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--success)' }}>
              ₹ {user?.walletBalance || 0}
            </div>
          </Link>
          <Link to="/my-trips" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="muted" style={{ marginBottom: 4 }}>🗓️ Active Trips</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent)' }}>
              {activeRides}
            </div>
          </Link>
          <Link to="/history" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="muted" style={{ marginBottom: 4 }}>📜 Ride History</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              View all
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <h3 style={{ fontFamily: "'Outfit', sans-serif", marginBottom: '1rem' }}>Quick Actions</h3>
        <div className="grid grid-2">
          {quickActions.map((item) => (
            <Link to={item.path} key={item.title} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '2rem', flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <strong style={{ display: 'block', marginBottom: 2 }}>{item.title}</strong>
                  <span className="muted" style={{ fontSize: '0.82rem' }}>{item.desc}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
