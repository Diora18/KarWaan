import { Link } from 'react-router-dom'

export default function SignupScreen() {
  return (
    <div className="app-shell center">
      <div className="hero-card" style={{ maxWidth: 680 }}>
        <div className="topbar">
          <div className="brand"><span>🚗</span><span>KarWaan</span></div>
          <span className="pill">Create account</span>
        </div>

        <h2 className="title" style={{ fontSize: '1.7rem' }}>Join your organization pool</h2>
        <p className="subtitle">Sign up to request approval from your company admin.</p>

        <form className="grid grid-2">
          <div>
            <label>Full Name</label>
            <input type="text" placeholder="Khush Patel" />
          </div>
          <div>
            <label>Phone</label>
            <input type="text" placeholder="+91 98765 43210" />
          </div>
          <div>
            <label>Email</label>
            <input type="email" placeholder="khush@odoo.com" />
          </div>
          <div>
            <label>Organization</label>
            <select>
              <option>Odoo Pvt. Ltd.</option>
              <option>Google LLC</option>
            </select>
          </div>
          <div>
            <label>Password</label>
            <input type="password" placeholder="Create password" />
          </div>
          <div>
            <label>Confirm Password</label>
            <input type="password" placeholder="Confirm password" />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <button className="primary-btn" style={{ width: '100%' }}>Register account</button>
            <p className="muted mt-3">Already have access? <Link to="/login">Login</Link></p>
          </div>
        </form>
      </div>
    </div>
  )
}
