import { useState } from 'react'
import './App.css'
import { planRoute } from './services/api'
import type { PlanRouteResponse } from './types/api.types'
import MapComponent from './components/MapComponent'
import DailyPlanComponent from './components/DailyPlanComponent'

function App() {
  const [currentLocation, setCurrentLocation] = useState('')
  const [pickupLocation, setPickupLocation] = useState('')
  const [dropoffLocation, setDropoffLocation] = useState('')
  const [currentCycleUsed, setCurrentCycleUsed] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [tripData, setTripData] = useState<PlanRouteResponse | null>(null)

  const handlePlanRoute = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setTripData(null)

    try {
      const data = await planRoute({
        currentLocation,
        pickupLocation,
        dropoffLocation,
        currentCycleUsed: parseFloat(currentCycleUsed) || 0,
      })

      setMessage('Route planned successfully!')
      setTripData(data)
      console.log('Response:', data)

    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Failed to connect to server'}`)

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Truck Route Planner</h1>
      
      <form onSubmit={handlePlanRoute} className="flex flex-col gap-4">
        <div>
          <label htmlFor="currentLocation" className="block mb-2 font-medium">
            Current Location:
          </label>
          <input
            id="currentLocation"
            type="text"
            value={currentLocation}
            onChange={(e) => setCurrentLocation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter current location"
          />
        </div>

        <div>
          <label htmlFor="pickupLocation" className="block mb-2 font-medium">
            Pickup Location:
          </label>
          <input
            id="pickupLocation"
            type="text"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter pickup location"
          />
        </div>

        <div>
          <label htmlFor="dropoffLocation" className="block mb-2 font-medium">
            Dropoff Location:
          </label>
          <input
            id="dropoffLocation"
            type="text"
            value={dropoffLocation}
            onChange={(e) => setDropoffLocation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter dropoff location"
          />
        </div>

        <div>
          <label htmlFor="currentCycleUsed" className="block mb-2 font-medium">
            Current Cycle Used:
          </label>
          <input
            id="currentCycleUsed"
            type="text"
            value={currentCycleUsed}
            onChange={(e) => setCurrentCycleUsed(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter current cycle used in this week"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`mt-4 px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-md transition-colors ${
            loading 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          {loading ? 'Planning...' : 'Plan Route'}
        </button>

        {message && (
          <div
            className={`p-4 rounded-md mt-4 ${
              message.startsWith('Error')
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-green-50 text-green-800 border border-green-200'
            }`}
          >
            {message}
          </div>
        )}
      </form>

      {/* Display Map and Daily Plan when trip data is available */}
      {tripData && tripData.tripDetails && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Trip Overview</h2>
          
          {/* Map Component */}
          <MapComponent
            coordinates={tripData.tripDetails.coordinates}
            locations={tripData.tripDetails.locations}
          />

          {/* Daily Plan Component */}
          <DailyPlanComponent dailyPlan={tripData.tripDetails.dailyPlan} />
        </div>
      )}
    </div>
  )
}

export default App
