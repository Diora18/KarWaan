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
      
      setMessage({ type: 'success', text: `Booked ${formData.seats} seat(s) with ${ride.driverId?.name}! Redirecting...` })
      setTimeout(() => navigate('/my-trips'), 2000)
    } catch (err) {
      setMessage({ type: 'error', text: 'Booking failed: ' + err.message })
      setBookingId(null)
    }
  }

  return (
    <div className="app-shell">
      <header className="page-header">
        <h1>Find a Ride</h1>
        <p className="page-subtitle">Browse available carpools and book your seat.</p>
      </header>

      {/* Compact inline filters */}
      <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div className="form-group" style={{ marginBottom: 0, flex: '1 1 180px' }}>
          <label>Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div className="form-group" style={{ marginBottom: 0, flex: '0 1 120px' }}>
          <label>Seats</label>
          <select name="seats" value={formData.seats} onChange={handleChange} required>
            {[1,2,3,4].map(n => <option key={n} value={n}>{n} seat{n > 1 ? 's' : ''}</option>)}
          </select>
        </div>
        <button type="submit" className="primary-btn" disabled={searching} style={{ whiteSpace: 'nowrap', height: 46 }}>
          {searching ? 'Searching...' : '🔍 Search'}
        </button>
      </form>

      {message.text && (
        <div className={`alert alert--${message.type === 'error' ? 'error' : 'success'}`}>
          {message.text}
        </div>
      )}

      {/* Main content: Ride list + Map side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedRide ? '1fr 1fr' : '1fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Ride Results */}
        <div>
          {!hasSearched ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧭</div>
              <p>Select a date to find open seats.</p>
            </div>
          ) : searching ? (
            <p style={{ color: 'var(--text-muted)', padding: '2rem 0' }}>Looking for drivers...</p>
          ) : rides.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔍</div>
              <p>No rides found for this date.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                {rides.length} ride{rides.length !== 1 ? 's' : ''} available
              </p>
              {rides.map(ride => {
                const isSelected = selectedRide?._id === ride._id
                return (
                  <div
                    key={ride._id}
                    onClick={() => setSelectedRide(ride)}
                    style={{
                      background: 'white',
                      border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.25rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 0 0 3px var(--accent-glow)' : 'var(--shadow-xs)',
                    }}
                  >
                    {/* Top row: driver + seats */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent-light)', display: 'grid', placeItems: 'center', fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>
                          {ride.driverId?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>{ride.driverId?.name}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{ride.vehicleId?.model}</div>
                        </div>
                      </div>
                      <span className="pill pill--accent">{ride.availableSeats} seat{ride.availableSeats !== 1 ? 's' : ''}</span>
                    </div>

                    {/* Route */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', flexShrink: 0 }} />
                      <span style={{ flex: 1 }}>{ride.pickupLocation?.address?.split(',')[0]}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)', flexShrink: 0 }} />
                      <span style={{ flex: 1 }}>{ride.destinationLocation?.address?.split(',')[0]}</span>
                    </div>

                    {/* Bottom row: time, fare, book */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>🕐 {formatTime(ride.departureTime)}</span>
                        <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          ₹{ride.farePerSeat}<span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)' }}>/seat</span>
                        </span>
                      </div>
                      <button 
                        className="primary-btn"
                        style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                        onClick={(e) => { e.stopPropagation(); handleBook(ride) }}
                        disabled={bookingId === ride._id}
                      >
                        {bookingId === ride._id ? 'Booking...' : 'Book'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Map Panel — only visible when a ride is selected */}
        {selectedRide && (
          <div className="card" style={{ position: 'sticky', top: '1rem', minHeight: 420, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '0.75rem' }}>Route Preview</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
              <strong>From:</strong> {selectedRide.pickupLocation?.address}<br/>
              <strong>To:</strong> {selectedRide.destinationLocation?.address}
            </p>
            <div style={{ flex: 1 }}>
              <MapView
                pickup={selectedRide.pickupLocation?.coordinates || selectedRide.pickupLocation?.location?.coordinates}
                destination={selectedRide.destinationLocation?.coordinates || selectedRide.destinationLocation?.location?.coordinates}
                height={320}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
