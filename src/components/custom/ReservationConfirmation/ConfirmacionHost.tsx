
import React from "react";
import ReservationConfirmedMessage from "./ReservationConfirmedMessage";

interface Props {
  onReservarSinPagar: () => void;
  onPagarCompleto: () => void;
  onCancelar: () => void;
  pickupDate?: Date;
  returnDate?: Date;
  //user: any;
  id: string;
  modelo:string;
  marca:string;
  precio:number;
}
console.log("estamos en ConfirmationHost")
const ConfirmacionReservaOpciones: React.FC<Props> = ({
  onReservarSinPagar,
  onPagarCompleto,
  onCancelar,
  //user,
  pickupDate,
  returnDate,
  id,
  marca,
  modelo,
  precio
}) => {
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[95%] max-w-lg">
        <h2 className="text-xl font-bold mb-4">Solicitud Aceptada</h2>
        <p>El anfitrión ha aceptado tu solicitud de reserva. Elige cómo deseas continuar:</p>

        <div className="mt-6 flex flex-col gap-4">
        <ReservationConfirmedMessage
            //user={user}
            pickupDate={pickupDate}
            returnDate={returnDate}
            id={id}
            marca={marca}
            modelo={modelo}
            precio = {precio}
          />
          <button
            onClick={onPagarCompleto}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Pagar 100%
          </button>
          <button
            onClick={onCancelar}
            className="text-gray-500 text-sm underline"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmacionReservaOpciones;
