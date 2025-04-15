import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, DollarSign } from "lucide-react";
import { format } from "date-fns";
import React, { useState } from "react";
import {SuccessModal} from "./SuccessNotification"
import { X } from "lucide-react";

interface ReservationDialogProps {
  showDialog: boolean;
  setShowDialog: (val: boolean) => void;
  loading: boolean;
  handleClick: () => void;
  handleConfirm: () => void;
  confirmed: boolean;
  handleCancelReservation: () => void;
  user: {
    id: number;
    nombre: string;
    ciudad: string;
    correo: string;
    telefono: number;
  };
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
}

export default function ReservationDialog({
  showDialog,
  setShowDialog,
  loading,
  handleClick,
  handleConfirm,
  confirmed,
  handleCancelReservation,
  user,
  vehicle,
  timeLeft,
  formatTime,
  pickupDate,
  returnDate,
}: ReservationDialogProps) {
  const [reservaId, setReservaId] = useState<number | null>(null);
  //fetch para reservar
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
    const response = await fetch("http://localhost:4000/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        carId,
        starDate: pickupDate.toISOString().split("T")[0],
        endDate: returnDate.toISOString().split("T")[0],
        estado,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      //console.error(" Error desde el backend:", data.error || data);
      alert(data.error );
      return false;
    }

    console.log("✔ Reserva creada correctamente:", data);
    //alert(data.error || "Reserva creada exitosamente");

    setReservaId(data.id); // <- asegúrate de que setReservaId esté definido en tu componente

    return true;
  } catch (error) {
    //console.error(" Error de red:", error);
    alert("Error de red al intentar crear la reserva");
    return false;
  }
};

  //cambia el estao de la reserva
  const actualizarEstadoReserva = async (
    id: number,
    nuevoEstado: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/reservations/${id}/state`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ estado: nuevoEstado }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(" Error al actualizar estado:", data.message || data);
        alert("Error al actualizar el estado de la reserva");
        return false;
      }

      console.log(" Estado actualizado:", data);
      alert(`Estado actualizado a: ${data.estado}`);
      return true;
    } catch (error) {
      console.error(" Error de red al actualizar estado:", error);
      alert("Error de red al actualizar el estado");
      return false;
    }
  };
  const [showSuccessModal, setShowSuccessModal] = useState(false);//para la notificacion de que si se reservo

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
          ) : (// boton de reservar ojo
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
              <strong>Nombre:</strong> {user.nombre}
              <br />
              <strong>Ciudad:</strong> {user.ciudad}
              <br />
              <strong>Correo:</strong> {user.correo}
              <br />
              <strong>Teléfono:</strong> {user.telefono}
            </div>
            <div className="pt-2">
              <strong>Vehículo:</strong> {vehicle.marca} {vehicle.modelo}
              <br />
              <strong>Precio:</strong> {vehicle.precio}
              {/*<br />
              <strong>Recogida:</strong>{" "}
              {pickupDate
                ? format(pickupDate, "dd/MM/yyyy")
                : "No seleccionada"}*/}
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
            Reserva válida por 48 horas
          </p>
        </div>

        <p className="text-xs text-red-500 mt-4">
          Si no realiza el pago en ese plazo, la reserva será cancelada
          automáticamente.
        </p>

        <AlertDialogFooter className="mt-4 justify-between flex-row-reverse">
          {confirmed ? (
            <>
              {/* Izquierda: Pagar */}
              <Button
                onClick={async () => {
                  if (reservaId) {
                    const success = await actualizarEstadoReserva(
                      reservaId,
                      "confirmado"
                    );
                    if (success) {
                      handleCancelReservation(); //el que reinicia todo
                      }
                  
                  }
                }}
                className="bg-[#11295B] text-[#E4D5C1] hover:bg-[#2f487a] font-medium"
              >
                {/*<DollarSign className="w-4 h-4 mr-2" />*/}
                Pagar
              </Button>
              {/* Derecha: Cancelar reserva */}
              <Button
                onClick={async () => {
                  if (reservaId) {
                    const success = await actualizarEstadoReserva(
                      reservaId,
                      "cancelado"
                    );
                    if (success) {
                      handleCancelReservation(); //el que reinicia todo 
                      }
                  }
                }}
                className="bg-[#11295B] text-[#E4D5C1] hover:bg-[#2f487a] font-medium"
              >
                Cancelar
              </Button>
              {/* Derecha: Cancelar */}
              <AlertDialogCancel className="bg-white text-black hover:bg-gray-200 font-medium">
                Cerrar
              </AlertDialogCancel>
            </>
          ) : (
            <>
              {/* Izquierda: Aceptar */}

              <AlertDialogAction
                onClick={async () => {
                  const success = await crearReserva(
                    user.id,
                    vehicle.id,
                    pickupDate,
                    returnDate,
                    "pendiente"
                  );

                  if (success) {
                    setShowSuccessModal(true);//mi notificacio de reserva exitosa
                    handleConfirm(); //  función para iniciar el reloj
                  }
                }}
                className="bg-[#11295B] text-[#E4D5C1] hover:bg-[#2f487a] font-medium"
              >
                Aceptar
              </AlertDialogAction>

              {/* Derecha: Cancelar */}
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
