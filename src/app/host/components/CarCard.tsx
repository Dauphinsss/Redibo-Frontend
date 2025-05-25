// src/app/host/components/CarCard.tsx

"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { Car } from "@/app/host/types";
import { CarImage } from "@/app/host/hooks/useCarImages";
import { DeleteCarDialog } from "./DeleteCarDialog";

interface CarCardProps {
  car: Car;
  images: CarImage[];
  onDelete: (carId: number) => Promise<void>;
}

export function CarCard({ car, images, onDelete }: CarCardProps) {
  const router = useRouter();
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

  const editOptions = [
    { label: "Dirección", path: `/host/home/editar/Dir/${car.id}` },
    { label: "Datos principales", path: `/host/home/editar/DatosPrincipales/${car.id}` },
    { label: "Características del coche", path: `/host/home/editar/Caraccocheedit/${car.id}` },
    { label: "Características adicionales", path: `/host/home/editar/CarAdd/${car.id}` },
    { label: "Imágenes del coche y precio", path: `/host/home/editar/CarIma/${car.id}` },
    { label: "Condicones de uso", path: `/host/pages/condicionUsoAuto/${car.id}` },
  ];

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
          <div className="flex flex-col gap-1 flex-1">
            <h3 className="text-lg font-semibold">
              {car.brand} {car.model}
            </h3>
            <div className="text-sm text-muted-foreground flex flex-col gap-1">
              <p>Año: {car.year}</p>
              <p className="break-all">VIN: {car.vin}</p>
              <p>Placa: {car.plate}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={car.status === "Disponible" ? "default" : "secondary"}>
              {car.status}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                            {/* Subtítulo no interactivo */}
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 px-2 py-1 select-none cursor-default">
                  <Edit2 className="h-4 w-4" />
                  <span>Editar</span>
                </div>
                <DropdownMenuSeparator />
                {editOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.path}
                    onClick={() => router.push(option.path)}
                    className="pl-6 text-sm text-muted-foreground hover:text-foreground"
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DeleteCarDialog
                  car={car}
                  onDelete={() => onDelete(car.id)}
                  trigger={
                    <DropdownMenuItem 
                      onSelect={(e) => e.preventDefault()} 
                      className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Eliminar</span>
                    </DropdownMenuItem>
                  }
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex justify-between items-end">
          <p className="text-lg font-semibold">BS {car.price}/día</p>
        </div>
      </CardContent>
    </Card>
  );
}