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
        if (alive) setOrganizations(data)
      })
      .catch(() => {
        if (alive) setOrganizations([])
      })
      .finally(() => {
        if (alive) setLoading(false)
      })

    return () => { alive = false }
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', padding: '1rem', background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: 600, width: '100%', textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem', display: 'inline-block', background: 'white', padding: '1.5rem', borderRadius: '50%', boxShadow: 'var(--shadow-md)' }}>🚗</div>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--text-primary)', letterSpacing: '-0.05em' }}>KarWaan</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6', maxWidth: 450, margin: '0 auto 2rem' }}>
          Ride together, save together. One secure platform for finding, sharing, and tracking employee rides.
        </p>

        <p className="muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {loading ? 'Connecting to backend...' : `${organizations.length} organizations connected`}
        </p>

        {organizations.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '3rem' }}>
            {organizations.slice(0, 4).map((org) => (
              <span key={org._id} className="pill" style={{ background: 'white', border: '1px solid var(--border)' }}>{org.name}</span>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
          <Link to="/login" style={{ flex: 1, maxWidth: 200 }}>
            <button className="primary-btn" style={{ width: '100%', padding: '0.8rem 0' }}>Sign in</button>
          </Link>
          <Link to="/signup" style={{ flex: 1, maxWidth: 200 }}>
            <button className="secondary-btn" style={{ width: '100%', padding: '0.8rem 0' }}>Create account</button>
          </Link>
        </div>
      </div>
    </div>
  )
}
