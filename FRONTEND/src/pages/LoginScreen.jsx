import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getOrganizations, login } from '../lib/api.js'

export default function LoginScreen() {
  const navigate = useNavigate()
  const [organizations, setOrganizations] = useState([])
  const [formData, setFormData] = useState({ email: '', password: '', organizationId: '' })
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let alive = true

    getOrganizations()
      .then((data) => {
        if (!alive) {
          return
        }

        setOrganizations(data)
        setFormData((current) => ({
          ...current,
          organizationId: current.organizationId || data[0]?._id || ''
        }))
      })
      .catch(() => {
        if (alive) {
          setMessage('Unable to load organizations from the backend.')
        }
      })
      .finally(() => {
        if (alive) {
          setInitialLoading(false)
        }
      })

    return () => {
      alive = false
    }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await login(formData)
      localStorage.setItem('karwaan_token', response.token)
      localStorage.setItem('karwaan_user', JSON.stringify(response.user))
      navigate('/dashboard')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell center">
      <div className="hero-card" style={{ maxWidth: 520 }}>
        <div className="topbar">
          <div className="brand"><span>🚗</span><span>KarWaan</span></div>
          <span className="pill">Employee login</span>
        </div>

        <h2 className="title" style={{ fontSize: '1.7rem' }}>Welcome back</h2>
        <p className="subtitle">Select your organization and continue to your commute dashboard.</p>
        <p className="muted" style={{ marginTop: 0 }}>
          {initialLoading ? 'Loading organizations...' : 'Organizations loaded from the backend.'}
        </p>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="khush@odoo.com"
            value={formData.email}
            onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
            required
          />

          <label>Organization</label>
          <select
            value={formData.organizationId}
            onChange={(event) => setFormData((current) => ({ ...current, organizationId: event.target.value }))}
            required
          >
            <option value="">Select organization</option>
            {organizations.map((organization) => (
              <option key={organization._id} value={organization._id}>{organization.name}</option>
            ))}
          </select>

          {message && <p className="muted" style={{ marginTop: 0 }}>{message}</p>}

          <button className="primary-btn" style={{ width: '100%' }} disabled={loading || initialLoading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
          
          <div className="grid grid-2 mt-3" style={{ gap: 8 }}>
            <button type="button" className="secondary-btn" onClick={() => {
              setFormData(f => ({ ...f, email: 'admin@odoo.com', password: 'Password123' }))
            }}>Use Admin</button>
            <button type="button" className="secondary-btn" onClick={() => {
              setFormData(f => ({ ...f, email: 'khush@odoo.com', password: 'Password123' }))
            }}>Use Employee</button>
          </div>

          <p className="muted mt-3">
            New here? <Link to="/signup">Create New Account</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
