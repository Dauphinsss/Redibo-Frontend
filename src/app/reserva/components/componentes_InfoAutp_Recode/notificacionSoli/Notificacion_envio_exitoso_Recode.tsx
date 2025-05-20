import React from "react";
import { FiBell } from "react-icons/fi";

interface NotificacionEnvioExitosoProps {
  onClose: () => void;
  hostNombre: string;
  fechaInicio: string;
  fechaFin: string;
}

export default function NotificacionEnvioExitoso_recode({ 
  onClose, 
  hostNombre,
  fechaInicio,
  fechaFin 
}: NotificacionEnvioExitosoProps) {
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Fecha inválida' : date.toLocaleDateString('es-ES');
    } catch {
      return 'Fecha inválida';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center pointer-events-none">
      <div className="bg-white border border-gray-300 shadow-lg rounded-lg p-4 max-w-md w-full z-50 pointer-events-auto text-center mx-4">
        <div className="flex items-center justify-center mb-2">
          <FiBell className="text-black text-2xl mr-2" />
          <h2 className="text-black font-bold text-lg">Solicitud enviada con éxito</h2>
        </div>
        <p className="text-gray-700 text-sm mb-4">
          Usted ha enviado una solicitud de renta al host <strong>{hostNombre || 'Anfitrión'}</strong>, 
          con fecha <strong>{formatDate(fechaInicio)}</strong> a <strong>{formatDate(fechaFin)}</strong>.
        </p>
        <button
          onClick={onClose}
          className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}