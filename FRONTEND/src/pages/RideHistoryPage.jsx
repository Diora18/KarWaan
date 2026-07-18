import { useState, useEffect } from 'react'
import { getMyTrips } from '../lib/api.js'
import { getStoredSession } from '../lib/auth.js'

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
  })
}

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function RideHistoryPage() {
  const { user } = getStoredSession() || {}
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getMyTrips()
      .then(data => {
        const history = data.filter(r => ['Completed', 'Cancelled'].includes(r.status))
        setRides(history)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filteredRides = filter === 'all'
    ? rides
    : rides.filter(r => r.status === (filter === 'completed' ? 'Completed' : 'Cancelled'))

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
      totalEarned += ride.passengers?.reduce((sum, p) => sum + (p.farePaid || 0), 0) || 0
    } else {
      const p = ride.passengers?.find(p => (p.userId?._id || p.userId) === user?._id)
      if (p) totalSpent += p.farePaid || 0
    }
  })

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' }
  ]

  return (
    <div className="app-shell">
      <header className="page-header">
        <h1>Ride History</h1>
        <p className="page-subtitle">Review your past trips and earnings.</p>
      </header>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalAsDriver}</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>Drove</div>
        </div>
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalAsPassenger}</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>Rode</div>
        </div>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#16a34a' }}>₹{totalEarned}</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>Earned</div>
        </div>
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#dc2626' }}>₹{totalSpent}</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>Spent</div>
        </div>
      </div>

      {/* Inline filter tabs + count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {filters.map(f => (
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
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {filteredRides.length} of {rides.length} trips
        </span>
      </div>

      {/* Ride list */}
      {loading ? (
        <p style={{ color: 'var(--text-muted)', padding: '2rem 0' }}>Loading ride history...</p>
      ) : filteredRides.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📜</div>
          <p style={{ fontSize: '1.1rem' }}>No past rides found.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Complete some trips to see them here!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredRides.map(ride => {
            const isDriver = ride.driverId?._id === user?._id || ride.driverId === user?._id
            const pickup = ride.pickupLocation?.address?.split(',')[0] || 'Unknown'
            const dropoff = ride.destinationLocation?.address?.split(',')[0] || 'Unknown'

            let fareInfo = ''
            let fareColor = 'var(--text-primary)'
            if (isDriver) {
              const earned = ride.passengers?.reduce((sum, p) => sum + (p.farePaid || 0), 0) || 0
              fareInfo = `+₹${earned}`
              fareColor = '#16a34a'
            } else {
              const p = ride.passengers?.find(p => (p.userId?._id || p.userId) === user?._id)
              fareInfo = p?.farePaid > 0 ? `-₹${p.farePaid}` : 'Unpaid'
              fareColor = p?.farePaid > 0 ? '#dc2626' : 'var(--text-muted)'
            }

            return (
              <div key={ride._id} style={{
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                boxShadow: 'var(--shadow-xs)',
              }}>
                {/* Left: icon */}
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                  background: ride.status === 'Completed' ? '#dcfce7' : '#fee2e2',
                  display: 'grid', placeItems: 'center', fontSize: '1.2rem'
                }}>
                  {ride.status === 'Completed' ? '✓' : '✕'}
                </div>

                {/* Middle: details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>{pickup} → {dropoff}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span>{formatDate(ride.departureTime)}</span>
                    <span>•</span>
                    <span>{formatTime(ride.departureTime)}</span>
                    <span>•</span>
                    <span>{isDriver ? 'You drove' : ride.driverId?.name || 'Unknown driver'}</span>
                    <span>•</span>
                    <span>{ride.vehicleId?.model || '—'}</span>
                    <span>•</span>
                    <span>{ride.passengers?.length || 0} pax</span>
                  </div>
                </div>

                {/* Right: fare + status */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: fareColor }}>{fareInfo}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{ride.status}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
