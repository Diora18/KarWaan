import { Navigation } from './Dashboard.jsx'

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

export default function RideHistoryPage() {
  const historyData = [
    {
      id: 1,
      date: 'Mon, July 14',
      time: '08:30 AM',
      route: 'Home / Sector 24 → Gandhinagar Office',
      driver: 'Raj Patel',
      fare: 120,
      status: 'Paid via Wallet'
    },
    {
      id: 2,
      date: 'Tue, July 15',
      time: '09:15 AM',
      route: 'Gandhinagar Office → Home / Sector 24',
      driver: 'Priya Sharma',
      fare: 140,
      status: 'Paid via Wallet'
    },
    {
      id: 3,
      date: 'Wed, July 16',
      time: '08:45 AM',
      route: 'Home / Sector 24 → Google Hub',
      driver: 'Aravind Nair',
      fare: 180,
      status: 'Paid via Wallet'
    }
  ]

  return (
    <div className="app-shell">
      <div className="hero-card">
        <div className="topbar">
          <div className="brand">
            <LogoIcon />
            <span>KarWaan</span>
          </div>
          <span className="badge">Commute Ledger</span>
        </div>

        <Navigation activePath="history" />

        <div className="grid grid-3" style={{ marginTop: 12 }}>
          {historyData.map((item) => (
            <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="space-between" style={{ borderBottom: '1px solid var(--border-muted)', paddingBottom: 10 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>{item.date}</span>
                <span className="pill" style={{ fontSize: '0.75rem', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.2)', background: 'rgba(16, 185, 129, 0.05)', textTransform: 'none' }}>
                  {item.status}
                </span>
              </div>
              
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: 4 }}>
                  {item.route}
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Driver: {item.driver} • Time: {item.time}
                </span>
              </div>

              <div className="space-between" style={{ marginTop: 'auto', paddingTop: 10 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dark)' }}>Fare Charged</span>
                <strong style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>₹{item.fare}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
