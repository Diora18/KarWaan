import { Link } from 'react-router-dom'

export default function LoginScreen() {
  return (
    <div className="app-shell center">
      <div className="hero-card" style={{ maxWidth: 520 }}>
        <div className="topbar">
          <div className="brand"><span>🚗</span><span>KarWaan</span></div>
          <span className="pill">Employee login</span>
        </div>

        <h2 className="title" style={{ fontSize: '1.7rem' }}>Welcome back</h2>
        <p className="subtitle">Select your organization and continue to your commute dashboard.</p>

        <form>
          <label>Email / Mobile</label>
          <input type="text" placeholder="khush@odoo.com" />

          <label>Password</label>
          <input type="password" placeholder="••••••••" />

          <label>Organization</label>
          <select>
            <option>Odoo Pvt. Ltd.</option>
            <option>Google LLC</option>
          </select>

          <button className="primary-btn" style={{ width: '100%' }}>Login</button>
          <p className="muted mt-3">
            New here? <Link to="/signup">Create New Account</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
