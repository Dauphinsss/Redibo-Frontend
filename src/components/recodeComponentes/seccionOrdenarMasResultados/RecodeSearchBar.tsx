"use client";

import { useState, useEffect, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

interface SearchBarProps {
  placeholder: string;
  onFiltrar: (query: string) => void;
  obtenerSugerencia: (query: string) => string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onFiltrar, obtenerSugerencia}) => {
  const [busqueda, setBusqueda] = useState("");
  const [mostrarBoton, setMostrarBoton] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const [sugerencia, setSugerencia] = useState("");

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
      .replace(/[^\p{L}\p{N}\s.\-\/]/gu, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")   
      .toLowerCase();
      onFiltrar(valorNormalizado);
    }, 300);
    return () => clearTimeout(timer);
  }, [busqueda, onFiltrar]);

  useEffect(() => {
    if (!busqueda.trim()) {
      setSugerencia("");
      return;
    }
    const timer = setTimeout(() => {
      const sugerido = obtenerSugerencia(busqueda);
      if (
        sugerido &&
        sugerido.toLowerCase() !== busqueda.toLowerCase()
      ) {
        setSugerencia(sugerido);
      } else {
        setSugerencia("");
      }
    }, 150); 
    return () => clearTimeout(timer); 
  }, [busqueda, obtenerSugerencia]);

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

        onKeyDown={(e) => {
          if ((e.key === "ArrowRight" || e.key === "Tab") && sugerencia) {
            e.preventDefault();
        
            const resto = sugerencia.slice(busqueda.length);
            const siguienteEspacio = resto.indexOf(" ");
        
            let siguienteParte = "";
            if (siguienteEspacio !== -1) {
              siguienteParte = resto.slice(0, siguienteEspacio + 1); 
            } else {
              siguienteParte = resto; 
            }
        
            const nuevaBusqueda = busqueda + siguienteParte;
            setBusqueda(nuevaBusqueda);
            setTimeout(() => {
              inputRef.current?.setSelectionRange(nuevaBusqueda.length, nuevaBusqueda.length);
            }, 0);
        
            if (nuevaBusqueda === sugerencia) {
              setSugerencia("");
            }
          }
        }}
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

      { sugerencia && (
        <div
          className="absolute top-0 left-0 p-2 pr-12 w-full h-12 text-gray-400 pointer-events-none select-none 
          text-[11px] md:text-base lg:text-lg font-normal flex items-center"
          style={{ fontFamily: "inherit" }}
        >
          <span className="invisible whitespace-pre">{busqueda}</span>
          <span className="ml-[1px] whitespace-pre">
            {sugerencia.slice(busqueda.length)}
          </span>
        </div>
      )}
    </div>
  );
};
export default SearchBar;