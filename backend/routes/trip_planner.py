"""
Trip planning logic for truck routes.
Handles calculations for feasibility, timing, and route optimization.
"""

from pickle import TRUE
from .services import calculate_route_distance, geocode_location


class TripPlanner:
    """
    Handles trip planning calculations and feasibility checks.
    """
    
    # Constants - We may want to make this user input in future for more flexible calculation
    MAX_DRIVING_HOURS_DAY = 11  # Maximum driving hours per day
    MAX_DRIVING_HOURS_CYCLE = 70  # Maximum driving hours per cycle
    CYCLE_DAYS = 8 # Days in cycle

    MAX_ON_DUTY_HOURS = 14  # Maximum on-duty hours per day
    FUELLING_DISTANCE_MILES = 1000 # Fuelling every x miles
    PICKUP_DROPOFF_DURATION = 0.5 # Duration in hours for pickup and dropoff (0.5 hours x 2 = 1 hour)
    AVERAGE_SPEED_MPH = 55  # Average highway speed including breaks
    
    def __init__(self, current_location, pickup_location, dropoff_location, current_cycle_used):
        self.current_location = current_location
        self.pickup_location = pickup_location
        self.dropoff_location = dropoff_location

        self.current_coord = geocode_location(current_location)
        self.pickup_coord = geocode_location(pickup_location)
        self.dropoff_coord = geocode_location(dropoff_location)

        self._daily_plan = [] # we will store the daily logs here

        self.current_cycle_used = float(current_cycle_used)
        if self.current_cycle_used >= self.MAX_DRIVING_HOURS_CYCLE:
            raise ValueError ("Current cycle used hours exceed maximum allowed hours in cycle.")
    

    def calculate_trip_plan(self):
        """
        Calculate complete trip plan including distances, times, and feasibility.
        """
        # Calculate distances
        self.distance_to_curr_pickup = calculate_route_distance(
            self.current_coord, 
            self.pickup_coord,
            "miles"
        )
        self.driving_time_curr_pickup = round(self.distance_to_curr_pickup / self.AVERAGE_SPEED_MPH, 2)
        
        self.distance_pickup_dropoff = calculate_route_distance(
            self.pickup_coord, 
            self.dropoff_coord,
            "miles"
        )
        self.driving_time_pickup_dropoff = round(self.distance_pickup_dropoff / self.AVERAGE_SPEED_MPH, 2)
        
        self.total_distance = round(self.distance_to_curr_pickup + self.distance_pickup_dropoff, 2)
        self.total_driving_time = round(self.driving_time_curr_pickup + self.driving_time_pickup_dropoff, 2)

        if self.total_driving_time + self.current_cycle_used > self.MAX_DRIVING_HOURS_CYCLE:
            raise ValueError("Trip is not possible. The required driving hours exceeds the current cycle maximum limit.")

        self._create_trip_plan()


        return {
            'locations': {
                'currentLocation': self.current_location,
                'pickupLocation': self.pickup_location,
                'dropOffLocation': self.dropoff_location
            },
            'coordinates': {
                'currentCoordinate': self.current_coord,
                'pickupCoordinate': self.pickup_coord,
                'dropOffCoordinate': self.dropoff_coord
            },
            'distances': {
                'currentToPickup': round(self.distance_to_curr_pickup, 2),
                'pickupToDropoff': round(self.distance_pickup_dropoff, 2),
                'total': self.total_distance
            },
            'durations': {
                'currentToPickup': self.driving_time_curr_pickup,
                'pickupToDropoff': self.driving_time_pickup_dropoff,
                'totalDriving': round(self.total_driving_time, 2)
            },
            'dailyPlan': self._daily_plan
        }
    

    def _create_trip_plan(self):
        """Create daily trip plan"""

        cum_driving_time = 0
        current_day = 0
        dropped_off = False
        
        while not dropped_off:

            current_day_plan = {
                "is_pick_up": False,
                "is_drop_off": False,
                "driving_time": 0,
                "driving_distance": 0,
                "on_duty_time": 0
            }

            if current_day == 0:
                current_day_plan["is_pick_up"] = True

            on_duty_time = 0
            driving_time_today = 0

            remaining_driving_time = self.total_driving_time - cum_driving_time

            driving_time_today = min(remaining_driving_time, self.MAX_DRIVING_HOURS_DAY, self.MAX_ON_DUTY_HOURS - on_duty_time)

            cum_driving_time += driving_time_today

            current_day_plan['driving_time'] = round(driving_time_today, 2)
            current_day_plan['driving_distance'] = round(driving_time_today * self.AVERAGE_SPEED_MPH, 2)
            on_duty_time += driving_time_today

            if cum_driving_time >= self.total_driving_time and on_duty_time + self.PICKUP_DROPOFF_DURATION <= self.MAX_ON_DUTY_HOURS:
                dropped_off = True
                current_day_plan['is_drop_off'] = True
                on_duty_time += self.PICKUP_DROPOFF_DURATION

            current_day_plan['on_duty_time'] = round(on_duty_time, 2)

            self._daily_plan.append(current_day_plan)