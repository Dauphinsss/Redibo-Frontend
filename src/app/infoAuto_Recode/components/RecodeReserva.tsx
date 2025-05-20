"use client";
import { useState } from "react";
import { ReservaProps } from "@/app/infoAuto_Recode/interface/autosInterface_Recode";
import ElegirFechas from "@/app/reserva/components/Fechas";
import ConfirmacionReservaOpciones from "@/app/reserva/components/ConfirmacionHost";

export default function Reserva({ id, precio, marca, modelo }: ReservaProps) {
  const [showModal, setShowModal] = useState(false);

  const [fechasSeleccionadas, setFechasSeleccionadas] = useState<{
    pickupDate?: Date;
    returnDate?: Date;
  }>({});


  const [showConfirmationOptions, setShowConfirmationOptions] = useState(false);

  return (
    <div className="w-full border border-gray-300 rounded-lg p-4 text-center">
      <p className="text-lg font-bold">BOB. {precio}</p>
      <p className="text-sm text-gray-500">Precio por día</p>
      <button
        onClick={() => {
          setShowModal(true);
        }}
        className="mt-2 w-full py-2 bg-black text-white rounded-lg"
      >
        Reserva
      </button>


      {showModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md flex flex-col gap-2">
            <h2 className="text-xl font-bold mb-4">Confirmación de Reserva</h2>
            <ElegirFechas
              onChange={(fechas) => setFechasSeleccionadas(fechas)}
            />{" "}
            {/*cabiado */}
            <p>
              <strong>Ubicación:</strong> Santa Cruz
            </p>
            <p>
              <strong>Precio:</strong> BOB. {precio}
            </p>
            <p>
              <strong>Cobertura:</strong> Cobertura completa contra accidentes y
              robos
            </p>
            <p>
              <strong>Términos del propietario:</strong>
            </p>
            <ul className="list-disc list-inside ml-4">
              <li>Entrega puntual</li>
              <li>Vehículo con tanque lleno</li>
            </ul>
            <p>
              <strong>Conductores asignados por el arrendatario:</strong>
            </p>
            <ul className="list-disc list-inside ml-4">
              <li>Juan Pérez</li>
              <li>María García</li>
            </ul>
            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-center">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setShowConfirmationOptions(true);
                }}
                className="bg-black text-white px-4 py-2 rounded"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmationOptions && (
        <ConfirmacionReservaOpciones
          //user={user}
          pickupDate={fechasSeleccionadas.pickupDate}
          returnDate={fechasSeleccionadas.returnDate}
          id={id}
          marca={marca}
          modelo={modelo}
          precio={precio}
          onReservarSinPagar={() => {
            setShowConfirmationOptions(false);
          }}
          onPagarCompleto={() => {
            setShowConfirmationOptions(false);
            alert("Reserva pagada al 100%.");
          }}
          onCancelar={() => setShowConfirmationOptions(false)}
        />
      )}
    </div>
  );
}
