import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { bookRide, searchRides } from '../lib/api.js'
import MapView from '../components/MapView.jsx'

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
  const [selectedRide, setSelectedRide] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSearch = useCallback(async (e) => {
    if (e) e.preventDefault()
    setSearching(true)
    setMessage({ type: '', text: '' })
    setHasSearched(true)
    setSelectedRide(null)
    
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
          <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: 8, background: message.type === 'error' ? 'var(--danger-bg)' : 'var(--success-bg)', color: message.type === 'error' ? 'var(--danger)' : 'var(--success)' }}>
            {message.text}
          </div>
        )}

        <div className="grid grid-2">
          <div>
            <form onSubmit={handleSearch} className="panel" style={{ marginBottom: '1rem' }}>
              <h3>Search ride</h3>
              <div className="grid grid-2" style={{ marginTop: '1rem' }}>
                <div>
                  <label>Date</label>
                  <input 
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Seats needed</label>
                  <select name="seats" value={formData.seats} onChange={handleChange} required>
                    <option value="1">1 seat</option>
                    <option value="2">2 seats</option>
                    <option value="3">3 seats</option>
                    <option value="4">4 seats</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="primary-btn" style={{ width: '100%' }} disabled={searching}>
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
                <p className="muted">No rides found for this date.</p>
              ) : (
                <div className="grid" style={{ gap: 10, marginTop: '0.5rem' }}>
                  {rides.map(ride => (
                    <div
                      key={ride._id}
                      className="card"
                      style={{
                        cursor: 'pointer',
                        borderColor: selectedRide?._id === ride._id ? 'var(--accent)' : undefined,
                        boxShadow: selectedRide?._id === ride._id ? '0 0 0 2px var(--accent-glow)' : undefined
                      }}
                      onClick={() => setSelectedRide(ride)}
                    >
                      <div className="space-between">
                        <strong>{ride.driverId?.name}</strong>
                        <span className="pill">{ride.availableSeats} seats</span>
                      </div>
                      <p className="muted" style={{ margin: '0.4rem 0', fontSize: '0.85rem' }}>
                        🕐 {formatTime(ride.departureTime)} &nbsp;•&nbsp; 🚙 {ride.vehicleId?.model}
                      </p>
                      <p className="muted" style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>
                        📍 {ride.pickupLocation?.address?.split(',')[0]} → {ride.destinationLocation?.address?.split(',')[0]}
                      </p>
                      <div className="space-between">
                        <strong style={{ color: 'var(--accent)' }}>₹{ride.farePerSeat} / seat</strong>
                        <button 
                          className="primary-btn"
                          style={{ padding: '0.4rem 1rem', fontSize: '0.82rem' }}
                          onClick={(e) => { e.stopPropagation(); handleBook(ride) }}
                          disabled={bookingId === ride._id}
                        >
                          {bookingId === ride._id ? 'Booking...' : 'Book'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="panel" style={{ display: 'flex', flexDirection: 'column', minHeight: 420 }}>
            <h3>Route Preview</h3>
            {selectedRide ? (
              <>
                <div style={{ marginBottom: '0.8rem' }}>
                  <p className="muted" style={{ fontSize: '0.85rem' }}>
                    📍 {selectedRide.pickupLocation?.address} → {selectedRide.destinationLocation?.address}
                  </p>
                </div>
                <MapView
                  pickup={selectedRide.pickupLocation?.coordinates}
                  destination={selectedRide.destinationLocation?.coordinates}
                  height="100%"
                />
              </>
            ) : (
              <div style={{ flex: 1, display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🗺️</div>
                  <p>Click a ride to preview its route on the map.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
