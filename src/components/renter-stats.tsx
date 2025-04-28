import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Clock, Calendar, XCircle, Award } from "lucide-react"

interface RenterStatsProps {
  estadisticas: {
    arrendamientosCompletados: number
    diasTotalesArrendados: number
    tiempoPromedioRespuesta: string
    tasaCancelacion: string
  }
}

export default function RenterStats({ estadisticas }: RenterStatsProps) {
  return (
    <Card className="border-redibo-blue">
      <CardHeader className="bg-redibo-blue text-redibo-white rounded-t-lg">
        <CardTitle>Estadísticas del arrendatario</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-redibo-bone p-4 rounded-lg flex items-center gap-3">
            <div className="bg-redibo-orange/20 p-2 rounded-full">
              <Car className="h-5 w-5 text-redibo-orange" />
            </div>
            <div>
              <div className="text-sm font-medium text-redibo-blue">Arrendamientos completados</div>
              <div className="text-2xl font-bold text-redibo-black">{estadisticas.arrendamientosCompletados}</div>
            </div>
          </div>

          <div className="bg-redibo-bone p-4 rounded-lg flex items-center gap-3">
            <div className="bg-redibo-orange/20 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-redibo-orange" />
            </div>
            <div>
              <div className="text-sm font-medium text-redibo-blue">Días totales arrendados</div>
              <div className="text-2xl font-bold text-redibo-black">{estadisticas.diasTotalesArrendados}</div>
            </div>
          </div>

          <div className="bg-redibo-bone p-4 rounded-lg flex items-center gap-3">
            <div className="bg-redibo-orange/20 p-2 rounded-full">
              <Clock className="h-5 w-5 text-redibo-orange" />
            </div>
            <div>
              <div className="text-sm font-medium text-redibo-blue">Tiempo promedio de respuesta</div>
              <div className="text-2xl font-bold text-redibo-black">{estadisticas.tiempoPromedioRespuesta}</div>
            </div>
          </div>

          <div className="bg-redibo-bone p-4 rounded-lg flex items-center gap-3">
            <div className="bg-redibo-orange/20 p-2 rounded-full">
              <XCircle className="h-5 w-5 text-redibo-orange" />
            </div>
            <div>
              <div className="text-sm font-medium text-redibo-blue">Tasa de cancelación</div>
              <div className="text-2xl font-bold text-redibo-black">{estadisticas.tasaCancelacion}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-redibo-orange/20 border border-redibo-orange rounded-lg p-4 flex items-start">
          <Award className="h-5 w-5 text-redibo-orange mr-2 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-redibo-blue">Arrendatario confiable</h3>
            <p className="text-xs text-redibo-black mt-1">
              Este arrendatario tiene un historial excelente y ha mantenido una alta calificación.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
