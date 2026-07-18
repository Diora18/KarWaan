export default function MyTripsPage() {
  return (
    <div className="app-shell">
      <div className="hero-card">
        <div className="topbar">
          <div className="brand"><span>🗓️</span><span>My Trips</span></div>
          <span className="badge">Live booking status</span>
        </div>

        <div className="grid grid-2">
          <div className="card">
            <strong>Trip: Home → Office</strong>
            <p className="muted">Driver: Raj • Status: Ride Booked</p>
            <button className="secondary-btn">Track ride</button>
          </div>
          <div className="card">
            <strong>Trip: Sector 24 → Office</strong>
            <p className="muted">Driver: Priya • Status: Trip Started</p>
            <button className="secondary-btn">Join chat</button>
          </div>
        </div>
      </div>
    </div>
  )
}
