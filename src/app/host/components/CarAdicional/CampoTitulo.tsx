"use client";
import React from "react";

export interface TituloFormularioProps {
  texto: string;
  as?: keyof React.JSX.IntrinsicElements; // Permite definir "h1", "h2", etc.
}

const TituloFormulario: React.FC<TituloFormularioProps> = ({ texto, as = "h1" }) => {
  const Heading = as as React.ElementType;
  return (
    <div className="w-full max-w-5xl flex justify-start">
      <Heading className="text-4xl font-bold my-5 pl-7">{texto}</Heading>
    </div>
  );
};

export default TituloFormulario;