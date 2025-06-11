import { axiosInstance2 } from "@/api/axios"
import { API_URL } from "@/utils/bakend"
import { useMutation } from "@tanstack/react-query"

interface VerifyReservationData {
  carId: number;
  starDate: string;
  endDate: string;
}

interface VerifyReservationResponse {
  available: boolean;
  message: string;
}

const verifyReservation = async (data: VerifyReservationData): Promise<VerifyReservationResponse> => {

  const response = await axiosInstance2.post(
    'reservations/verify',
    data
  );

  return response.data;
};

export const useVerifyReservation = () => {
  return useMutation({
    mutationFn: verifyReservation,
    onError: (error: any) => {
      console.error('Error verificando reserva:', error);
    },
  });
};
