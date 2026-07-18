import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyVehicles, publishRide } from '../lib/api.js'

// Simple mock geocoder for prototyping
const MOCK_GEOCODER = {
  'office': { address: 'Odoo Office, Gandhinagar', coordinates: [72.5276, 23.0351] },
  'ahmedabad': { address: 'SG Highway, Ahmedabad', coordinates: [72.5312, 23.0338] },
  'default': { address: 'Sector 1, Gandhinagar', coordinates: [72.6369, 23.2156] }
}

function geocode(text) {
  const lower = text.toLowerCase()
  if (lower.includes('office')) return MOCK_GEOCODER['office']
  if (lower.includes('ahmedabad')) return MOCK_GEOCODER['ahmedabad']
  return MOCK_GEOCODER['default']
}

export default function OfferRidePage() {
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState([])
  const [loadingVehicles, setLoadingVehicles] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  const [formData, setFormData] = useState({
    pickupText: '',
    destinationText: '',
    departureDate: new Date().toISOString().split('T')[0],
    departureTime: '', // time string like '09:00'
    availableSeats: 3,
    farePerSeat: 120,
    vehicleId: ''
  })

  useEffect(() => {
    let alive = true
    getMyVehicles()
      .then(data => {
        if (!alive) return
        // Filter out inactive vehicles
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
      if (!formData.vehicleId) {
        throw new Error('Please select a vehicle')
      }

      // Combine date and time inputs
      const departureDate = new Date(formData.departureDate)
      const [hours, minutes] = formData.departureTime.split(':')
      departureDate.setHours(Number(hours), Number(minutes), 0, 0)

      const payload = {
        vehicleId: formData.vehicleId,
        pickupLocation: geocode(formData.pickupText),
        destinationLocation: geocode(formData.destinationText),
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
          <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: 8, background: message.type === 'error' ? '#fee2e2' : '#dcfce7', color: message.type === 'error' ? '#991b1b' : '#166534' }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-2">
          <div className="panel">
            <h3>Ride details</h3>
            <label>Pickup location</label>
            <input 
              name="pickupText"
              placeholder="e.g., Sector 1, Gandhinagar" 
              value={formData.pickupText}
              onChange={handleChange}
              required
            />
            
            <label>Destination</label>
            <input 
              name="destinationText"
              placeholder="e.g., Odoo Office" 
              value={formData.destinationText}
              onChange={handleChange}
              required
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
            
            <label>Available seats</label>
            <input 
              type="number" 
              name="availableSeats"
              placeholder="3" 
              min="1"
              value={formData.availableSeats}
              onChange={handleChange}
              required
            />
            
            <label>Fare per seat (₹)</label>
            <input 
              type="number" 
              name="farePerSeat"
              placeholder="120" 
              min="0"
              value={formData.farePerSeat}
              onChange={handleChange}
              required
            />
          </div>

          <div className="panel">
            <h3>Vehicle details</h3>
            
            {loadingVehicles ? (
              <p className="muted">Loading vehicles...</p>
            ) : vehicles.length === 0 ? (
              <p className="muted" style={{ color: '#991b1b' }}>No active vehicles found. Please add a vehicle first.</p>
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
                
                <div style={{ marginTop: '2rem' }}>
                  <p className="muted" style={{ fontSize: '0.85rem' }}>
                    Note: For testing purposes, locations containing "Office" or "Ahmedabad" will map to hardcoded geocoordinates.
                  </p>
                </div>
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
        </form>
      </div>
    </div>
  )
}
