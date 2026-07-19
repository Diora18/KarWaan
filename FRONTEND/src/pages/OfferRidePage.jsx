import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyVehicles, publishRide, getSavedPlaces } from '../lib/api.js'
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
  const [savedPlaces, setSavedPlaces] = useState(null)

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
      
    getSavedPlaces()
      .then(places => {
        if (!alive) return
        setSavedPlaces(places)
      })
      .catch(err => console.error("Could not load saved places", err))

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
        pickupLocation: {
          address: pickupLocation.address,
          coordinates: pickupLocation.location?.coordinates || pickupLocation.coordinates
        },
        destinationLocation: {
          address: destinationLocation.address,
          coordinates: destinationLocation.location?.coordinates || destinationLocation.coordinates
        },
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
      <header className="page-header">
        <p className="page-eyebrow">Share</p>
        <h1>Offer a Ride</h1>
        <p className="page-subtitle">Driving somewhere? Share your empty seats and earn.</p>
      </header>

      {message.text && (
        <div className={`alert alert--${message.type === 'error' ? 'error' : 'success'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-2">
        <div className="card card--flat grid gap-sm">
          <h3>Route & Schedule</h3>
            
          <AddressAutocomplete
            label="Pickup location"
            placeholder="Search pickup address..."
            value={pickupLocation}
            onChange={setPickupLocation}
            quickPicks={[
              ...(savedPlaces?.home ? [{ label: '🏠 Home', place: savedPlaces.home }] : []),
              ...(savedPlaces?.office ? [{ label: '🏢 Office', place: savedPlaces.office }] : [])
            ]}
          />
          
          <AddressAutocomplete
            label="Destination"
            placeholder="Search destination..."
            value={destinationLocation}
            onChange={setDestinationLocation}
            quickPicks={[
              ...(savedPlaces?.home ? [{ label: '🏠 Home', place: savedPlaces.home }] : []),
              ...(savedPlaces?.office ? [{ label: '🏢 Office', place: savedPlaces.office }] : [])
            ]}
          />
          
          <div className="grid grid-2 gap-sm">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Date</label>
              <input 
                type="date" 
                name="departureDate"
                value={formData.departureDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
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
          
          <div className="grid grid-2 gap-sm">
            <div className="form-group" style={{ marginBottom: 0 }}>
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
            <div className="form-group" style={{ marginBottom: 0 }}>
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
            <p className="loading-text">Loading vehicles...</p>
          ) : vehicles.length === 0 ? (
            <div className="alert alert--error">No active vehicles. Please add one first.</div>
          ) : (
            <div className="form-group" style={{ marginBottom: 0 }}>
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
            </div>
          )}

          <button 
            type="submit" 
            className="primary-btn btn-block" 
            disabled={publishing || vehicles.length === 0}
          >
            {publishing ? 'Publishing...' : 'Publish Ride'}
          </button>
        </div>

        <div className="card card--flat map-panel">
          <h3 className="mb-sm">Route Preview</h3>
          {(!pickupLocation && !destinationLocation) ? (
            <div className="map-placeholder">
              <div>
                <div className="map-placeholder-icon">🗺️</div>
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
  )
}
