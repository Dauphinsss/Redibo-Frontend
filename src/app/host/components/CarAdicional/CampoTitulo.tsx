"use client";
import React from "react";

export interface TituloFormularioProps {
  texto: string;
  as?: keyof React.JSX.IntrinsicElements;
}

const TituloFormulario: React.FC<TituloFormularioProps> = ({
  texto,
  as = "h1",
}) => {
  const Heading = as as React.ElementType;
  return (
    <div className="w-full max-w-5xl">
      <Heading className="text-5xl font-bold my-5"> {/* ⬅ Tamaño aumentado */}
        {texto}
      </Heading>
    </div>
  );
};

export default TituloFormulario;
