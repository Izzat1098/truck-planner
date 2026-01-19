import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .services import calculate_route_distance
from .trip_planner import TripPlanner


@csrf_exempt
@require_http_methods(["POST"])
def plan_route(request):
    """
    Endpoint to calculate route distance between pickup and dropoff locations.
    Expects JSON body with pickupLocation and dropoffLocation.
    """
    try:
        data = json.loads(request.body)
        current_location = data.get('currentLocation')
        pickup_location = data.get('pickupLocation')
        dropoff_location = data.get('dropoffLocation')
        current_cycle_used = data.get('currentCycleUsed')

        
        if not pickup_location or not dropoff_location or not current_location:
            return JsonResponse({
                'error': 'Incomplete request parameters provided'
            }, status=400)
        
        if not current_cycle_used:
            cycle = 0
        else:
            cycle = current_cycle_used
        
        plan = TripPlanner(
            current_location=current_location,
            pickup_location=pickup_location,
            dropoff_location=dropoff_location,
            current_cycle_used=cycle
        )

        result = plan.calculate_trip_plan()
        
        return JsonResponse({
            'success': True,
            'tripDetails': json.loads(json.dumps(result, default=str)),
            'message': f'Route calculated successfully'
        })
        
    except ValueError as e:
        return JsonResponse({
            'error': str(e)
        }, status=400)
    
    except Exception as e:
        return JsonResponse({
            'error': f'An error occurred: {str(e)}'
        }, status=500)
