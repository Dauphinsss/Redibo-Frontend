import { axiosInstance2 } from "@/api/axios"
import { useMutation } from "@tanstack/react-query"

interface VerifyReservationData {
  carId: Number;
  starDate: string;
  endDate: string;
}

interface VerifyReservationResponse {
  available: boolean;
  message: string;
}

const verifyReservation = async (data: VerifyReservationData): Promise<VerifyReservationResponse> => {
  const token = localStorage.getItem('auth_token')
  if (!token) throw new Error('Token no encontrado')

  const response = await axiosInstance2.post(
    '/reservations/verify',
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
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
