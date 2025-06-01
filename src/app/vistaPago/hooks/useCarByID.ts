import { useMutation, useQuery } from "@tanstack/react-query";
import { createPaymentOrder, getById, getHostById, getRenterById } from "../service/carInfo";
import { Host, PaymentOrderPayload, Vehiculo } from "../types/car";
export const useCardByID = (id: number) =>
    useQuery<Vehiculo>({
        queryKey: ['car', id],
        queryFn: () => getById(id),
        enabled: !!id,
    }
);
export const useHostById = (id:number) => {
    return useQuery<Host>({
        queryKey: ['host', id],
        queryFn: ()=>getHostById(id)
    });
}
export const useRenter = ()=>{
    return useQuery({
        queryKey: ['renter', ],
        queryFn: ()=>getRenterById()
    });
}
export const useCreatePaymentOrder = () => {
  return useMutation({
    mutationFn: (data: PaymentOrderPayload) => createPaymentOrder(data),
  });
};