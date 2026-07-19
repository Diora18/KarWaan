import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getSavedPlaces, updateSavedPlaces } from '../lib/api.js'
import AddressAutocomplete from '../components/AddressAutocomplete.jsx'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('menu') // 'menu', 'savedPlaces', 'help'
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const [homeLocation, setHomeLocation] = useState(null)
  const [officeLocation, setOfficeLocation] = useState(null)

  useEffect(() => {
    if (activeTab === 'savedPlaces') {
      loadSavedPlaces()
    }
  }, [activeTab])

  const loadSavedPlaces = async () => {
    setLoading(true)
    setMessage({ type: '', text: '' })
    try {
      const places = await getSavedPlaces()
      if (places.home) setHomeLocation(places.home)
      if (places.office) setOfficeLocation(places.office)
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load saved places: ' + err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleSavePlaces = async () => {
    setSaving(true)
    setMessage({ type: '', text: '' })
    try {
      const payload = {}
      if (homeLocation) payload.home = homeLocation
      if (officeLocation) payload.office = officeLocation
      await updateSavedPlaces(payload)
      setMessage({ type: 'success', text: 'Saved places updated successfully!' })
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update places: ' + err.message })
    } finally {
      setSaving(false)
    }
  }

  const menuItems = [
    { label: 'My Trips', icon: '🚗', to: '/my-trips' },
    { label: 'My Vehicle', icon: '🚙', to: '/vehicles' },
    { label: 'Payment Method', icon: '💳', to: '/wallet' },
    { label: 'Ride History', icon: '🕒', to: '/history' },
    { label: 'Saved Places', icon: '📍', onClick: () => setActiveTab('savedPlaces') },
    { label: 'Help', icon: '❓', onClick: () => setActiveTab('help') },
  ]

  return (
    <div className="app-shell">
      <header className="page-header">
        <div className="page-header-row">
          <div>
            <p className="page-eyebrow">
              {activeTab !== 'menu' && (
                <span style={{ cursor: 'pointer', marginRight: '0.5rem', color: 'var(--accent)' }} onClick={() => setActiveTab('menu')}>
                  &larr; Back to Settings
                </span>
              )}
              {activeTab === 'menu' ? 'Preferences' : ''}
            </p>
            <h1>{activeTab === 'menu' ? 'Settings' : activeTab === 'savedPlaces' ? 'Saved Places' : 'Help & Support'}</h1>
            <p className="page-subtitle">
              {activeTab === 'menu' 
                ? 'Centralizes application settings and frequently used modules.' 
                : activeTab === 'savedPlaces' 
                ? 'Store frequently used pickup and destination locations for faster booking.'
                : 'Access support resources and FAQs.'}
            </p>
          </div>
        </div>
      </header>

      {message.text && (
        <div className={`alert alert--${message.type === 'error' ? 'error' : 'success'}`}>
          {message.text}
        </div>
      )}

      {activeTab === 'menu' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {menuItems.map((item, idx) => {
              const borderBottom = idx < menuItems.length - 1 ? '1px solid var(--border)' : 'none'
              
              if (item.to) {
                return (
                  <Link 
                    key={item.label} 
                    to={item.to} 
                    style={{ padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom, textDecoration: 'none', color: 'var(--text-main)' }}
                    className="hover-bg"
                  >
                    <span style={{ fontSize: '1.5rem', width: '2rem', textAlign: 'center' }}>{item.icon}</span>
                    <span style={{ fontWeight: 500 }}>{item.label}</span>
                    <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>&rsaquo;</span>
                  </Link>
                )
              } else {
                return (
                  <div 
                    key={item.label} 
                    onClick={item.onClick}
                    style={{ padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom, cursor: 'pointer', color: 'var(--text-main)' }}
                    className="hover-bg"
                  >
                    <span style={{ fontSize: '1.5rem', width: '2rem', textAlign: 'center' }}>{item.icon}</span>
                    <span style={{ fontWeight: 500 }}>{item.label}</span>
                    <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>&rsaquo;</span>
                  </div>
                )
              }
            })}
          </div>
        </div>
      )}

      {activeTab === 'savedPlaces' && (
        <div className="card">
          <div className="form-group">
            <label style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'block' }}>🏠 Home Address</label>
            <p className="muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Set your default home location for quicker matching.</p>
            <AddressAutocomplete 
              placeholder="Search home address..."
              onPlaceSelected={(place) => setHomeLocation(place)}
              initialValue={homeLocation?.address}
            />
          </div>
          
          <div className="form-group" style={{ marginTop: '2rem' }}>
            <label style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'block' }}>🏢 Office Address</label>
            <p className="muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Set your default office location.</p>
            <AddressAutocomplete 
              placeholder="Search office address..."
              onPlaceSelected={(place) => setOfficeLocation(place)}
              initialValue={officeLocation?.address}
            />
          </div>

          <button 
            className="primary-btn" 
            style={{ marginTop: '1.5rem', width: '100%', padding: '0.8rem' }}
            onClick={handleSavePlaces}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Places'}
          </button>
        </div>
      )}

      {activeTab === 'help' && (
        <div className="card">
          <h3>Need Assistance?</h3>
          <p className="muted" style={{ marginTop: '0.5rem', lineHeight: 1.6 }}>
            If you are experiencing issues with the app, please reach out to your organization's IT admin.
          </p>
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
            <strong>Support Email:</strong> support@karwaan.internal
            <br/><br/>
            <strong>Internal Hotline:</strong> Ext. 4099
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .hover-bg:hover {
          background-color: var(--bg-primary);
        }
      `}} />
    </div>
  )
}
