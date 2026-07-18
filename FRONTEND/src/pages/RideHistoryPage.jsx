import { useState, useEffect } from 'react'
import { getMyTrips } from '../lib/api.js'
import { getStoredSession } from '../lib/auth.js'

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function RideHistoryPage() {
  const { user } = getStoredSession() || {}
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all', 'completed', 'cancelled'

  useEffect(() => {
    getMyTrips()
      .then(data => {
        // Only show completed or cancelled rides as "history"
        const history = data.filter(r => ['Completed', 'Cancelled'].includes(r.status))
        setRides(history)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filteredRides = filter === 'all'
    ? rides
    : rides.filter(r => r.status === (filter === 'completed' ? 'Completed' : 'Cancelled'))

  // Calculate summary stats
  const completedRides = rides.filter(r => r.status === 'Completed')
  const totalAsDriver = completedRides.filter(r => r.driverId?._id === user?._id || r.driverId === user?._id).length
  const totalAsPassenger = completedRides.filter(r => {
    return r.passengers?.some(p => (p.userId?._id || p.userId) === user?._id)
  }).length

  let totalSpent = 0
  let totalEarned = 0
  completedRides.forEach(ride => {
    const isDriver = ride.driverId?._id === user?._id || ride.driverId === user?._id
    if (isDriver) {
      // Sum up fares paid by passengers
      totalEarned += ride.passengers?.reduce((sum, p) => sum + (p.farePaid || 0), 0) || 0
    } else {
      const p = ride.passengers?.find(p => (p.userId?._id || p.userId) === user?._id)
      if (p) totalSpent += p.farePaid || 0
    }
  })

  return (
    <div className="app-shell">
      <div className="hero-card">
        <div className="topbar">
          <div className="brand"><span>📜</span><span>Ride History</span></div>
          <span className="badge">{rides.length} past rides</span>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-2" style={{ marginBottom: '1.5rem' }}>
          <div className="panel">
            <h3 style={{ margin: '0 0 1rem 0' }}>Your Stats</h3>
            <div className="grid grid-2" style={{ gap: '0.8rem' }}>
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>{totalAsDriver}</div>
                <div className="muted" style={{ fontSize: '0.8rem' }}>Rides as Driver</div>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>{totalAsPassenger}</div>
                <div className="muted" style={{ fontSize: '0.8rem' }}>Rides as Passenger</div>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--success)' }}>₹{totalEarned}</div>
                <div className="muted" style={{ fontSize: '0.8rem' }}>Total Earned</div>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--danger)' }}>₹{totalSpent}</div>
                <div className="muted" style={{ fontSize: '0.8rem' }}>Total Spent</div>
              </div>
            </div>
          </div>

          <div className="panel">
            <h3 style={{ margin: '0 0 1rem 0' }}>Filter</h3>
            <div className="row" style={{ flexWrap: 'wrap' }}>
              {[
                { key: 'all', label: 'All Rides' },
                { key: 'completed', label: '✅ Completed' },
                { key: 'cancelled', label: '❌ Cancelled' }
              ].map(f => (
                <button
                  key={f.key}
                  className={filter === f.key ? 'primary-btn' : 'secondary-btn'}
                  style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <p className="muted" style={{ marginTop: '1rem' }}>
              Showing {filteredRides.length} of {rides.length} past rides
            </p>
          </div>
        </div>

        {/* Ride List */}
        {loading ? (
          <p className="muted">Loading ride history...</p>
        ) : filteredRides.length === 0 ? (
          <p className="muted" style={{ textAlign: 'center', padding: '2rem' }}>
            No past rides found. Complete some trips to see them here!
          </p>
        ) : (
          <div className="grid grid-2" style={{ gap: '1rem' }}>
            {filteredRides.map(ride => {
              const isDriver = ride.driverId?._id === user?._id || ride.driverId === user?._id
              const pickup = ride.pickupLocation?.address?.split(',')[0] || 'Unknown'
              const dropoff = ride.destinationLocation?.address?.split(',')[0] || 'Unknown'

              let fareInfo = ''
              if (isDriver) {
                const earned = ride.passengers?.reduce((sum, p) => sum + (p.farePaid || 0), 0) || 0
                fareInfo = `Earned ₹${earned}`
              } else {
                const p = ride.passengers?.find(p => (p.userId?._id || p.userId) === user?._id)
                fareInfo = p?.farePaid > 0 ? `Paid ₹${p.farePaid}` : 'Unpaid'
              }

              return (
                <div key={ride._id} className="card">
                  <div className="space-between" style={{ alignItems: 'flex-start' }}>
                    <strong>{pickup} → {dropoff}</strong>
                    <span className="pill" style={{
                      background: ride.status === 'Completed' ? 'var(--success-bg)' : 'var(--danger-bg)',
                      color: ride.status === 'Completed' ? 'var(--success)' : 'var(--danger)'
                    }}>
                      {ride.status}
                    </span>
                  </div>

                  <p className="muted" style={{ margin: '0.5rem 0' }}>
                    📅 {formatDate(ride.departureTime)} at {formatTime(ride.departureTime)}
                  </p>

                  <p className="muted" style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>
                    {isDriver ? '🚘 You drove' : `🚘 Driver: ${ride.driverId?.name || 'Unknown'}`}
                    &nbsp;•&nbsp;
                    🚙 {ride.vehicleId?.model || 'Unknown'} ({ride.vehicleId?.registrationNumber || '—'})
                  </p>

                  <div className="space-between" style={{ marginTop: '0.5rem' }}>
                    <span className="muted" style={{ fontSize: '0.85rem' }}>
                      👥 {ride.passengers?.length || 0} passengers
                    </span>
                    <strong style={{ color: isDriver ? 'var(--success)' : 'var(--accent)' }}>
                      {fareInfo}
                    </strong>
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
