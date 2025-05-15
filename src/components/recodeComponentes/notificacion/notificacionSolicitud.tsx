import React from "react";
import { Bell } from "lucide-react";

interface NotificacionProps {
  tipo: "host" | "renter";
}

export const NotificacionHost: React.FC<NotificacionProps> = ({ tipo }) => {
  return (
    <div className="bg-gray-100 border rounded p-3 mb-3 shadow-sm">
      <div className="flex items-start gap-2">
        <Bell className="text-black mt-1" size={20} />
        <div className="flex-1">
          <h4 className="font-bold text-sm">Notificación de solicitud de alquiler</h4>
          <p className="text-sm text-gray-800">
            [Usuario] está interesado en alquilar tu vehículo [marca].<br />
            Con fecha desde dd/mm/aa hasta dd/mm/aa.<br />
            A recoger de [Ubicación de Entrega] y devolución en [Ubicación de Devolución]
          </p>
          {tipo === "host" && (
            <div className="flex gap-2 mt-2">
              <button className="bg-gray-300 text-white px-3 py-1 rounded opacity-70 cursor-not-allowed">
                Aceptar
              </button>
              <button className="bg-gray-300 text-white px-3 py-1 rounded opacity-70 cursor-not-allowed">
                Rechazar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
