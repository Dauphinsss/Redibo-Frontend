"use client";
import React from "react";
import BotonAnterior from "@/app/host/components/CarAdicional/BotonAnterior";
import TituloFormulario from "@/app/host/components/CarAdicional/CampoTitulo";
import ListaCaracteristicas from "@/app/host/components/CarAdicional/CampoOpciones";
import BotonSiguiente from "@/app/host/components/CarAdicional/BotonSiguiente";

const CarAdicionalPage: React.FC = () => {
  return (
    <main className="p-6 min-h-screen bg-gray-100">
      <header
        className="
          flex flex-col items-start  /* ⬅ Ahora apilado vertical */
          max-w-5xl mx-auto
        "
      >
        <BotonAnterior />
        <TituloFormulario 
          as="h1" 
          texto="Características Adicionales" 
        />
      </header>

      <section className="mt-6">
        <ListaCaracteristicas />
      </section>

      <div className="w-full max-w-5xl mx-auto mt-10 px-4 sm:px-10 flex justify-end">
        <BotonSiguiente />
      </div>
    </main>
  );
};

export default CarAdicionalPage;
