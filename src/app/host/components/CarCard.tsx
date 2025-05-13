// src/app/host/components/CarCard.tsx

"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

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
  const cover = images[0];
  const [imageLoaded, setImageLoaded] = useState(false);

  // Base height en px para el recorte
  const BASE_HEIGHT = 200;
  const MAX_HEIGHT = 300;

  // Calculamos un alto dinámico: si la imagen es muy alta, aumentamos el contenedor
  const containerHeight = useMemo(() => {
    if (!cover?.width || !cover?.height) return BASE_HEIGHT;
    const ratio = cover.width / cover.height;
    // ratio < 1 → imagen alta → containerHeight > BASE_HEIGHT
    if (ratio < 1) {
      return Math.min(BASE_HEIGHT * (1 / ratio), MAX_HEIGHT);
    }
    // ratio ≥ 1 → imagen ancha o cuadrada → altura fija
    return BASE_HEIGHT;
  }, [cover]);

  return (
    <Card className="flex flex-col md:flex-row shadow-lg border hover:shadow-xl transition-shadow overflow-hidden">
      <CardHeader className="p-0 md:w-1/3">
        <div
          className="relative w-full bg-gray-100 overflow-hidden"
          style={{ height: `${containerHeight}px` }}
        >
          {!imageLoaded && <Skeleton className="absolute inset-0" />}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoaded ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            {cover?.data ? (
              <img
                src={cover.data}
                alt={`Foto del carro ${car.id}`}
                className="w-full h-full object-cover object-center"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-500">
                Sin imagen
              </div>
            )}
          </motion.div>
        </div>
      </CardHeader>

      <CardContent className="md:w-2/3 p-4 space-y-4 flex flex-col justify-between">
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
