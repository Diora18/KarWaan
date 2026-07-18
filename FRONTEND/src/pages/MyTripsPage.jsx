import { useState } from 'react'
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

export default function MyTripsPage() {
  const [activeTrackingId, setActiveTrackingId] = useState(null)
  const [activeChatId, setActiveChatId] = useState(null)

  const toggleTracking = (id) => {
    setActiveTrackingId(activeTrackingId === id ? null : id)
  }

  const toggleChat = (id) => {
    setActiveChatId(activeChatId === id ? null : id)
  }

  return (
    <div className="app-shell">
      <div className="hero-card">
        <div className="topbar">
          <div className="brand">
            <LogoIcon />
            <span>KarWaan</span>
          </div>
          <span className="badge">Active Bookings</span>
        </div>

        <Navigation activePath="my-trips" />

        <div className="grid grid-2" style={{ marginTop: 12 }}>
          <div className="panel">
            <div className="space-between" style={{ marginBottom: 18 }}>
              <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>Trip: Home → Office</strong>
              <span className="pill" style={{ color: 'var(--primary)', borderColor: 'rgba(99, 102, 241, 0.2)', background: 'rgba(99, 102, 241, 0.05)' }}>
                Ride Booked
              </span>
            </div>
            
            <p className="muted" style={{ fontSize: '0.9rem', marginBottom: 14 }}>
              Driver: <strong>Raj Patel</strong> • Vehicle: <strong>Toyota Corolla</strong>
            </p>
            <p className="text-dark" style={{ fontSize: '0.85rem', marginBottom: 20 }}>
              Departure: <strong>08:30 AM</strong> • Pickup Point: Sector 24 Entrance Gate
            </p>
            
            <div style={{ marginTop: 'auto' }}>
              <button 
                className="secondary-btn" 
                style={{ width: '100%', marginBottom: 12 }}
                onClick={() => toggleTracking(1)}
              >
                {activeTrackingId === 1 ? 'Hide Live Map' : 'Track Driver Location'}
              </button>
              
              {activeTrackingId === 1 && (
                <div className="card" style={{ background: 'rgba(99, 102, 241, 0.03)', borderColor: 'var(--primary)', height: 140, display: 'grid', placeItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <div className="center">
                    <span className="pulse-indicator" style={{ marginBottom: 8 }}></span>
                    <span>Raj is 1.2 km away • ETA 4 minutes</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="panel">
            <div className="space-between" style={{ marginBottom: 18 }}>
              <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>Trip: Sector 24 → Office</strong>
              <div className="row" style={{ gap: 8 }}>
                <span className="pulse-indicator"></span>
                <span className="pill" style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.2)', background: 'rgba(16, 185, 129, 0.05)' }}>
                  In Progress
                </span>
              </div>
            </div>
            
            <p className="muted" style={{ fontSize: '0.9rem', marginBottom: 14 }}>
              Driver: <strong>Priya Sharma</strong> • Vehicle: <strong>Maruti Ertiga</strong>
            </p>
            <p className="text-dark" style={{ fontSize: '0.85rem', marginBottom: 20 }}>
              Departure: <strong>09:15 AM</strong> • Active passenger count: 2 colleagues
            </p>

            <div style={{ marginTop: 'auto' }}>
              <button 
                className="primary-btn" 
                style={{ width: '100%', marginBottom: 12 }}
                onClick={() => toggleChat(2)}
              >
                {activeChatId === 2 ? 'Close Route Chat' : 'Open Commute Chat'}
              </button>
              
              {activeChatId === 2 && (
                <div className="card" style={{ background: 'rgba(255,255,255,0.01)', maxHeight: 180, overflowY: 'auto', padding: 12 }}>
                  <div style={{ fontSize: '0.8rem', marginBottom: 8 }}>
                    <span style={{ color: '#818cf8', fontWeight: 'bold' }}>Priya:</span> I'm near the circle, please stay ready.
                  </div>
                  <div style={{ fontSize: '0.8rem', marginBottom: 8 }}>
                    <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>You:</span> Got it, walking to the pickup point now.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
