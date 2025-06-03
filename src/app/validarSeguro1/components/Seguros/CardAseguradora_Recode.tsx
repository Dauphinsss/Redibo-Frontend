"use client";
import { memo } from "react";
import Link from "next/link";
import { Aseguradora } from "../../interface/ListaAutoSeguro_Interface_Recode";

function CardAseguradora_Recode({
  idAseguradora,
  empresa,
  nombre,
  tipoSeguro,
  fechaInicio,
  fechaFin,
}: Aseguradora) {
  const enlaceDestino = `/validarSeguro1/pages/formularioCobertura_Recode/${idAseguradora}`;

  return (
    <Link
      href={enlaceDestino}
      target="_blank"
      rel="noopener noreferrer"
      className="border rounded-xl p-4 w-full flex flex-col gap-2 bg-white text-black shadow-sm hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer"
    >
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg">{empresa}</h2>
      </div>
      <div className="text-sm">
        <p>{nombre}</p>
        <p className="text-xs">{tipoSeguro}</p>
      </div>
      <div className="flex justify-between text-sm font-bold">
        <div>
          <p className="text-xs">Fecha inicio</p>
          <p>{fechaInicio}</p>
        </div>
        <div>
          <p className="text-xs">Fecha fin</p>
          <p>{fechaFin}</p>
        </div>
      </div>
    </Link>
  );
}

export default memo(CardAseguradora_Recode);