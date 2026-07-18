export default function AdminPage() {
  return (
    <div className="app-shell">
      <div className="hero-card">
        <div className="topbar">
          <div className="brand"><span>🛡️</span><span>Admin Console</span></div>
          <span className="badge">Organization admin</span>
        </div>

        <div className="grid grid-3">
          <div className="panel">
            <h3>Approval queue</h3>
            <p className="muted">Khush Patel • Pending</p>
            <button className="primary-btn">Approve</button>
          </div>
          <div className="panel">
            <h3>Vehicles</h3>
            <p className="muted">2 active vehicles • 1 inactive</p>
            <button className="secondary-btn">Review fleet</button>
          </div>
          <div className="panel">
            <h3>Settings</h3>
            <p className="muted">Cost configuration and operation rules</p>
            <button className="secondary-btn">Open settings</button>
          </div>
        </div>
      </div>
    </div>
  )
}
