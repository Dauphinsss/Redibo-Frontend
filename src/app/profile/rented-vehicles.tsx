"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, Calendar, DollarSign } from "lucide-react"

// Datos de ejemplo para vehículos rentados
const mockVehicles = [
  {
    id: 1,
    name: "Tesla Model 3",
    description: "Sedán eléctrico de alto rendimiento",
    image: "/placeholder.svg?height=300&width=500",
    pricePerDay: 85,
    startDate: "2023-05-15",
    endDate: "2023-05-20",
    status: "active",
  },
  {
    id: 2,
    name: "BMW X5",
    description: "SUV de lujo con características premium",
    image: "/placeholder.svg?height=300&width=500",
    pricePerDay: 120,
    startDate: "2023-06-10",
    endDate: "2023-06-15",
    status: "completed",
  },
]

export function RentedVehicles() {
  const [vehicles, setVehicles] = useState(mockVehicles)

  // Función para mostrar el estado del alquiler
  const renderStatus = (status: string) => {
    if (status === "active") {
      return <Badge className="bg-green-600">Activo</Badge>
    } else if (status === "completed") {
      return <Badge variant="secondary">Completado</Badge>
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mis Vehículos Rentados</h2>
        <Button className="bg-black hover:bg-gray-800 text-white">Rentar Nuevo Vehículo</Button>
      </div>

      {vehicles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <Image src={vehicle.image || "/placeholder.svg"} alt={vehicle.name} fill className="object-cover" />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{vehicle.name}</CardTitle>
                    <CardDescription>{vehicle.description}</CardDescription>
                  </div>
                  {renderStatus(vehicle.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-muted-foreground" />
                    <span className="font-medium">{vehicle.pricePerDay}€ por día</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-muted-foreground" />
                    <span>
                      {new Date(vehicle.startDate).toLocaleDateString()} -{" "}
                      {new Date(vehicle.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" className="w-full">
                  Ver Detalles
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <Car size={64} className="text-gray-300" />
              <p className="text-xl text-gray-400">No hay vehículos rentados</p>
              <Button className="mt-4 bg-black hover:bg-gray-800 text-white">Rentar un Vehículo Ahora</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
