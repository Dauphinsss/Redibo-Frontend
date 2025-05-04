// src/app/host/hooks/useCarImages.ts

import { useState, useEffect } from "react";
import { Car } from "@/app/host/types";
import { getImagesByCarId } from "@/app/host/services/imageService";

export interface CarImage {
  id: number;
  data: string;
  width?: number;
  height?: number;
}

export function useCarImages(cars: Car[]) {
  const [carImages, setCarImages] = useState<Record<number, CarImage[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadImages() {
      setLoading(true);
      setError(null);

      const imagesByCar: Record<number, CarImage[]> = {};

      await Promise.all(
        cars.map(async (car) => {
          try {
            const response = await getImagesByCarId(car.id);

            if (response.success) {
              imagesByCar[car.id] = response.data.map(img => ({
                id: img.id,
                data: img.data,
                width: img.width,
                height: img.height,
              }));
            } else {
              imagesByCar[car.id] = [];
            }
          } catch (err) {
            imagesByCar[car.id] = [];
            if (!cancelled) setError(err as Error);
          }
        })
      );

      if (!cancelled) {
        setCarImages(imagesByCar);
        setLoading(false);
      }
    }

    if (cars.length) loadImages();
    return () => { cancelled = true; };
  }, [cars]);

  return {
    carImages,
    loading,
    error,
  };
}
