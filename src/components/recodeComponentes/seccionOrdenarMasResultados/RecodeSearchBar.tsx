"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

interface SearchBarProps {
  placeholder: string;
  onFiltrar: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onFiltrar }) => {
  const [busqueda, setBusqueda] = useState("");
  const [mostrarBoton, setMostrarBoton] = useState(true);

  // Mostrar el botón si hay texto
  useEffect(() => {
    setMostrarBoton(busqueda.trim().length === 0);
  }, [busqueda]);

  // Debounce de 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      const valorNormalizado = busqueda
      .trim()
      .replace(/\s+/g, " ")
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")   
      .toLowerCase();
      onFiltrar(valorNormalizado);
    }, 300);

    return () => clearTimeout(timer);
  }, [busqueda, onFiltrar]);

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder={placeholder}
        aria-label="Campo de búsqueda de autos por modelo, marca"
        value={busqueda}
        maxLength={50}
        onChange={(e) => setBusqueda(e.target.value)}
        onFocus={() => setMostrarBoton(false)}
        onBlur={() => setMostrarBoton(true)}
        className="p-2 border border-gray-300 rounded-md w-full h-12 text-left pr-12 text-[11px] md:text-base lg:text-lg"
      />
      {mostrarBoton && (
        <button
          type="button"
          aria-label="Buscar autos"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black text-white rounded-md flex items-center justify-center"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;