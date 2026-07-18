import { NavLink, useNavigate } from 'react-router-dom'
import { getStoredSession } from '../lib/auth.js'

export default function Navbar() {
  const navigate = useNavigate()
  const { user } = getStoredSession() || {}

  if (!user) return null

  const links = [
    { to: '/dashboard', label: 'Home', icon: '' },
    { to: '/find-ride', label: 'Find Ride', icon: '' },
    { to: '/offer-ride', label: 'Offer Ride', icon: '' },
    { to: '/my-trips', label: 'My Trips', icon: '' },
    { to: '/vehicles', label: 'Vehicles', icon: '' },
    { to: '/wallet', label: 'Wallet', icon: '' },
    { to: '/history', label: 'History', icon: '' },
  ]

  if (user.role === 'Admin') {
    links.push({ to: '/admin', label: 'Admin', icon: '🛡️' })
  }

  const handleLogout = () => {
    localStorage.removeItem('karwaan_token')
    localStorage.removeItem('karwaan_user')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/dashboard" className="navbar-brand">
          <span className="navbar-logo">🚗</span>
          <span className="navbar-title">KarWaan</span>
        </NavLink>

        <div className="navbar-links">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `navbar-link ${isActive ? 'navbar-link--active' : ''}`}
            >
              <span className="navbar-link-icon">{link.icon}</span>
              <span className="navbar-link-label">{link.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="navbar-right">
          <span className="navbar-user">{user.name?.split(' ')[0]}</span>
          <button className="navbar-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  )
}
