import type { PlanRouteRequest, PlanRouteResponse } from '../types/api.types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export const planRoute = async (data: PlanRouteRequest): Promise<PlanRouteResponse> => {
  console.log(data)

  if (data.currentCycleUsed === "") {
    data.currentCycleUsed = 0;
  }
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
