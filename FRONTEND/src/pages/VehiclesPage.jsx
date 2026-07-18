import { useState, useEffect } from 'react'
import { getMyVehicles, createMyVehicle } from '../lib/api.js'
import { useNavigate } from 'react-router-dom'

export default function VehiclesPage() {
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [adding, setAdding] = useState(false)
  const [formData, setFormData] = useState({
    model: '',
    registrationNumber: '',
    seatingCapacity: 4,
    fuelEfficiency: 15
  })

  const loadVehicles = async () => {
    try {
      const data = await getMyVehicles()
      setVehicles(data)
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load vehicles: ' + err.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVehicles()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setAdding(true)
    setMessage({ type: '', text: '' })

    try {
      await createMyVehicle({
        ...formData,
        seatingCapacity: Number(formData.seatingCapacity),
        fuelEfficiency: Number(formData.fuelEfficiency)
      })
      setMessage({ type: 'success', text: 'Vehicle added successfully!' })
      setFormData({ model: '', registrationNumber: '', seatingCapacity: 4, fuelEfficiency: 15 })
      loadVehicles()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="app-shell">
      <div className="hero-card">
        <div className="topbar">
          <div className="brand"><span>🚗</span><span>My Vehicles</span></div>
          <button className="secondary-btn" onClick={() => navigate('/dashboard')}>Back</button>
        </div>

        {message.text && (
          <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: 8, background: message.type === 'error' ? '#fee2e2' : '#dcfce7', color: message.type === 'error' ? '#991b1b' : '#166534' }}>
            {message.text}
          </div>
        )}

        <div className="grid grid-2">
          <div className="panel">
            <h3>Registered Vehicles</h3>
            {loading ? (
              <p className="muted">Loading...</p>
            ) : vehicles.length === 0 ? (
              <p className="muted">You have no registered vehicles.</p>
            ) : (
              <div className="grid" style={{ gap: 12 }}>
                {vehicles.map(v => (
                  <div key={v._id} className="card">
                    <div className="space-between">
                      <strong>{v.model}</strong>
                      <span className="pill">{v.status}</span>
                    </div>
                    <p className="muted" style={{ margin: '0.5rem 0 0 0' }}>{v.registrationNumber} • {v.seatingCapacity} Seats</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="panel">
            <h3>Add New Vehicle</h3>
            <form onSubmit={handleSubmit}>
              <label>Vehicle Model</label>
              <input 
                name="model"
                placeholder="e.g., Honda City" 
                value={formData.model}
                onChange={handleChange}
                required
              />
              
              <label>Registration Number</label>
              <input 
                name="registrationNumber"
                placeholder="e.g., GJ 01 AB 1234" 
                value={formData.registrationNumber}
                onChange={handleChange}
                required
              />
              
              <label>Seating Capacity</label>
              <input 
                type="number"
                name="seatingCapacity"
                placeholder="4"
                min="1"
                value={formData.seatingCapacity}
                onChange={handleChange}
                required
              />
              
              <label>Fuel Efficiency (km/l)</label>
              <input 
                type="number"
                name="fuelEfficiency"
                placeholder="15"
                min="1"
                value={formData.fuelEfficiency}
                onChange={handleChange}
                required
              />
              
              <button type="submit" className="primary-btn mt-3" style={{ width: '100%' }} disabled={adding}>
                {adding ? 'Adding...' : 'Add Vehicle'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
