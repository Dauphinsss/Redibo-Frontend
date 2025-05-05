import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import React, { useState } from "react";
import { SuccessModal } from "./SuccessNotification";
import axiosInstance from "@/api/axios";
import axios from "axios";
import { useUserProfile } from "./hooks/useProfile";

interface ReservationDialogProps {
  showDialog: boolean;
  setShowDialog: (val: boolean) => void;
  loading: boolean;
  handleClick: () => void;
  handleConfirm: () => void;
  confirmed: boolean;
  handleCancelReservation: () => void;
  vehicle: {
    id: number;
    marca: string;
    modelo: string;
    precio: string;
  };
  pickupDate?: Date;
  returnDate?: Date;
  timeLeft: number;
  formatTime: (ms: number, detailed?: boolean) => string;
  id: string;
  marca: string;
  modelo: string;
}

export default function ReservationDialog({
  showDialog,
  setShowDialog,
  loading,
  handleClick,
  handleConfirm,
  confirmed,
  handleCancelReservation,
  vehicle,
  timeLeft,
  formatTime,
  pickupDate,
  returnDate,
  id,
  marca,
  modelo,
}: ReservationDialogProps) {
  const [reservaId, setReservaId] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const profile = useUserProfile();
  if (!profile) return <div>Cargando datos del usuario...</div>;

  const crearReserva = async (
    userId: number,
    carId: number,
    pickupDate: Date | undefined,
    returnDate: Date | undefined,
    estado: string = "pendiente"
  ): Promise<boolean> => {
    if (!pickupDate || !returnDate) {
      alert("Las fechas no pueden estar vacías");
      return false;
    }

    try {
      const response = await axiosInstance.post("/api/reservations", {
        userId,
        carId,
        starDate: pickupDate.toISOString().split("T")[0],
        endDate: returnDate.toISOString().split("T")[0],
        estado,
      });

      const data = response.data;
      console.log("✔ Reserva creada correctamente:", data);
      setReservaId(data.id);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const backendError = error.response?.data?.error || "Error al crear la reserva";
        alert(backendError);
      } else {
        alert("Error de red al intentar crear la reserva");
      }
      return false;
    }
  };

  const actualizarEstadoReserva = async (
    id: number,
    nuevoEstado: string
  ): Promise<boolean> => {
    try {
      const response = await axiosInstance.patch(`/api/reservations/${id}/state`, {
        estado: nuevoEstado,
      });

      const data = response.data;
      console.log("Estado actualizado:", data);
      alert(`Estado actualizado a: ${data.estado}`);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const backendError = error.response?.data?.error || "Error al actualizar el estado";
        alert(backendError);
      } else {
        console.error("Error de red al actualizar estado:", error);
        alert("Error de red al actualizar el estado");
      }
      return false;
    }
  };

  return (
    <>
      <SuccessModal show={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClick}
            disabled={loading}
            className="border-gray-500"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                Reservar
              </>
            )}
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="max-w-md w-full">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center bg-[#11295B] text-white p-4 rounded-t-xl">
              Reserva Temporal
            </AlertDialogTitle>

            <div className="text-sm space-y-2 mt-2 ml-10">
              <div>
                <strong>Nombre:</strong> {profile.nombre}
                <br />
                <strong>Ciudad:</strong> {profile.ciudad.nombre}
                <br />
                <strong>Correo:</strong> {profile.correo}
                <br />
                <strong>Teléfono:</strong> {profile.telefono}
              </div>
              <div className="pt-2">
                <strong>Vehículo:</strong> {marca} {modelo}
                <br />
                <strong>Precio:</strong> {vehicle.precio}
              </div>
            </div>
          </AlertDialogHeader>

          <div className="border border-[#000000] rounded-lg py-4 mt-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Tiempo restante para pagar</p>
            <p className="text-4xl font-bold">
              {confirmed
                ? timeLeft > 0
                  ? formatTime(timeLeft)
                  : "Tiempo expirado"
                : "--:--:--"}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Reserva válida por 48 horas
            </p>
          </div>

          <p className="text-xs text-red-500 mt-4">
            Si no realiza el pago en ese plazo, la reserva será cancelada automáticamente.
          </p>

          <AlertDialogFooter className="mt-4 justify-between flex-row-reverse">
            {confirmed ? (
              <>
                <Button
                  onClick={async () => {
                    if (reservaId) {
                      const success = await actualizarEstadoReserva(reservaId, "confirmado");
                      if (success) {
                        handleCancelReservation();
                      }
                    }
                  }}
                  className="bg-[#11295B] text-[#E4D5C1] hover:bg-[#2f487a] font-medium"
                >
                  Pagar
                </Button>

                <Button
                  onClick={async () => {
                    if (reservaId) {
                      const success = await actualizarEstadoReserva(reservaId, "cancelado");
                      if (success) {
                        handleCancelReservation();
                      }
                    }
                  }}
                  className="bg-[#11295B] text-[#E4D5C1] hover:bg-[#2f487a] font-medium"
                >
                  Cancelar
                </Button>

                <AlertDialogCancel className="bg-white text-black hover:bg-gray-200 font-medium">
                  Cerrar
                </AlertDialogCancel>
              </>
            ) : (
              <>
                <AlertDialogAction
                  onClick={async () => {
                    const success = await crearReserva(
                      profile.id,
                      Number(id),
                      pickupDate,
                      returnDate,
                      "pendiente"
                    );
                    if (success) {
                      setShowSuccessModal(true);
                      handleConfirm();
                    }
                  }}
                  className="bg-[#11295B] text-[#E4D5C1] hover:bg-[#2f487a] font-medium"
                >
                  Aceptar
                </AlertDialogAction>

                <AlertDialogCancel className="bg-white text-black hover:bg-gray-200 font-medium">
                  Cerrar
                </AlertDialogCancel>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
