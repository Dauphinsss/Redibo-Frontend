"use client";
import React from "react";
import BotonAnterior from "@/app/host/components/CarAdicional/BotonAnterior";
import TituloFormulario from "@/app/host/components/CarAdicional/CampoTitulo";
import ListaCaracteristicas from "@/app/host/components/CarAdicional/CampoOpciones";
import BotonSiguiente from "@/app/host/components/CarAdicional/BotonSiguiente";

const CarAdicionalPage: React.FC = () => {
  return (
    <main className="p-6 min-h-screen bg-gray-100">
      <header className="flex items-center">
        <BotonAnterior />
        <TituloFormulario as="h1" texto="Características Adicionales" />
      </header>
      <section className="mt-6">
        <ListaCaracteristicas />
      </section>
      <div className="w-full max-w-5xl flex justify-between mt-10 px-10">
        <div className="flex-1"></div>
        <BotonSiguiente />
      </div>
  </main>
  );
};

export default CarAdicionalPage;