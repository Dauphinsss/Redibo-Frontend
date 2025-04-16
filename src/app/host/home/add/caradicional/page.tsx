"use client";
import React from "react";
import BotonAnterior from "@/app/host/components/CarAdicional/BotonAnterior";
import LabelCarAdicio from "@/app/host/components/CarAdicional/LabelCarAdicio";
import DisposicionCheckBox from "@/app/host/components/CarAdicional/DisposicionCheckBox";
import BotonSiguiente from "@/app/host/components/CarAdicional/BotonSiguiente";

const CarAdicionalPage: React.FC = () => {
  return (
    <div className="p-11 flex flex-col items-start min-h-screen bg-gray-100">
      {/* Botón Anterior */}
      <div className="w-full max-w-2xl flex justify-start">
        <BotonAnterior />
      </div>

      {/* Label del Título */}
      <div className="mt-1 w-full max-w-5xl">
        <LabelCarAdicio text="Características adicionales" />
      </div>

      {/* Lista de Checkboxes */}
      <div className="w-full max-w-6xl mt-6 pl-8">
        <DisposicionCheckBox />
      </div>

      {/* Botón Siguiente */}
      <div className="w-full max-w-4xl flex justify-end mt-26">
        <BotonSiguiente redirectTo="/host/home/add/inputimagen" />
      </div>
    </div>
  );
};

export default CarAdicionalPage;