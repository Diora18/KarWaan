import { useState } from 'react'
import { Navigation } from './Dashboard.jsx'

const LogoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="url(#brandGrad)" />
    <path d="M8 18.5V21C8 21.55 8.45 22 9 22H10C10.55 22 11 21.55 11 21V20.5C11 19.67 11.67 19 12.5 19H13.5C14.33 19 15 19.67 15 20.5V21C15 21.55 15.45 22 16 22H17C17.55 22 18 21.55 18 21V18.5M18 16.5V15C18 13.34 16.66 12 15 12H11C9.34 12 8 13.34 8 15V16.5M7 17.5C7 17.22 7.22 17 7.5 17H18.5C18.78 17 19 17.22 19 17.5V18.5C19 18.78 18.78 19 18.5 19H7.5C7.22 19 7 18.78 7 18.5V17.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="brandGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1" />
        <stop offset="1" stopColor="#4f46e5" />
      </linearGradient>
    </defs>
  </svg>
)

export default function AdminPage() {
  const [approvals, setApprovals] = useState([
    { id: 1, name: 'Khush Patel', email: 'khush@odoo.com', status: 'Pending' },
    { id: 2, name: 'Smit Joshi', email: 'smit@odoo.com', status: 'Pending' }
  ])

  const handleApprove = (id) => {
    setApprovals(approvals.map(app => 
      app.id === id ? { ...app, status: 'Approved' } : app
    ))
  }

  return (
    <div className="app-shell">
      <div className="hero-card">
        <div className="topbar">
          <div className="brand">
            <LogoIcon />
            <span>KarWaan</span>
          </div>
          <span className="badge">Admin Console</span>
        </div>

        <Navigation activePath="admin" />

        <div className="grid grid-3" style={{ marginTop: 12 }}>
          <div className="panel" style={{ minHeight: 320 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 18, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>
              Approval Queue
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {approvals.map((app) => {
                const isApproved = app.status === 'Approved';
                return (
                  <div key={app.id} className="card" style={{ padding: 14, borderColor: isApproved ? 'rgba(16, 185, 129, 0.2)' : 'var(--card-border)', background: isApproved ? 'rgba(16, 185, 129, 0.02)' : 'rgba(255,255,255,0.01)' }}>
                    <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-main)' }}>{app.name}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: 12 }}>{app.email}</span>
                    
                    <div className="space-between">
                      <span className="pill" style={{ fontSize: '0.75rem', color: isApproved ? '#10b981' : 'var(--warning)', borderColor: isApproved ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)', background: isApproved ? 'rgba(16, 185, 129, 0.05)' : 'rgba(245, 158, 11, 0.05)', padding: '4px 10px' }}>
                        {app.status}
                      </span>
                      {!isApproved && (
                        <button 
                          className="primary-btn" 
                          style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                          onClick={() => handleApprove(app.id)}
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="panel" style={{ minHeight: 320, justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 18, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>
                Vehicle Fleet
              </h3>
              <div className="card" style={{ marginBottom: 16 }}>
                <strong style={{ display: 'block', fontSize: '1.6rem', color: 'var(--text-main)' }}>2 Active</strong>
                <span className="muted" style={{ fontSize: '0.85rem' }}>1 pending verification</span>
              </div>
              <p className="muted" style={{ fontSize: '0.85rem' }}>
                Ensure all drivers submit vehicle insurance documents and registration certificates before approval.
              </p>
            </div>
            
            <button className="secondary-btn" style={{ width: '100%', marginTop: 20 }}>
              Review Active Fleet
            </button>
          </div>

          <div className="panel" style={{ minHeight: 320, justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 18, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>
                Cost Settings
              </h3>
              <div className="card" style={{ marginBottom: 16 }}>
                <strong style={{ display: 'block', fontSize: '1.6rem', color: 'var(--text-main)' }}>₹6 / km</strong>
                <span className="muted" style={{ fontSize: '0.85rem' }}>Standard rate configuration</span>
              </div>
              <p className="muted" style={{ fontSize: '0.85rem' }}>
                Manage base fare rates, dynamic fuel allowances, and maximum passenger capacities.
              </p>
            </div>

            <button className="secondary-btn" style={{ width: '100%', marginTop: 20 }}>
              Adjust Cost Rules
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
