import os
from pathlib import Path
from unittest.mock import NonCallableMock
import openrouteservice
from openrouteservice import client
from dotenv import load_dotenv
from .utils import meters_to_miles

backend_dir = Path(__file__).resolve().parent.parent
dotenv_path = backend_dir / '.env'
load_dotenv(dotenv_path)

api_key = os.getenv('OPENROUTESERVICE_API_KEY')
if not api_key:
    raise ValueError("OPENROUTESERVICE_API_KEY not found in environment variables. "
                    "Please set it in your .env file or environment.")

def geocode_location(location_name):
    """
    Convert location name to coordinates (longitude, latitude) using OpenRouteService.
    Ensures the location is in the United States.
    """
    ors_client = client.Client(key=api_key)

    try:
        # Use OpenRouteService geocoding API
        geocode_result = ors_client.pelias_search(
            text=location_name,
            country="USA"  # Restrict to United States
        )
        
        if not geocode_result.get('features'):
            raise ValueError(f"Could not find coordinates for location: {location_name}")
        
        coords = geocode_result['features'][0]['geometry']['coordinates']
        location_address = geocode_result['features'][0]['properties'].get('label', '')
        
        return coords
        
    except Exception as e:
        raise ValueError(f"Geocoding error for {location_name}: {str(e)}")


def calculate_route_distance(start_coords, end_coords, unit = None):
    """
    Calculate driving distance between two locations using OpenRouteService.
    Returns distance in miles.
    """
    ors_client = client.Client(key=api_key)
    coords = [start_coords, end_coords]
    
    try:
        route = ors_client.directions(
            coordinates=coords,
            profile='driving-car',
            format='geojson',
            units="m"
        )
        summary = route['features'][0]['properties']["summary"]
        print("route", summary)
        distance_meters = summary["distance"]

        if unit == "miles":
            return meters_to_miles(distance_meters)
        else:
            return distance_meters
        
    except Exception as e:
        raise ValueError(f"Error calculating route from '{start_coords}' to '{end_coords}': {str(e)}")
