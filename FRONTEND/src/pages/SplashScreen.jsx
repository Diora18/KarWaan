import { Link } from 'react-router-dom'

const LogoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="url(#brandGrad)" />
    <path d="M8 18.5V21C8 21.55 8.45 22 9 22H10C10.55 22 11 21.55 11 21V20.5C11 19.67 11.67 19 12.5 19H13.5C14.33 19 15 19.67 15 20.5V21C15 21.55 15.45 22 16 22H17C17.55 22 18 21.55 18 21V18.5M18 16.5V15C18 13.34 16.66 12 15 12H11C9.34 12 8 13.34 8 15V16.5M7 17.5C7 17.22 7.22 17 7.5 17H18.5C18.78 17 19 17.22 19 17.5V18.5C19 18.78 18.78 19 18.5 19H7.5C7.22 19 7 18.78 7 18.5V17.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="24" cy="14" r="2" fill="#10b981" />
    <path d="M22 20C23 18 25 18 26 20" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
    <defs>
      <linearGradient id="brandGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1" />
        <stop offset="1" stopColor="#4f46e5" />
      </linearGradient>
    </defs>
  </svg>
)

export default function SplashScreen() {
  return (
    <div className="app-shell center">
      <div className="hero-card center" style={{ maxWidth: 840, padding: '56px 40px' }}>
        <div className="brand" style={{ marginBottom: 24 }}>
          <LogoIcon />
          <span>KarWaan</span>
        </div>
        
        <h1 className="title" style={{ fontSize: '3rem', maxWidth: '680px', marginBottom: 16 }}>
          Corporate Ridesharing, Refined.
        </h1>
        <p className="subtitle" style={{ maxWidth: '580px', marginBottom: 40, fontSize: '1.15rem' }}>
          Connect with verified colleagues, optimize your daily commute, and build a sustainable route network for your organization.
        </p>
        
        <div className="row" style={{ justifyContent: 'center', marginBottom: 48 }}>
          <Link to="/login">
            <button className="primary-btn" style={{ padding: '14px 32px' }}>
              Sign In
            </button>
          </Link>
          <Link to="/signup">
            <button className="secondary-btn" style={{ padding: '14px 32px' }}>
              Create Account
            </button>
          </Link>
        </div>

        <div className="grid grid-3" style={{ width: '100%', borderTop: '1px solid var(--border-muted)', paddingTop: 40, textAlign: 'left' }}>
          <div className="card">
            <div style={{ color: '#818cf8', fontWeight: 'bold', marginBottom: 8, fontSize: '0.9rem', textTransform: 'uppercase' }}>01. Verified Pool</div>
            <strong style={{ display: 'block', marginBottom: 6, fontSize: '1.05rem' }}>Colleagues Only</strong>
            <p className="muted" style={{ fontSize: '0.9rem' }}>Access is restricted to authorized company domains and active emails.</p>
          </div>
          <div className="card">
            <div style={{ color: '#818cf8', fontWeight: 'bold', marginBottom: 8, fontSize: '0.9rem', textTransform: 'uppercase' }}>02. Smart Booking</div>
            <strong style={{ display: 'block', marginBottom: 6, fontSize: '1.05rem' }}>Real-time Routes</strong>
            <p className="muted" style={{ fontSize: '0.9rem' }}>Match with drivers heading exactly your way, with automatic ETA calculations.</p>
          </div>
          <div className="card">
            <div style={{ color: '#818cf8', fontWeight: 'bold', marginBottom: 8, fontSize: '0.9rem', textTransform: 'uppercase' }}>03. Seamless Splits</div>
            <strong style={{ display: 'block', marginBottom: 6, fontSize: '1.05rem' }}> cashless Wallet</strong>
            <p className="muted" style={{ fontSize: '0.9rem' }}>Fare calculations are fully automated and debited securely from your balance.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
