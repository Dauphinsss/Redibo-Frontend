import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../api/axios";
import { Car } from "@/app/home/types/apitypes";

export function useCars() {
  return useQuery<Car[]>({
    queryKey: ['all-cars'],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/cars/');
      return response.data;
    },
    staleTime: 7000,
  })
}