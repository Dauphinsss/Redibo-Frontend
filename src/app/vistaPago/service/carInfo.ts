import { axiosInstance2 } from "@/api/axios"
import { CarByIdEndpoint, hostByIdEndpoint, ordenDePago, renterByIdEndpoint } from "@/api/endpoints";
import { Host, PaymentOrderPayload, Vehiculo } from "../types/car";
import { headers } from "next/headers";

export const getById = async (id: number): Promise<Vehiculo> => {
  const response = await axiosInstance2.get(CarByIdEndpoint.index(id));
  return response.data;
}
export const getHostById = async (id: number): Promise<Host> => {
  const res = await axiosInstance2.get(hostByIdEndpoint.index(id))
  return res.data;
}
export const getRenterById = async () => {
  const token = localStorage.getItem("auth_token");
  const res = await axiosInstance2.get(renterByIdEndpoint.index,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
  )
  return res.data
}
export const createPaymentOrder = async (data: PaymentOrderPayload) => {
  const response = await axiosInstance2.post(ordenDePago.index, data);

  return response.data;
}

export const getGarantiaByCarId = async (id_carro: number) => {
  const res = await axiosInstance2.get(`/garantias/carro/${id_carro}`);
  return res.data.garantia; // garantia
}
  ;
