export interface PlanRouteRequest {
  currentLocation: string
  pickupLocation: string
  dropoffLocation: string
  currentCycleUsed: string | number
}

export interface Coordinates {
  currentCoordinate: [number, number]
  pickupCoordinate: [number, number]
  dropOffCoordinate: [number, number]
}

export interface Locations {
  currentLocation: string
  pickupLocation: string
  dropOffLocation: string
}

export interface Distances {
  currentToPickup: number
  pickupToDropoff: number
  total: number
}

export interface Durations {
  currentToPickup: number
  pickupToDropoff: number
  totalDriving: number
}

export interface DailyPlan {
  is_pick_up: boolean
  is_drop_off: boolean
  driving_time: number
  driving_distance: number
  on_duty_time: number
}

export interface TripDetails {
  locations: Locations
  coordinates: Coordinates
  distances: Distances
  durations: Durations
  dailyPlan: DailyPlan[]
}

export interface PlanRouteResponse {
  success: boolean
  tripDetails: TripDetails
  message: string
}
