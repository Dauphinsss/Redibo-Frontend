import React from "react";
import { FiBell } from "react-icons/fi"; // Importa el ícono de campana

interface NotificacionEnvioExitosoProps {
  onClose: () => void;
}

export default function NotificacionEnvioExitoso_recode({ onClose }: NotificacionEnvioExitosoProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/20 pointer-events-none">
      {/* Notificación en la parte superior */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 shadow-lg rounded-lg p-4 max-w-md w-full z-50 pointer-events-auto text-center">
        <div className="flex items-center justify-center mb-2">
          <FiBell className="text-black text-2xl mr-2" /> {/* Ícono al lado del título */}
          <h2 className="text-black font-bold text-lg">Solicitud enviada con éxito</h2>
        </div>
        <p className="text-gray-700 text-sm mb-4">
          Usted ha enviado una solicitud de renta al host <strong>[Nombre]</strong>, con fecha <strong>dd/mm/aa</strong>.
        </p>
        <button
          onClick={onClose}
          className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}