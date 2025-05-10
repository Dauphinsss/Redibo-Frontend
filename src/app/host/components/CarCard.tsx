// src/app/host/components/CarCard.tsx

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Car } from "@/app/host/types";
import { CarImage } from "@/app/host/hooks/useCarImages";
import { DeleteCarDialog } from "./DeleteCarDialog";
import { EditCarDropdown } from "./EditCarDropdown";

interface CarCardProps {
  car: Car;
  images: CarImage[];
  onDelete: (carId: number) => Promise<void>;
}

export function CarCard({ car, images, onDelete }: CarCardProps) {
  const image = images[0]; // Primera imagen como portada tiene que estar (1,2 o 3)  no va desde 0
  const aspectRatio = image && image.width && image.height
    ? image.width / image.height
    : 1.5; // Valor por defecto

  return (
    <Card className="flex flex-col md:flex-row shadow-lg border hover:shadow-xl transition-shadow overflow-hidden">
      <CardHeader className="p-0 md:w-1/3">
        {image ? (
          <div
            className="w-full"
            style={{
              aspectRatio: `${aspectRatio}`,
              overflow: "hidden",
              backgroundColor: "#f3f3f3",
            }}
          >
          {image.data ? (
            <img
              src={image.data}
              alt={`Foto del carro ${car.id}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span>Sin imagen</span>
            </div>
          )}
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-48 md:h-full bg-gray-200">
            <p>No image available</p>
          </div>
        )}
      </CardHeader>

      <CardContent className="md:w-2/3 p-4 space-y-2">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">
              {car.brand} {car.model}
            </h3>
            <div className="text-sm text-muted-foreground flex flex-col gap-1">
              <p>Año: {car.year}</p>
              <p className="break-all">VIN: {car.vin}</p>
              <p>Placa: {car.plate}</p>
            </div>
          </div>
          <Badge variant={car.status === "Disponible" ? "default" : "secondary"}>
            {car.status}
          </Badge>
        </div>

        <p className="text-lg font-semibold">BS {car.price}/día</p>

        <div className="flex flex-col gap-2">
          <EditCarDropdown carId={car.id} />
          <DeleteCarDialog
            car={car}
            onDelete={() => onDelete(car.id)}
            trigger={
              <Button variant="destructive" className="w-full gap-2">
                <Trash2 size={18} /> Eliminar
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
