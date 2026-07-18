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

export default function OfferRidePage() {
  const [published, setPublished] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setPublished(true)
    setTimeout(() => {
      setPublished(false)
    }, 4000)
  }

  return (
    <div className="app-shell">
      <div className="hero-card">
        <div className="topbar">
          <div className="brand">
            <LogoIcon />
            <span>KarWaan</span>
          </div>
          <span className="badge">Share Commute</span>
        </div>

        <Navigation activePath="offer-ride" />

        <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
          <div className="grid grid-2">
            <div className="panel">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 18, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>
                Commute Coordinates
              </h3>
              
              <label htmlFor="pickup-input">Pickup Location</label>
              <input id="pickup-input" placeholder="e.g. Sector 24 / G-Road" required />
              
              <label htmlFor="destination-input">Destination</label>
              <input id="destination-input" placeholder="e.g. Gift City / Gandhinagar Office" required />
              
              <div className="grid grid-3" style={{ gap: 12 }}>
                <div>
                  <label htmlFor="time-input">Departure</label>
                  <input id="time-input" type="time" required />
                </div>
                <div>
                  <label htmlFor="seats-input">Seats</label>
                  <input id="seats-input" type="number" placeholder="3" min="1" max="6" required />
                </div>
                <div>
                  <label htmlFor="fare-input">Fare (₹)</label>
                  <input id="fare-input" type="number" placeholder="120" min="0" required />
                </div>
              </div>
            </div>

            <div className="panel" style={{ justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 18, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>
                  Vehicle Credentials
                </h3>
                
                <label htmlFor="vehicle-model">Vehicle Model</label>
                <input id="vehicle-model" placeholder="Toyota Corolla" required />
                
                <div className="grid grid-2" style={{ gap: 12 }}>
                  <div>
                    <label htmlFor="reg-num">License Plate</label>
                    <input id="reg-num" placeholder="GJ 01 AB 1234" required />
                  </div>
                  <div>
                    <label htmlFor="cap-input">Total Capacity</label>
                    <input id="cap-input" type="number" placeholder="4" min="1" required />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 20 }}>
                {published && (
                  <div className="card" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: '#10b981', color: '#10b981', padding: '12px 16px', marginBottom: 16, fontSize: '0.9rem', fontWeight: 600, textAlign: 'center', borderRadius: '8px' }}>
                    ✓ Ride successfully published to organization feed!
                  </div>
                )}
                <button type="submit" className="primary-btn" style={{ width: '100%' }}>
                  Publish Shared Route
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
