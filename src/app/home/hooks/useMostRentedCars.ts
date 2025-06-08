import { useQuery } from "@tanstack/react-query";
import {axiosInstance} from "@/api/axios";
import { Car } from "@/app/home/types/apitypes";

export function useMostRentedCars() {
  return useQuery<Car[]>({
    queryKey: ['most-rented-cars'],
    queryFn: async () => {
      const response = await axiosInstance.get('api/cars/most-rented');
      return response.data;
    },
    staleTime: 7000,
  })
}


