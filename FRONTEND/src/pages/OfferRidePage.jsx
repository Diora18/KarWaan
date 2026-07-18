export default function OfferRidePage() {
  return (
    <div className="app-shell">
      <div className="hero-card">
        <div className="topbar">
          <div className="brand"><span>🚘</span><span>Offer a Ride</span></div>
          <span className="badge">Publish commute</span>
        </div>

        <div className="grid grid-2">
          <div className="panel">
            <h3>Ride details</h3>
            <label>Pickup location</label>
            <input placeholder="Home / Sector 24" />
            <label>Destination</label>
            <input placeholder="Office / Gandhinagar" />
            <label>Departure time</label>
            <input type="time" />
            <label>Available seats</label>
            <input type="number" placeholder="3" />
            <label>Fare per seat</label>
            <input type="number" placeholder="₹120" />
          </div>

          <div className="panel">
            <h3>Vehicle details</h3>
            <label>Vehicle model</label>
            <input placeholder="Toyota Corolla" />
            <label>Registration number</label>
            <input placeholder="GJ 01 AB 1234" />
            <label>Seating capacity</label>
            <input type="number" placeholder="4" />
            <button className="primary-btn" style={{ width: '100%' }}>Publish ride</button>
          </div>
        </div>
      </div>
    </div>
  )
}
