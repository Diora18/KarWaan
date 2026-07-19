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

  const [errors, setErrors] = useState({})

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setErrors({})

    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Full name is required'
    else if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters'
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits'
    
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'
    
    if (!formData.organizationId) newErrors.organizationId = 'Please select an organization'
    
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }} noValidate>
          <div className="grid grid-2" style={{ gap: '1.2rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Khush Patel"
                value={formData.name}
                onChange={(event) => { setFormData((current) => ({ ...current, name: event.target.value })); if(errors.name) setErrors(e => ({...e, name: ''})) }}
                style={{ borderColor: errors.name ? 'var(--danger)' : undefined }}
              />
              {errors.name && <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.2rem' }}>{errors.name}</div>}
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Phone</label>
              <input
                type="text"
                placeholder="9876543210"
                value={formData.phone}
                onChange={(event) => { setFormData((current) => ({ ...current, phone: event.target.value })); if(errors.phone) setErrors(e => ({...e, phone: ''})) }}
                style={{ borderColor: errors.phone ? 'var(--danger)' : undefined }}
              />
              {errors.phone && <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.2rem' }}>{errors.phone}</div>}
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Email Address</label>
              <input
                type="email"
                placeholder="khush@odoo.com"
                value={formData.email}
                onChange={(event) => { setFormData((current) => ({ ...current, email: event.target.value })); if(errors.email) setErrors(e => ({...e, email: ''})) }}
                style={{ borderColor: errors.email ? 'var(--danger)' : undefined }}
              />
              {errors.email && <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.2rem' }}>{errors.email}</div>}
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Organization</label>
              <select
                value={formData.organizationId}
                onChange={(event) => { setFormData((current) => ({ ...current, organizationId: event.target.value })); if(errors.organizationId) setErrors(e => ({...e, organizationId: ''})) }}
                style={{ borderColor: errors.organizationId ? 'var(--danger)' : undefined }}
              >
                <option value="">Select organization</option>
                {organizations.map((organization) => (
                  <option key={organization._id} value={organization._id}>{organization.name}</option>
                ))}
              </select>
              {errors.organizationId && <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.2rem' }}>{errors.organizationId}</div>}
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Password</label>
              <input
                type="password"
                placeholder="Create password"
                value={formData.password}
                onChange={(event) => { setFormData((current) => ({ ...current, password: event.target.value })); if(errors.password) setErrors(e => ({...e, password: ''})) }}
                style={{ borderColor: errors.password ? 'var(--danger)' : undefined }}
              />
              {errors.password && <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.2rem' }}>{errors.password}</div>}
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(event) => { setFormData((current) => ({ ...current, confirmPassword: event.target.value })); if(errors.confirmPassword) setErrors(e => ({...e, confirmPassword: ''})) }}
                style={{ borderColor: errors.confirmPassword ? 'var(--danger)' : undefined }}
              />
              {errors.confirmPassword && <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.2rem' }}>{errors.confirmPassword}</div>}
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
