import { useEffect, useState } from 'react'
import { getAdminEmployees, updateEmployeeAccess } from '../lib/api.js'

export default function AdminPage() {
  const [employees, setEmployees] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState('')

  useEffect(() => {
    let alive = true

    getAdminEmployees()
      .then((data) => {
        if (alive) {
          setEmployees(data)
        }
      })
      .catch((error) => {
        if (alive) {
          setMessage(error.message)
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
    setMessage('')

    try {
      const response = await updateEmployeeAccess(employeeId, status)
      setEmployees((current) => current.map((employee) => (employee._id === employeeId ? response.user : employee)))
      setMessage(response.message)
    } catch (error) {
      setMessage(error.message)
    } finally {
      setSavingId('')
    }
  }

  return (
    <div className="app-shell">
      <div className="hero-card">
        <div className="topbar">
          <div className="brand"><span>🛡️</span><span>Admin Console</span></div>
          <span className="badge">Organization admin</span>
        </div>

        {message && <p className="muted">{message}</p>}

        <div className="grid grid-3">
          <div className="panel">
            <h3>Approval queue</h3>
            <p className="muted">{loading ? 'Loading employees...' : `${employees.length} employees loaded`}</p>
            <div className="grid" style={{ gap: 12 }}>
              {employees.map((employee) => (
                <div key={employee._id} className="card">
                  <div className="space-between">
                    <strong>{employee.name}</strong>
                    <span className="pill">{employee.status}</span>
                  </div>
                  <p className="muted">{employee.email} • {employee.role}</p>
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
          <div className="panel">
            <h3>Vehicles</h3>
            <p className="muted">Next step: connect live vehicle list</p>
            <button className="secondary-btn" disabled>Review fleet</button>
          </div>
          <div className="panel">
            <h3>Settings</h3>
            <p className="muted">Next step: connect organization settings</p>
            <button className="secondary-btn" disabled>Open settings</button>
          </div>
        </div>
      </div>
    </div>
  )
}
