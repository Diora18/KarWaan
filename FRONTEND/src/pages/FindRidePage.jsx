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

export default function FindRidePage() {
  const [searched, setSearched] = useState(false)
  const [bookedRideId, setBookedRideId] = useState(null)

  const handleSearch = () => {
    setSearched(true)
  }

  const handleBook = (id) => {
    setBookedRideId(id)
  }

  const availableRides = [
    {
      id: 1,
      driver: 'Raj Patel',
      role: 'Backend Dev',
      vehicle: 'Toyota Corolla (GJ 01 AB 1234)',
      time: '08:30 AM',
      route: 'Home / Sector 24 → Gandhinagar Office',
      fare: 120,
      seats: 3
    },
    {
      id: 2,
      driver: 'Priya Sharma',
      role: 'UI Designer',
      vehicle: 'Maruti Ertiga (GJ 01 CD 5678)',
      time: '09:00 AM',
      route: 'Sector 24 → Gandhinagar Office',
      fare: 140,
      seats: 2
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
          <span className="badge">Find Colleagues</span>
        </div>

        <Navigation activePath="find-ride" />

        <div className="grid grid-2" style={{ marginTop: 12 }}>
          <div className="panel">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 18, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>
              Configure Route Settings
            </h3>
            
            <label htmlFor="pickup-input">Pickup Location</label>
            <input id="pickup-input" placeholder="e.g. Home / Sector 24" defaultValue="Home / Sector 24" />

            <label htmlFor="destination-input">Destination</label>
            <input id="destination-input" placeholder="e.g. Office / Gandhinagar" defaultValue="Office / Gandhinagar" />

            <label htmlFor="seats-select">Seats Needed</label>
            <select id="seats-select" defaultValue="1">
              <option value="1">1 Seat</option>
              <option value="2">2 Seats</option>
              <option value="3">3 Seats</option>
            </select>

            <button className="primary-btn" onClick={handleSearch} style={{ width: '100%' }}>
              Search Active Routes
            </button>
          </div>

          <div className="panel">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 18, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>
              {searched ? 'Active Matches Found' : 'Featured Route Matches'}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {availableRides.map((ride) => {
                const isBooked = bookedRideId === ride.id;
                return (
                  <div key={ride.id} className="card" style={{ background: isBooked ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255, 255, 255, 0.02)', borderColor: isBooked ? '#10b981' : 'var(--card-border)' }}>
                    <div className="space-between" style={{ marginBottom: 6 }}>
                      <div>
                        <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{ride.driver}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dark)', marginLeft: 8, borderLeft: '1px solid rgba(255, 255, 255, 0.1)', paddingLeft: 8 }}>{ride.role}</span>
                      </div>
                      <span className="pill" style={{ color: isBooked ? '#10b981' : 'var(--primary)', borderColor: isBooked ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)', background: isBooked ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.05)' }}>
                        {isBooked ? 'Booked' : `${ride.seats} seats remaining`}
                      </span>
                    </div>
                    
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                      🚙 {ride.vehicle}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 14 }}>
                      ⏰ {ride.time} • {ride.route}
                    </p>
                    
                    <div className="space-between">
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        ₹{ride.fare} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-dark)' }}>/ seat</span>
                      </span>
                      <button 
                        className={isBooked ? 'secondary-btn' : 'primary-btn'} 
                        style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                        onClick={() => handleBook(ride.id)}
                        disabled={isBooked}
                      >
                        {isBooked ? 'Cancel Seat' : 'Request Seat'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
