import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyVehicles, publishRide } from '../lib/api.js'
import AddressAutocomplete from '../components/AddressAutocomplete.jsx'
import MapView from '../components/MapView.jsx'

export default function OfferRidePage() {
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState([])
  const [loadingVehicles, setLoadingVehicles] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  const [pickupLocation, setPickupLocation] = useState(null)
  const [destinationLocation, setDestinationLocation] = useState(null)

  const [formData, setFormData] = useState({
    departureDate: new Date().toISOString().split('T')[0],
    departureTime: '',
    availableSeats: 3,
    farePerSeat: 120,
    vehicleId: ''
  })

  useEffect(() => {
    let alive = true
    getMyVehicles()
      .then(data => {
        if (!alive) return
        const activeVehicles = data.filter(v => v.status === 'Active')
        setVehicles(activeVehicles)
        if (activeVehicles.length > 0) {
          setFormData(current => ({ ...current, vehicleId: activeVehicles[0]._id }))
        }
      })
      .catch(err => {
        if (alive) setMessage({ type: 'error', text: 'Failed to load vehicles: ' + err.message })
      })
      .finally(() => {
        if (alive) setLoadingVehicles(false)
      })
      
    return () => { alive = false }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setPublishing(true)
    setMessage({ type: '', text: '' })

    try {
      if (!formData.vehicleId) throw new Error('Please select a vehicle')
      if (!pickupLocation) throw new Error('Please select a pickup location from the suggestions')
      if (!destinationLocation) throw new Error('Please select a destination from the suggestions')

      const departureDate = new Date(formData.departureDate)
      const [hours, minutes] = formData.departureTime.split(':')
      departureDate.setHours(Number(hours), Number(minutes), 0, 0)

      const payload = {
        vehicleId: formData.vehicleId,
        pickupLocation: pickupLocation,
        destinationLocation: destinationLocation,
        departureTime: departureDate.toISOString(),
        availableSeats: Number(formData.availableSeats),
        farePerSeat: Number(formData.farePerSeat)
      }

      await publishRide(payload)
      setMessage({ type: 'success', text: 'Ride published successfully! Redirecting...' })
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
      setPublishing(false)
    }
  }

  return (
    <div className="app-shell">
      <div className="hero-card">
        <div className="topbar">
          <div className="brand"><span>🚘</span><span>Offer a Ride</span></div>
          <span className="badge">Publish commute</span>
        </div>

        {message.text && (
          <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: 8, background: message.type === 'error' ? 'var(--danger-bg)' : 'var(--success-bg)', color: message.type === 'error' ? 'var(--danger)' : 'var(--success)' }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-2">
          <div className="panel">
            <h3>Route & Schedule</h3>
            
            <AddressAutocomplete
              label="Pickup location"
              placeholder="Search pickup address..."
              value={pickupLocation}
              onChange={setPickupLocation}
            />
            
            <AddressAutocomplete
              label="Destination"
              placeholder="Search destination..."
              value={destinationLocation}
              onChange={setDestinationLocation}
            />
            
            <div className="grid grid-2">
              <div>
                <label>Date</label>
                <input 
                  type="date" 
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Time</label>
                <input 
                  type="time" 
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-2">
              <div>
                <label>Available seats</label>
                <input 
                  type="number" 
                  name="availableSeats"
                  min="1"
                  value={formData.availableSeats}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Fare per seat (₹)</label>
                <input 
                  type="number" 
                  name="farePerSeat"
                  min="0"
                  value={formData.farePerSeat}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {loadingVehicles ? (
              <p className="muted">Loading vehicles...</p>
            ) : vehicles.length === 0 ? (
              <p className="muted" style={{ color: 'var(--danger)' }}>No active vehicles. Please add one first.</p>
            ) : (
              <>
                <label>Select Vehicle</label>
                <select 
                  name="vehicleId" 
                  value={formData.vehicleId}
                  onChange={handleChange}
                  required
                >
                  {vehicles.map(v => (
                    <option key={v._id} value={v._id}>
                      {v.model} ({v.registrationNumber})
                    </option>
                  ))}
                </select>
              </>
            )}

            <button 
              type="submit" 
              className="primary-btn mt-3" 
              style={{ width: '100%' }}
              disabled={publishing || vehicles.length === 0}
            >
              {publishing ? 'Publishing...' : 'Publish ride'}
            </button>
          </div>

          <div className="panel" style={{ display: 'flex', flexDirection: 'column', minHeight: 420 }}>
            <h3>Route Preview</h3>
            {(!pickupLocation && !destinationLocation) ? (
              <div style={{ flex: 1, display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🗺️</div>
                  <p>Pick a start and end point to preview the route on the map.</p>
                </div>
              </div>
            ) : (
              <MapView
                pickup={pickupLocation?.coordinates}
                destination={destinationLocation?.coordinates}
                height="100%"
              />
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
