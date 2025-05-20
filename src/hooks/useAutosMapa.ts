import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axios";
import { AutoMap } from "@/interface/map";

export function useCarsMap(startDate: string, endDate: string) {
  return useQuery<AutoMap[]>({
    queryKey: ['cars-map'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/api/cars/available', {
        params: {
          startDate,
          endDate,
        },
      });
      return data
    },
    staleTime: 7000,
    enabled: !!startDate && !!endDate,
  })
}