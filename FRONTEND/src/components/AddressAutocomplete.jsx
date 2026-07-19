import { useState, useEffect, useRef } from 'react'

export default function AddressAutocomplete({ value, onChange, placeholder = 'Search address...', label, quickPicks = [] }) {
  const [query, setQuery] = useState(value?.address || '')
  const [suggestions, setSuggestions] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const wrapperRef = useRef(null)

  // Debounce API calls
  useEffect(() => {
    if (!query || query.length < 3) {
      setSuggestions([])
      return
    }

    // Don't search if the query exactly matches the selected value
    if (value && query === value.address) {
      return
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true)
      try {
        // Photon API (Free, OSM-based)
        // lon, lat focus helps bias results towards India/Gujarat area (e.g., Ahmedabad: 72.57, 23.02)
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lon=72.5714&lat=23.0225`)
        const data = await res.json()
        setSuggestions(data.features || [])
      } catch (err) {
        console.error('Autocomplete error:', err)
      } finally {
        setLoading(false)
      }
    }, 400)

    return () => clearTimeout(delayDebounceFn)
  }, [query, value])

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (feature) => {
    const { name, city, state, country } = feature.properties
    const coords = feature.geometry.coordinates // [lon, lat]
    
    // Construct readable address
    const addressParts = [name, city, state, country].filter(Boolean)
    const formattedAddress = addressParts.join(', ')
    
    setQuery(formattedAddress)
    setIsOpen(false)
    
    onChange({
      address: formattedAddress,
      coordinates: coords
    })
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative', marginBottom: '14px' }}>
      {label && <label>{label}</label>}
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
            if (value) onChange(null) // clear selection if they type
          }}
          onFocus={() => { if (suggestions.length > 0) setIsOpen(true) }}
          style={{ width: '100%', marginBottom: 0 }}
        />
        {loading && (
          <span style={{ position: 'absolute', right: '12px', top: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Loading...
          </span>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="autocomplete-dropdown">
          {suggestions.map((feature, i) => {
            const { name, city, state } = feature.properties
            return (
              <li key={i} onClick={() => handleSelect(feature)}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {[city, state].filter(Boolean).join(', ')}
                </div>
              </li>
            )
          })}
        </ul>
      )}
      
      {quickPicks && quickPicks.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
          {quickPicks.map((pick, idx) => (
            <button
              key={idx}
              type="button"
              className="secondary-btn"
              style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', borderRadius: '1rem' }}
              onClick={() => {
                setQuery(pick.place.address)
                onChange(pick.place)
              }}
            >
              {pick.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
