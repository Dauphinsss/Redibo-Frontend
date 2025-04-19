"use client";
import React from "react";

interface TituloFormularioProps {
  texto: string;
}

const TituloFormulario: React.FC<TituloFormularioProps> = ({ texto }) => {
  return (
    <div className="w-full max-w-5xl flex justify-start">
      <h1 className="text-4xl font-bold my-5 pl-7">{texto}</h1>
    </div>
  );
};

export default TituloFormulario;