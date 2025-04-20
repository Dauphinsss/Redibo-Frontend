"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

interface SearchBarProps {
  placeholder: string;
  onFiltrar: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onFiltrar }) => {
  const [busqueda, setBusqueda] = useState("");

  //Aplica debounce de 300ms a la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      const valorNormalizado = busqueda.trim().replace(/\s+/g, " ").toLowerCase();
      onFiltrar(valorNormalizado);
    }, 300);

    return () => clearTimeout(timer);
  }, [busqueda, onFiltrar]);

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder={placeholder}
        aria-label="Campo de búsqueda de autos por modelo o marca"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="p-2 border border-gray-300 rounded-md w-full h-12 text-left pr-12 text-[11px] md:text-base lg:text-lg"
      />
      <button
        type="button"
        aria-label="Buscar autos"
        className="absolute right-1 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black text-white rounded-md flex items-center justify-center"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default SearchBar;