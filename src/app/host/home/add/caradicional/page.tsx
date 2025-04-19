"use client";
import React from "react";
import BotonAnterior from "@/app/host/components/CarAdicional/BotonAnterior";
import TituloFormulario from "@/app/host/components/CarAdicional/CampoTitulo";
import ListaCaracteristicas from "@/app/host/components/CarAdicional/CampoOpciones";
import BotonSiguiente from "@/app/host/components/CarAdicional/BotonSiguiente";

const CarAdicionalPage: React.FC = () => {
  return (
    <div className="p-6 flex flex-col items-start min-h-screen bg-gray-100">
      <BotonAnterior />
      
      <TituloFormulario texto="Características Adicionales" />
      
      <ListaCaracteristicas />
      
      <div className="w-full max-w-5xl flex justify-between mt-10 px-10">
        <div className="flex-1"></div>
        <BotonSiguiente />
      </div>
    </div>
  );
};

export default CarAdicionalPage;