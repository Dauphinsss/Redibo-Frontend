"use client";
import React, { useState, useRef, useEffect } from "react";
import { BellIcon } from "lucide-react";
import { NotificacionHost } from "@/app/reserva/components/componentes_InfoAuto_Recode/notificacionSoli/notificacionSolicitud";
import { NotificacionRenter } from "@/app/reserva/components/componentes_InfoAuto_Recode/notificacionSoli/notificacionRenter";
import { Notificacion } from "@/app/reserva/interface/NotificacionSolicitud_Recode";

interface NotificacionesCampanaProps {
  notificaciones: Notificacion[];
  onAceptar?: (id: string) => void;
  onRechazar?: (id: string) => void;
}

export const NotificacionesCampana: React.FC<NotificacionesCampanaProps> = ({
  notificaciones = [],
  onAceptar,
  onRechazar,
}) => {
  const [abierto, setAbierto] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Cerrar al hacer clic fuera o al presionar Esc
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current && 
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setAbierto(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => { 
      if (event.key === 'Escape') {
        setAbierto(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleNotificaciones = () => {
    setAbierto(prev => !prev);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={toggleNotificaciones}
        className={`relative p-2 rounded-full transition ${
          abierto ? 'bg-gray-200' : 'hover:bg-gray-200'
        }`}
        aria-label="Mostrar notificaciones"
        aria-expanded={abierto}
      >
        <BellIcon className="w-6 h-6 text-gray-700" />
        {notificaciones.length > 0 && (
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {abierto && (
        <div
          ref={panelRef}
          className="absolute right-0 mt-2 w-[400px] max-h-[500px] bg-white border rounded-lg shadow-xl overflow-hidden z-50"
        >
          <div className="sticky top-0 bg-white p-4 border-b">
            <h2 className="text-lg font-semibold">Notificaciones</h2>
          </div>
          
          <div className="overflow-y-auto max-h-[452px] px-4 py-2">
            {notificaciones.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No hay notificaciones
              </p>
            ) : (
              <>
                <div className="mb-4">
                  <h3 className="text-sm font-bold mb-2">Solicitudes al Host</h3>
                  {notificaciones
                    .filter((n) => n.tipo === "host")
                    .map((notif) => (
                      <NotificacionHost
                        key={notif.id}
                        notificacion={notif}
                        onAceptar={() => onAceptar?.(notif.id)}
                        onRechazar={() => onRechazar?.(notif.id)}
                      />
                    ))}
                </div>

                <hr className="my-2 border-gray-200" />

                <div>
                  <h3 className="text-sm font-bold mb-2">Solicitudes de Renter</h3>
                  {notificaciones
                    .filter((n) => n.tipo === "renter")
                    .map((notif) => (
                      <NotificacionRenter
                        key={notif.id}
                        notificacion={notif}
                      />
                    ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};