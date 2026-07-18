import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getOrganizations } from '../lib/api.js'

export default function SplashScreen() {
  const [organizations, setOrganizations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true

    getOrganizations()
      .then((data) => {
        if (alive) {
          setOrganizations(data)
        }
      })
      .catch(() => {
        if (alive) {
          setOrganizations([])
        }
      })
      .finally(() => {
        if (alive) {
          setLoading(false)
        }
      })

    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="app-shell center" style={{ minHeight: '100vh' }}>
      <div className="hero-card center" style={{ maxWidth: 560, padding: '48px 40px' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🚗</div>
        <h1 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '2.8rem',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #0ea5e9, #6366f1, #a78bfa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.03em',
          marginBottom: '0.3rem'
        }}>
          KarWaan
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: 'var(--text-secondary)',
          marginBottom: '2rem',
          maxWidth: 380
        }}>
          Ride Together, Save Together. One secure platform for finding, sharing, and tracking employee rides.
        </p>

        <p className="muted" style={{ marginBottom: '1.2rem' }}>
          {loading ? 'Connecting to backend...' : `${organizations.length} organizations connected`}
        </p>

        {organizations.length > 0 && (
          <div className="row" style={{ justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {organizations.slice(0, 4).map((org) => (
              <span key={org._id} className="badge">{org.name}</span>
            ))}
          </div>
        )}

        <div className="row" style={{ justifyContent: 'center', gap: '1rem' }}>
          <Link to="/login">
            <button className="primary-btn" style={{ padding: '12px 32px', fontSize: '1rem' }}>Login</button>
          </Link>
          <Link to="/signup">
            <button className="secondary-btn" style={{ padding: '12px 32px', fontSize: '1rem' }}>Create account</button>
          </Link>
        </div>
      </div>
    </div>
  )
}
