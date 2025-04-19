"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { AutoCard_Interfaces_Recode as RecodeAuto } from "@/interface/AutoCard_Interface_Recode";

interface SearchBarProps {
  placeholder: string;
  autos: RecodeAuto[];
  onFiltrar: (filtrados: RecodeAuto[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, autos, onFiltrar }) => {
  const [busqueda, setBusqueda] = useState("");

  // const [mensajeError, setMensajeError] = useState("");

  const handleBusqueda = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setBusqueda(valor);
    // setMensajeError("");
    
    //con este const eliminamos los espacios al inicio y al final de cada palabra
    const valorNormalizado = valor.trim().replace(/\s+/g, ' ').toLowerCase();

    if (valorNormalizado === "") {
      // setMensajeError("Debe ingresar un término de búsqueda válido");
      onFiltrar(autos);
    } else {
      // setMensajeError("");
      const filtrados = autos.filter((auto) =>
        `${auto.modelo} ${auto.marca}`.toLowerCase().includes(valorNormalizado)
      );
      onFiltrar(filtrados);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder={placeholder}
        value={busqueda}
        onChange={handleBusqueda}
        className="p-2 border border-gray-300 rounded-md w-full h-12 text-left pr-12 text-[11px] md:text-base lg:text-lg"
      />
      <button
        type="button"
        className="absolute right-1 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black text-white rounded-md flex items-center justify-center"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
      </button>
      {/* {mensajeError && (<p className="mt-2 text-red-500 text-sm">{mensajeError}</p>)} */}
    </div>
  );
};

export default SearchBar;
