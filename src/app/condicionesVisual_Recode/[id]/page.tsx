'use client';

import { useState } from 'react';
import { notFound } from "next/navigation";
import FormularioSolicitud from "@/components/recodeComponentes/notificacionSoli/Notificacion_envio_host_Recode";
import { NotificacionesCampana } from "@/components/recodeComponentes/notificacionSoli/campana";
import Header from "@/components/ui/Header";
import { Notificacion } from "@/interface/NotificacionSolicitud_Recode";
import { useParams } from 'next/navigation';

export default function CondicionVisualPage() {
  const params = useParams();
  const id_carro = Number(params.id);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  if (isNaN(id_carro) || id_carro <= 0) {
    notFound();
  }

  const handleSolicitudExitosa = () => {
    console.log("Solicitud enviada con éxito");
  };

  const handleNuevaNotificacion = (notificacion: Notificacion) => {
    setNotificaciones(prev => [...prev, notificacion]);
  };

  return (
    <main className="p-4 max-w-7xl mx-auto">
      <Header />
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Formulario de Reserva
          </h1>
          <FormularioSolicitud
            id_carro={id_carro}
            onSolicitudExitosa={handleSolicitudExitosa}
            onNuevaNotificacion={handleNuevaNotificacion}
          />
        </div>
        
        <div className="lg:w-96">
          <NotificacionesCampana 
            notificaciones={notificaciones}
            onAceptar={(id) => console.log('Aceptar:', id)}
            onRechazar={(id) => console.log('Rechazar:', id)}
          />
        </div>
      </div>
    </main>
  );
}