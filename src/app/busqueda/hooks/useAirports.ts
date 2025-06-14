import { useQuery } from "@tanstack/react-query";
import { axiosInstance }from "../../../api/axios";
import { Aeropuerto } from "@/app/home/types/apitypes";

export function useAirports() {
  return useQuery<Aeropuerto[]>({
    queryKey: ['all-airports'],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/airports/');
      return response.data;
    },
    staleTime: 7000,
  })
}