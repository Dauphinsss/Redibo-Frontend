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
import { axiosInstance } from "@/api/axios";
import axios from "axios";
import ErrorModal from "./ErrorModal";

interface ReservationDialogProps {
  showDialog: boolean;
  setShowDialog: (val: boolean) => void;
  loading: boolean;
  handleClick: () => void;
  handleConfirm: () => void;
  confirmed: boolean;
  handleCancelReservation: () => void;
  pickupDate?: Date;
  returnDate?: Date;
  timeLeft: number;
  formatTime: (ms: number, detailed?: boolean) => string;
  id: string;
  marca: string;
  modelo: string;
  precio: number;
}

export default function ReservationDialog({
  showDialog,
  setShowDialog,
  loading,
  handleClick,
  handleConfirm,
  confirmed,
  handleCancelReservation,
  timeLeft,
  formatTime,
  pickupDate,
  returnDate,
  id,
  marca,
  modelo,
  precio,
}: ReservationDialogProps) {
  const [reservaId, setReservaId] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  //para los mensajes de error una modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const crearReserva = async (
    userId: number,
    carId: number,
    pickupDate: Date | undefined,
    returnDate: Date | undefined,
    estado: string = "pendiente"
  ): Promise<boolean> => {
    if (!pickupDate || !returnDate) {
      setModalMessage("Las fechas no pueden estar vacías");
      setModalVisible(true);
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
      console.log("Reserva creada correctamente:", data);
      setReservaId(data.id);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const backendError =
          error.response?.data?.error || "Error al crear la reserva";
        setModalMessage(backendError);
        setModalVisible(true);
      } else {
        setModalMessage("Error de red al intentar crear la reserva");
        setModalVisible(true);
      }
      return false;
    }
  };

  const actualizarEstadoReserva = async (
    id: number,
    nuevoEstado: string
  ): Promise<boolean> => {
    try {
      const response = await axiosInstance.patch(
        `/api/reservations/${id}/state`,
        {
          estado: nuevoEstado,
        }
      );

      const data = response.data;
      console.log("Estado actualizado:", data);
      setModalMessage(`La reserva fue: ${data.estado}`);
      setModalVisible(true);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const backendError =
          error.response?.data?.error || "Error al actualizar el estado";
        alert(backendError);
      } else {
        console.error("Error de red al actualizar estado:", error);
        setModalMessage("Error de red al actualizar el estado");
        setModalVisible(true);
      }
      return false;
    }
  };

  return (
    <>
      <SuccessModal
        show={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          setShowDialog(true);
        }}
      />
      <ErrorModal
        visible={modalVisible}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogTrigger asChild>
          <Button
            size="sm"
            onClick={handleClick}
            disabled={loading}
            className="bg-black text-white hover:bg-[#333333] border-none"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2 text-white" />
                Reservar
              </>
            )}
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="max-w-md w-full">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center bg-black text-white p-4 rounded-t-xl">
              Reserva Temporal
            </AlertDialogTitle>

            <div className="text-sm space-y-2 mt-2 ml-0 md:ml-10">
              <div>
                <h3 className="font-bold text-base mb-1 text-black">
                  Datos del usuario
                </h3>
                <strong>Nombre:</strong> Juan Perez
                <br />
                <strong>Ciudad:</strong> Cochabamba
                <br />
                <strong>Correo:</strong> juan.p@gmail.com
                <br />
                <strong>Teléfono:</strong> 76852535
              </div>
              <div className="pt-0">
                <h3 className="font-bold text-base mb-1 text-black">
                  Datos del vehículo
                </h3>
                <strong>Vehículo:</strong> {modelo}
                <br />
                <strong>Marca:</strong> {marca}
                <br />
                <strong>Precio día:</strong> {precio} BOB
              </div>
            </div>
          </AlertDialogHeader>
          <div className="border border-[#000000] rounded-lg py-4 mt-4 text-center">
            <p className="text-sm text-gray-600 mb-1">
              Tiempo restante para pagar
            </p>
            <p className="text-4xl font-bold">
              {confirmed
                ? timeLeft > 0
                  ? formatTime(timeLeft)
                  : "Tiempo expirado"
                : "--:--:--"}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Reserva válida por 12 horas
            </p>
          </div>

          <p className="text-xs text-red-500 mt-4">
            Si no realiza el pago en ese plazo, la reserva será cancelada
            automáticamente.
          </p>

          <AlertDialogFooter className="mt-4 justify-between flex-row-reverse">
            {confirmed ? (
              <>
                <Button
                  onClick={async () => {
                    if (reservaId) {
                      const success = await actualizarEstadoReserva(
                        reservaId,
                        "confirmado"
                      );
                      if (success) {
                        handleCancelReservation();
                      }
                    }
                  }}
                  className="bg-black text-[#E4D5C1] hover:bg-[#333333] font-medium"//
                >
                  Pagar
                </Button>

                <Button
                  onClick={async () => {
                    if (reservaId) {
                      const success = await actualizarEstadoReserva(
                        reservaId,
                        "cancelado"
                      );
                      if (success) {
                        handleCancelReservation();
                      }
                    }
                  }}
                  className="bg-black text-[#E4D5C1] hover:bg-[#333333] font-medium"
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
                      1,
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
                  className="bg-black text-[#E4D5C1] hover:bg-[#333333] font-medium"
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
