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
    <div className="app-shell center">
      <div className="hero-card center">
        <div className="brand">
          <span>🚗</span>
          <span>KarWaan</span>
        </div>
        <h1 className="title">Ride Together, Save Together</h1>
        <p className="subtitle">One secure employee commute platform for finding, sharing, and tracking rides.</p>
        <p className="muted" style={{ marginTop: 0, marginBottom: 18 }}>
          {loading ? 'Loading organizations from the backend...' : `${organizations.length} organizations connected.`}
        </p>
        {organizations.length > 0 && (
          <div className="row" style={{ justifyContent: 'center', flexWrap: 'wrap', marginBottom: 18 }}>
            {organizations.slice(0, 4).map((organization) => (
              <span key={organization._id} className="badge">{organization.name}</span>
            ))}
          </div>
        )}
        <div className="row" style={{ justifyContent: 'center' }}>
          <Link to="/login"><button className="primary-btn">Login</button></Link>
          <Link to="/signup"><button className="secondary-btn">Create account</button></Link>
        </div>
      </div>
    </div>
  )
}
