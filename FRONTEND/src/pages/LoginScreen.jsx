import { Link, useNavigate } from 'react-router-dom'

const LogoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="url(#brandGrad)" />
    <path d="M8 18.5V21C8 21.55 8.45 22 9 22H10C10.55 22 11 21.55 11 21V20.5C11 19.67 11.67 19 12.5 19H13.5C14.33 19 15 19.67 15 20.5V21C15 21.55 15.45 22 16 22H17C17.55 22 18 21.55 18 21V18.5M18 16.5V15C18 13.34 16.66 12 15 12H11C9.34 12 8 13.34 8 15V16.5M7 17.5C7 17.22 7.22 17 7.5 17H18.5C18.78 17 19 17.22 19 17.5V18.5C19 18.78 18.78 19 18.5 19H7.5C7.22 19 7 18.78 7 18.5V17.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="brandGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1" />
        <stop offset="1" stopColor="#4f46e5" />
      </linearGradient>
    </defs>
  </svg>
)

export default function LoginScreen() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  }

  return (
    <div className="app-shell center">
      <div className="hero-card animate-fade" style={{ maxWidth: 500, padding: '40px 32px' }}>
        <div className="topbar">
          <div className="brand">
            <LogoIcon />
            <span>KarWaan</span>
          </div>
          <span className="pill">Corporate Pool</span>
        </div>

        <h2 className="title" style={{ fontSize: '1.8rem', marginBottom: 8 }}>Welcome back</h2>
        <p className="subtitle" style={{ fontSize: '0.95rem', marginBottom: 28 }}>
          Select your organization workspace to access your commute dashboard.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email-input">Work Email Address</label>
          <input 
            id="email-input"
            type="email" 
            placeholder="name@company.com" 
            required 
          />

          <label htmlFor="password-input">Password</label>
          <input 
            id="password-input"
            type="password" 
            placeholder="••••••••" 
            required 
          />

          <label htmlFor="org-select">Organization</label>
          <select id="org-select" defaultValue="odoo">
            <option value="odoo">Odoo Pvt. Ltd.</option>
            <option value="google">Google LLC</option>
            <option value="meta">Meta India</option>
          </select>

          <button type="submit" className="primary-btn" style={{ width: '100%', marginTop: 8 }}>
            Sign In to Dashboard
          </button>
          
          <p className="muted mt-3" style={{ fontSize: '0.9rem', textAlign: 'center' }}>
            New here? <Link to="/signup" style={{ marginLeft: 4 }}>Create custom account</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
