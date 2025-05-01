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
  return (
    <Card className="flex flex-col md:flex-row shadow-lg border border-gray-200 hover:shadow-xl transition-shadow overflow-hidden">
      <CardHeader className="p-0 md:w-1/3">
        {images && images.length > 0 ? (
          <img
            src={images[0].src}
            alt={`Foto del carro ${car.id}`}
            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
          />
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
