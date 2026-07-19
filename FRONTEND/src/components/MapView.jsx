import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet's default icon paths
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom colored icons
const createIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
}

const greenIcon = createIcon('green')
const redIcon = createIcon('red')
const blueIcon = createIcon('blue')

// Component to handle map bounds when coords change
function MapUpdater({ pickup, destination, driverLocation, routeCoords }) {
  const map = useMap()

  useEffect(() => {
    const bounds = L.latLngBounds()
    let hasPoints = false

    if (pickup) { bounds.extend([pickup[1], pickup[0]]); hasPoints = true }
    if (destination) { bounds.extend([destination[1], destination[0]]); hasPoints = true }
    if (driverLocation) { bounds.extend([driverLocation[1], driverLocation[0]]); hasPoints = true }
    
    if (routeCoords && routeCoords.length > 0) {
      routeCoords.forEach(coord => bounds.extend(coord))
      hasPoints = true
    }

    if (hasPoints) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
    }
  }, [map, pickup, destination, driverLocation, routeCoords])

  return null
}

export default function MapView({ pickup, destination, driverLocation, height = '350px' }) {
  const [routeCoords, setRouteCoords] = useState([])

  const isValidCoord = (coord) => Array.isArray(coord) && coord.length === 2

  const validPickup = isValidCoord(pickup) ? pickup : null
  const validDestination = isValidCoord(destination) ? destination : null
  const validDriver = isValidCoord(driverLocation) ? driverLocation : null

  // Fetch route from OSRM
  useEffect(() => {
    if (!validPickup || !validDestination) {
      setRouteCoords([])
      return
    }

    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${validPickup[0]},${validPickup[1]};${validDestination[0]},${validDestination[1]}?overview=full&geometries=geojson`
        const res = await fetch(url)
        const data = await res.json()
        
        if (data.code === 'Ok' && data.routes.length > 0) {
          const latLngs = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]])
          setRouteCoords(latLngs)
        }
      } catch (err) {
        console.error('Routing error:', err)
      }
    }

    fetchRoute()
  }, [validPickup, validDestination])

  // Default center: Ahmedabad
  const defaultCenter = [23.0225, 72.5714]
  const center = validPickup ? [validPickup[1], validPickup[0]] : defaultCenter

  return (
    <div style={{ height, borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--border)' }} className="dark-map">
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%', zIndex: 1 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater 
          pickup={validPickup} 
          destination={validDestination} 
          driverLocation={validDriver}
          routeCoords={routeCoords}
        />

        {routeCoords.length > 0 && (
          <Polyline 
            positions={routeCoords} 
            color="#38bdf8" 
            weight={5} 
            opacity={0.8} 
          />
        )}

        {validPickup && <Marker position={[validPickup[1], validPickup[0]]} icon={greenIcon} />}
        {validDestination && <Marker position={[validDestination[1], validDestination[0]]} icon={redIcon} />}
        
        {validDriver && (
          <Marker 
            position={[validDriver[1], validDriver[0]]} 
            icon={blueIcon}
            zIndexOffset={1000} 
          />
        )}
      </MapContainer>
    </div>
  )
}
