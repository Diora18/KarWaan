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
        if (alive) setMessage({ type: 'error', text: error.message })
      })
      .finally(() => {
        if (alive) setLoading(false)
      })

    return () => { alive = false }
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
    { key: 'employees', label: 'Employees', count: employees.length },
    { key: 'vehicles', label: 'Fleet', count: vehicles.length },
    { key: 'reports', label: 'Reports', count: null }
  ]

  return (
    <div className="app-shell">
      <header className="page-header">
        <div className="page-header-row">
          <div>
            <p className="page-eyebrow">Administration</p>
            <h1>Admin Console</h1>
            <p className="page-subtitle">Manage employees, fleet, and organization settings.</p>
          </div>
          <span className="badge">Organization admin</span>
        </div>
      </header>

      {message.text && (
        <div className={`alert alert--${message.type === 'error' ? 'error' : 'success'}`}>
          {message.text}
        </div>
      )}

      {!loading && org && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="grid grid-2 gap-md">
            <div>
              <h2 style={{ margin: '0 0 8px', fontSize: '1.5rem' }}>{org.name}</h2>
              <p className="muted" style={{ margin: '4px 0' }}>Industry: {org.industry || 'Not specified'}</p>
              <p className="muted" style={{ margin: '4px 0' }}>Address: {org.registeredAddress || 'Not specified'}</p>
              <p className="muted" style={{ margin: '4px 0' }}>Admin Contact: {org.adminContact}</p>
              <p className="muted" style={{ margin: '4px 0' }}>Domain: @{org.domain}</p>
            </div>
            <div className="grid grid-2 gap-sm">
              <div style={{ background: 'var(--bg-primary)', padding: '1.2rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)' }}>{settings.registeredEmployees || 0}</div>
                <div className="muted" style={{ fontSize: '0.9rem', marginTop: '0.2rem' }}>Employees</div>
              </div>
              <div style={{ background: 'var(--bg-primary)', padding: '1.2rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)' }}>{settings.registeredVehicles || 0}</div>
                <div className="muted" style={{ fontSize: '0.9rem', marginTop: '0.2rem' }}>Vehicles</div>
              </div>
              <div style={{ background: 'var(--bg-primary)', padding: '1.2rem', borderRadius: 'var(--radius-md)', textAlign: 'center', gridColumn: 'span 2' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)' }}>{settings.ridesThisMonth || 0}</div>
                <div className="muted" style={{ fontSize: '0.9rem', marginTop: '0.2rem' }}>Rides This Month</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`tab-btn ${activeTab === tab.key ? 'primary-btn' : 'secondary-btn'}`}
          >
            {tab.label} {tab.count !== null && <span style={{ opacity: 0.7 }}>({tab.count})</span>}
          </button>
        ))}
      </div>

      {activeTab === 'employees' && (
        <div className="card">
          <h3 style={{ marginBottom: '0.5rem' }}>Approval Queue</h3>
          <p className="muted" style={{ marginBottom: '1.5rem' }}>{loading ? 'Loading employees...' : `${employees.length} employees loaded`}</p>
          <div className="grid grid-2 gap-sm">
            {employees.map((employee) => (
              <div key={employee._id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                <div className="space-between mb-sm">
                  <strong style={{ fontSize: '1.1rem' }}>{employee.name}</strong>
                  <span className={`pill ${employee.status === 'Active' ? 'pill--success' : employee.status === 'Rejected' ? 'pill--danger' : ''}`}>{employee.status}</span>
                </div>
                <p className="muted" style={{ fontSize: '0.875rem' }}>{employee.email} · {employee.role}</p>
                {employee.department && <p className="muted" style={{ fontSize: '0.8125rem' }}>Dept: {employee.department}</p>}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button
                    className="primary-btn"
                    style={{ flex: 1, padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                    onClick={() => handleAccessChange(employee._id, 'Active')}
                    disabled={savingId === employee._id || employee.status === 'Active'}
                  >
                    Approve
                  </button>
                  <button
                    className="secondary-btn"
                    style={{ flex: 1, padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
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

      {activeTab === 'vehicles' && (
        <div className="card">
          <h3 style={{ marginBottom: '0.5rem' }}>Organization Fleet</h3>
          <p className="muted" style={{ marginBottom: '1.5rem' }}>{loading ? 'Loading fleet...' : `${vehicles.length} vehicles registered`}</p>
          <div className="grid grid-2 gap-sm">
            {vehicles.map((vehicle) => (
              <div key={vehicle._id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                <div className="space-between mb-sm">
                  <strong style={{ fontSize: '1.1rem' }}>{vehicle.model}</strong>
                  <span className={`pill ${vehicle.status === 'Active' ? 'pill--success' : ''}`}>
                    {vehicle.status}
                  </span>
                </div>
                <p className="muted" style={{ fontSize: '0.875rem' }}>{vehicle.registrationNumber}</p>
                <p className="muted" style={{ fontSize: '0.8125rem', marginTop: 4 }}>
                  Owner: {vehicle.ownerId?.name || 'Unknown'}
                </p>
                <p className="muted" style={{ fontSize: '0.8125rem' }}>
                  Seats: {vehicle.seatingCapacity} · Fuel Efficiency: {vehicle.fuelEfficiency ? `${vehicle.fuelEfficiency} km/l` : 'Not set'}
                </p>
              </div>
            ))}
            {vehicles.length === 0 && !loading && (
              <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', gridColumn: 'span 2' }}>
                <p className="muted">No vehicles registered yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="grid grid-2 gap-md">
          <div className="card">
            <div className="space-between" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Cost Configuration</h3>
              {!editingConfig && (
                <button className="secondary-btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => setEditingConfig(true)}>Edit</button>
              )}
            </div>

            {editingConfig ? (
              <form onSubmit={handleSaveConfig}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Fuel Cost Per Liter (₹)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={configForm.fuelCostPerLiter}
                      onChange={(e) => setConfigForm(prev => ({ ...prev, fuelCostPerLiter: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Cost Per KM (₹)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={configForm.costPerKm}
                      onChange={(e) => setConfigForm(prev => ({ ...prev, costPerKm: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Operational Travel Cost (₹)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={configForm.operationalTravelCost}
                      onChange={(e) => setConfigForm(prev => ({ ...prev, operationalTravelCost: Number(e.target.value) }))}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button type="submit" className="primary-btn" disabled={savingConfig}>
                      {savingConfig ? 'Saving...' : 'Save Config'}
                    </button>
                    <button type="button" className="secondary-btn" onClick={() => setEditingConfig(false)}>Cancel</button>
                  </div>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                  <span className="muted">Fuel Cost / Liter</span>
                  <strong>₹ {config?.fuelCostPerLiter ?? 'N/A'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                  <span className="muted">Cost / KM</span>
                  <strong>₹ {config?.costPerKm ?? 'N/A'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                  <span className="muted">Operational Travel Cost</span>
                  <strong>₹ {config?.operationalTravelCost ?? 'N/A'}</strong>
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Monthly Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
                <span className="muted">Organization</span>
                <strong>{org?.name || 'Not set'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
                <span className="muted">Industry</span>
                <strong>{org?.industry || 'Not set'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
                <span className="muted">Registered Employees</span>
                <strong>{settings?.registeredEmployees || 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
                <span className="muted">Registered Fleet</span>
                <strong>{settings?.registeredVehicles || 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
                <span className="muted">Rides This Month</span>
                <strong style={{ color: 'var(--accent)' }}>{settings?.ridesThisMonth || 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
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
  )
}
