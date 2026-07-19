import { useState, useEffect } from 'react'
import { getMyVehicles, createMyVehicle } from '../lib/api.js'

export default function VehiclesPage() {
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
      <header className="page-header">
        <p className="page-eyebrow">Fleet</p>
        <h1>My Vehicles</h1>
        <p className="page-subtitle">Manage your cars and their details for offering rides.</p>
      </header>

      {message.text && (
        <div className={`alert alert--${message.type === 'error' ? 'error' : 'success'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-2">
        <div className="card card--flat">
          <h3 className="mb-sm">Registered Vehicles</h3>
          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : vehicles.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🚙</div>
              <p>You have no registered vehicles.</p>
            </div>
          ) : (
            <div className="grid gap-sm">
              {vehicles.map(v => (
                <div key={v._id} className="vehicle-item">
                  <div className="vehicle-item-header">
                    <strong>{v.model}</strong>
                    <span className={`pill ${v.status === 'Active' ? 'pill--success' : ''}`}>
                      {v.status}
                    </span>
                  </div>
                  <p className="muted" style={{ margin: 0, fontSize: '0.875rem' }}>
                    <strong>Reg:</strong> {v.registrationNumber}<br/>
                    <strong>Seats:</strong> {v.seatingCapacity} · <strong>Efficiency:</strong> {v.fuelEfficiency ? `${v.fuelEfficiency} km/l` : 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card card--flat">
          <h3 className="mb-sm">Add New Vehicle</h3>
          <form onSubmit={handleSubmit} className="grid gap-sm">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Vehicle Model</label>
              <input 
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. Honda City"
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Registration Number</label>
              <input 
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                placeholder="e.g. MH 01 AB 1234"
                required
              />
            </div>
            <div className="grid grid-2 gap-sm">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Seating Capacity</label>
                <input 
                  type="number"
                  name="seatingCapacity"
                  value={formData.seatingCapacity}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Fuel Efficiency (km/l)</label>
                <input 
                  type="number"
                  name="fuelEfficiency"
                  value={formData.fuelEfficiency}
                  onChange={handleChange}
                  min="1"
                />
              </div>
            </div>
            <button type="submit" className="primary-btn btn-block" disabled={adding}>
              {adding ? 'Adding...' : 'Add Vehicle'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
