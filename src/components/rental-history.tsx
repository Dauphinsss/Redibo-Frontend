import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

interface RentalHistoryItem {
  id: string
  vehiculo: string
  fechaInicio: string
  fechaFin: string
  anfitrion: string
  estado: string
  imagenVehiculo: string
}

interface RentalHistoryProps {
  historial: RentalHistoryItem[]
}

export default function RentalHistory({ historial }: RentalHistoryProps) {
  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "completado":
        return <Badge className="bg-green-500">Completado</Badge>
      case "cancelado":
        return <Badge className="bg-red-500">Cancelado</Badge>
      case "en curso":
        return <Badge className="bg-blue-500">En curso</Badge>
      default:
        return <Badge>{estado}</Badge>
    }
  }

  return (
    <Card className="border-redibo-blue">
      <CardHeader className="bg-redibo-blue text-redibo-white rounded-t-lg">
        <CardTitle>Historial de arrendamientos</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {historial.length === 0 ? (
            <p className="text-center text-redibo-blue py-4">No hay historial de arrendamientos</p>
          ) : (
            historial.map((item) => (
              <div key={item.id} className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-24 overflow-hidden rounded-md border border-redibo-blue">
                    <Image
                      src={item.imagenVehiculo || "/placeholder.svg"}
                      alt={item.vehiculo}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-redibo-blue">{item.vehiculo}</h4>
                    <div className="flex items-center text-sm text-redibo-blue/70">
                      <span>{item.fechaInicio}</span>
                      <span className="mx-1">→</span>
                      <span>{item.fechaFin}</span>
                    </div>
                    <div className="text-sm">Anfitrión: {item.anfitrion}</div>
                  </div>
                  <div>{getStatusBadge(item.estado)}</div>
                </div>
                <Separator className="bg-redibo-bone" />
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
