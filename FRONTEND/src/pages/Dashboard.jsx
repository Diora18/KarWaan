import { Link } from 'react-router-dom'

const quickActions = [
  { title: 'Find a Ride', path: '/find-ride', icon: '🧭' },
  { title: 'Offer a Ride', path: '/offer-ride', icon: '🚘' },
  { title: 'My Trips', path: '/my-trips', icon: '🗓️' },
  { title: 'Ride History', path: '/history', icon: '📜' },
]

export default function Dashboard() {
  return (
    <div className="app-shell">
      <div className="hero-card">
        <div className="topbar">
          <div className="brand"><span>🚗</span><span>KarWaan</span></div>
          <span className="badge">Employee dashboard</span>
        </div>

        <div className="grid grid-2">
          <div className="panel">
            <h2 className="title" style={{ fontSize: '1.8rem' }}>Good morning, Khush</h2>
            <p className="subtitle">Plan your commute, discover rides, and keep your wallet ready.</p>
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
              <div className="card">
                <div className="muted">Wallet</div>
                <strong>₹ 540</strong>
              </div>
              <div className="card">
                <div className="muted">Today’s rides</div>
                <strong>3</strong>
              </div>
              <div className="card">
                <div className="muted">Saved places</div>
                <strong>2</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
