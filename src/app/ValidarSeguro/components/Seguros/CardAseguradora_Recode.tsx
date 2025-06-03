"use client";import { memo } from "react";
import { Aseguradora } from "../../interface/ListaAutoSeguro_Interface_Recode";

function CardAseguradora_Recode({
  //idAseguradora,
  empresa,
  nombre,
  tipoSeguro,
  fechaInicio,
  fechaFin,

}: Aseguradora) {

  return (
    <div className="border rounded-xl p-4 w-full flex flex-col gap-2 bg-white shadow-sm dark:bg-gray-900 cursor-pointer">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg text-black dark:text-white">{empresa}</h2>
        <h3 className="font-medium text-lg text-black dark:text-white">{nombre}</h3>
        <h3 className="font-medium text-lg text-black dark:text-white">{tipoSeguro}</h3>
      </div>

      <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
        <div>
          <p className="text-xs">Fecha inicio</p>
          <p>{fechaInicio}</p>
        </div>
        <div>
          <p className="text-xs">Fecha fin</p>
          <p>{fechaFin}</p>
        </div>
      </div>
    </div>
  );
}

export default memo(CardAseguradora_Recode);
