import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { bookRide, searchRides } from '../lib/api.js'

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function FindRidePage() {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    seats: 1
  })
  
  const [rides, setRides] = useState([])
  const [searching, setSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [bookingId, setBookingId] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSearch = useCallback(async (e) => {
    if (e) e.preventDefault()
    setSearching(true)
    setMessage({ type: '', text: '' })
    setHasSearched(true)
    
    try {
      const results = await searchRides({
        date: formData.date,
        seats: formData.seats
      })
      setRides(results)
    } catch (err) {
      setMessage({ type: 'error', text: 'Search failed: ' + err.message })
      setRides([])
    } finally {
      setSearching(false)
    }
  }, [formData.date, formData.seats])

  // Auto-search on page load or when date/seats change
  useEffect(() => {
    handleSearch()
  }, [formData.date, formData.seats])

  const handleBook = async (ride) => {
    setBookingId(ride._id)
    setMessage({ type: '', text: '' })
    
    try {
      await bookRide({
        rideId: ride._id,
        seatsBooked: formData.seats
      })
      
      setMessage({ type: 'success', text: `Successfully booked ${formData.seats} seat(s) with ${ride.driverId?.name}! Redirecting...` })
      setTimeout(() => navigate('/my-trips'), 2000)
    } catch (err) {
      setMessage({ type: 'error', text: 'Booking failed: ' + err.message })
      setBookingId(null)
    }
  }

  return (
    <div className="app-shell">
      <div className="hero-card">
        <div className="topbar">
          <div className="brand"><span>🧭</span><span>Find a Ride</span></div>
          <span className="badge">Search seats</span>
        </div>

        {message.text && (
          <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: 8, background: message.type === 'error' ? '#fee2e2' : '#dcfce7', color: message.type === 'error' ? '#991b1b' : '#166534' }}>
            {message.text}
          </div>
        )}

        <div className="grid grid-2">
          <form onSubmit={handleSearch} className="panel">
            <h3>Search ride</h3>
            <p className="muted" style={{ marginBottom: '1rem' }}>See all available rides in your organization.</p>
            
            <label>Date</label>
            <input 
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
            
            <label>Seats needed</label>
            <select name="seats" value={formData.seats} onChange={handleChange} required>
              <option value="1">1 seat</option>
              <option value="2">2 seats</option>
              <option value="3">3 seats</option>
              <option value="4">4 seats</option>
            </select>
            
            <button type="submit" className="primary-btn mt-3" disabled={searching}>
              {searching ? 'Searching...' : 'Search rides'}
            </button>
          </form>

          <div className="panel">
            <h3>Available rides</h3>
            
            {!hasSearched ? (
              <p className="muted">Select a date to find open seats.</p>
            ) : searching ? (
              <p className="muted">Looking for drivers...</p>
            ) : rides.length === 0 ? (
              <p className="muted">No rides found matching your route and time.</p>
            ) : (
              <div className="grid" style={{ gap: 12 }}>
                {rides.map(ride => (
                  <div key={ride._id} className="card">
                    <div className="space-between">
                      <strong>{ride.driverId?.name} • {ride.vehicleId?.model}</strong>
                      <span className="pill">{ride.availableSeats} seats left</span>
                    </div>
                    <p className="muted" style={{ margin: '0.5rem 0' }}>
                      {formatTime(ride.departureTime)} • {ride.pickupLocation.address.split(',')[0]} → {ride.destinationLocation.address.split(',')[0]} • ₹{ride.farePerSeat} / seat
                    </p>
                    <button 
                      className="secondary-btn"
                      onClick={() => handleBook(ride)}
                      disabled={bookingId === ride._id}
                    >
                      {bookingId === ride._id ? 'Booking...' : 'Book ride'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
