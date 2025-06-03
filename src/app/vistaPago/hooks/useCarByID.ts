import { useMutation, useQuery } from "@tanstack/react-query";
import { createPaymentOrder, getById, getHostById, getRenterById, getGarantiaByCarId} from "../service/carInfo";
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
export const useGarantiaByCarId = (id_carro: number) => {
  return useQuery({
    queryKey: ['garantia', id_carro],
    queryFn: () => getGarantiaByCarId(id_carro),
    enabled: !!id_carro,
  });
};