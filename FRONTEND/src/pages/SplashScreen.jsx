import { Link } from 'react-router-dom'

export default function SplashScreen() {
  return (
    <div className="app-shell center">
      <div className="hero-card center">
        <div className="brand">
          <span>🚗</span>
          <span>KarWaan</span>
        </div>
        <h1 className="title">Ride Together, Save Together</h1>
        <p className="subtitle">One secure employee commute platform for finding, sharing, and tracking rides.</p>
        <div className="row" style={{ justifyContent: 'center' }}>
          <Link to="/login"><button className="primary-btn">Login</button></Link>
          <Link to="/signup"><button className="secondary-btn">Create account</button></Link>
        </div>
      </div>
    </div>
  )
}
