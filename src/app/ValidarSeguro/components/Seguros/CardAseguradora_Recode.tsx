"use client";

import { useState, useRef, useEffect, memo } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { PlanSeguro } from "../../interface/ListaAutoSeguro_Interface_Recode";
import PlanesSeguroDropdown_Recode from "./PlanesSeguroDropdown_Recode";

interface Props {
  empresa: string;
  fechaInicio: string;
  fechaFin: string;
  planes: PlanSeguro[];
}

function CardAseguradora_Recode({
  empresa,
  fechaInicio,
  fechaFin,
  planes,
}: Props) {
  const [mostrarPlanes, setMostrarPlanes] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar con clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setMostrarPlanes(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="border rounded-xl p-4 w-full flex flex-col gap-2 bg-white shadow-sm dark:bg-gray-900 cursor-pointer"
      onClick={() => setMostrarPlanes(false)} // Cierre si haces clic en la tarjeta
    >
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg text-black dark:text-white">{empresa}</h3>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Evita que el clic en el botón cierre el dropdown
            setMostrarPlanes((prev) => !prev);
          }}
          aria-label="Opciones"
          className="p-1 text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
        >
          <FaEllipsisV className="text-xl" />
        </button>
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

      <PlanesSeguroDropdown_Recode
        planes={planes}
        visible={mostrarPlanes}
        onClose={() => setMostrarPlanes(false)}
      />
    </div>
  );
}

export default memo(CardAseguradora_Recode);
