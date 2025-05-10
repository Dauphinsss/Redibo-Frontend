import { SteeringWheel } from "./steering-wheel-icon"

export function DriverInfo() {
  return (
    <div>
      <div className="flex justify-center mt-8">
        <div className="w-full max-w-md">
          <div className="border-2 border-gray-800 rounded-xl p-6 flex items-center justify-center">
            <div className="w-full max-w-sm">
              <div className="border-2 border-gray-800 rounded-lg p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <SteeringWheel className="w-16 h-16 text-gray-600" />
                </div>

                <div className="flex-1">
                  <div className="space-y-2">
                    <div className="h-2 w-24 bg-gray-800 rounded"></div>
                    <div className="h-2 w-32 bg-gray-800 rounded"></div>
                    <div className="h-2 w-28 bg-gray-800 rounded"></div>
                    <div className="h-2 w-20 bg-gray-800 rounded"></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-500">Licencia de conducir</p>
                <p className="text-gray-500">Válida hasta: 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
