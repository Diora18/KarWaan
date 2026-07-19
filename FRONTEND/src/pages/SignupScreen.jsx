import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getOrganizations, register } from '../lib/api.js'

export default function SignupScreen() {
  const navigate = useNavigate()
  const [organizations, setOrganizations] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationId: ''
  })
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
    setMessage('')

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const response = await register({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        organizationId: formData.organizationId
      })

      setMessage(response.message)
      setTimeout(() => navigate('/login'), 1200)
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'var(--bg-primary)' }}>
      <div className="card" style={{ maxWidth: 450, width: '100%', padding: '2.5rem 2rem', margin: '2rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <img src="/logo.png" alt="KarWaan Logo" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Create Account</h2>
          <p className="muted">Register to start carpooling with colleagues.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div className="grid grid-2" style={{ gap: '1.2rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Khush Patel"
                value={formData.name}
                onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Phone</label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))}
                required
              />
            </div>
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
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Password</label>
              <input
                type="password"
                placeholder="Create password"
                value={formData.password}
                onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(event) => setFormData((current) => ({ ...current, confirmPassword: event.target.value }))}
                required
              />
            </div>
          </div>

          {message && (
            <div style={{ padding: '0.8rem', borderRadius: 'var(--radius-sm)', background: message.includes('Successfully') || message.includes('success') ? 'var(--success-bg)' : 'var(--danger-bg)', color: message.includes('Successfully') || message.includes('success') ? 'var(--success)' : 'var(--danger)', fontSize: '0.9rem', border: `1px solid ${message.includes('Successfully') || message.includes('success') ? '#6ee7b7' : '#fca5a5'}` }}>
              {message}
            </div>
          )}

          <button className="primary-btn" disabled={loading || initialLoading} style={{ marginTop: '0.5rem', width: '100%', padding: '0.8rem' }}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
