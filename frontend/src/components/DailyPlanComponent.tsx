import type { DailyPlan } from '../types/api.types'

interface DailyPlanComponentProps {
  dailyPlan: DailyPlan[]
}

export default function DailyPlanComponent({ dailyPlan }: DailyPlanComponentProps) {
  if (!dailyPlan || dailyPlan.length === 0) {
    return null
  }

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Daily Plan</h2>
      <div className="space-y-4">
        {dailyPlan.map((plan, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-xl font-semibold text-black">Day {index + 1}</h3>
              {plan.is_pick_up && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  Pick-up
                </span>
              )}
              {plan.is_drop_off && (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  Drop-off
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-md p-3">
                <div className="text-sm text-gray-600 mb-1">Driving Time</div>
                <div className="text-xl font-semibold text-gray-900">
                  {plan.driving_time.toFixed(2)} hrs
                </div>
              </div>

              <div className="bg-gray-50 rounded-md p-3">
                <div className="text-sm text-gray-600 mb-1">Driving Distance</div>
                <div className="text-xl font-semibold text-gray-900">
                  {plan.driving_distance.toFixed(2)} mi
                </div>
              </div>

              <div className="bg-gray-50 rounded-md p-3">
                <div className="text-sm text-gray-600 mb-1">On-Duty Time</div>
                <div className="text-xl font-semibold text-gray-900">
                  {plan.on_duty_time.toFixed(2)} hrs
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
