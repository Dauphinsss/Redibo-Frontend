'use client';

import { useState } from 'react';
import { notFound } from "next/navigation";
import FormularioSolicitud from "@/app/reserva/components/componentes_InfoAuto_Recode/notificacionSoli/Notificacion_envio_host_Recode";
import Header from "@/components/ui/Header";
import { Notificacion } from "@/app/reserva/interface/NotificacionSolicitud_Recode";
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

  const handleNuevaNotificacion = (notificacion: Notificacion | null) => {
    if (notificacion) {
        setNotificaciones(prev => [...prev, notificacion]);
    }
  };

  return (
    <main className="border-b px-4 sm:px-6 lg:px-8 py-7">
      <Header />
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Formulario de Reserva
          </h1>
          <FormularioSolicitud
            id_carro={id_carro}
            onSolicitudExitosa={handleSolicitudExitosa}
          />
        </div>
        
        
      </div>
    </main>
  );
}