import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyTrips, updateTripStatus, payRideFare } from '../lib/api.js'
import { getStoredSession } from '../lib/auth.js'

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short'
  })
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
      await loadTrips()
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

  const statusColors = {
    Active: { bg: '#dcfce7', text: '#16a34a', border: '#86efac' },
    Scheduled: { bg: '#fef3c7', text: '#d97706', border: '#fde68a' },
    Completed: { bg: '#f1f5f9', text: '#64748b', border: '#e2e8f0' },
    Cancelled: { bg: '#fee2e2', text: '#dc2626', border: '#fecaca' },
  }

  return (
    <div className="app-shell">
      <header className="page-header">
        <h1>My Trips</h1>
        <p className="page-subtitle">Manage your active bookings and driving schedules.</p>
      </header>

      {message.text && (
        <div className={`alert alert--${message.type === 'error' ? 'error' : 'success'}`}>
          <span>{message.text}</span>
          {message.type === 'error' && message.text.includes('Insufficient balance') && (
            <Link to="/wallet" className="primary-btn btn-sm" style={{ textDecoration: 'none' }}>
              Add Funds
            </Link>
          )}
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--text-muted)', padding: '2rem 0' }}>Loading your trips...</p>
      ) : rides.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗓️</div>
          <p style={{ fontSize: '1.1rem' }}>You have no active trips.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Find or offer a ride to get started!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {rides.map(ride => {
            const isDriver = ride.driverId?._id === user?._id || ride.driverId === user?._id
            const pickup = ride.pickupLocation?.address?.split(',')[0] || 'Unknown'
            const dropoff = ride.destinationLocation?.address?.split(',')[0] || 'Unknown'
            const sc = statusColors[ride.status] || statusColors.Scheduled

            return (
              <div key={ride._id} style={{
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xs)',
              }}>
                {/* Color strip at top */}
                <div style={{ height: 4, background: sc.text }} />

                <div style={{ padding: '1.25rem 1.5rem' }}>
                  {/* Header row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', marginBottom: '0.3rem' }}>{pickup} → {dropoff}</h3>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <span>{formatDate(ride.departureTime)} at {formatTime(ride.departureTime)}</span>
                        <span>•</span>
                        <span style={{ fontWeight: 600, color: isDriver ? 'var(--accent)' : 'var(--text-secondary)' }}>{isDriver ? 'Driver' : 'Passenger'}</span>
                      </div>
                    </div>
                    <span style={{
                      padding: '4px 12px', borderRadius: 99, fontSize: '0.75rem', fontWeight: 600,
                      background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`,
                    }}>
                      {ride.status}
                    </span>
                  </div>

                  {/* Detail grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                    {!isDriver && (
                      <div style={{ background: 'var(--bg-primary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Driver</div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{ride.driverId?.name}</div>
                      </div>
                    )}
                    <div style={{ background: 'var(--bg-primary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vehicle</div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{ride.vehicleId?.model} <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>({ride.vehicleId?.registrationNumber})</span></div>
                    </div>
                    <div style={{ background: 'var(--bg-primary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Passengers</div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{ride.passengers?.reduce((sum, p) => sum + (p.seatsBooked || 1), 0) || 0} booked</div>
                    </div>
                    <div style={{ background: 'var(--bg-primary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fare</div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent)' }}>₹{ride.farePerSeat}/seat</div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                    {isDriver ? (
                      <>
                        {ride.status === 'Scheduled' && (
                          <button className="primary-btn" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                            onClick={() => handleStatusChange(ride._id, 'Active')} disabled={updatingId === ride._id}>
                            {updatingId === ride._id ? 'Updating...' : '▶ Start Trip'}
                          </button>
                        )}
                        {ride.status === 'Active' && (
                          <>
                            <button className="primary-btn btn-success" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                              onClick={() => handleStatusChange(ride._id, 'Completed')} disabled={updatingId === ride._id}>
                              {updatingId === ride._id ? 'Updating...' : '✓ Complete Trip'}
                            </button>
                            <Link to={`/chat/${ride._id}`} className="secondary-btn" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', textDecoration: 'none' }}>💬 Chat</Link>
                            <Link to={`/track/${ride._id}`} className="secondary-btn" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', textDecoration: 'none' }}>📍 Track</Link>
                          </>
                        )}
                        {['Completed', 'Cancelled'].includes(ride.status) && (
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Trip finished</span>
                        )}
                      </>
                    ) : (
                      <>
                        {ride.status === 'Scheduled' && <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>⏳ Waiting for driver to start</span>}
                        {ride.status === 'Active' && (
                          <>
                            <Link to={`/chat/${ride._id}`} className="secondary-btn" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', textDecoration: 'none' }}>💬 Chat</Link>
                            <Link to={`/track/${ride._id}`} className="secondary-btn" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', textDecoration: 'none' }}>📍 Track Live</Link>
                          </>
                        )}
                        {['Completed', 'Cancelled'].includes(ride.status) && (
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Trip finished</span>
                        )}
                        {(() => {
                          const passenger = ride.passengers?.find(p => p.userId?._id === user?._id || p.userId === user?._id)
                          if (passenger && passenger.farePaid === 0 && ride.status !== 'Cancelled') {
                            return (
                              <button className="primary-btn" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                                onClick={() => handlePayFare(ride._id)} disabled={updatingId === ride._id}>
                                {updatingId === ride._id ? 'Paying...' : `💰 Pay ₹${ride.farePerSeat * passenger.seatsBooked}`}
                              </button>
                            )
                          }
                          if (passenger && passenger.farePaid > 0) {
                            return <span className="pill pill--success">✓ Paid ₹{passenger.farePaid}</span>
                          }
                          return null
                        })()}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
