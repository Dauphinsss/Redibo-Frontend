// src/app/host/hooks/useCarImages.ts

import { useState, useEffect } from "react";
import { Car } from "@/app/host/types";
import { getImagesByCarId } from "@/app/host/services/imageService";

// Nuevo tipo de imagen para el frontend
export interface CarImage {
  id: number;
  src: string;  // src directo para usar en <img src="..." />
}

export function useCarImages(cars: Car[]) {
  const [carImages, setCarImages] = useState<Record<number, CarImage[]>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (cars.length) {
      loadImages();
    }
  }, [cars]);

  async function loadImages() {
    setLoading(true);
    setError(null);

    const imagesByCar: Record<number, CarImage[]> = {};

    await Promise.all(
      cars.map(async (car) => {
        try {
          const response = await getImagesByCarId(car.id);

          if (response.success) {
            // Mapear cada imagen { id, url } ➔ { id, src }
            imagesByCar[car.id] = response.data.map(img => ({
              id: img.id,
              src: img.url
            }));
          } else {
            console.warn(`API devolvió success=false para carId=${car.id}`);
            imagesByCar[car.id] = [];
          }
        } catch (err) {
          console.error(`Error cargando imágenes para carId=${car.id}:`, err);
          imagesByCar[car.id] = [];
        }
      })
    );

    setCarImages(imagesByCar);
    setLoading(false);
  }

  return {
    carImages,
    loading,
    error,
  };
}
