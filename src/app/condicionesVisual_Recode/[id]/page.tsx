'use client';

import { notFound } from "next/navigation";
import FormularioSolicitud from "@/components/recodeComponentes/notificacionSoli/Notificacion_envio_host_Recode";
import Header from "@/components/ui/Header";

interface PageParams {
  params: { id: string };
}

export default function CondicionVisualPage({ params }: PageParams) {
  const id_carro = Number(params.id);

  if (isNaN(id_carro) || id_carro <= 0) {
    notFound();
  }

  const handleSolicitudExitosa = () => {
    console.log("Solicitud enviada con éxito");
  };

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <Header />
      <h1 className="text-2xl font-bold mb-6 text-center">
        Formulario de Reserva
      </h1>
      <FormularioSolicitud 
        id_carro={id_carro} 
        onSolicitudExitosa={handleSolicitudExitosa} 
      />
    </main>
  );
}