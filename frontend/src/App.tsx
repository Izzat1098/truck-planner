import { useState } from 'react'
import './App.css'

function App() {
  const [currentLocation, setCurrentLocation] = useState('')
  const [pickupLocation, setPickupLocation] = useState('')
  const [dropoffLocation, setDropoffLocation] = useState('')
  const [currentCycleUsed, setCurrentCycleUsed] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handlePlanRoute = async () => {
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('http://localhost:3000/api/plan-route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentLocation,
          pickupLocation,
          dropoffLocation,
          currentCycleUsed,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Route planned successfully!')
        console.log('Response:', data)
      } else {
        setMessage(`Error: ${data.message || 'Failed to plan route'}`)
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Failed to connect to server'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Truck Route Planner</h1>
      
      <div className="flex flex-col gap-4">
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
            placeholder="Enter current cycle used"
          />
        </div>

        <button
          onClick={handlePlanRoute}
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
      </div>
    </div>
  )
}

export default App
