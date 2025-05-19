import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axios";
import { Car } from "@/app/busqueda/types/apitypes";

export function useMostRentedCars() {
  return useQuery<Car[]>({
    queryKey: ['most-rented-cars'],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/cars/most-rented');
      return response.data;
    },
    staleTime: 7000,
  })
}


