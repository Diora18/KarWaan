import { useEffect, useState } from 'react'
import { getAdminEmployees, updateEmployeeAccess, getAdminVehicles, getAdminSettings, updateAdminSettings } from '../lib/api.js'

export default function AdminPage() {
  const [employees, setEmployees] = useState([])
  const [message, setMessage] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState('')
  const [vehicles, setVehicles] = useState([])
  const [settings, setSettings] = useState(null)
  const [activeTab, setActiveTab] = useState('employees')
  const [editingConfig, setEditingConfig] = useState(false)
  const [configForm, setConfigForm] = useState({
    fuelCostPerLiter: 0,
    costPerKm: 0,
    operationalTravelCost: 0
  })
  const [savingConfig, setSavingConfig] = useState(false)

  useEffect(() => {
    let alive = true

    Promise.all([
      getAdminEmployees(),
      getAdminVehicles(),
      getAdminSettings()
    ])
      .then(([empData, vehData, setData]) => {
        if (alive) {
          setEmployees(empData)
          setVehicles(vehData)
          setSettings(setData)
          if (setData?.organization?.configuration) {
            setConfigForm({
              fuelCostPerLiter: setData.organization.configuration.fuelCostPerLiter || 0,
              costPerKm: setData.organization.configuration.costPerKm || 0,
              operationalTravelCost: setData.organization.configuration.operationalTravelCost || 0
            })
          }
        }
      })
      .catch((error) => {
        if (alive) {
          setMessage({ type: 'error', text: error.message })
        }
      })
      .finally(() => {
        if (alive) {
          setLoading(false)
        }
      })

    return () => {
      alive = false
    }
  }, [])

  async function handleAccessChange(employeeId, status) {
    setSavingId(employeeId)
    setMessage({ type: '', text: '' })

    try {
      const response = await updateEmployeeAccess(employeeId, status)
      setEmployees((current) => current.map((employee) => (employee._id === employeeId ? response.user : employee)))
      setMessage({ type: 'success', text: response.message })
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setSavingId('')
    }
  }

  async function handleSaveConfig(e) {
    e.preventDefault()
    setSavingConfig(true)
    setMessage({ type: '', text: '' })

    try {
      const updated = await updateAdminSettings(configForm)
      setSettings(prev => ({
        ...prev,
        organization: updated
      }))
      setEditingConfig(false)
      setMessage({ type: 'success', text: 'Cost configuration updated successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setSavingConfig(false)
    }
  }

  const org = settings?.organization
  const config = org?.configuration

  const tabs = [
    { key: 'employees', label: '👥 Employees', count: employees.length },
    { key: 'vehicles', label: '🚙 Fleet', count: vehicles.length },
    { key: 'reports', label: '📊 Reports', count: null }
  ]

  return (
    <div className="app-shell">
      <div className="hero-card">
        <div className="topbar">
          <div className="brand"><span>🛡️</span><span>Admin Console</span></div>
          <span className="badge">Organization admin</span>
        </div>

        {message.text && (
          <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: 8, background: message.type === 'error' ? 'var(--danger-bg)' : 'var(--success-bg)', color: message.type === 'error' ? 'var(--danger)' : 'var(--success)' }}>
            {message.text}
          </div>
        )}

        {/* Company Info Banner */}
        {!loading && org && (
          <div className="panel" style={{ marginBottom: '1.5rem' }}>
            <div className="grid grid-2" style={{ gap: '1.5rem' }}>
              <div>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.6rem' }}>{org.name}</h2>
                <p className="muted" style={{ margin: '0.3rem 0' }}>🏢 Industry: {org.industry || 'Not specified'}</p>
                <p className="muted" style={{ margin: '0.3rem 0' }}>📍 Address: {org.registeredAddress || 'Not specified'}</p>
                <p className="muted" style={{ margin: '0.3rem 0' }}>📧 Admin Contact: {org.adminContact}</p>
                <p className="muted" style={{ margin: '0.3rem 0' }}>🌐 Domain: @{org.domain}</p>
              </div>
              <div>
                <div className="grid grid-3" style={{ gap: '0.8rem' }}>
                  <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{settings.registeredEmployees || 0}</div>
                    <div className="muted" style={{ fontSize: '0.8rem' }}>Employees</div>
                  </div>
                  <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{settings.registeredVehicles || 0}</div>
                    <div className="muted" style={{ fontSize: '0.8rem' }}>Vehicles</div>
                  </div>
                  <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{settings.ridesThisMonth || 0}</div>
                    <div className="muted" style={{ fontSize: '0.8rem' }}>Rides/Month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={activeTab === tab.key ? 'primary-btn' : 'secondary-btn'}
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
            >
              {tab.label} {tab.count !== null && <span style={{ opacity: 0.7 }}>({tab.count})</span>}
            </button>
          ))}
        </div>

        {/* EMPLOYEES TAB */}
        {activeTab === 'employees' && (
          <div className="panel">
            <h3>Approval Queue</h3>
            <p className="muted">{loading ? 'Loading employees...' : `${employees.length} employees loaded`}</p>
            <div className="grid grid-2" style={{ gap: 12 }}>
              {employees.map((employee) => (
                <div key={employee._id} className="card">
                  <div className="space-between">
                    <strong>{employee.name}</strong>
                    <span className="pill">{employee.status}</span>
                  </div>
                  <p className="muted">{employee.email} • {employee.role}</p>
                  {employee.department && <p className="muted" style={{ fontSize: '0.8rem' }}>Dept: {employee.department}</p>}
                  <div className="row">
                    <button
                      className="primary-btn"
                      onClick={() => handleAccessChange(employee._id, 'Active')}
                      disabled={savingId === employee._id || employee.status === 'Active'}
                    >
                      Approve
                    </button>
                    <button
                      className="secondary-btn"
                      onClick={() => handleAccessChange(employee._id, 'Rejected')}
                      disabled={savingId === employee._id || employee.status === 'Rejected'}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VEHICLES TAB */}
        {activeTab === 'vehicles' && (
          <div className="panel">
            <h3>Organization Fleet</h3>
            <p className="muted">{loading ? 'Loading fleet...' : `${vehicles.length} vehicles registered`}</p>
            <div className="grid grid-2" style={{ gap: 12 }}>
              {vehicles.map((vehicle) => (
                <div key={vehicle._id} className="card">
                  <div className="space-between">
                    <strong>{vehicle.model}</strong>
                    <span className="pill" style={{ background: vehicle.status === 'Active' ? 'var(--success-bg)' : 'var(--bg-glass)', color: vehicle.status === 'Active' ? 'var(--success)' : 'var(--text-muted)' }}>
                      {vehicle.status}
                    </span>
                  </div>
                  <p className="muted">{vehicle.registrationNumber}</p>
                  <p className="muted" style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    👤 Owner: {vehicle.ownerId?.name || 'Unknown'}
                  </p>
                  <p className="muted" style={{ fontSize: '0.85rem' }}>
                    💺 Seats: {vehicle.seatingCapacity} &nbsp;•&nbsp; ⛽ Fuel Efficiency: {vehicle.fuelEfficiency ? `${vehicle.fuelEfficiency} km/l` : 'Not set'}
                  </p>
                </div>
              ))}
              {vehicles.length === 0 && !loading && (
                <p className="muted" style={{ textAlign: 'center', margin: '2rem 0' }}>No vehicles registered yet.</p>
              )}
            </div>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <div className="grid grid-2" style={{ gap: '1.5rem' }}>
            {/* Cost Configuration */}
            <div className="panel">
              <div className="space-between" style={{ marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>Cost Configuration</h3>
                {!editingConfig && (
                  <button className="secondary-btn" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setEditingConfig(true)}>
                    ✏️ Edit
                  </button>
                )}
              </div>

              {editingConfig ? (
                <form onSubmit={handleSaveConfig}>
                  <div className="grid" style={{ gap: '1rem' }}>
                    <div>
                      <label>Fuel Cost Per Liter (₹)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={configForm.fuelCostPerLiter}
                        onChange={(e) => setConfigForm(prev => ({ ...prev, fuelCostPerLiter: Number(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <label>Cost Per KM (₹)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={configForm.costPerKm}
                        onChange={(e) => setConfigForm(prev => ({ ...prev, costPerKm: Number(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <label>Operational Travel Cost (₹)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={configForm.operationalTravelCost}
                        onChange={(e) => setConfigForm(prev => ({ ...prev, operationalTravelCost: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="row">
                      <button type="submit" className="primary-btn" disabled={savingConfig}>
                        {savingConfig ? 'Saving...' : 'Save Config'}
                      </button>
                      <button type="button" className="secondary-btn" onClick={() => setEditingConfig(false)}>Cancel</button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="grid" style={{ gap: '0.8rem' }}>
                  <div className="card space-between">
                    <span className="muted">⛽ Fuel Cost / Liter</span>
                    <strong>₹ {config?.fuelCostPerLiter ?? 'N/A'}</strong>
                  </div>
                  <div className="card space-between">
                    <span className="muted">🛣️ Cost / KM</span>
                    <strong>₹ {config?.costPerKm ?? 'N/A'}</strong>
                  </div>
                  <div className="card space-between">
                    <span className="muted">🏗️ Operational Travel Cost</span>
                    <strong>₹ {config?.operationalTravelCost ?? 'N/A'}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Summary Stats */}
            <div className="panel">
              <h3>Monthly Summary</h3>
              <div className="grid" style={{ gap: '0.8rem', marginTop: '1rem' }}>
                <div className="card space-between">
                  <span className="muted">Organization</span>
                  <strong>{org?.name || 'Not set'}</strong>
                </div>
                <div className="card space-between">
                  <span className="muted">Industry</span>
                  <strong>{org?.industry || 'Not set'}</strong>
                </div>
                <div className="card space-between">
                  <span className="muted">Registered Employees</span>
                  <strong>{settings?.registeredEmployees || 0}</strong>
                </div>
                <div className="card space-between">
                  <span className="muted">Registered Fleet</span>
                  <strong>{settings?.registeredVehicles || 0}</strong>
                </div>
                <div className="card space-between">
                  <span className="muted">Rides This Month</span>
                  <strong>{settings?.ridesThisMonth || 0}</strong>
                </div>
                <div className="card space-between">
                  <span className="muted">Avg Fleet Fuel Efficiency</span>
                  <strong>
                    {vehicles.length > 0
                      ? `${(vehicles.reduce((sum, v) => sum + (v.fuelEfficiency || 0), 0) / vehicles.filter(v => v.fuelEfficiency).length || 0).toFixed(1)} km/l`
                      : 'No vehicles'
                    }
                  </strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
