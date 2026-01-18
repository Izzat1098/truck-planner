const API_BASE_URL = 'http://localhost:3000/api'

export interface PlanRouteRequest {
  currentLocation: string
  pickupLocation: string
  dropoffLocation: string
  currentCycleUsed: string
}

export interface PlanRouteResponse {
  message?: string
  // Add other response fields as needed
}

export const planRoute = async (data: PlanRouteRequest): Promise<PlanRouteResponse> => {
  const response = await fetch(`${API_BASE_URL}/plan-route`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Failed to plan route')
  }

  return result
}
