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
      setTimeout(() => {
        navigate('/login')
      }, 1200)
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell center">
      <div className="hero-card" style={{ maxWidth: 680 }}>
        <div className="topbar">
          <div className="brand"><span>🚗</span><span>KarWaan</span></div>
          <span className="pill">Create account</span>
        </div>

        <h2 className="title" style={{ fontSize: '1.7rem' }}>Join your organization pool</h2>
        <p className="subtitle">Sign up to request approval from your company admin.</p>
        <p className="muted" style={{ marginTop: 0 }}>
          {initialLoading ? 'Loading organizations...' : 'Organizations loaded from the backend.'}
        </p>

        <form className="grid grid-2" onSubmit={handleSubmit}>
          <div>
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Khush Patel"
              value={formData.name}
              onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
              required
            />
          </div>
          <div>
            <label>Phone</label>
            <input
              type="text"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))}
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              placeholder="khush@odoo.com"
              value={formData.email}
              onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
              required
            />
          </div>
          <div>
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
          <div>
            <label>Password</label>
            <input
              type="password"
              placeholder="Create password"
              value={formData.password}
              onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
              required
            />
          </div>
          <div>
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={(event) => setFormData((current) => ({ ...current, confirmPassword: event.target.value }))}
              required
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            {message && <p className="muted" style={{ marginTop: 0 }}>{message}</p>}
            <button className="primary-btn" style={{ width: '100%' }} disabled={loading || initialLoading}>
              {loading ? 'Submitting...' : 'Register account'}
            </button>
            <p className="muted mt-3">Already have access? <Link to="/login">Login</Link></p>
          </div>
        </form>
      </div>
    </div>
  )
}
