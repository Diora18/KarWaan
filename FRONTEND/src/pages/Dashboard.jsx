import { Link } from 'react-router-dom'

const LogoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="url(#brandGrad)" />
    <path d="M8 18.5V21C8 21.55 8.45 22 9 22H10C10.55 22 11 21.55 11 21V20.5C11 19.67 11.67 19 12.5 19H13.5C14.33 19 15 19.67 15 20.5V21C15 21.55 15.45 22 16 22H17C17.55 22 18 21.55 18 21V18.5M18 16.5V15C18 13.34 16.66 12 15 12H11C9.34 12 8 13.34 8 15V16.5M7 17.5C7 17.22 7.22 17 7.5 17H18.5C18.78 17 19 17.22 19 17.5V18.5C19 18.78 18.78 19 18.5 19H7.5C7.22 19 7 18.78 7 18.5V17.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="brandGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1" />
        <stop offset="1" stopColor="#4f46e5" />
      </linearGradient>
    </defs>
  </svg>
)

const CompassIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
)

const CarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
    <circle cx="7" cy="17" r="2"/>
    <path d="M9 17h6"/>
    <circle cx="17" cy="17" r="2"/>
  </svg>
)

const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

const HistoryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <polyline points="3 3 3 8 8 8"/>
    <line x1="12" y1="7" x2="12" y2="12"/>
    <line x1="12" y1="12" x2="16" y2="14"/>
  </svg>
)

export const Navigation = ({ activePath }) => (
  <nav className="app-nav">
    <Link to="/dashboard" className={`nav-link ${activePath === 'dashboard' ? 'active' : ''}`}>Overview</Link>
    <Link to="/find-ride" className={`nav-link ${activePath === 'find-ride' ? 'active' : ''}`}>Find Ride</Link>
    <Link to="/offer-ride" className={`nav-link ${activePath === 'offer-ride' ? 'active' : ''}`}>Offer Ride</Link>
    <Link to="/my-trips" className={`nav-link ${activePath === 'my-trips' ? 'active' : ''}`}>My Trips</Link>
    <Link to="/history" className={`nav-link ${activePath === 'history' ? 'active' : ''}`}>History</Link>
    <Link to="/admin" className={`nav-link ${activePath === 'admin' ? 'active' : ''}`}>Admin</Link>
  </nav>
)

const quickActions = [
  { title: 'Find a Ride', path: '/find-ride', icon: <CompassIcon />, desc: 'Search for available car seats' },
  { title: 'Offer a Ride', path: '/offer-ride', icon: <CarIcon />, desc: 'Publish seat details for colleagues' },
  { title: 'My Trips', path: '/my-trips', icon: <CalendarIcon />, desc: 'View live/upcoming matching stats' },
  { title: 'Ride History', path: '/history', icon: <HistoryIcon />, desc: 'Inspect past commute logs' },
]

export default function Dashboard() {
  return (
    <div className="app-shell">
      <div className="hero-card">
        <div className="topbar">
          <div className="brand">
            <LogoIcon />
            <span>KarWaan</span>
          </div>
          <span className="badge">Employee Workspace</span>
        </div>

        <Navigation activePath="dashboard" />

        <div className="grid grid-2" style={{ marginTop: 12 }}>
          <div className="panel">
            <h2 className="title" style={{ fontSize: '1.8rem', marginBottom: 6 }}>Good morning, Khush</h2>
            <p className="subtitle" style={{ fontSize: '0.95rem', marginBottom: 28 }}>
              Configure your daily route schedules, share coordinates, and review pool activity.
            </p>
            <div className="grid grid-2">
              {quickActions.map((item) => (
                <Link to={item.path} key={item.title}>
                  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
                    <div style={{ color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.1)', width: 44, height: 44, borderRadius: 10, display: 'grid', placeItems: 'center' }}>
                      {item.icon}
                    </div>
                    <div>
                      <strong style={{ display: 'block', marginBottom: 4, color: 'var(--text-main)' }}>{item.title}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.desc}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="panel" style={{ justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 18, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>
                Commute Balance & Metrics
              </h3>
              <div className="grid grid-3" style={{ marginBottom: 24 }}>
                <div className="card" style={{ padding: '16px 12px', textAlign: 'center' }}>
                  <div className="muted" style={{ fontSize: '0.8rem', marginBottom: 6 }}>Wallet Balance</div>
                  <strong style={{ fontSize: '1.4rem', color: '#10b981' }}>₹ 540</strong>
                </div>
                <div className="card" style={{ padding: '16px 12px', textAlign: 'center' }}>
                  <div className="muted" style={{ fontSize: '0.8rem', marginBottom: 6 }}>Monthly Rides</div>
                  <strong style={{ fontSize: '1.4rem' }}>24</strong>
                </div>
                <div className="card" style={{ padding: '16px 12px', textAlign: 'center' }}>
                  <div className="muted" style={{ fontSize: '0.8rem', marginBottom: 6 }}>CO₂ Saved</div>
                  <strong style={{ fontSize: '1.4rem', color: '#0ea5e9' }}>14kg</strong>
                </div>
              </div>
            </div>

            <div className="card" style={{ background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.15)' }}>
              <div className="space-between" style={{ marginBottom: 8 }}>
                <strong style={{ fontSize: '0.95rem' }}>Upcoming Commute</strong>
                <div className="row" style={{ gap: 6 }}>
                  <span className="pulse-indicator"></span>
                  <span className="text-dark" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Booked</span>
                </div>
              </div>
              <p className="muted" style={{ fontSize: '0.85rem' }}>
                Raj's Toyota Corolla is scheduled to pickup at 08:30 AM tomorrow from Home / Sector 24.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
