import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Coordinates, Locations } from '../types/api.types'
import L from 'leaflet'

// Fix for default marker icons in React-Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

interface MapComponentProps {
  coordinates: Coordinates
  locations: Locations
}

export default function MapComponent({ coordinates, locations }: MapComponentProps) {
  // Convert coordinates from [lng, lat] to [lat, lng] for Leaflet
  const currentPosition: LatLngExpression = [
    coordinates.currentCoordinate[1],
    coordinates.currentCoordinate[0],
  ]
  const pickupPosition: LatLngExpression = [
    coordinates.pickupCoordinate[1],
    coordinates.pickupCoordinate[0],
  ]
  const dropoffPosition: LatLngExpression = [
    coordinates.dropOffCoordinate[1],
    coordinates.dropOffCoordinate[0],
  ]

  // Create polyline connecting all points
  const routePositions: LatLngExpression[] = [
    currentPosition,
    pickupPosition,
    dropoffPosition,
  ]

  // Calculate center point for the map
  const centerLat =
    (coordinates.currentCoordinate[1] +
      coordinates.pickupCoordinate[1] +
      coordinates.dropOffCoordinate[1]) /
    3
  const centerLng =
    (coordinates.currentCoordinate[0] +
      coordinates.pickupCoordinate[0] +
      coordinates.dropOffCoordinate[0]) /
    3
  const center: LatLngExpression = [centerLat, centerLng]

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-300">
      <MapContainer
        center={center}
        zoom={7}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Current Location Marker */}
        <Marker position={currentPosition}>
          <Popup>
            <div className="text-sm">
              <strong>Current Location</strong>
              <br />
              {locations.currentLocation}
            </div>
          </Popup>
        </Marker>

        {/* Pickup Location Marker */}
        <Marker position={pickupPosition}>
          <Popup>
            <div className="text-sm">
              <strong>Pickup Location</strong>
              <br />
              {locations.pickupLocation}
            </div>
          </Popup>
        </Marker>

        {/* Dropoff Location Marker */}
        <Marker position={dropoffPosition}>
          <Popup>
            <div className="text-sm">
              <strong>Dropoff Location</strong>
              <br />
              {locations.dropOffLocation}
            </div>
          </Popup>
        </Marker>

        {/* Route Polyline */}
        <Polyline
          positions={routePositions}
          pathOptions={{ color: 'blue', weight: 3, opacity: 0.7 }}
        />
      </MapContainer>
    </div>
  )
}
