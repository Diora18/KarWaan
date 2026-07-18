export default function RideHistoryPage() {
  return (
    <div className="app-shell">
      <div className="hero-card">
        <div className="topbar">
          <div className="brand"><span>📜</span><span>Ride History</span></div>
          <span className="badge">Past journeys</span>
        </div>

        <div className="grid grid-3">
          <div className="card">
            <strong>Mon, 08:30</strong>
            <p className="muted">Home → Office • ₹120</p>
          </div>
          <div className="card">
            <strong>Tue, 09:15</strong>
            <p className="muted">Office → Sector 24 • ₹140</p>
          </div>
          <div className="card">
            <strong>Wed, 08:45</strong>
            <p className="muted">Home → Google Hub • ₹180</p>
          </div>
        </div>
      </div>
    </div>
  )
}
