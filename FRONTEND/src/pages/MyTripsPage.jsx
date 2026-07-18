import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyTrips, updateTripStatus, payRideFare } from '../lib/api.js'
import { getStoredSession } from '../lib/auth.js'

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function MyTripsPage() {
  const { user } = getStoredSession() || {}
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [updatingId, setUpdatingId] = useState(null)

  const loadTrips = async () => {
    try {
      const data = await getMyTrips()
      setRides(data)
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load trips: ' + err.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTrips()
  }, [])

  const handleStatusChange = async (rideId, newStatus) => {
    setUpdatingId(rideId)
    setMessage({ type: '', text: '' })
    
    try {
      await updateTripStatus(rideId, newStatus)
      await loadTrips() // reload to get fresh data
      setMessage({ type: 'success', text: `Trip updated to ${newStatus}` })
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setUpdatingId(null)
    }
  }

  const handlePayFare = async (rideId) => {
    setUpdatingId(rideId)
    setMessage({ type: '', text: '' })

    try {
      await payRideFare(rideId)
      await loadTrips()
      setMessage({ type: 'success', text: 'Fare paid successfully! Wallet deducted.' })
    } catch (err) {
      setMessage({ type: 'error', text: 'Payment failed: ' + err.message })
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="app-shell">
      <div className="hero-card">
        <div className="topbar">
          <div className="brand"><span>🗓️</span><span>My Trips</span></div>
          <span className="badge">Live booking status</span>
        </div>

        {message.text && (
          <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: 8, background: message.type === 'error' ? 'var(--danger-bg)' : 'var(--success-bg)', color: message.type === 'error' ? 'var(--danger)' : 'var(--success)' }}>
            {message.text}
          </div>
        )}

        {loading ? (
          <p className="muted">Loading your trips...</p>
        ) : rides.length === 0 ? (
          <p className="muted">You have no active trips.</p>
        ) : (
          <div className="grid grid-2">
            {rides.map(ride => {
              const isDriver = ride.driverId?._id === user?._id || ride.driverId === user?._id
              const pickup = ride.pickupLocation?.address?.split(',')[0] || 'Unknown'
              const dropoff = ride.destinationLocation?.address?.split(',')[0] || 'Unknown'

              return (
                <div key={ride._id} className="card">
                  <div className="space-between" style={{ alignItems: 'flex-start' }}>
                    <strong>{pickup} → {dropoff}</strong>
                    <span className="pill">{ride.status}</span>
                  </div>
                  
                  <p className="muted" style={{ margin: '0.5rem 0' }}>
                    {isDriver ? 'Role: Driver' : `Driver: ${ride.driverId?.name}`} • {formatTime(ride.departureTime)}
                  </p>
                  
                  <p className="muted" style={{ margin: '0 0 1rem 0', fontSize: '0.85rem' }}>
                    Vehicle: {ride.vehicleId?.model} ({ride.vehicleId?.registrationNumber})
                    <br />
                    Seats Booked: {ride.passengers?.reduce((sum, p) => sum + (p.seatsBooked || 1), 0) || 0}
                  </p>

                  <div className="row">
                    {isDriver ? (
                      <>
                        {ride.status === 'Scheduled' && (
                          <button 
                            className="primary-btn"
                            onClick={() => handleStatusChange(ride._id, 'Active')}
                            disabled={updatingId === ride._id}
                          >
                            {updatingId === ride._id ? 'Updating...' : 'Start Trip'}
                          </button>
                        )}
                        {ride.status === 'Active' && (
                          <>
                            <button 
                              className="primary-btn"
                              style={{ background: 'linear-gradient(135deg, #059669, #34d399)', marginRight: '0.5rem' }}
                              onClick={() => handleStatusChange(ride._id, 'Completed')}
                              disabled={updatingId === ride._id}
                            >
                              {updatingId === ride._id ? 'Updating...' : 'Complete Trip'}
                            </button>
                            <Link to={`/chat/${ride._id}`} className="primary-btn" style={{ textDecoration: 'none' }}>💬 Chat</Link>
                            <Link to={`/track/${ride._id}`} className="primary-btn" style={{ textDecoration: 'none', background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}>📍 Track Live</Link>
                          </>
                        )}
                        {['Completed', 'Cancelled'].includes(ride.status) && (
                          <button className="secondary-btn" disabled>Finished</button>
                        )}
                      </>
                    ) : (
                      <>
                        {ride.status === 'Scheduled' && <button className="secondary-btn" disabled>Waiting for driver...</button>}
                        {ride.status === 'Active' && (
                          <>
                            <Link to={`/chat/${ride._id}`} className="primary-btn" style={{ textDecoration: 'none' }}>💬 Chat</Link>
                            <Link to={`/track/${ride._id}`} className="primary-btn" style={{ textDecoration: 'none', background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}>📍 Track Live</Link>
                          </>
                        )}
                        {['Completed', 'Cancelled'].includes(ride.status) && (
                          <button className="secondary-btn" disabled>Finished</button>
                        )}
                        {/* Passenger Payment Button */}
                        {(() => {
                          const passenger = ride.passengers?.find(p => p.userId?._id === user?._id || p.userId === user?._id)
                          if (passenger && passenger.farePaid === 0 && ride.status !== 'Cancelled') {
                            return (
                              <button 
                                className="primary-btn" 
                                style={{ background: 'var(--accent)', marginLeft: '0.5rem' }}
                                onClick={() => handlePayFare(ride._id)}
                                disabled={updatingId === ride._id}
                              >
                                {updatingId === ride._id ? 'Paying...' : `Pay ₹${ride.farePerSeat * passenger.seatsBooked}`}
                              </button>
                            )
                          }
                          if (passenger && passenger.farePaid > 0) {
                            return <span className="pill" style={{ marginLeft: '0.5rem', background: 'var(--success-bg)', color: 'var(--success)' }}>Paid ₹{passenger.farePaid}</span>
                          }
                          return null
                        })()}
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
