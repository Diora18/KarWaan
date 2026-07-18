import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { getAuthToken } from '../lib/api.js'
import { getStoredSession } from '../lib/auth.js'
import MapView from '../components/MapView.jsx'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function LiveTrackingPage() {
  const { rideId } = useParams()
  const navigate = useNavigate()
  const { user } = getStoredSession() || {}
  const socketRef = useRef(null)
  const watchIdRef = useRef(null)

  const [rideInfo, setRideInfo] = useState(null)
  const [driverLocation, setDriverLocation] = useState(null)
  const [trackingStatus, setTrackingStatus] = useState('connecting')
  const [speed, setSpeed] = useState(0)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [isDriver, setIsDriver] = useState(false)
  const [etaText, setEtaText] = useState('')

  useEffect(() => {
    const token = getAuthToken()
    if (!token) return

    const socket = io(API_BASE, { auth: { token } })
    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('join_ride_room', { rideId }, (response) => {
        if (response?.initialState?.lastTelemetry) {
          setDriverLocation(response.initialState.lastTelemetry.coordinates)
        }
        setTrackingStatus('connected')
      })
    })

    fetch(`${API_BASE}/api/rides/my`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(rides => {
        const ride = rides.find(r => r._id === rideId)
        if (ride) {
          setRideInfo(ride)
          const driverId = ride.driverId?._id || ride.driverId
          setIsDriver(driverId === user?._id)
        }
      })
      .catch(console.error)

    socket.on('location_update', (data) => {
      if (data.rideId === rideId) {
        setDriverLocation(data.coordinates)
        setSpeed(Math.round((data.speed || 0) * 3.6))
        setLastUpdate(new Date())
      }
    })

    socket.on('disconnect', () => {
      setTrackingStatus('disconnected')
    })

    return () => {
      socket.disconnect()
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [rideId])

  useEffect(() => {
    if (!isDriver || !socketRef.current) return

    if (!navigator.geolocation) {
      setTrackingStatus('no-gps')
      return
    }

    setTrackingStatus('broadcasting')

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const coords = [position.coords.longitude, position.coords.latitude]
        setDriverLocation(coords)
        setSpeed(Math.round((position.coords.speed || 0) * 3.6))
        setLastUpdate(new Date())

        socketRef.current?.emit('send_location', {
          rideId,
          coordinates: coords,
          bearing: position.coords.heading || 0,
          speed: position.coords.speed || 0,
        })
      },
      (error) => {
        console.error('Geolocation error:', error)
        setTrackingStatus('gps-error')
      },
      {
        enableHighAccuracy: true,
        maximumAge: 2000,
        timeout: 5000,
      }
    )

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [isDriver, rideId])

  const pickup = rideInfo?.pickupLocation?.coordinates
  const destination = rideInfo?.destinationLocation?.coordinates

  useEffect(() => {
    if (!driverLocation || !destination) return

    const fetchEta = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${driverLocation[0]},${driverLocation[1]};${destination[0]},${destination[1]}?overview=false`
        const res = await fetch(url)
        const data = await res.json()
        
        if (data.code === 'Ok' && data.routes.length > 0) {
          const durationSeconds = data.routes[0].duration
          const distanceMeters = data.routes[0].distance
          
          if (durationSeconds < 60) {
            setEtaText('Arriving soon')
          } else {
            const mins = Math.round(durationSeconds / 60)
            const kms = (distanceMeters / 1000).toFixed(1)
            setEtaText(`${mins} min away (${kms} km)`)
          }
        }
      } catch (err) {
        // Ignore ETA errors silently
      }
    }

    fetchEta()
    const interval = setInterval(fetchEta, 15000)
    return () => clearInterval(interval)
  }, [driverLocation, destination])

  const openInGoogleMaps = () => {
    if (!destination) return
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination[1]},${destination[0]}`
    window.open(url, '_blank')
  }

  const statusLabels = {
    broadcasting: 'Broadcasting GPS',
    connected: 'Tracking live',
    connecting: 'Connecting...',
    disconnected: 'Disconnected',
    'gps-error': 'GPS Error',
    'no-gps': 'No GPS',
  }

  const isLive = trackingStatus === 'broadcasting' || trackingStatus === 'connected'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-primary)' }}>
      <div style={{ padding: '1rem 1.5rem', background: 'white', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="secondary-btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }} onClick={() => navigate('/my-trips')}>← Back</button>
            <strong style={{ fontSize: '1.2rem' }}>
              {rideInfo
                ? `${rideInfo.pickupLocation?.address?.split(',')[0]} → ${rideInfo.destinationLocation?.address?.split(',')[0]}`
                : 'Loading ride...'
              }
            </strong>
          </div>
          {rideInfo && (
            <button className="primary-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={openInGoogleMaps}>
              Open Maps
            </button>
          )}
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
          <span className={`pill ${isLive ? 'pill--success' : 'pill--danger'}`}>
            {statusLabels[trackingStatus] || trackingStatus}
          </span>
          {speed > 0 && <span className="muted" style={{ fontSize: '0.9rem' }}>{speed} km/h</span>}
          {etaText && <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent)' }}>{etaText}</span>}
          {lastUpdate && <span className="muted" style={{ fontSize: '0.85rem' }}>Updated {lastUpdate.toLocaleTimeString()}</span>}
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        <MapView
          pickup={pickup}
          destination={destination}
          driverLocation={driverLocation}
          height="100%"
        />
      </div>
    </div>
  )
}
