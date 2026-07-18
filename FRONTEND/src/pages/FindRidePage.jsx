export default function FindRidePage() {
  return (
    <div className="app-shell">
      <div className="hero-card">
        <div className="topbar">
          <div className="brand"><span>🧭</span><span>Find a Ride</span></div>
          <span className="badge">Search seats</span>
        </div>

        <div className="grid grid-2">
          <div className="panel">
            <h3>Search ride</h3>
            <label>From</label>
            <input placeholder="Home / Sector 24" />
            <label>To</label>
            <input placeholder="Office / Gandhinagar" />
            <label>Seats needed</label>
            <select>
              <option>1 seat</option>
              <option>2 seats</option>
              <option>3 seats</option>
            </select>
            <button className="primary-btn">Search rides</button>
          </div>

          <div className="panel">
            <h3>Available rides</h3>
            <div className="card">
              <div className="space-between"><strong>Raj • Toyota Corolla</strong><span className="pill">3 seats left</span></div>
              <p className="muted">08:30 AM • Home → Office • ₹120 / seat</p>
              <button className="secondary-btn">Book ride</button>
            </div>
            <div className="card mt-3">
              <div className="space-between"><strong>Priya • Maruti Ertiga</strong><span className="pill">2 seats left</span></div>
              <p className="muted">09:00 AM • Sector 24 → Office • ₹140 / seat</p>
              <button className="secondary-btn">Book ride</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
