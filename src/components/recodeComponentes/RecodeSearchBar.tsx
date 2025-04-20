"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

interface SearchBarProps {
  placeholder: string;
  onFiltrar: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onFiltrar }) => {
  const [busqueda, setBusqueda] = useState("");

  const handleBusqueda = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setBusqueda(valor);

    const valorNormalizado = valor.trim().replace(/\s+/g, ' ').toLowerCase();
    onFiltrar(valorNormalizado);
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
    </div>
  );
};

export default SearchBar;
