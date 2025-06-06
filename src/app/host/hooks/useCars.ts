// src/app/host/hooks/useCars.ts
import { useState, useEffect } from "react";
import axios from "axios";
import { Car } from "@/app/host/types";
import { getCars } from "@/app/host/services/carService";

interface UseCarsOptions {
  hostId: number | null;
  initialPageSize?: number;
}

export function useCars({ hostId, initialPageSize = 10 }: UseCarsOptions) {
  const [cars, setCars] = useState<Car[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [skip, setSkip] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("useCars useEffect triggered. Current hostId:", hostId);
    setCars([]);
    setHasMore(true);
    setSkip(0);
    setLoading(true);
    setError(null);
    
    if (hostId === null) {
      setLoading(false);
      return;
    }

    loadInitialCars();
    
  }, [hostId, initialPageSize]); 

  async function loadInitialCars() {
    console.log("loadInitialCars called with hostId:", hostId);
    try {
      console.log("Calling getCars with skip: 0, take:", initialPageSize, ", hostId:", hostId); 
      const result = await getCars({ 
        skip: 0, 
        take: initialPageSize, 
        hostId: hostId === null ? undefined : hostId 
      });
      
      console.log("getCars response:", result);

      if (result && result.data) {
        setCars(result.data);
        setHasMore(result.data.length > 0 && (result.total === undefined || result.data.length < result.total));
        setSkip(result.data.length);
      } else {
        console.warn("getCars did not return expected data format.", result);
        setCars([]);
        setHasMore(false);
        setSkip(0);
      }
      
    } catch (error) {
      console.error("Error loading cars:", error); 
      setError(error instanceof Error ? error : new Error("Error desconocido al cargar carros."));
    } finally {
      setLoading(false);
    }
  }

  const fetchMoreData = async () => {
    if (hostId === null || loading) {
      return;
    }
    setLoading(true); 
    try {
      const result = await getCars({ 
        skip, 
        take: initialPageSize, 
        hostId: hostId === null ? undefined : hostId 
      });
      
      console.log("fetchMoreData getCars response:", result); 

      if (result && result.data) {
        setCars((prev) => [...prev, ...result.data]);
        setSkip((prev) => prev + result.data.length);
        setHasMore(cars.length + result.data.length < result.total);
      } else {
         setHasMore(false); 
      }

    } catch (error) {
      setError(error instanceof Error ? error : new Error("Error desconocido al cargar más carros."));
    } finally {
      setLoading(false);
    }
  };

  const deleteCar = async (carId: number) => {
    console.log("deleteCar called for carId:", carId); 
    try {
      console.log("Calling DELETE API for carId:", carId); 
      await axios.delete(`http://localhost:4000/api/v1/vehiculo/${carId}/eliminar`);
      console.log("Car deleted successfully on backend."); 
      setCars((prev) => prev.filter((car) => car.id !== carId));
      console.log("Car removed from state."); 
      return true;
    } catch (error) {
      console.error("Error deleting car:", error); 
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