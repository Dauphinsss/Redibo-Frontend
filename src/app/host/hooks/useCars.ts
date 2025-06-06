// src/app/host/hooks/useCars.ts
import { useState, useEffect } from "react";
import axios from "axios";
import { Car } from "@/app/host/types";
import { getCars } from "@/app/host/services/carService";

interface UseCarsOptions {
  hostId: number;
  initialPageSize?: number;
}

export function useCars({ hostId, initialPageSize = 10 }: UseCarsOptions) {
  const [cars, setCars] = useState<Car[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [skip, setSkip] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadInitialCars();
  }, []);

  async function loadInitialCars() {
    try {
      const result = await getCars({ 
        skip: 0, 
        take: initialPageSize, 
        hostId 
      });
      
      setCars(result.data);
      setHasMore(result.data.length > 0 && result.data.length < result.total);
      setSkip(result.data.length);
    } catch (error) {
      console.error("Error al cargar carros:", error);
      setError(error instanceof Error ? error : new Error("Error desconocido"));
    } finally {
      setLoading(false);
    }
  }

  const fetchMoreData = async () => {
    try {
      const result = await getCars({ 
        skip, 
        take: initialPageSize, 
        hostId 
      });
      
      setCars((prev) => [...prev, ...result.data]);
      setSkip((prev) => prev + result.data.length);
      setHasMore(cars.length + result.data.length < result.total);
    } catch (error) {
      console.error("Error al cargar más carros:", error);
      setError(error instanceof Error ? error : new Error("Error desconocido"));
    }
  };

  const deleteCar = async (carId: number) => {
    try {
      await axios.delete(`http://localhost:4000/api/v1/vehiculo/${carId}/eliminar`);
      setCars((prev) => prev.filter((car) => car.id !== carId));
      return true;
    } catch (error) {
      console.error("Error al eliminar el vehículo:", error);
      setError(error instanceof Error ? error : new Error("Error al eliminar el vehículo"));
      throw error;
    }
  };

  return {
    cars,
    hasMore,
    loading,
    error,
    fetchMoreData,
    deleteCar
  };
}