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
        if (!alive) return
        setOrganizations(data)
        setFormData((current) => ({
          ...current,
          organizationId: current.organizationId || data[0]?._id || ''
        }))
      })
      .catch(() => {
        if (alive) setMessage('Unable to load organizations from the backend.')
      })
      .finally(() => {
        if (alive) setInitialLoading(false)
      })

    return () => { alive = false }
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'var(--bg-primary)' }}>
      <div className="card" style={{ maxWidth: 450, width: '100%', padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <img src="/logo.png" alt="KarWaan Logo" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Welcome to KarWaan</h2>
          <p className="muted">Sign in to your organization account.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="khush@odoo.com"
              value={formData.email}
              onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
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
          </div>

          {message && (
            <div style={{ padding: '0.8rem', borderRadius: 'var(--radius-sm)', background: 'var(--danger-bg)', color: 'var(--danger)', fontSize: '0.9rem', border: '1px solid #fca5a5' }}>
              {message}
            </div>
          )}

          <button className="primary-btn" disabled={loading || initialLoading} style={{ marginTop: '0.5rem', width: '100%', padding: '0.8rem' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button type="button" className="secondary-btn" style={{ flex: 1, padding: '0.5rem' }} onClick={() => {
              setFormData(f => ({ ...f, email: 'admin@odoo.com', password: 'Password123' }))
            }}>Use Admin</button>
            <button type="button" className="secondary-btn" style={{ flex: 1, padding: '0.5rem' }} onClick={() => {
              setFormData(f => ({ ...f, email: 'khush@odoo.com', password: 'Password123' }))
            }}>Use Employee</button>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            New here? <Link to="/signup" style={{ color: 'var(--accent)', fontWeight: 600 }}>Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
